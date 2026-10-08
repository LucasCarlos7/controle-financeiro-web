import { Amount } from '../../shared/components/ui/Amount';
import type { PickerOption } from '../../shared/components/ui/OptionPicker';
import type { IconName } from '../../shared/components/icons';
import type { CartaoCredito, Conta, TipoConta } from './types';

export const TIPO_CONTA_LABELS: Record<TipoConta, string> = {
  Corrente: 'Conta corrente',
  Poupanca: 'Poupança',
  Carteira: 'Carteira',
};

export const TIPO_CONTA_ICONS: Record<TipoConta, IconName> = {
  Corrente: 'bank',
  Poupanca: 'target',
  Carteira: 'wallet',
};

/** Opção de seletor para uma conta: tipo e saldo atual. */
export function contaOption(conta: Conta): PickerOption {
  return {
    value: conta.id,
    label: conta.nome,
    description: TIPO_CONTA_LABELS[conta.tipo],
    icon: TIPO_CONTA_ICONS[conta.tipo],
    meta: { label: 'Saldo atual', value: <Amount value={conta.saldoAtual} kind="balance" /> },
  };
}

/** Opção de seletor para um cartão: fechamento/vencimento e limite disponível. */
export function cartaoOption(cartao: CartaoCredito): PickerOption {
  return {
    value: cartao.id,
    label: cartao.nome,
    description: `Fecha dia ${cartao.diaFechamento} · vence ${cartao.diaVencimento}`,
    icon: 'card',
    meta: {
      label: 'Disponível',
      value: <Amount value={cartao.limiteDisponivel} kind="balance" />,
      hint: (
        <>
          de <Amount value={cartao.limite} />
        </>
      ),
    },
  };
}
