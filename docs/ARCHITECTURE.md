# MTG App — Architecture

**Approved 2026-04-20.** Verified against April 2026 .NET / Aspire / AI stack. Any new service, feature, or AI integration maps into this doc or explains why not.

## North star

> "Deterministic first, AI second — with a tiered speed ladder and a controllable thinking dial."

- AI is **not** the default path. Most requests resolve through the deterministic data layer.
- AI is used only when it adds real value.
- Escalation up the tier ladder is controlled, not automatic.
- Users see modes: **Fast / Smart / Deep Brew**.

## Stack (verified April 2026)

| Layer | Choice | Notes |
|---|---|---|
| Language / runtime | **.NET 10 LTS** (support through Nov 2028), C# 14 | Released Nov 2025 |
| Orchestration | **Aspire 13.1+** | `Aspire.Hosting.PostgreSQL@13.2+`; always `.WaitFor()` dependents |
| Frontend | React 19 + TypeScript + Vite 8 + Tailwind v4 | Existing |
| Primary DB | **PostgreSQL** (FTS + JSONB + CTEs + `pgvector`) | HNSW index for semantic search |
| Cache | **Redis** via Aspire integration | `WithRedisInsight()` locally |
| Search | Postgres FTS default, pgvector selective | Don't reach for vectors until keyword search fails |
| Background | .NET worker services | `mtg.ingest` runs here |
| Observability | **OpenTelemetry** via Aspire `ServiceDefaults` | Tier latency, escalation rate, cost per session |
| Streaming | Native `TypedResults.ServerSentEvents(IAsyncEnumerable<SseItem<T>>)` in .NET 10 Minimal APIs | Auto-reconnect via `Last-Event-ID` |
| AI abstraction | `Microsoft.Extensions.AI` → **`IChatClient`** | Provider swap = config change, not rewrite |
| AI orchestration | **Microsoft Agent Framework 1.0** (GA April 7 2026) | Successor to Semantic Kernel; use for multi-agent, typed state, graph workflows |
| Vector client | `Pgvector.EntityFrameworkCore` | EF Core integration |

## Backend services (Aspire-orchestrated)

```
AppHost
├── mtg.api            — primary API (cards, decks, users, auth) — EXISTS
├── mtg.ai-router      — tiered IChatClient routing — NOT YET
├── mtg.ingest         — Scryfall sync, embeddings, combo graph — NOT YET
├── Postgres           — primary DB (exists via Aspire)
└── Redis              — cache — NOT YET
```

`mtg.realtime` is **not** a separate service. Use native `TypedResults.ServerSentEvents` inside `mtg.api`. Split out only when horizontal fanout is justified.

Current Aspire projects (exist in repo): `MtgApp.Api`, `MtgApp.AppHost`, `MtgApp.Domain`, `MtgApp.ImageProcessing`, `MtgApp.Infrastructure`, `MtgApp.ServiceDefaults`, `MtgApp.Tests`.

## AI speed ladder

| Tier | Name | Use for | Example model | $/Mtok |
|---|---|---|---|---|
| **0** | Deterministic | Card lookup, rulings, legality, mana curve, deck stats, known combos | — | 0 |
| **1** | Fast AI | Short explanations, summaries, rewrites | Haiku, GPT-4o-mini | $0.50–2 |
| **2** | Smart AI | Deck improvement, commander comparison, sideboard, budget subs | Sonnet, GPT-5 Turbo | $10–15 |
| **3** | Deep Brew | Complex deckbuilding, multi-constraint, meta-aware, tradeoff analysis | Opus, GPT-5-class (or self-hosted **OpenMythos** as Python endpoint via `IChatClient`) | $30–60 |

**Routing rule:** default to Tier 0. AI Router never auto-escalates past the tier the user or feature requested. Published benchmarks: tiered routing reduces AI spend 30–70% vs uniform premium use.

## Feature-to-tier mapping

- 75 table-stakes features (card search, deck builder, collection, playtest, pricing, sharing) → Tier 0 in almost every case. Postgres FTS + well-written CTEs answer these.
- 30 🔥 differentiators (NL search, deck critique, trade scout, combo discovery, binder bulk-scan) → Tiers 1–3 through `mtg.ai-router`.
- 3 wedge features (binder-page bulk scan, storage-location tracking, agentic trade scout) → each needs a worker in `mtg.ingest` + a dedicated tool exposed via the AI router.

