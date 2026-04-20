# MTG App — 2026 Animation & Visual Stack

## TL;DR

**Stack:** Motion (primary) + GSAP (high-impact moments) + React Three Fiber (3D card table / premium foil effects) + React's native `<ViewTransition>` (navigation) + shadcn/ui extended with Magic UI and Aceternity UI for animated primitives.

**The single most important rule:** every animation gets classified S-tier through F-tier by its render pipeline cost. S-tier (transform + opacity only, compositor thread) stays, F-tier (layout-thrashing) gets rewritten.

## Core Libraries

| Library | Use For | Don't Use For |
|---------|---------|---------------|
| **Motion** (fka Framer Motion) | 90% of UI — hover, drag, mount/unmount, layout animations, springs | — |
| **GSAP** | Landing page hero, scroll-triggered, SVG morphs, cinematic moments | Component-level UI state |
| **React Three Fiber** | 3D booster opening, premium foil cards, playtest table | Every card (kills mobile perf) |
| **View Transitions API** | All navigation, card grid → detail, tab switching | — |
| **dnd-kit** | Deck builder drag-and-drop | — |

## shadcn Extension Layer

| Library | Pull From It |
|---------|-------------|
| **Magic UI** | Bento grids, border beam, number ticker, marquee, particles, text shimmer |
| **Aceternity UI** | 3D card tilt-on-hover, spotlight effects, animated backgrounds, meteor effects |
| **Animate UI** | Drop-in animated shadcn replacements (buttons, switches, accordions) |
| **SmoothUI** | Siri orb (AI indicator), rich popovers, animated inputs |

## Performance Tiers

| Tier | Animates | Cost |
|------|----------|------|
| **S** | transform + opacity | GPU, 120fps, compositor thread |
| **A** | color, background-color, box-shadow | Paint only, 60fps fine |
| **B** | padding, margin (isolated) | Small layout, rare is OK |
| **C** | width, height, top, left | Layout recalc — avoid |
| **F** | Nested C-tier | Layout thrashing — never ship |

## Animation Rules (for CLAUDE.md)

- All animations use Motion (`import from 'motion/react'`), NOT framer-motion
- Transform + opacity only for UI state changes. Never animate width, height, top, left
- Every animation respects prefers-reduced-motion
- Use `<ViewTransition>` for navigation and shared-element moments
- Use GSAP only for scroll-triggered or timeline-heavy landing/marketing animations
- Use R3F only for designated 3D moments (booster opening, foil hero cards, playtest table)
- Duration defaults: 150ms micro-interactions, 300ms state changes, 500ms cinematic reveals
- Easing: ease-out for entering, ease-in for exiting. Spring physics for tactile feel

## MTG-Specific Animation Patterns

### Card Interactions
- **Hover tilt:** `perspective(1000px) rotateX/Y` from cursor position + specular highlight overlay
- **Foil shimmer:** Animated gradient overlay + noise texture. Premium: R3F MeshPhysicalMaterial + iridescence
- **Hover lift:** `translateY(-8px)` + growing shadow. 200ms ease-out
- **Tap press:** `scale(0.97)` on press, spring back. 80ms

### Deck Building
- **Drag-to-add:** dnd-kit overlay with `rotate(3deg)` + elevated shadow, spring settle on drop
- **Reorder:** Motion layout animations with spring physics
- **Price tick:** Count-up animation, green/red flash for increase/decrease

### Navigation (View Transitions)
- **Card grid → detail:** `view-transition-name: card-{id}` — image morphs from grid to detail view
- **Tab switching:** Cross-fade content, sliding indicator via Motion `layoutId`

### AI Agent Interactions
- **Thinking:** SmoothUI Siri Orb, different colors per agent type
- **Response:** Typewriter effect (15-20ms/char) or line-by-line wipe
- **Confidence:** Spring-physics bar that wobbles on low confidence

## Day 1 Dependencies

```bash
pnpm add motion gsap @gsap/react
pnpm add three @react-three/fiber @react-three/drei @react-three/postprocessing
pnpm add @dnd-kit/core @dnd-kit/sortable
pnpm add @tanstack/react-virtual
```

## Performance Watch List

1. **Collection grid 10K+ cards:** Virtualize with TanStack Virtual + `content-visibility: auto`
2. **Deck builder DnD:** dnd-kit sortable, drag overlay transform+opacity only
3. **Playtest sandbox:** CSS-only tilt for non-focused cards, or R3F instanced meshes

## Accessibility Floor

1. `prefers-reduced-motion` respected everywhere (instant with 150ms fade fallback)
2. Focus states visible during animations
3. No animation traps keyboard users — all interruptible
