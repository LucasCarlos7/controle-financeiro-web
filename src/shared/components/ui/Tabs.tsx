import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../../utils/cn';

interface TabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Abas de navegação (tablist). Setas, Home e End trocam de aba. */
export function Tabs<T extends string>({ tabs, active, onChange, label, className }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((tab) => tab.value === active);
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onChange(tabs[next].value);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('mb-6 flex gap-1 border-b border-border', className)}
    >
      {tabs.map((tab) => {
        const selected = active === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              '-mb-px h-11 border-b-2 px-3 text-base font-medium transition-colors duration-(--duration-fast)',
              selected
                ? 'border-primary text-text'
                : 'border-transparent text-text-muted hover:border-border-strong hover:text-text',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