## Critical rules

- **No direct AI calls from the frontend.** All AI goes through `mtg.ai-router`.
- **Deterministic answers ship first.** If Postgres + a well-written query can answer it, that's the answer.
- **Cache aggressively.** Redis in front of the router → Postgres query caching for hot paths → CDN for card images → ingest-time precompute for deck features.
- **Instrument everything.** Latency per tier, escalation rate, cost per user/session, cache hit rate. OpenTelemetry sinks via Aspire.
- **`IChatClient` middleware order:** rate-limit → cache → telemetry (outermost). Cache hits shouldn't burn rate budget.
- **`IChatClient` DI:** don't register as singleton without verifying stateless-ness per provider. Azure OpenAI is safe; others may not be.
- **Credentials:** use `ManagedIdentityCredential` (or provider-specific) in production — NOT `DefaultAzureCredential`. Probing overhead + unpredictable source order bite under load.
- **Agent Framework, not Semantic Kernel, for new code.** SK gets maintenance; migrate lazily. AF gives typed state, middleware, telemetry, and graph workflows for multi-agent work.
- **OpenMythos clarity:** it's a Python/PyTorch research model, not a .NET framework. If we self-host it for Tier 3, we call it via `IChatClient` against a Python inference endpoint — it's treated as a provider, not linked directly.

## Status matrix

| Thing | Exists | Next |
|---|---|---|
| Aspire AppHost orchestrating Postgres + mtg.api | ✓ | — |
| Postgres as real DB (not SQLite MVP) | ✓ (via Aspire) | BES-377 making it the default |
| EF Core migrations | ✓ | Add pgvector columns + HNSW when Tier 3 arrives |
| React frontend + AppShell + Collection View | ✓ | Decks promotion next |
| `mtg.ai-router` service | ✗ | Scaffold + first Tier-0 tool as vertical slice |
| `mtg.ingest` worker | ✗ | Scryfall sync on cron first |
| Redis cache | ✗ | Aspire `AddRedis` + `.WaitFor()` on dependents |
| pgvector extension + HNSW | ✗ | Add when first AI feature needs embeddings |
| OpenTelemetry tier metrics | Partial (Aspire defaults) | Explicit histogram per tier |
| Agent Framework 1.0 wiring | ✗ | Evaluate when we have more than one AI agent |
| SSE endpoint in mtg.api | ✗ | First stream = token streaming for Fast AI |

## Sequencing (proposed, post-UI stabilization)

1. Stabilize frontend spine: finish Collection promotion, Decks promotion, `/cards` three-zone
2. Data foundation: Scryfall ingest worker, card/rulings/combo schema, scheduled sync
3. AI Router vertical slice: `mtg.ai-router` scaffold + ONE Tier-0 deterministic tool end-to-end (card lookup) to prove the wiring, then ONE Tier-1 tool (fuzzy search + explanation)
4. Redis + observability: Aspire-wire Redis, add tier/latency/cost histograms
5. First 🔥 differentiator: pick the natural-language card search (simplest to demo) and ship the full stack through it as the reference pattern

## Card data ingestion (Scryfall, 2026 pattern)

**Why there are currently no images in the app:** everything you see in Storybook stories + the live `/collection` is mock data. The production data layer hasn't been wired to Scryfall yet. This is the next backend task after the frontend spine stabilizes.

### Scryfall is the canonical source

Scryfall provides the entire MTG card catalog + rulings + images for free under WotC's Fan Content Policy. No registration required. **Use Scryfall — don't scrape individual vendors.** MTGJSON recommends it too.

### Two-tier ingestion: bulk for catalog, API for lookups

| Need | Use | Why |
|---|---|---|
| Full card catalog | **Bulk Data files** (`GET /bulk-data`) | Not rate-limited; updated every 12 hours; canonical |
| Individual card by ID / NL query | REST API (`/cards/:id`, `/cards/search`) | Live, authoritative, post-errata |
| Card images | **Hotlink from `cards.scryfall.io` CDN** | Free, highest quality, not rate-limited, don't self-host |

### Bulk data flow (for `mtg.ingest`)

