import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { MESES } from '../../utils/format';
import { MonthCalendar } from './MonthCalendar';
import { MonthStrip } from './MonthStrip';

interface MonthYearPickerProps {
  ano: number;
  mes: number;
  onChange: (ano: number, mes: number) => void;
}

export function MonthYearPicker({ ano, mes, onChange }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [calAno, setCalAno] = useState(ano);
  const [calMes, setCalMes] = useState(mes);
  const containerRef = useRef<HTMLDivElement>(null);

  const hoje = new Date();
  const todayData = { ano: hoje.getFullYear(), mes: hoje.getMonth() + 1, dia: hoje.getDate() };

  // Sincroniza calendário interno quando o picker é aberto
  useEffect(() => {
    if (open) {
      setCalAno(ano);
      setCalMes(mes);
    }
  }, [open, ano, mes]);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  function handleDayClick(_dia: number) {
    // Clicar qualquer dia confirma a seleção do mês exibido
    onChange(calAno, calMes);
    setOpen(false);
  }

  function handleStripChange(a: number, m: number) {
    setCalAno(a);
    setCalMes(m);
    onChange(a, m);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Botão principal */}
      <div
        role="group"
        aria-label="Período"
        className="inline-flex h-11 items-center rounded-control border border-border-strong bg-surface px-0.5 shadow-card sm:h-10"
      >
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'rounded px-3 py-1 text-base font-semibold tabular-nums text-text transition-colors duration-(--duration-fast) hover:bg-surface-hover',
            open && 'bg-surface-hover',
          )}
        >
          {MESES[mes - 1]} de {ano}
        </button>
      </div>

      {/* Dropdown com calendário */}
      {open && (
        <div
          role="dialog"
          aria-label="Selecionar período"
          className="absolute left-0 top-full z-50 mt-1 w-72 rounded-control border border-border-strong bg-surface p-3 shadow-card"
        >
          <MonthCalendar
            ano={calAno}
            mes={calMes}
            hoje={todayData}
            diaSelecionado={calAno === ano && calMes === mes ? todayData.dia : null}
            onMesChange={(a, m) => { setCalAno(a); setCalMes(m); }}
            onDiaClick={handleDayClick}
          />

          {/* Faixa de meses na base do calendário */}
          <div className="mt-3 border-t border-border pt-3">
            <MonthStrip
              ano={calAno}
              mes={calMes}
              onChange={handleStripChange}
              janelaAntes={5}
              janelaDepois={6}
            />
          </div>
        </div>
      )}
    </div>
  );
}
