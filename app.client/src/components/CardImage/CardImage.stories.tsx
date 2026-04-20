import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardImage, CardImageWithHover } from './CardImage';

const meta = {
  title: 'Components/CardImage',
  component: CardImage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Card Image Component

High-performance card image component with advanced loading states, error handling, and smooth animations.

## Features

- **Advanced Lazy Loading**: Uses Intersection Observer for efficient loading
- **Loading States**: Shimmer animation while loading
- **Error Handling**: Graceful fallback for failed image loads
- **Performance Optimized**: Uses \`content-visibility\` and lazy loading
- **Accessibility**: Proper alt text and ARIA labels
- **Motion Respect**: Honors \`prefers-reduced-motion\` settings
- **Hover Effects**: 3D tilt and scaling (CardImageWithHover variant)

## Animation Quality Standards

- Transform + opacity only (no layout thrashing)
- Spring physics for tactile feel
- 300ms duration for state changes
- Smooth loading → loaded transition
- Reduced motion compliance

## Performance Features

- Intersection Observer with 100px rootMargin
- \`fetchPriority="low"\` for background loading
- \`content-visibility: auto\` for rendering optimization
- Proper aspect ratios to prevent layout shifts
        `
      }
    }
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'normal'],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CardImage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample image URIs for stories
const sampleImageUris = {
  normal: "https://cards.scryfall.io/normal/front/2/d/2dd5a601-aff0-4d54-a8c0-704cd18ebf35.jpg",
  small: "https://cards.scryfall.io/small/front/2/d/2dd5a601-aff0-4d54-a8c0-704cd18ebf35.jpg"
};

const brokenImageUris = {
  normal: "https://invalid-url.example.com/broken.jpg",
  small: "https://invalid-url.example.com/broken-small.jpg"
};

export const Default: Story = {
  args: {
    name: "Lightning Bolt",
    imageUris: sampleImageUris,
    size: 'normal',
    className: 'w-48 h-64'
  },
};

export const SmallSize: Story = {
  args: {
    name: "Lightning Bolt",
    imageUris: sampleImageUris,
    size: 'small',
    className: 'w-32 h-44'
  },
};

export const WithHoverEffects: Story = {
  render: (args) => (
    <CardImageWithHover {...args} />
  ),
  args: {
    name: "Lightning Bolt",
    imageUris: sampleImageUris,
    size: 'normal',
    className: 'w-48 h-64'
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over the card to see 3D tilt and scaling effects with spring physics.'
      }
    }
  }
};

export const ErrorState: Story = {
  args: {
    name: "Broken Image Card",
    imageUris: brokenImageUris,
    size: 'normal',
    className: 'w-48 h-64'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the error state when image loading fails.'
      }
    }
  }
};

export const LoadingDemo: Story = {
  render: (args) => {
    // Simulate slow loading by using a delayed image
    const delayedImageUris = {
      normal: "https://cards.scryfall.io/normal/front/c/8/c8817585-0d32-4d56-9142-0d29512e7fa6.jpg?t=" + Date.now(),
      small: "https://cards.scryfall.io/small/front/c/8/c8817585-0d32-4d56-9142-0d29512e7fa6.jpg?t=" + Date.now()
    };

    return <CardImage {...args} imageUris={delayedImageUris} />;
  },
  args: {
    name: "Jace, the Mind Sculptor",
    size: 'normal',
    className: 'w-48 h-64'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the loading animation with shimmer effect. Refresh to see the loading state.'
      }
    }
  }
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, i) => (
        <CardImageWithHover
          key={i}
          name={`Sample Card ${i + 1}`}
          imageUris={{
            normal: `https://cards.scryfall.io/normal/front/${Math.floor(i/2)}/${i}/${i}${i}${i}${i}${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}.jpg`,
            small: `https://cards.scryfall.io/small/front/${Math.floor(i/2)}/${i}/${i}${i}${i}${i}${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}-${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}.jpg`
          }}
          size="normal"
          className="w-full aspect-[5/7]"
        />
      ))}
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Grid of cards showing hover effects and staggered loading. Some images may fail to load, demonstrating error states.'
      }
    }
  }
};

export const ReducedMotion: Story = {
  args: {
    name: "Lightning Bolt",
    imageUris: sampleImageUris,
    size: 'normal',
    className: 'w-48 h-64'
  },
  parameters: {
    docs: {
      description: {
        story: 'Test this with `prefers-reduced-motion: reduce` in your browser to see the simplified animations.'
      }
    }
  },
  decorators: [
    (Story) => (
      <div style={{
        // Simulate reduced motion preference for this story
        contain: 'layout'
      }}>
        <p className="text-sm text-slate-400 mb-4">
          💡 Enable "reduce motion" in your OS accessibility settings to test reduced motion behavior
        </p>
        <Story />
      </div>
    ),
  ],
};