import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ConfirmContext, type ConfirmOptions } from './feedbackContext';
import { Modal, ModalActions } from './Modal';

/** Substitui window.confirm por um diálogo no tema do app. Use com useConfirm(). */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((next: ConfirmOptions) => {
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  function settle(value: boolean) {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={options !== null}
        title={options?.title ?? ''}
        onClose={() => settle(false)}
        footer={
          <ModalActions
            onCancel={() => settle(false)}
            onConfirm={() => settle(true)}
            confirmLabel={options?.confirmLabel ?? 'Confirmar'}
            destructive={options?.destructive}
          />
        }
      >
        {options?.description && <p className="text-base text-text-muted">{options.description}</p>}
      </Modal>
    </ConfirmContext.Provider>
  );
}
