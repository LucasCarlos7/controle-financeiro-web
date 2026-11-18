import { formatMonthYear } from '../../utils/format';
import { IconButton } from './IconButton';

interface MonthYearPickerProps {
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
}

export function MonthYearPicker({ ano, mes, onChange }: MonthYearPickerProps) {
  function goToPrevious() {
    if (mes === 1) onChange(ano - 1, 12);
    else onChange(ano, mes - 1);
  }

  function goToNext() {
    if (mes === 12) onChange(ano + 1, 1);
    else onChange(ano, mes + 1);
  }

  return (
    <div
      role="group"
      aria-label="Período"
      className="inline-flex h-11 items-center gap-1 rounded-control border border-border-strong bg-surface px-0.5 shadow-card sm:h-10"
    >
      <IconButton icon="chevron-left" label="Mês anterior" size="sm" onClick={goToPrevious} />
      <p aria-live="polite" className="min-w-36 text-center text-base font-semibold tabular-nums text-text">
        {formatMonthYear(ano, mes)}
      </p>
      <IconButton icon="chevron-right" label="Próximo mês" size="sm" onClick={goToNext} />
    </div>
  );
}
