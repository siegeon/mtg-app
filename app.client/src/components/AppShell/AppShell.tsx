import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Library,
  Search,
  ScanLine,
  Archive,
  TrendingUp,
  DollarSign,
  Settings,
  Plus,
  ChevronRight,
  Bookmark,
  Play,
  Zap,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AppShellProps {
  /** Current page context for breadcrumb */
  currentPage?: string;
  /** Active navigation item */
  activeNav?: string;
  /** Main content to display */
  children?: React.ReactNode;
  /** Navigation item click handler */
  onNavClick?: (navId: string) => void;
  /** Primary CTA click handler */
  onCTAClick?: (label: string) => void;
  /** Filter controls for top bar row 2 */
  filterControls?: React.ReactNode;
  /** Filter chips for top bar row 3 */
  filterChips?: { label: string; onRemove(): void }[];
  /** Result counter for top bar row 3 */
  resultCounter?: { showing: number; total: number };
}

const getPrimaryAction = (activeNav?: string) => {
  const actionMap = {
    decks: { label: 'New Deck', icon: Plus },
    collection: { label: 'Add Cards', icon: Plus },
    cards: { label: 'Save Search', icon: Bookmark },
    scan: { label: 'Start Scan', icon: Play },
    storage: { label: 'New Location', icon: Plus },
    'trade-scout': { label: 'New Match Rule', icon: Zap },
    prices: { label: 'Add to Watchlist', icon: Plus }
  };

  return activeNav ? actionMap[activeNav as keyof typeof actionMap] : null;
};

const sidebarSections = [
  {
    label: 'COLLECTION',
    items: [
      { id: 'decks', label: 'Decks', icon: Library },
      { id: 'collection', label: 'Collection', icon: Archive },
      { id: 'cards', label: 'Cards', icon: Search }
    ]
  },
  {
    label: 'AI TOOLS',
    items: [
      { id: 'scan', label: 'Scan', icon: ScanLine },
      { id: 'storage', label: 'Storage', icon: Archive },
      { id: 'trade-scout', label: 'Trade Scout', icon: TrendingUp },
      { id: 'prices', label: 'Prices', icon: DollarSign }
    ]
  }
];

const NavItem = ({ item, isActive, onClick }: { item: any; isActive: boolean; onClick?: () => void }) => {
  const Icon = item.icon;

  return (
    <motion.button
      className={cn(
        'flex items-center gap-3 w-full px-4 py-3 text-left rounded-sm transition-all duration-150',
        'text-slate-400 font-medium hover:text-slate-100',
        'hover:bg-violet-500/10 hover:translate-x-1',
        isActive && 'bg-violet-500/20 text-violet-400'
      )}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon size={18} />
      <span className="text-sm">{item.label}</span>
    </motion.button>
  );
};

// Filter chip component for row 3
const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <motion.div
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-medium border border-violet-500/30"
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <span className="select-none">{label}</span>
    <motion.button
      type="button"
      onClick={onRemove}
      className="flex items-center justify-center w-4 h-4 rounded-full bg-violet-600/20 hover:bg-violet-600/40 text-violet-600 dark:text-violet-400 transition-colors duration-150"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Remove ${label} filter`}
    >
      <X size={10} />
    </motion.button>
  </motion.div>
);

export const AppShell: React.FC<AppShellProps> = ({
  currentPage = 'Dashboard',
  activeNav,
  children,
  onNavClick,
  onCTAClick,
  filterControls,
  filterChips,
  resultCounter
}) => {
  const primaryAction = getPrimaryAction(activeNav);
  return (
    <div className="h-screen grid grid-cols-[auto_1fr] grid-rows-1 bg-gradient-to-br from-violet-900/20 via-slate-900 to-black">
      {/* Left Sidebar */}
      <aside className="h-screen w-56 bg-slate-950/90 border-r border-white/10 backdrop-blur-sm overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Logo/Brand Area */}
          <div className="h-16 px-6 flex items-center border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-white font-semibold">MTG App</h1>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-6">
            {sidebarSections.map((section) => (
              <div key={section.label}>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-4">
                  {section.label}
                </h2>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={activeNav === item.id}
                      onClick={() => onNavClick?.(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {/* Primary CTA Button */}
            {primaryAction && (
              <motion.button
                className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-150"
                onClick={() => onCTAClick?.(primaryAction.label)}
                whileHover={{ y: -1, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <primaryAction.icon size={16} />
                {primaryAction.label}
              </motion.button>
            )}

            {/* Settings */}
            <NavItem
              item={{ id: 'settings', label: 'Settings', icon: Settings }}
              isActive={activeNav === 'settings'}
              onClick={() => onNavClick?.('settings')}
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col min-h-0">
        {/* Top Bar - Three-zone header (adaptive rows) */}
        <header className="bg-slate-950/50 border-b border-white/10 backdrop-blur-sm">
          {/* Row 1: Breadcrumb */}
          <div className="h-16 px-6 flex items-center border-b border-white/5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-slate-400">
              <Home size={16} />
              <ChevronRight size={14} />
              <span className="text-white font-medium">{currentPage}</span>
            </div>
          </div>

          {/* Row 2: Filter Controls (only if provided) */}
          {filterControls && (
            <div className="px-6 py-3 border-b border-white/5">
              {filterControls}
            </div>
          )}

          {/* Row 3: Filter Chips + Result Counter (only if chips or counter provided) */}
          {(filterChips?.length || resultCounter) && (
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {filterChips?.map((chip, index) => (
                  <FilterChip
                    key={index}
                    label={chip.label}
                    onRemove={chip.onRemove}
                  />
                ))}
              </div>
              {resultCounter && (
                <span className="text-sm text-slate-400">
                  Showing {resultCounter.showing.toLocaleString()} of {resultCounter.total.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-6">
          {children || (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-lg mx-auto flex items-center justify-center">
                  <Library className="text-slate-500" size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Main Content Area</h2>
                  <p className="text-slate-400">This is where page content will be routed</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};