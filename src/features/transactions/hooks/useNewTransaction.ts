import { createContext, useContext } from 'react';

/** Abre o formulário de novo lançamento de qualquer tela (topo, menu lateral, botão flutuante). */
export const NewTransactionContext = createContext<(() => void) | undefined>(undefined);

export function useNewTransaction() {
  const context = useContext(NewTransactionContext);
  if (!context) throw new Error('useNewTransaction deve ser usado dentro de NewTransactionProvider');
  return context;
}
