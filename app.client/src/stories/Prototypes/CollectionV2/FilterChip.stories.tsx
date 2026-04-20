import type { Meta, StoryObj } from '@storybook/react-vite';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  disabled?: boolean;
}

const FilterChip = ({ label, onRemove, disabled = false }: FilterChipProps) => {
  return (
    <motion.div
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        bg-violet-500/20 text-violet-700 dark:text-violet-300
        text-xs font-medium border border-violet-500/30
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
      `}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <span className="select-none">{label}</span>
      {onRemove && (
        <motion.button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={`
            flex items-center justify-center w-4 h-4 rounded-full
            bg-violet-600/20 hover:bg-violet-600/40 text-violet-600 dark:text-violet-400
            transition-colors duration-150
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileHover={!disabled ? { scale: 1.1 } : {}}
          whileTap={!disabled ? { scale: 0.9 } : {}}
          aria-label={`Remove ${label} filter`}
        >
          <X size={10} />
        </motion.button>
      )}
    </motion.div>
  );
};

interface FilterChipGroupProps {
  chips: { label: string; id: string }[];
  onRemove?: (id: string) => void;
}

const FilterChipGroup = ({ chips, onRemove }: FilterChipGroupProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {chips.map((chip) => (
        <FilterChip
          key={chip.id}
          label={chip.label}
          onRemove={() => onRemove?.(chip.id)}
        />
      ))}
    </div>
  );
};

const meta = {
  title: 'Prototypes/CollectionV2/FilterChip',
  component: FilterChip,
  tags: ['autodocs'],
  args: {
    label: 'Legendary Creature',
    disabled: false,
  },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onRemove: { action: 'remove' },
  },
  decorators: [
    (Story) => (
      <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutRemove: Story = {
  args: {
    onRemove: undefined,
  },
};

export const WithLongLabel: Story = {
  args: {
    label: 'Legendary Artifact Creature — Construct',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const GroupRow: Story = {
  render: () => {
    const chips = [
      { id: '1', label: 'Blue' },
      { id: '2', label: 'Legendary' },
      { id: '3', label: 'CMC ≤ 3' },
      { id: '4', label: 'Rare' },
      { id: '5', label: 'Creature' },
    ];

    const handleRemove = (id: string) => {
      console.log('Remove chip:', id);
    };

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Active Filters
          </h3>
          <FilterChipGroup chips={chips} onRemove={handleRemove} />
        </div>

        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FilterChipGroup chips={chips.slice(0, 3)} onRemove={handleRemove} />
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing 247 of 1,203 cards
            </span>
          </div>
        </div>
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: () => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {/* No chips - empty state */}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Showing 1,203 of 1,203 cards
      </span>
    </div>
  ),
};