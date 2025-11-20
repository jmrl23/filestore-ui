'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const storedTheme = localStorage.getItem(storageKey) as Theme;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');

      const applySystem = () => {
        root.classList.remove('light', 'dark');
        root.classList.add(media.matches ? 'dark' : 'light');
      };

      applySystem();
      media.addEventListener('change', applySystem);
      localStorage.setItem(storageKey, theme);
      return () => media.removeEventListener('change', applySystem);
    }

    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, mounted, storageKey]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
