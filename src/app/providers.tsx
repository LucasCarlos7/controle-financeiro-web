import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '../shared/lib/queryClient';
import { AuthProvider } from '../features/auth/hooks/useAuth';
import { ThemeProvider } from '../shared/hooks/useTheme';
import { ConfirmProvider } from '../shared/components/ui/ConfirmProvider';
import { ToastProvider } from '../shared/components/ui/ToastProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <ConfirmProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ConfirmProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
