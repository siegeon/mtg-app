import { motion } from 'motion/react';
import { X } from 'lucide-react';

export interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  disabled?: boolean;
}

export const FilterChip = ({ label, onRemove, disabled = false }: FilterChipProps) => {
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

export interface FilterChipGroupProps {
  chips: { label: string; id: string }[];
  onRemove?: (id: string) => void;
}

export const FilterChipGroup = ({ chips, onRemove }: FilterChipGroupProps) => {
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