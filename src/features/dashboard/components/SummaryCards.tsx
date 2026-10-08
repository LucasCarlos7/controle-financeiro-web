import { formatCurrency } from '../../../shared/utils/format';
import { Icon } from '../../../shared/components/icons';
import type { ResumoMensal } from '../types';

export function SummaryCards({ resumo }: { resumo: ResumoMensal }) {
  const saldoPositivo = resumo.saldo >= 0;

  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Icon name="plus" className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-medium">Receitas</p>
        </div>
        <p className="mt-2 text-xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
          {formatCurrency(resumo.receitas)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <Icon name="tag" className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-medium">Despesas</p>
        </div>
        <p className="mt-2 text-xl font-semibold tracking-tight text-red-600 dark:text-red-400">
          {formatCurrency(resumo.despesas)}
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <Icon name="wallet" className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-medium">Saldo</p>
        </div>
        <p
          className={`mt-2 text-xl font-semibold tracking-tight ${saldoPositivo ? 'text-slate-900 dark:text-slate-100' : 'text-red-600 dark:text-red-400'}`}
        >
          {formatCurrency(resumo.saldo)}
        </p>
      </div>
    </div>
  );
}
