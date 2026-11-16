import type { PageMeta } from '@chester-hill-solutions/cms-core';
import type { CmsDomainStore } from '@chester-hill-solutions/cms-store';
export type { PageMeta };
export type ToolErrorCode = 'NOT_FOUND' | 'VALIDATION' | 'CONFLICT' | 'FORBIDDEN' | 'PRECONDITION' | 'INTERNAL';
export type ToolFieldError = {
    blockId?: string;
    field: string;
    message: string;
};
export type ToolError = {
    ok: false;
    code: ToolErrorCode;
    error: string;
    fieldErrors?: ToolFieldError[];
    /** Recovery hint for the calling agent, e.g. "Call get_page and retry." */
    suggestion?: string;
    retryable?: boolean;
};
export type ToolResult<T = unknown> = {
    ok: true;
    data: T;
} | ToolError;
export type AgentTransport = 'chat' | 'mcp' | 'http';
/**
 * What a call acts on, derived from the parsed tool input.
 *
 * Auth hooks receive this so a host can bind a decision to one page rather than to the tool
 * name alone: a token issued for `page-about` must not read `page-contact` just because both
 * calls name `get_page`.
 */
export type AgentResource = {
    kind: 'entry';
    entryId: string;
} | {
    kind: 'slug';
    slug: string;
}
/** A site-wide call: the collection, the media library, or a new page before it exists. */
 | {
    kind: 'site';
}
/** The input did not parse, so the call names no resource. Deny unless the policy covers it. */
 | {
    kind: 'unknown';
};
export type AgentCallContext = {
    toolName: string;
    actorId?: string;
    transport?: AgentTransport;
    /** Selected from the parsed input by the tool, never from the caller's override. */
    resource: AgentResource;
};
/**
 * Caller-supplied call context. The resource is deliberately absent: it comes from the parsed
 * tool input, so a transport cannot widen the scope of the authorization decision.
 */
export type AgentCallOverrides = {
    actorId?: string;
    transport?: AgentTransport;
};
export type CmsAgentConfig = {
    /** Called before every read tool. Throw to deny (becomes FORBIDDEN). */
    assertCanRead: (ctx: AgentCallContext) => void | Promise<void>;
    /** Called before every write tool, after assertCanRead. Throw to deny. */
    assertCanMutate: (ctx: AgentCallContext) => void | Promise<void>;
    /** Default actor recorded in call context and revision audit. */
    actorId?: string;
    validateNewPageSlug: (slug: string) => string | null;
    entryIdFromPageSlug: (slug: string) => string;
    newPageDoc: (input: {
        title: string;
        slug: string;
    }) => PageMeta;
    /** Observability hook — invoked after every tool call with its result. */
    onToolComplete?: (ctx: AgentCallContext, result: ToolResult) => void;
    /**
     * Typed domain content — tours, stops, businesses, notices.
     *
     * Optional. A site that publishes only pages passes nothing, and the domain
     * tools are then not registered at all rather than registered and failing: an
     * agent should not be offered a tool with no store behind it.
     */
    domain?: CmsAgentDomainStore;
    /** Content types the host serves, so an agent can discover what exists. */
    domainContentTypes?: readonly string[];
    /**
     * Human- or machine-readable description of a content type's payload contract.
     * The payload shape belongs to the host, so this package cannot derive it; an
     * agent that can read it authors valid records instead of guessing.
     */
    describeContentType?: (contentType: string) => unknown;
};
/** The domain store as the agent sees it: untyped payloads arriving from a model. */
export type CmsAgentDomainStore = CmsDomainStore<Record<string, unknown>>;
export type { CmsAgentStore } from '@chester-hill-solutions/cms-store';
