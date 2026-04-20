# MTG App Ecosystem

The definitive Magic: The Gathering application — deck building, collection management, game tracking, pricing, and AI-powered tools.

## THE NON-NEGOTIABLE VISUAL BAR

**This app must feel like a video game, not a CRUD app.** Every screen, every interaction, every component must have polished motion. This is not optional, not a "nice-to-have," not something we "add later." Animation quality IS the product quality. A feature without animation is an incomplete feature. Do not ship static UI.

Read `docs/ANIMATION_STACK.md` for the full rationale and specific patterns. The key points:

- **Every hover has feedback** (lift, tilt, glow, or scale — never just cursor change)
- **Every state change animates** (enter/exit with Motion, spring physics for tactile feel)
- **Every navigation morphs** (View Transitions API for shared elements — card in grid flies to detail view)
- **Cards are the primary interaction surface** — they must feel physical (3D tilt on hover, specular highlight, foil shimmer for premium)
- **AI interactions have their own motion language** (Siri orb thinking indicator, typewriter response reveal, confidence bars with spring physics)
- **Performance tier S or A only** — transform + opacity animations. Never animate width/height/top/left. Run `/motion-audit` before shipping.
- **`prefers-reduced-motion` respected everywhere** — no exceptions

If you're building a component and it doesn't move, you're not done.

## Tech Stack

- **Backend:** .NET 10, Aspire (service orchestration), EF Core (ORM), PostgreSQL
- **Frontend:** React + Vite, TypeScript, shadcn/ui, Radix, Tailwind CSS v4
- **Testing:** xUnit (.NET), Vitest (frontend), Playwright (browser/E2E), Storybook (component dev)
- **Package manager:** pnpm (frontend), dotnet (backend)
- **Infrastructure:** .NET Aspire AppHost for local dev orchestration

## Project Structure (planned)

```
mtg-app/
├── src/
│   ├── MtgApp.AppHost/          # Aspire orchestrator
│   ├── MtgApp.ServiceDefaults/  # Shared service config
│   ├── MtgApp.Api/              # Web API
│   ├── MtgApp.Domain/           # Domain models
│   ├── MtgApp.Infrastructure/   # EF Core, external APIs
│   └── MtgApp.Web/              # React frontend
├── tests/
│   ├── MtgApp.Api.Tests/
│   ├── MtgApp.Domain.Tests/
│   └── MtgApp.Web.Tests/
├── docs/
│   └── FEATURE_INVENTORY.md     # Full feature spec
└── CLAUDE.md                    # This file
```

## Key External APIs

- **Scryfall API** — Card data spine (https://scryfall.com/docs/api)
- **EDHREC** — Commander recommendations and synergy data
- **Commander Spellbook** — Combo database
- **TCGplayer / Card Kingdom / Cardmarket** — Pricing data

## Development Commands

```bash
# Backend
dotnet build
dotnet test
aspire run         # Start all services via Aspire

# Frontend
cd src/MtgApp.Web
pnpm install
pnpm dev           # Vite dev server
pnpm build         # Production build
pnpm storybook     # Component development

# E2E
pnpm playwright test
```

## Animation & Visual Stack

See `docs/ANIMATION_STACK.md` for the full rationale. Key rules:

- **Motion** (import from `motion/react`) for 90% of UI animations. NOT framer-motion.
- **GSAP** only for scroll-triggered or timeline-heavy landing/marketing animations.
- **React Three Fiber** only for designated 3D moments (booster opening, foil hero cards, playtest table).
- **View Transitions API** for all navigation and shared-element moments.
- **dnd-kit** for drag-and-drop (deck builder).
- Transform + opacity only for UI state changes. Never animate width, height, top, left.
- Every animation respects `prefers-reduced-motion`.
- Duration defaults: 150ms micro-interactions, 300ms state changes, 500ms cinematic reveals.
- Easing: ease-out for entering elements, ease-in for exiting. Spring physics for tactile feel.
- Virtualize collection grids with TanStack Virtual + `content-visibility: auto`.

## UI Component Libraries

- **shadcn/ui** — base primitives (Dialog, Dropdown, Command)
- **Magic UI** — animated surfaces (bento grids, border beam, number ticker, particles)
- **Aceternity UI** — 3D card tilt, spotlight effects, premium feel moments
- **Animate UI** — drop-in animated shadcn replacements
- **SmoothUI** — AI indicators (Siri orb), rich popovers

## Conventions

- Follow existing patterns in the codebase before creating new ones
- All API endpoints return JSON
- Use EF Core migrations for schema changes
- Storybook: Views/ for shipped components, Prototypes/ for WIP
- Dark mode support required (light mode default)
- All new UI components need Storybook stories
