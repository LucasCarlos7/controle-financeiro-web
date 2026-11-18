import { createContext } from 'react';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Pinta a ação de vermelho (excluir, cancelar recorrência). */
  destructive?: boolean;
}

export type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

export type ToastTone = 'success' | 'danger' | 'neutral';

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
}

export type ToastFn = (options: ToastOptions | string) => void;

export const ToastContext = createContext<ToastFn | undefined>(undefined);

export interface PrivacyState {
  hidden: boolean;
  toggle: () => void;
}

export const PrivacyContext = createContext<PrivacyState>({ hidden: false, toggle: () => {} });
