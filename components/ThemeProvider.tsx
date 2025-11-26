'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, ReactNode } from 'react';
import type { ThemeProviderProps as NextThemeProviderProps } from 'next-themes';

const NextThemesProvider = dynamic(
  () => import('next-themes').then((e) => e.ThemeProvider),
  { ssr: false }
);

interface ThemeProviderProps extends Omit<NextThemeProviderProps, 'children'> {
  children: ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}