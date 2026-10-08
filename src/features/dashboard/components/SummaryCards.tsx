import { Card } from '../../../shared/components/ui/Card';
import { Amount } from '../../../shared/components/ui/Amount';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { StatCard } from '../../../shared/components/ui/StatCard';
import { formatPercent } from '../../../shared/utils/format';
import type { ResumoMensal } from '../types';

/** Saldo do mês em destaque, com receitas e despesas como apoio. */
export function SummaryCards({ resumo }: { resumo: ResumoMensal }) {
  const despesasSobreReceitas = resumo.receitas > 0 ? (resumo.despesas / resumo.receitas) * 100 : null;

  return (
    <Card padding="none" as="section" aria-label="Resumo do mês" className="mb-4 sm:mb-6">
      <div className="grid divide-y divide-border lg:grid-cols-[1.4fr_1fr_1fr] lg:divide-x lg:divide-y-0">
        <div className="p-5 sm:p-6">
          <p className="text-base font-medium text-text-muted">Saldo do mês</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            <Amount value={resumo.saldo} kind="balance" />
          </p>
          <p className="mt-1.5 text-sm text-text-muted">Receitas menos despesas pagas no período</p>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border lg:contents">
          <StatCard
            className="p-5 sm:p-6"
            label="Receitas"
            icon="arrow-down-left"
            tone="income"
            value={<Amount value={resumo.receitas} className={resumo.receitas ? 'text-income' : undefined} />}
          />
          <StatCard
            className="p-5 sm:p-6"
            label="Despesas"
            icon="arrow-up-right"
            tone="expense"
            value={<Amount value={resumo.despesas} className={resumo.despesas ? 'text-expense' : undefined} />}
            hint={despesasSobreReceitas !== null ? `${formatPercent(despesasSobreReceitas)} das receitas` : undefined}
          />
        </div>
      </div>
    </Card>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <Card padding="none" className="mb-4 sm:mb-6">
      <div className="grid divide-y divide-border lg:grid-cols-[1.4fr_1fr_1fr] lg:divide-x lg:divide-y-0">
        <div className="p-5 sm:p-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-10 w-48" />
          <Skeleton className="mt-2.5 h-3.5 w-56" />
        </div>
        <div className="grid grid-cols-2 divide-x divide-border lg:contents">
          {[0, 1].map((key) => (
            <div key={key} className="p-5 sm:p-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-7 w-32" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
