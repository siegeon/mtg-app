# MTG App Style Guide

Design language inspired by autoclaude (Aperant) visual DNA with MTG-specific adaptations. Pairs with `ANIMATION_STACK.md` for motion patterns.

## Color Palette

```css
/* Primary Colors */
--color-primary: #8b5cf6;        /* violet-500 - purple accent */
--color-primary-dark: #7c3aed;   /* violet-600 - hover states */
--color-primary-light: #a78bfa;  /* violet-400 - subtle highlights */

/* Background System */
--bg-app: linear-gradient(135deg, #2d1b69 0%, #1f1a2e 25%, #0f0f0f 50%);
--bg-panel: #1a1a1a;             /* near-black panels */
--bg-panel-hover: #222222;       /* hover state */
--bg-sidebar: #151515;           /* darker sidebar */
--bg-input: #1e1e1e;            /* form inputs */

/* Text Hierarchy */
--text-primary: #fafafa;         /* near-white primary text */
--text-secondary: #94a3b8;       /* slate-400 secondary text */
--text-muted: #64748b;           /* slate-500 muted text */
--text-accent: #8b5cf6;          /* violet-500 accent text */

/* Semantic Colors */
--color-success: #22c55e;        /* green-500 */
--color-warning: #f59e0b;        /* amber-500 */
--color-error: #ef4444;          /* red-500 */
--color-info: #3b82f6;           /* blue-500 */
```

## Layout Tokens

```css
/* Sidebar */
--sidebar-width: 220px;
--sidebar-compact-width: 60px;

/* Container Max Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Z-Index Scale */
--z-sidebar: 40;
--z-header: 50;
--z-dropdown: 100;
--z-modal: 1000;
--z-tooltip: 2000;
```

## Spacing Scale

```css
/* Based on 4px baseline */
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

## Typography Scale

```css
/* Font Families */
--font-sans: ui-sans-serif, system-ui, sans-serif;
--font-mono: ui-monospace, 'SF Mono', Consolas, monospace;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

## Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;        /* Primary panel radius */
--radius-lg: 12px;
--radius-full: 9999px;   /* Pills and status chips */
```

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
--shadow-card-hover: 0 20px 25px rgba(0, 0, 0, 0.4);
```

## Component Patterns

### Panels
```css
.panel {
  background: var(--bg-panel);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.panel-hover:hover {
  background: var(--bg-panel-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Buttons
```css
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 150ms ease-out;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
```

### Status Chips
```css
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-success {
  background: rgba(34, 197, 94, 0.2);
  color: var(--color-success);
}
```

### Sidebar Navigation
```css
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  transition: all 150ms ease-out;
}

.nav-item:hover {
  background: rgba(139, 92, 246, 0.1);
  color: var(--text-primary);
  transform: translateX(4px);
}

.nav-item.active {
  background: rgba(139, 92, 246, 0.2);
  color: var(--color-primary);
}

.nav-section {
  margin: var(--space-6) 0 var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}
```

## Focus Ring System

```css
.focus-ring:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

## Responsive Breakpoints

```css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

## MTG-Specific Tokens

```css
/* Card Dimensions */
--card-width-sm: 120px;
--card-width-md: 180px;
--card-width-lg: 240px;
--card-aspect-ratio: 0.715;  /* Standard MTG card ratio */

/* Mana Color Mapping */
--mana-white: #fffbd5;
--mana-blue: #0e68ab;
--mana-black: #150b00;
--mana-red: #d3202a;
--mana-green: #00733e;
--mana-colorless: #ccc2c0;
```

## Animation Integration

This style guide pairs with `ANIMATION_STACK.md`. Key integration points:

- All hover states use `transform` + `opacity` only (S-tier performance)
- Spring transitions via Motion for tactile feel  
- `prefers-reduced-motion` respected in all hover effects
- View Transitions API ready with semantic class names

## Usage with Tailwind v4

Apply via CSS custom properties in your main stylesheet:

```css
@import "tailwindcss";

:root {
  /* Import all custom properties above */
}

.app-gradient {
  background: var(--bg-app);
}
```