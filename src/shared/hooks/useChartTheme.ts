import { useMemo, useSyncExternalStore } from 'react';

const TOKENS = {
  income: '--color-income',
  expense: '--color-expense',
  balance: '--color-balance',
  grid: '--color-border',
  axis: '--color-text-muted',
  cursor: '--color-surface-hover',
  surface: '--color-surface',
} as const;

export type ChartTheme = Record<keyof typeof TOKENS, string>;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getThemeClass() {
  return document.documentElement.className;
}

/** Converte qualquer cor CSS (inclusive oklch) para rgb(), que os atributos SVG do Recharts aceitam. */
function toRgb(context: CanvasRenderingContext2D, color: string): string {
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/** Cores dos gráficos lidas dos tokens CSS; recalculadas quando o tema muda. */
export function useChartTheme(): ChartTheme {
  const themeClass = useSyncExternalStore(subscribe, getThemeClass);

  return useMemo(() => {
    void themeClass;
    const styles = getComputedStyle(document.documentElement);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const entries = Object.entries(TOKENS).map(([key, token]) => {
      const value = styles.getPropertyValue(token).trim();
      return [key, context ? toRgb(context, value) : value];
    });
    return Object.fromEntries(entries) as ChartTheme;
  }, [themeClass]);
}
