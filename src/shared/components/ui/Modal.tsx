import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { IconButton } from './IconButton';

type Size = 'sm' | 'md' | 'lg';

interface ModalProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** Rodapé fixo (ações). Fica visível mesmo com o conteúdo rolando. */
  footer?: ReactNode;
  size?: Size;
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openModals = 0;

function lockScroll() {
  openModals += 1;
  if (openModals > 1) return;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
}

function unlockScroll() {
  openModals = Math.max(0, openModals - 1);
  if (openModals > 0) return;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * Diálogo modal: foco preso dentro dele, Esc fecha, a página de fundo não rola e o foco volta para
 * quem abriu. No mobile vira uma folha que sobe da parte de baixo.
 */
export function Modal({ open, title, description, onClose, children, footer, size = 'sm' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll();

    // Com mouse/teclado, foca o primeiro campo; no toque, foca o painel para não abrir o teclado virtual.
    const panel = panelRef.current;
    const prefersFieldFocus = window.matchMedia('(pointer: fine)').matches;
    const firstField = panel?.querySelector<HTMLElement>('input:not([type=hidden]), select, textarea');
    (prefersFieldFocus && firstField ? firstField : panel)?.focus();

    return () => {
      unlockScroll();
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab' || !panelRef.current) return;

    const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.offsetParent !== null,
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div aria-hidden="true" className="absolute inset-0 animate-fade-in bg-overlay" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative flex max-h-[92svh] w-full animate-slide-up flex-col overflow-hidden rounded-t-modal border border-border bg-surface-raised shadow-raised focus-visible:outline-none sm:max-h-[85svh] sm:animate-scale-in sm:rounded-modal',
          SIZE_CLASSES[size],
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-5 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-xl font-semibold tracking-tight text-text">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-0.5 text-base text-text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton icon="x" label="Fechar" size="sm" onClick={onClose} className="-mr-1.5 -mt-0.5" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2 sm:px-6">{children}</div>
        {footer && (
          <div className="border-t border-border bg-surface-raised px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

interface ModalActionsProps {
  onCancel: () => void;
  /** Id do <form> que o botão principal envia (o rodapé fica fora do form). */
  formId?: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  pending?: boolean;
  destructive?: boolean;
}

export function ModalActions({
  onCancel,
  formId,
  onConfirm,
  confirmLabel = 'Salvar',
  pending = false,
  destructive = false,
}: ModalActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={onCancel} className="sm:min-w-28">
        Cancelar
      </Button>
      <Button
        type={formId ? 'submit' : 'button'}
        form={formId}
        onClick={onConfirm}
        loading={pending}
        variant={destructive ? 'danger' : 'primary'}
        className={cn('sm:min-w-28', destructive && 'border-danger bg-danger-soft')}
      >
        {pending ? 'Salvando...' : confirmLabel}
      </Button>
    </div>
  );
}
