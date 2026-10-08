import { useMemo } from 'react';
import { useAccountsQuery } from '../../accounts/hooks/useAccountsQuery';
import { useCardsQuery } from '../../accounts/hooks/useCardsQuery';
import { useCategoriesQuery } from '../../categories/hooks/useCategoriesQuery';
import { useTagsQuery } from '../../categories/hooks/useTagsQuery';
import type { Categoria } from '../../categories/types';
import type { Transacao } from '../types';

export interface TransactionDisplay {
  categoria?: Categoria;
  subcategoriaNome?: string;
  /** "Nubank", "Cartão Nubank" ou "Nubank → Poupança". */
  origem?: string;
  tags: string[];
}

/**
 * Resolve nomes de conta, cartão, categoria e tags de um lançamento a partir das listas já carregadas
 * (a API devolve só os ids). As queries são as mesmas que o filtro e o formulário usam, então ficam em cache.
 */
export function useTransactionLookups() {
  const { data: accounts } = useAccountsQuery();
  const { data: cards } = useCardsQuery();
  const { data: categories } = useCategoriesQuery();
  const { data: tags } = useTagsQuery();

  return useMemo(() => {
    const contas = new Map((accounts ?? []).map((conta) => [conta.id, conta.nome]));
    const cartoes = new Map((cards ?? []).map((cartao) => [cartao.id, cartao.nome]));
    const categorias = new Map((categories ?? []).map((categoria) => [categoria.id, categoria]));
    const tagNomes = new Map((tags ?? []).map((tag) => [tag.id, tag.nome]));

    return function describe(transacao: Transacao): TransactionDisplay {
      const categoria = transacao.categoriaId ? categorias.get(transacao.categoriaId) : undefined;
      const subcategoriaNome = categoria?.subcategorias?.find((sub) => sub.id === transacao.subcategoriaId)?.nome;

      let origem: string | undefined;
      if (transacao.cartaoCreditoId) {
        origem = cartoes.get(transacao.cartaoCreditoId);
      } else if (transacao.contaId) {
        const conta = contas.get(transacao.contaId);
        const destino = transacao.contaDestinoId ? contas.get(transacao.contaDestinoId) : undefined;
        origem = destino ? `${conta ?? 'Conta'} → ${destino}` : conta;
      }

      return {
        categoria,
        subcategoriaNome,
        origem,
        tags: transacao.tagIds.map((id) => tagNomes.get(id)).filter((nome): nome is string => Boolean(nome)),
      };
    };
  }, [accounts, cards, categories, tags]);
}
