import { useContext } from 'react';
import { ConfirmContext, ToastContext } from '../components/ui/feedbackContext';

/** Diálogo de confirmação: `if (await confirm({ title: 'Excluir?' })) ...` */
export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error('useConfirm deve ser usado dentro de ConfirmProvider');
  return context;
}

/** Aviso curto após uma ação: `toast('Lançamento salvo')`. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return context;
}
