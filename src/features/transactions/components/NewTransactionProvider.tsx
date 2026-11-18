import { useCallback, useState, type ReactNode } from 'react';
import { NewTransactionContext } from '../hooks/useNewTransaction';
import { TransactionFormModal } from './TransactionFormModal';

export function NewTransactionProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openForm = useCallback(() => setOpen(true), []);

  return (
    <NewTransactionContext.Provider value={openForm}>
      {children}
      <TransactionFormModal open={open} onClose={() => setOpen(false)} />
    </NewTransactionContext.Provider>
  );
}
