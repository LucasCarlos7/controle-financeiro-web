import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface MonthStripItem {
  ano: number;
  mes: number;
}

interface MonthStripProps {
  /** Mês/ano selecionado atualmente. */
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
  /** Quantos meses antes e depois do selecionado exibir. Padrão: 11 antes + 6 depois. */
  janelaAntes?: number;
  janelaDepois?: number;
}

export function MonthStrip({ ano, mes, onChange, janelaAntes = 11, janelaDepois = 6 }: MonthStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const items: MonthStripItem[] = [];
  const baseMs = new Date(ano, mes - 1, 1).getTime();

  for (let i = -janelaAntes; i <= janelaDepois; i++) {
    const d = new Date(baseMs);
    d.setMonth(d.getMonth() + i);
    items.push({ ano: d.getFullYear(), mes: d.getMonth() + 1 });
  }

  // Scroll para o mês selecionado quando muda
  useEffect(() => {
    const btn = selectedRef.current;
    const container = scrollRef.current;
    if (!btn || !container) return;

    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.offsetWidth;
    container.scrollLeft = btnLeft - containerWidth / 2 + btnWidth / 2;
  }, [ano, mes]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1 overflow-x-auto pb-1 scrollbar-none"
      aria-label="Navegar por mês"
      role="toolbar"
    >
      {items.map((item, idx) => {
        const isSelected = item.ano === ano && item.mes === mes;
        const label = `${MESES_CURTOS[item.mes - 1]} ${item.ano}`;

        return (
          <button
            key={idx}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            aria-label={label}
            aria-pressed={isSelected}
            onClick={() => onChange(item.ano, item.mes)}
            className={cn(
              'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-(--duration-fast)',
              isSelected
                ? 'bg-primary text-white'
                : 'text-text-muted hover:bg-surface-hover hover:text-text',
            )}
          >
            {MESES_CURTOS[item.mes - 1]}
          </button>
        );
      })}
    </div>
  );
}
