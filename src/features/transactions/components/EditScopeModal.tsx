import { useState } from 'react';
import { Modal, ModalActions } from '../../../shared/components/ui/Modal';
import { cn } from '../../../shared/utils/cn';
import type { EscopoEdicaoRecorrencia } from '../types';

interface ScopeOption {
  value: EscopoEdicaoRecorrencia;
  label: string;
  description: string;
}

const OPTIONS: ScopeOption[] = [
  {
    value: 'SomenteEsta',
    label: 'Somente esta parcela',
    description: 'Apenas este lançamento será alterado.',
  },
  {
    value: 'EstaEPosteriores',
    label: 'Esta e as próximas',
    description: 'Este lançamento e todos os seguintes serão alterados.',
  },
  {
    value: 'Todas',
    label: 'Todas as parcelas',
    description: 'Todos os lançamentos desta recorrência serão alterados.',
  },
];

interface EditScopeModalProps {
  open: boolean;
  pending: boolean;
  onConfirm: (escopo: EscopoEdicaoRecorrencia) => void;
  onClose: () => void;
}

export function EditScopeModal({ open, pending, onConfirm, onClose }: EditScopeModalProps) {
  const [escopo, setEscopo] = useState<EscopoEdicaoRecorrencia>('SomenteEsta');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar lançamento recorrente"
      description="Escolha quais parcelas devem ser alteradas."
      size="sm"
      footer={
        <ModalActions
          onCancel={onClose}
          onConfirm={() => onConfirm(escopo)}
          confirmLabel="Salvar alterações"
          pending={pending}
        />
      }
    >
      <ul className="flex flex-col gap-2">
        {OPTIONS.map((opt) => (
          <li key={opt.value}>
            <label
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                escopo === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-surface-raised hover:bg-surface-hover',
              )}
            >
              <input
                type="radio"
                name="escopo-edicao"
                value={opt.value}
                checked={escopo === opt.value}
                onChange={() => setEscopo(opt.value)}
                className="mt-0.5 accent-primary"
              />
              <div>
                <p className="text-sm font-medium text-text">{opt.label}</p>
                <p className="mt-0.5 text-xs text-text-muted">{opt.description}</p>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
