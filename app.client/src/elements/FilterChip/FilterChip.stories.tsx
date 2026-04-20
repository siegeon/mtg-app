import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterChip, FilterChipGroup } from './FilterChip';

const meta = {
  title: 'Elements/FilterChip/FilterChip',
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