import type { Meta, StoryObj } from '@storybook/react';
import { DeckBuilderPrototype } from './DeckBuilderPrototype';

const meta: Meta<typeof DeckBuilderPrototype> = {
  title: 'Prototypes/DeckBuilder/DeckBuilderPrototype',
  component: DeckBuilderPrototype,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      disable: true, // Component handles its own background
    },
    viewport: {
      defaultViewport: 'responsive',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DeckBuilderPrototype>;

export const FullPrototype: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**🎮 Complete MTG Deck Builder Prototype**

This is the full video-game-quality deck builder prototype showcasing:

**Core Features:**
- **Split Layout**: Card grid (left) + deck zone (right)
- **Interactive Deck Building**: Click cards to add → spring animations
- **Real-time Mana Curve**: Updates live as cards are added
- **Dark/Light Mode Toggle**: Full theme switching
- **Responsive Design**: 4 cols desktop → 2 cols mobile

**Video-Game Quality Animations:**
- ✨ **Card Hover**: 3D tilt tracking, specular highlights, lift with shadow
- 🎯 **Staggered Entrance**: Each card appears 60ms after previous
- 🌊 **Spring Physics**: Tactile quantity changes, smooth tab transitions
- 💫 **Add to Deck**: Cards fly to deck with exit/enter animations
- 🌈 **Color-Themed Glow**: MTG color identity highlighting
- 💎 **Foil Shimmer**: Premium cards (>$50) show shimmer effect

**Accessibility:**
- ♿ **prefers-reduced-motion**: Graceful fallback, animations disabled
- 🎯 **Reduced Motion Indicator**: Shows when motion is disabled
- ⌨️ **Keyboard Accessible**: All interactions work with keyboard

**Technical Excellence:**
- 🚀 **Performance**: Transform + opacity only (S-tier animations)
- 📱 **Responsive**: Breakpoints: sm(640px) → lg(1024px) → xl(1280px)
- 🎨 **Motion Library**: Uses motion/react (NOT framer-motion)
- 🔧 **Real State**: Functional deck building with quantity management

Try these interactions:
1. **Click cards** to add them to your deck
2. **Toggle dark/light mode** with the theme button
3. **Search and filter** cards in the grid
4. **Manage quantities** in the deck zone
5. **Switch tabs** between mainboard/sideboard
6. **Watch the mana curve** update in real-time
        `,
      },
    },
  },
};

export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default dark mode experience with premium MTG aesthetic.',
      },
    },
  },
};

export const AnimationShowcase: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <DeckBuilderPrototype />
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '200px',
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          🎮 Animation Demo
        </div>
        <div style={{ opacity: 0.9 }}>
          • Hover cards for 3D tilt<br/>
          • Click to add with spring physics<br/>
          • Watch mana curve update live<br/>
          • Toggle theme for transitions<br/>
          • Respect prefers-reduced-motion
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Full animation showcase with helpful overlay explaining interactions.',
      },
    },
  },
};

export const ResponsiveDemo: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Test responsive behavior across different screen sizes. Switch viewports to see grid columns adapt.',
      },
    },
  },
};

export const PerformanceTest: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <DeckBuilderPrototype />
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '11px',
          maxWidth: '180px',
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          ⚡ Performance Notes
        </div>
        <div style={{ opacity: 0.9 }}>
          • S-tier animations only<br/>
          • Transform + opacity<br/>
          • Never width/height/top/left<br/>
          • Spring physics: 300ms stiff<br/>
          • Reduced motion support<br/>
          • Virtual scrolling ready
        </div>
      </div>
      <DeckBuilderPrototype />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Performance-focused view highlighting technical excellence and animation optimization.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <DeckBuilderPrototype />
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '11px',
          maxWidth: '180px',
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          ♿ Accessibility
        </div>
        <div style={{ opacity: 0.9 }}>
          • prefers-reduced-motion<br/>
          • Keyboard navigation<br/>
          • Screen reader friendly<br/>
          • High contrast support<br/>
          • Focus indicators<br/>
          • Alt text on images
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features demonstration. Enable "prefers-reduced-motion" in your OS to see motion reduction.',
      },
    },
  },
};