import { useId, useMemo, useState } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { cn } from '../../utils/cn';
import { ICON_GROUPS, iconLabel } from '../iconCatalog';
import { EntityIcon, Icon, type IconName } from '../icons';
import { Modal } from './Modal';

function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

/** Quadrado com o ícone; tingido pela cor (ex.: da categoria) quando houver. */
export function IconBadge({
  name,
  fallback,
  color,
  className,
}: {
  name?: string | null;
  fallback?: IconName;
  color?: string | null;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-sunken text-text-muted ring-1 ring-border',
        className,
      )}
      style={color ? { backgroundColor: `color-mix(in oklch, ${color} 22%, transparent)`, color: `color-mix(in oklch, ${color} 75%, var(--color-text))` } : undefined}
    >
      <EntityIcon name={name} fallback={fallback} className="h-[55%] w-[55%]" />
    </span>
  );
}

interface IconPickerDialogProps {
  open: boolean;
  value: string;
  fallback: IconName;
  color?: string | null;
  onClose: () => void;
  onSelect: (value: string) => void;
}

function IconPickerDialog({ open, value, fallback, color, onClose, onSelect }: IconPickerDialogProps) {
  const [query, setQuery] = useState('');
  const searchId = useId();

  const groups = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return ICON_GROUPS;
    return ICON_GROUPS.map((group) => ({
      ...group,
      icons: group.icons.filter((icon) => normalize(icon.label).includes(term) || normalize(group.label).includes(term)),
    })).filter((group) => group.icons.length > 0);
  }, [query]);

  function choose(next: string) {
    setQuery('');
    onSelect(next);
  }

  const optionClass = (selected: boolean) =>
    cn(
      'flex aspect-square w-full items-center justify-center rounded-control border transition-colors',
      selected
        ? 'border-primary-text bg-primary-soft text-primary-text ring-1 ring-primary-text'
        : 'border-border bg-surface text-text hover:bg-surface-hover',
    );

  return (
    <Modal
      open={open}
      title="Escolha um ícone"
      onClose={() => {
        setQuery('');
        onClose();
      }}
    >
      <label htmlFor={searchId} className="sr-only">
        Buscar ícone
      </label>
      <div className="relative mb-4">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar: mercado, carro, saúde…"
          autoComplete="off"
          className="h-11 w-full rounded-control border border-border-strong bg-surface pl-9 pr-3 text-base text-text placeholder:text-text-subtle focus-visible:border-primary-text focus-visible:outline-none"
        />
      </div>

      <button
        type="button"
        aria-pressed={value === ''}
        onClick={() => choose('')}
        className={cn(
          'mb-4 flex w-full items-center gap-3 rounded-control border px-3 py-2 text-left transition-colors',
          value === ''
            ? 'border-primary-text bg-primary-soft ring-1 ring-primary-text'
            : 'border-border bg-surface hover:bg-surface-hover',
        )}
      >
        <IconBadge fallback={fallback} color={color} className="h-9 w-9" />
        <span className="flex-1 text-base font-medium text-text">Ícone padrão</span>
        {value === '' && <Icon name="check" className="h-4 w-4 text-primary-text" />}
      </button>

      {groups.length === 0 && <p className="py-6 text-center text-base text-text-muted">Nenhum ícone encontrado.</p>}

      <div className="space-y-5">
        {groups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{group.label}</h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
              {group.icons.map((icon) => {
                const selected = icon.name === value;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    title={icon.label}
                    aria-label={icon.label}
                    aria-pressed={selected}
                    onClick={() => choose(icon.name)}
                    className={optionClass(selected)}
                  >
                    <EntityIcon name={icon.name} className="h-6 w-6" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </Modal>
  );
}

interface IconPickerRowProps {
  value: string;
  onChange: (value: string) => void;
  /** Ícone mostrado quando nada foi escolhido (ex.: o do tipo de conta). */
  fallback: IconName;
  color?: string | null;
  label?: string;
}

/** Linha "Ícone" do formulário: mostra o escolhido e abre a grade de ícones. */
export function IconPickerRow({ value, onChange, fallback, color, label = 'Ícone' }: IconPickerRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="first:rounded-t-card last:rounded-b-card">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-surface-hover focus-visible:outline-offset-[-2px]"
      >
        <IconBadge name={value} fallback={fallback} color={color} />
        <span className="shrink-0 text-base font-medium text-text">{label}</span>
        <span className={cn('ml-auto truncate text-base', value ? 'text-text' : 'text-text-subtle')}>
          {iconLabel(value) ?? 'Padrão'}
        </span>
        <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-text-muted" />
      </button>
      <IconPickerDialog
        open={open}
        value={value}
        fallback={fallback}
        color={color}
        onClose={() => setOpen(false)}
        onSelect={(next) => {
          onChange(next);
          setOpen(false);
        }}
      />
    </div>
  );
}

interface IconPickerFieldProps<T extends FieldValues> extends Omit<IconPickerRowProps, 'value' | 'onChange'> {
  // O tipo de saída do formulário (zod) não importa para este campo.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  name: Path<T>;
}

/** IconPickerRow ligado ao react-hook-form; o valor é o nome do ícone ou "" (padrão). */
export function IconPickerField<T extends FieldValues>({ control, name, ...props }: IconPickerFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <IconPickerRow {...props} value={(field.value as string | null | undefined) ?? ''} onChange={field.onChange} />
      )}
    />
  );
}