1. **Discovery:** `GET https://api.scryfall.com/bulk-data` returns a list of bulk files. Read the `download_uri` (timestamped — the old un-timestamped URLs no longer update). Types we want:
   - `default_cards` — every card in English/printed language (primary catalog)
   - `rulings` — all rulings
   - `oracle_cards` (optional) — one card per Oracle ID, smaller
2. **Download:** stream the JSON file (can be hundreds of MB). Don't load into memory; parse as a stream with `System.Text.Json.JsonSerializer.DeserializeAsyncEnumerable<ScryfallCard>()`.
3. **Upsert into Postgres:** batch 500-1000 rows at a time. Key by `oracle_id` (card identity) + `id` (printing identity). Use `ON CONFLICT (id) DO UPDATE`.
4. **Images:** store the `image_uris` object as JSONB. The frontend builds img src from it (`small`, `normal`, `large`, `png`, `art_crop`, `border_crop`). No image download needed.
5. **Prices:** trust for 24 hours max. Bulk files include prices; don't display prices older than 24h as current.
6. **Schedule:** every 12 hours via a worker-hosted timer. Check the `updated_at` on the bulk data object; skip download if we already have that timestamp.

### Rate-limit budget

- General API: 10 req/s cap, use conservatively — 5 req/s is polite.
- Heavy endpoints (`Search`, `Named`, `Random`, `Collection`): 2 req/s — critical.
- Bulk data + image CDN: **no rate limit**.
- **User-Agent header required** on every request: `MtgApp/1.0 (contact@example.com)`. Without it Scryfall may throttle or block.

### Image serving

- Hotlink the Scryfall CDN (`https://cards.scryfall.io/<size>/front/<a>/<b>/<scryfallId>.<ext>`). Don't self-host. Don't proxy.
- Use Tailwind's responsive `<img>` with `loading="lazy"` and a lightweight skeleton while the CDN fetches.
- If we want an in-app CDN edge later (geo + staleness control), Cloudflare Images or Bunny on top of Scryfall URLs; not worth it pre-launch.

### Caching layers (for AI router + frontend)

1. **Postgres** — the card table IS the cache. Queries hit it directly.
2. **Redis** — memoize FTS results, AI router responses by prompt hash.
3. **HTTP** — long-lived ETags on `/api/cards/:id`; client gets 304 on repeat.
4. **CDN** — only for card images (Scryfall handles this).

Don't add Redis speculatively — wait until the AI router or a hot FTS query proves it's needed.

### Rulings, prices, combos — same pattern

- Rulings: `rulings` bulk file, upsert by `oracle_id`.
- Prices: live via bulk (daily refresh is fine for casual users; real-time for trade-scout).
- Combos: Commander Spellbook API (separate) — combo graph lives in its own ingest job.

### Concrete first slice

The first `mtg.ingest` heartbeat ships this:
1. A `SyncScryfallCardsJob` that hits `/bulk-data`, picks `default_cards`, downloads, streams into `Cards` table via `ON CONFLICT`.
2. An `idempotency` column: `bulk_data_timestamp`. Skip if we already synced this timestamp.
3. A Postgres index: `CREATE INDEX idx_cards_name_fts ON cards USING GIN (to_tsvector('english', name))` for FTS.
4. An endpoint `GET /api/cards/{id}` returning the card row. Frontend builds `image_uris.normal` src.
5. Scheduled via a .NET `IHostedService` or `BackgroundService` with a 12-hour timer.
6. OpenTelemetry: `mtg_ingest_cards_upserted_total`, `mtg_ingest_last_success_unix_seconds`, `mtg_ingest_run_duration_seconds`.

**With that one job alive, the Collection page stops being mock data and starts serving real images.**

## Sources

- [.NET 10 overview](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-10/overview)
- [Aspire 13 release notes](https://aspire.dev/whats-new/aspire-13/)
- [Microsoft Agent Framework 1.0 (April 7, 2026)](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)
- [`Microsoft.Extensions.AI`](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai)
- [SSE in .NET 10 Minimal APIs](https://www.milanjovanovic.tech/blog/server-sent-events-in-aspnetcore-and-dotnet-10)
- [pgvector-dotnet](https://github.com/pgvector/pgvector-dotnet)
- [AI model routing best practices 2026](https://openmark.ai/ai-model-routing)
