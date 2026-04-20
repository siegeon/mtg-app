import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard, StatCardStrip } from './StatCard';

const meta = {
  title: 'Elements/StatCard/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  args: {
    label: 'Total Cards',
    value: 1203,
    variant: 'default',
    isLoading: false,
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    variant: {
      control: 'select',
      options: ['default', 'success'],
    },
    isLoading: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-[200px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TotalCards: Story = {
  args: {
    label: 'Total Cards',
    value: 1203,
  },
};

export const UniqueCards: Story = {
  args: {
    label: 'Unique Cards',
    value: 847,
  },
};

export const TotalValue: Story = {
  args: {
    label: 'Total Value',
    value: '$2,847.50',
    variant: 'success',
  },
};

export const Loading: Story = {
  args: {
    label: 'Loading...',
    value: 0,
    isLoading: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Rare Cards',
    value: 156,
    icon: (
      <div className="w-3 h-3 rounded-full bg-orange-400" />
    ),
  },
};

export const ThreeCardStrip: Story = {
  render: () => {
    const stats = [
      {
        id: 'total',
        label: 'Total Cards',
        value: 1203,
      },
      {
        id: 'unique',
        label: 'Unique Cards',
        value: 847,
      },
      {
        id: 'value',
        label: 'Total Value',
        value: '$2,847.50',
        variant: 'success' as const,
      },
    ];

    return <StatCardStrip stats={stats} />;
  },
};

export const ThreeCardStripWithLoading: Story = {
  render: () => {
    const stats = [
      {
        id: 'total',
        label: 'Total Cards',
        value: 1203,
      },
      {
        id: 'unique',
        label: 'Unique Cards',
        value: 0,
        isLoading: true,
      },
      {
        id: 'value',
        label: 'Total Value',
        value: '$2,847.50',
        variant: 'success' as const,
      },
    ];

    return <StatCardStrip stats={stats} />;
  },
};