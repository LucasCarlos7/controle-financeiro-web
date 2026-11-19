import { cn } from '../../utils/cn';
import { MESES } from '../../utils/format';
import { IconButton } from './IconButton';

interface MonthCalendarProps {
  ano: number;
  mes: number;
  /** Dia selecionado (1-31), para destaque de borda. */
  diaSelecionado?: number | null;
  hoje?: { ano: number; mes: number; dia: number };
  onMesChange: (ano: number, mes: number) => void;
  onDiaClick?: (dia: number) => void;
}

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export function MonthCalendar({ ano, mes, diaSelecionado, hoje, onMesChange, onDiaClick }: MonthCalendarProps) {
  const primeiroDiaSemana = new Date(ano, mes - 1, 1).getDay(); // 0=Dom
  const offset = (primeiroDiaSemana + 6) % 7; // converter para Seg=0
  const diasNoMes = new Date(ano, mes, 0).getDate();

  const celulas: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: diasNoMes }, (_, i) => i + 1),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);

  function prevMes() {
    if (mes === 1) onMesChange(ano - 1, 12);
    else onMesChange(ano, mes - 1);
  }

  function nextMes() {
    if (mes === 12) onMesChange(ano + 1, 1);
    else onMesChange(ano, mes + 1);
  }

  return (
    <div className="select-none">
      {/* Cabeçalho com navegação */}
      <div className="mb-3 flex items-center justify-between">
        <IconButton icon="chevron-left" label="Mês anterior" size="sm" onClick={prevMes} />
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">{MESES[mes - 1]}</span>
          <span className="text-sm font-semibold text-text-muted">{ano}</span>
        </div>
        <IconButton icon="chevron-right" label="Próximo mês" size="sm" onClick={nextMes} />
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="mb-1 grid grid-cols-7">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium uppercase tracking-wide text-text-muted">
            {d.slice(0, 3)}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {celulas.map((dia, idx) => {
          if (!dia) return <div key={idx} />;

          const isHoje = hoje && hoje.ano === ano && hoje.mes === mes && hoje.dia === dia;
          const isSelecionado = diaSelecionado === dia;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onDiaClick?.(dia)}
              className={cn(
                'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors duration-(--duration-fast)',
                isHoje && 'bg-primary text-white',
                isSelecionado && !isHoje && 'ring-2 ring-primary font-semibold text-primary',
                !isHoje && !isSelecionado && 'text-text hover:bg-surface-hover',
              )}
            >
              {dia}
            </button>
          );
        })}
      </div>
    </div>
  );
}
