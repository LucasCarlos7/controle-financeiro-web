import { useQuery } from '@tanstack/react-query';
import { listAccounts } from '../api/accounts.api';

export const accountsQueryKey = (apenasAtivas?: boolean) => ['contas', { apenasAtivas }] as const;

export function useAccountsQuery(apenasAtivas?: boolean) {
  return useQuery({
    queryKey: accountsQueryKey(apenasAtivas),
    queryFn: () => listAccounts(apenasAtivas),
  });
}
