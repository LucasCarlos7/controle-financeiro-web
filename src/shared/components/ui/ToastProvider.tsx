import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';
import { ToastContext, type ToastOptions, type ToastTone } from './feedbackContext';
import { IconButton } from './IconButton';

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const TONE_ICON: Record<ToastTone, { icon: IconName; className: string }> = {
  success: { icon: 'check', className: 'bg-success-soft text-success' },
  danger: { icon: 'alert', className: 'bg-danger-soft text-danger' },
  neutral: { icon: 'check', className: 'bg-surface-sunken text-text-muted' },
};

const DURATION_MS = 4000;

/** Mensagens curtas de confirmação de ação. Use com useToast(). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions | string) => {
    const { message, tone = 'success' } = typeof options === 'string' ? { message: options } : options;
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current.slice(-2), { id, message, tone }]);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:px-6"
      >
        {toasts.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, item.id]);

  const { icon, className } = TONE_ICON[item.tone];

  return (
    <div
      role={item.tone === 'danger' ? 'alert' : 'status'}
      className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-center gap-3 rounded-card border border-border bg-surface-raised py-2 pl-3 pr-2 shadow-raised"
    >
      <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full', className)}>
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <p className="flex-1 text-base font-medium text-text">{item.message}</p>
      <IconButton icon="x" label="Fechar aviso" size="sm" onClick={() => onDismiss(item.id)} />
    </div>
  );
}
