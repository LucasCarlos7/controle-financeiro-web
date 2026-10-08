import { Icon } from './icons';

interface MonthYearPickerProps {
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
}

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

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
    <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
      <button
        type="button"
        onClick={goToPrevious}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        aria-label="Mês anterior"
      >
        <Icon name="chevron-left" className="h-4 w-4" />
      </button>
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {MESES[mes - 1]} de {ano}
      </p>
      <button
        type="button"
        onClick={goToNext}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        aria-label="Próximo mês"
      >
        <Icon name="chevron-right" className="h-4 w-4" />
      </button>
    </div>
  );
}
