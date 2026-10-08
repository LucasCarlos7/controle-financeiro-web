import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';
import { Icon, type IconName } from '../icons';
import { IconButton } from './IconButton';

export interface ActionMenuItem {
  label: string;
  icon?: IconName;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionMenuProps {
  /** Nome acessível do botão (ex.: "Ações de Aluguel"). */
  label: string;
  items: ActionMenuItem[];
  className?: string;
}

/** Menu "⋯" com as ações secundárias de um item. Setas navegam, Esc fecha. */
export function ActionMenu({ label, items, className }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    setOpenUpward(Boolean(rect && window.innerHeight - rect.bottom < 56 + items.length * 44));
    rootRef.current?.querySelector<HTMLButtonElement>('[role=menuitem]:not([disabled])')?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, items.length]);

  function close(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close(true);
      return;
    }
    if (event.key === 'Tab') {
      close(false);
      return;
    }
    const menuItems = Array.from(
      rootRef.current?.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not([disabled])') ?? [],
    );
    const index = menuItems.indexOf(document.activeElement as HTMLButtonElement);
    const moves: Record<string, number> = {
      ArrowDown: (index + 1) % menuItems.length,
      ArrowUp: (index - 1 + menuItems.length) % menuItems.length,
      Home: 0,
      End: menuItems.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    menuItems[next]?.focus();
  }

  return (
    <div ref={rootRef} className={cn('relative', className)} onKeyDown={open ? handleKeyDown : undefined}>
      <IconButton
        ref={buttonRef}
        icon="more"
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
      />
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(
            'absolute right-0 z-30 w-max min-w-48 animate-scale-in rounded-card border border-border bg-surface-raised p-1 shadow-raised',
            openUpward ? 'bottom-full mb-1 origin-bottom-right' : 'top-full mt-1 origin-top-right',
          )}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              onClick={() => {
                close(true);
                item.onSelect();
              }}
              className={cn(
                'flex h-11 w-full items-center gap-2.5 whitespace-nowrap rounded-control px-3 text-left text-base font-medium transition-colors focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:opacity-55 sm:h-9',
                item.tone === 'danger'
                  ? 'text-danger hover:bg-danger-soft focus-visible:bg-danger-soft'
                  : 'text-text hover:bg-surface-hover focus-visible:bg-surface-hover',
              )}
            >
              {item.icon && <Icon name={item.icon} className="h-4 w-4 shrink-0" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
