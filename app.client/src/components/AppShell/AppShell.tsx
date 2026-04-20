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
  Zap
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

export const AppShell: React.FC<AppShellProps> = ({
  currentPage = 'Dashboard',
  activeNav,
  children,
  onNavClick,
  onCTAClick
}) => {
  const primaryAction = getPrimaryAction(activeNav);
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900/20 via-slate-900 to-black">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-full w-56 bg-slate-950/90 border-r border-white/10 backdrop-blur-sm">
        <div className="flex flex-col h-full">
          {/* Logo/Brand Area */}
          <div className="p-6 border-b border-white/10">
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
      </div>

      {/* Main Content Area */}
      <div className="ml-56 min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-slate-950/50 border-b border-white/10 backdrop-blur-sm">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-slate-400">
              <Home size={16} />
              <ChevronRight size={14} />
              <span className="text-white font-medium">{currentPage}</span>
            </div>

            {/* Search */}
            <div className="relative max-w-md flex-1 mx-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search cards..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-md pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Right side placeholder */}
            <div className="w-24"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children || (
            <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
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