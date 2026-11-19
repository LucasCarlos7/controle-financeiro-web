import { useState } from 'react';
import { Modal } from '../../../shared/components/ui/Modal';
import { Button } from '../../../shared/components/ui/Button';
import { cn } from '../../../shared/utils/cn';
import { formatDate } from '../../../shared/utils/format';
import type { EscopoEdicaoRecorrencia } from '../types';

interface ScopeOption {
  value: EscopoEdicaoRecorrencia;
  label: string;
  description: string;
}

function buildOptions(transactionDate?: string): ScopeOption[] {
  return [
    {
      value: 'SomenteEsta',
      label: 'Somente esta transação',
      description: 'Altera somente a transação aberta.',
    },
    {
      value: 'Todas',
      label: 'Todas',
      description: 'Altera a recorrência e todos os lançamentos vinculados.',
    },
    {
      value: 'EstaEPosteriores',
      label: 'Daqui pra frente',
      description: transactionDate
        ? `Altera a recorrência e as ocorrências a partir de ${formatDate(transactionDate)}.`
        : 'Altera a recorrência e as ocorrências seguintes.',
    },
  ];
}

interface EditScopeModalProps {
  open: boolean;
  pending: boolean;
  transactionDate?: string;
  onConfirm: (escopo: EscopoEdicaoRecorrencia) => void;
  onClose: () => void;
}

export function EditScopeModal({ open, pending, transactionDate, onConfirm, onClose }: EditScopeModalProps) {
  const [escopo, setEscopo] = useState<EscopoEdicaoRecorrencia>('SomenteEsta');
  const options = buildOptions(transactionDate);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edição de recorrência"
      description="Escolha uma opção para editar essa recorrência."
      size="sm"
      footer={
        <div className="flex flex-col items-center gap-3">
          <Button
            type="button"
            onClick={() => onConfirm(escopo)}
            loading={pending}
            className="h-12 w-full text-base"
          >
            {pending ? 'Salvando...' : 'Confirmar'}
          </Button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="text-sm font-medium text-danger disabled:opacity-50"
          >
            Não, quero voltar
          </button>
        </div>
      }
    >
      <ul className="flex flex-col gap-2">
        {options.map((opt) => (
          <li key={opt.value}>
            <label
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
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
