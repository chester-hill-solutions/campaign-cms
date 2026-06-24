import { useState } from 'react'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import type { UIMessage } from '@tanstack/ai'

type ToolCallPart = Extract<UIMessage['parts'][number], { type: 'tool-call' }>

function ToolCallView({
  part,
  onApproval,
}: {
  part: ToolCallPart
  onApproval: (id: string, approved: boolean) => void
}) {
  const needsApproval =
    part.state === 'approval-requested' && part.approval?.id !== undefined

  return (
    <div className="rounded-md border border-line bg-surface-card px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-mono font-semibold">{part.name}</span>
        <span className="text-ink-muted">{part.state}</span>
      </div>
      {part.arguments ? (
        <pre className="m-0 mt-1 overflow-x-auto whitespace-pre-wrap break-all text-ink-muted">
          {part.arguments}
        </pre>
      ) : null}
      {needsApproval && part.approval ? (
        <div className="mt-2 flex items-center gap-2">
          <span className="font-medium">Publish requires approval.</span>
          <button
            type="button"
            className="rounded bg-ink px-2 py-1 font-medium text-surface-page"
            onClick={() => onApproval(part.approval!.id, true)}
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded border border-line px-2 py-1 font-medium"
            onClick={() => onApproval(part.approval!.id, false)}
          >
            Reject
          </button>
        </div>
      ) : null}
      {part.output !== undefined ? (
        <pre className="m-0 mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-all text-ink-muted">
          {typeof part.output === 'string'
            ? part.output
            : JSON.stringify(part.output)}
        </pre>
      ) : null}
    </div>
  )
}

export function CmsAgentChat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, addToolApprovalResponse, isLoading, error } =
    useChat({
      connection: fetchServerSentEvents('/api/cms/chat'),
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    void sendMessage(text)
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 px-4 py-8">
      <header>
        <h1 className="m-0 text-xl font-semibold">CMS agent</h1>
        <p className="m-0 mt-1 text-sm text-ink-muted">
          Ask the agent to list pages, edit blocks, upload media, or publish.
          Edits stay in the draft until you approve a publish.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user'
                ? 'self-end rounded-lg bg-ink px-3 py-2 text-sm text-surface-page'
                : 'flex flex-col gap-2 self-start text-sm'
            }
          >
            {message.parts.map((part, i) => {
              if (part.type === 'text') {
                return (
                  <p key={i} className="m-0 whitespace-pre-wrap">
                    {part.content}
                  </p>
                )
              }
              if (part.type === 'tool-call') {
                return (
                  <ToolCallView
                    key={part.id}
                    part={part as ToolCallPart}
                    onApproval={(id, approved) =>
                      void addToolApprovalResponse({ id, approved })
                    }
                  />
                )
              }
              return null
            })}
          </div>
        ))}
        {isLoading ? (
          <p className="m-0 text-sm text-ink-muted">Thinking…</p>
        ) : null}
        {error ? (
          <p className="m-0 text-sm text-red-600">
            Something went wrong: {error.message}
          </p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "Add a quote block to the about page"'
          className="flex-1 rounded-md border border-line bg-surface-card px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={isLoading || input.trim().length === 0}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface-page disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
