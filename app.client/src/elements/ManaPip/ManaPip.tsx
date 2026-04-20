import { motion } from 'motion/react';

export interface ManaPipProps {
  color: 'W' | 'U' | 'B' | 'R' | 'G' | 'C';
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const ManaPip = ({ color, active = false, disabled = false, onClick }: ManaPipProps) => {
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
      whileHover={!disabled ? { scale: 1.1 } : {}}
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

export interface ManaPipGroupProps {
  activeColors?: ('W' | 'U' | 'B' | 'R' | 'G' | 'C')[];
  onToggle?: (color: 'W' | 'U' | 'B' | 'R' | 'G' | 'C') => void;
}

export const ManaPipGroup = ({ activeColors = [], onToggle }: ManaPipGroupProps) => {
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