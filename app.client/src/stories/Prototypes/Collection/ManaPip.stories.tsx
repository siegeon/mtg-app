import type { Meta, StoryObj } from '@storybook/react-vite';
import { motion } from 'motion/react';
import { useState } from 'react';

interface ManaPipProps {
  color: 'W' | 'U' | 'B' | 'R' | 'G' | 'C';
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const ManaPip = ({ color, active = false, disabled = false, onClick }: ManaPipProps) => {
  const colorMap = {
    W: { bg: '#FFF8E7', border: '#D4B896' }, // cream
    U: { bg: '#87CEEB', border: '#4682B4' }, // sky blue
    B: { bg: '#2F2F2F', border: '#1A1A1A' }, // dark gray
    R: { bg: '#FA8072', border: '#CD5C5C' }, // coral
    G: { bg: '#9CAF88', border: '#6B8E5A' }, // sage green
    C: { bg: '#9CA3AF', border: '#6B7280' }, // neutral gray
  };

  const colors = colorMap[color];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-5 h-5 rounded-full border-[0.5px]
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${active ? 'ring-2 ring-violet-500 ring-offset-1' : ''}
      `}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
      whileHover={!disabled ? { scale: 1.1, brightness: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={active ? { scale: [1, 1.05, 1] } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="sr-only">
        {color === 'C' ? 'Colorless' :
         color === 'W' ? 'White' :
         color === 'U' ? 'Blue' :
         color === 'B' ? 'Black' :
         color === 'R' ? 'Red' :
         'Green'}
      </span>
    </motion.button>
  );
};

interface ManaPipGroupProps {
  activeColors?: ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[];
  onToggle?: (color: 'W' | 'U' | 'B' | 'R' | 'G' | 'C') => void;
}

const ManaPipGroup = ({ activeColors = [], onToggle }: ManaPipGroupProps) => {
  const colors: ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[] = ['W', 'U', 'B', 'R', 'G', 'C'];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
        Colors:
      </span>
      <div className="flex items-center gap-1">
        {colors.map((color) => (
          <ManaPip
            key={color}
            color={color}
            active={activeColors.includes(color)}
            onClick={() => onToggle?.(color)}
          />
        ))}
      </div>
    </div>
  );
};

const meta = {
  title: 'Prototypes/Collection/ManaPip',
  component: ManaPip,
  tags: ['autodocs'],
  args: {
    color: 'U',
    active: false,
    disabled: false,
  },
  argTypes: {
    color: {
      control: 'select',
      options: ['W', 'U', 'B', 'R', 'G', 'C'],
      description: 'MTG color (W=White, U=Blue, B=Black, R=Red, G=Green, C=Colorless)'
    },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ManaPip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      {(['W', 'U', 'B', 'R', 'G', 'C'] as const).map((color) => (
        <div key={color} className="flex flex-col items-center gap-2">
          <ManaPip color={color} />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {color === 'C' ? 'Colorless' :
             color === 'W' ? 'White' :
             color === 'U' ? 'Blue' :
             color === 'B' ? 'Black' :
             color === 'R' ? 'Red' :
             'Green'}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      {(['W', 'U', 'B', 'R', 'G', 'C'] as const).map((color, index) => (
        <ManaPip
          key={color}
          color={color}
          active={index % 2 === 0}
        />
      ))}
    </div>
  ),
};

export const Group: Story = {
  render: () => {
    const [activeColors, setActiveColors] = useState<('W' | 'U' | 'B' | 'R' | 'G' | 'C')[]>(['U', 'R']);

    const handleToggle = (color: 'W' | 'U' | 'B' | 'R' | 'G' | 'C') => {
      setActiveColors(prev =>
        prev.includes(color)
          ? prev.filter(c => c !== color)
          : [...prev, color]
      );
    };

    return (
      <div className="p-4">
        <ManaPipGroup
          activeColors={activeColors}
          onToggle={handleToggle}
        />
      </div>
    );
  },
};