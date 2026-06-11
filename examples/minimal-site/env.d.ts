declare namespace Cloudflare {
  interface Env {
    DB: D1Database
    MEDIA: R2Bucket
    /** Kill switch for the CMS agent. Set to '1' to enable /agent and its API. */
    CMS_AGENT_ENABLED?: string
    /** OpenRouter API key for the agent chat route (set via .dev.vars / secret). */
    OPENROUTER_API_KEY?: string
    /** Optional OpenRouter model override, e.g. 'anthropic/claude-sonnet-4.5'. */
    CMS_AGENT_MODEL?: string
    /** Shared secret for the MCP route. The route is disabled when unset. */
    CMS_AGENT_MCP_SECRET?: string
  }
}
