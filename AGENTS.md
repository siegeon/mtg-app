# MTG App — Agent Guidelines

## Project Context

This is the MTG App Ecosystem — the definitive Magic: The Gathering application.
Read CLAUDE.md for tech stack, project structure, and conventions.
Read docs/FEATURE_INVENTORY.md for the full feature spec and priorities.
Read docs/ANIMATION_STACK.md for the animation stack and specific motion patterns.

## VISUAL BAR — VIDEO GAME, NOT CRUD APP

**Every component, every screen, every interaction must have polished motion and animation.** This is the #1 product differentiator. A static UI is an incomplete feature. Do not mark work done if it doesn't move.

Key rules (see CLAUDE.md and docs/ANIMATION_STACK.md for full details):
- Motion library (`motion/react`) for 90% of animations. NOT framer-motion.
- Every hover has visual feedback (lift, tilt, glow, or scale)
- Every state change animates (spring physics for tactile feel)
- Cards use 3D tilt on hover with specular highlight (Aceternity UI)
- View Transitions for all navigation (shared-element morphs)
- S-tier animations only: transform + opacity. Never animate layout properties.
- `prefers-reduced-motion` respected everywhere
- Duration: 150ms micro, 300ms state, 500ms cinematic

## Environment Setup

If dotnet is not on PATH:
```bash
export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$DOTNET_ROOT:$PATH"
```

## Verification Protocol

Before marking any issue done:

1. **Build:** `dotnet build` must succeed with zero errors
2. **Tests:** `dotnet test` must pass. `pnpm build` must succeed.
3. **Runtime:** If Aspire is configured, start it and verify services are healthy
4. **Browser:** If UI changes, verify in browser or Storybook. Take screenshots as evidence.
5. **Storybook:** New UI components must have stories. Verify they render.

"Build passes" is NOT the same as "it works." Always verify at runtime.

## Handoff Protocol

When passing work to the next agent (Builder → Verifier, etc.), your comment MUST include:
- What was done and why
- How to verify (specific URLs, commands, or stories to check)
- Any known limitations or edge cases
- Screenshots if UI work

## PRISM — Team Memory System

PRISM gives every agent persistent memory across heartbeats and sessions. It runs at `localhost:8081` via MCP (configured in `.mcp.json`).

### Every Agent Should:
- **Start of heartbeat:** Call `mcp__prism__context_bundle(persona="<your-role>")` to load relevant context
- **Before investigating:** Call `mcp__prism__brain_search` to check if this problem was solved before
- **After completing work:** Call `mcp__prism__memory_store` to persist what you learned
- **Before storing:** Call `mcp__prism__memory_recall` to avoid duplicates

### First Time on This Project:
1. Call `mcp__prism__project_list` — is `mtg-app` onboarded?
2. If not: call `mcp__prism__project_onboard` and walk the checklist
3. If yes: proceed with `context_bundle`

### What to Store in PRISM:
- Patterns that worked (animation approaches, API integration patterns)
- Failures and their root causes (so other agents don't repeat them)
- Design decisions and their reasoning
- Performance findings (what's S-tier vs F-tier in practice)

### What NOT to Store:
- Anything already in CLAUDE.md, AGENTS.md, or docs/
- Raw code (use `brain_index_doc` instead)
- Ephemeral state (issue numbers, agent statuses)

## Paperclip Rules

- Never trigger a heartbeat from inside a heartbeat
- Always comment on in-progress work before exiting
- Always set parentId on subtasks
- Board Review issues: set --status blocked, only human can unblock
