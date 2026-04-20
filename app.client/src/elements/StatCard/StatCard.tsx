import React from 'react';
import { motion } from 'motion/react';

export interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const StatCard = ({ label, value, variant = 'default', icon, isLoading = false }: StatCardProps) => {
  return (
    <motion.div
      className={`
        bg-white/[0.03] dark:bg-white/[0.03] border border-gray-200 dark:border-gray-700
        rounded-lg p-3 transition-colors duration-200
        hover:bg-white/[0.05] dark:hover:bg-white/[0.05]
      `}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <div className="text-gray-500 dark:text-gray-400">
                {icon}
              </div>
            )}
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {label}
            </p>
          </div>
          {isLoading ? (
            <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className={`
              text-lg font-medium leading-none
              ${variant === 'success'
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-900 dark:text-gray-100'
              }
            `}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export interface StatCardStripProps {
  stats: Array<{
    id: string;
    label: string;
    value: string | number;
    variant?: 'default' | 'success';
    icon?: React.ReactNode;
    isLoading?: boolean;
  }>;
}

export const StatCardStrip = ({ stats }: StatCardStripProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          variant={stat.variant}
          icon={stat.icon}
          isLoading={stat.isLoading}
        />
      ))}
    </div>
  );
};