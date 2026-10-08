import { useQuery } from '@tanstack/react-query';
import { listCards } from '../api/cards.api';

export const cardsQueryKey = (apenasAtivos?: boolean) => ['cartoes', { apenasAtivos }] as const;

export function useCardsQuery(apenasAtivos?: boolean) {
  return useQuery({
    queryKey: cardsQueryKey(apenasAtivos),
    queryFn: () => listCards(apenasAtivos),
  });
}
