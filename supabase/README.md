# SafeTrekr Marketing — Supabase Project

**Project Ref**: `olgjdqguafidgrutubih`
**Purpose**: Marketing site form submissions, analytics events, newsletter signups, rate limiting.
**Note**: This project also hosts the Tarva Dark Factory orchestrator tables. Marketing tables are prefixed/namespaced to avoid conflicts.

## Tables (Marketing)
- `form_submissions` — Unified form storage (demo request, contact, quote, sample binder download)
- `newsletter_subscribers` — Double opt-in newsletter with SendGrid integration
- `analytics_events` — Custom conversion events supplementing Plausible
- `rate_limits` — Ephemeral rate limiting per IP per form type
- `ab_test_assignments` — Sticky variant assignment for A/B tests
- `crm_sync_queue` — Async CRM sync with exponential backoff retry

## Migrations
Apply via: `supabase db push` or via the Supabase MCP `apply_migration` tool.

## Extensions
- `pgcrypto` — IP hashing (SHA-256)
- `uuid-ossp` — UUID generation for primary keys
- `pg_stat_statements` — Query performance monitoring
- `pg_trgm` — Trigram similarity for search
