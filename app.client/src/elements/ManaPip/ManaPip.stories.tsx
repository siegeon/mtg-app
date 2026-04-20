import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ManaPip, ManaPipGroup } from './ManaPip';

const meta = {
  title: 'Elements/ManaPip/ManaPip',
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