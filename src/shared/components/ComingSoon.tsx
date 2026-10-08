import { EmptyState } from './EmptyState';

export function ComingSoon({ feature }: { feature: string }) {
  return (
    <EmptyState
      title={`${feature} em construção`}
      description="Esta tela ainda não foi implementada nesta fatia do MVP."
    />
  );
}
