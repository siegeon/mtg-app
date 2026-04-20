import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AppShellContextValue {
  // AppShell props that pages can set
  filterControls?: React.ReactNode;
  filterChips?: { label: string; onRemove(): void }[];
  resultCounter?: { showing: number; total: number };

  // Methods to update these props
  setFilterControls: (filterControls?: React.ReactNode) => void;
  setFilterChips: (filterChips?: { label: string; onRemove(): void }[]) => void;
  setResultCounter: (resultCounter?: { showing: number; total: number }) => void;
  clearAll: () => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export const useAppShell = () => {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return context;
};

interface AppShellProviderProps {
  children: ReactNode;
}

export const AppShellProvider: React.FC<AppShellProviderProps> = ({ children }) => {
  const [filterControls, setFilterControls] = useState<React.ReactNode>();
  const [filterChips, setFilterChips] = useState<{ label: string; onRemove(): void }[]>();
  const [resultCounter, setResultCounter] = useState<{ showing: number; total: number }>();

  const clearAll = () => {
    setFilterControls(undefined);
    setFilterChips(undefined);
    setResultCounter(undefined);
  };

  return (
    <AppShellContext.Provider
      value={{
        filterControls,
        filterChips,
        resultCounter,
        setFilterControls,
        setFilterChips,
        setResultCounter,
        clearAll,
      }}
    >
      {children}
    </AppShellContext.Provider>
  );
};