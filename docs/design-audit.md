# Auditoria de design: controle-financeiro-web

Data: 07/10/2026 · Escopo: `src/` inteiro (≈4,7 mil linhas) e todas as 8 rotas.

## Como foi feita

- Leitura de todos os componentes de `src/features` e `src/shared`.
- Contagem das classes Tailwind com `grep` (números da seção 1).
- Navegação automatizada com Playwright no `npm run dev`: 8 rotas × 2 temas × 3 larguras (375, 768 e 1440 px), 8 modais, estados de carregamento, vazio e erro. Em cada tela foram medidos: scroll horizontal, contraste WCAG de cada texto visível (cor final calculada sobre o fundo real) e tamanho de cada elemento interativo.
- **A API não estava rodando** (Docker parado). As respostas de `/api/v1/*` foram simuladas por interceptação no próprio browser, com dados de exemplo. A interface renderizada é a real; só os dados são fictícios.
- Screenshots de referência ("antes") em [`docs/design-audit/antes/`](design-audit/antes/).

Linha de base: `npm run build` passa; `npm run lint` passa com **3 warnings** já existentes (`react/only-export-components` em `Input.tsx:9`, `useTheme.tsx:34` e `useAuth.tsx:58`). Nenhuma rota tem scroll horizontal em nenhuma largura.

---

## 1. Inventário

### Cores

| Família | Ocorrências* | Uso |
|---|---:|---|
| `slate-*` | 375 | texto, fundo, borda (neutros) |
| `red-*` | 103 | despesa, erro, excluir, estouro |
| `indigo-*` | 70 | primária, item ativo, foco, gráfico |
| `white` | 38 | superfícies no tema claro |
| `emerald-*` | 13 | receita, "Pago", orçamento ok |
| `amber-*` | 4 | "Pendente" |
| `black` | 1 | sombra do modal |

\* contando variantes (`dark:`, `hover:`, `focus:`). Ao todo são **602 classes de cor** e **296 prefixos `dark:`** espalhados por **33 arquivos**. Os campeões são `AppShell.tsx` (17 linhas com cor), `GoalsPage.tsx` (13), `TransactionFormModal.tsx` (12), `SummaryCards.tsx` (12) e `AccountsPage.tsx` (11).

Além disso, **34 cores hex** estão escritas direto em TSX, todas nos gráficos (`#4f46e5`, `#10b981`, `#f43f5e` e 10 tons de slate para eixo, grade e tooltip), e 4 no `index.css` (scrollbar).

Os 10 tons mais usados: `text-slate-400` (47), `text-slate-500` (39), `text-slate-900` (31), `text-slate-100` (31), `bg-slate-900` (29), `text-red-400` (27), `border-slate-800` (22), `bg-slate-800` (22), `border-slate-200` (21), `bg-slate-100` (20).

O mesmo papel semântico aparece com valores diferentes:
- **texto secundário**: `slate-400`, `slate-500` e `slate-600`;
- **borda**: `slate-100`, `slate-200` e `slate-300` no claro, `slate-700` e `slate-800` no escuro;
- **despesa**: `red-600` na lista e no card, mas `#f43f5e` (rose) no gráfico;
- **receita**: `emerald-600` no texto, `#10b981` (emerald-500) no gráfico.

### Tipografia

| Classe | Ocorrências |
|---|---:|
| `text-sm` | 49 |
| `text-xs` | 13 |
| `text-xl` | 5 |
| `text-base` | 2 |
| `text-2xl` | 1 (só o `PageHeader`) |
| `text-[11px]` | 1 (navegação inferior) |

Pesos: `font-medium` 28, `font-semibold` 17, `font-bold` 3. Fonte do sistema (`index.css:6`), sem escala definida. O maior texto da aplicação é o título da página (24px). **O saldo do mês usa 20px, o mesmo tamanho das receitas e das despesas.** `tabular-nums`: **0 ocorrências**.

### Espaçamento

- Padding: `px-3` (23), `p-4` (13), `py-2` (11), `py-2.5` (8), `pt-2` (7), `px-4` (6). Há 25 valores distintos.
- Gap/space: `gap-2` (28), `gap-3` (19), `space-y-4` (10), `space-y-2.5` (6), `gap-4` (5), `gap-1` (5), mais 5 valores com 1 a 3 usos.
- Margens de layout embutidas em componentes compartilhados: `PageHeader` (`mb-6`), `Tabs` (`mb-6`), `MonthYearPicker` (`mb-5`), `SummaryCards` (`mb-6`). Por isso o espaçamento vertical entre blocos varia entre 16, 20 e 24px de uma página para outra.

### Raios e sombras

- Raios: `rounded-lg` (33), `rounded-full` (20), `rounded-xl` (17), `rounded-2xl` (3), `rounded-md` (2). São 5 valores para 3 papéis (controle, card, modal).
- Sombras: `shadow-sm` + `shadow-slate-900/[0.03]` repetidos 15 vezes à mão. Também aparecem `shadow-md` (hover do item do extrato), `shadow-xl` (modal) e `shadow-indigo-600/20` e `/30` (botão primário e logo). No escuro, tudo vira `shadow-none` (16 vezes).

### Ícones

Conjunto próprio em `shared/components/icons.tsx` (19 ícones, traço de 1,8). Tamanhos: `h-4` (24), `h-3.5` (12), `h-4.5` (4), `h-5` (4), `h-3` (2).

### Movimento

Duas animações em `index.css:54-81` (`animate-in`, `animate-slide-up`), mais `transition-all` nas barras de progresso. **Nenhuma regra para `prefers-reduced-motion`.**

---

## 2. Problemas por categoria

Severidade: **alta** atrapalha uso ou acessibilidade de verdade; **média** prejudica clareza ou consistência de forma visível; **baixa** é polimento.

### 2.1 Hierarquia visual

| # | Problema | Onde | Sev. |
|---|---|---|---|
| H1 | O saldo, o número mais importante do app, tem o mesmo peso visual de receitas e despesas: 3 cards iguais com `text-xl`. Não existe um número "herói". | `SummaryCards.tsx:9-44` | alta |
| H2 | Cada item do extrato tem de 4 a 6 controles sempre visíveis (Editar, Marcar como pago/pendente, Excluir, Cancelar recorrência, badges). Em 375px viram 2 ou 3 linhas de botões por lançamento, e as ações competem com o valor. | `TransactionListItem.tsx:48-105` | alta |
| H3 | O bloco de filtros do extrato (7 controles) ocupa ~280px antes do primeiro lançamento no mobile e ~290px no desktop. | `TransactionFiltersBar.tsx:24-90` | alta |
| H4 | O extrato não mostra categoria, conta ou cartão de cada lançamento, só descrição e data. Isso pode ser resolvido no cliente com as queries que já existem, sem mudar a API. | `TransactionListItem.tsx:39-42` | média |
| H5 | Títulos de seção ("Gastos por categoria", "Evolução mensal") usam `text-sm text-slate-700`, quase indistinguíveis do texto comum. | `CategoryBreakdownChart.tsx:19`, `MonthlyEvolutionChart.tsx:26` | média |
| H6 | Em Contas e Categorias, o botão primário ("Nova conta") fica abaixo das abas, alinhado à direita e longe do título. Nas outras páginas ele fica no `PageHeader`. | `AccountsPage.tsx:33-38, 120-125`, `CategoriesPage.tsx:29-34` | média |
| H7 | Em Contas não há total consolidado (patrimônio ou soma dos saldos), que é o primeiro número que o usuário procura nessa tela. Pode ser calculado no cliente. | `AccountsPage.tsx:50-101` | baixa |
| H8 | Objetivo 100% concluído tem o mesmo visual de um objetivo em andamento. | `GoalsPage.tsx:87-100` | baixa |

### 2.2 Consistência

| # | Problema | Onde | Sev. |
|---|---|---|---|
| C1 | Sem tokens: cada componente escolhe seu tom de slate e repete a versão `dark:` (602 classes de cor, 296 `dark:`). | todo `src/` | alta |
| C2 | Despesa tem 3 vermelhos diferentes: `red-600` (lista e card), `#f43f5e` rose (gráfico) e `red-500` (barra de orçamento). Receita tem 2 verdes. | `TransactionListItem.tsx:14-15`, `MonthlyEvolutionChart.tsx:6-7`, `BudgetsPage.tsx:84` | média |
| C3 | Ações de editar e excluir aparecem em 3 formatos: botão com texto (`Editar` / `Excluir` em extrato, contas e categorias), ícone de 28px (orçamentos e objetivos) e link de texto (`Remover` do aporte). | `CategoriesPage.tsx:66-87`, `BudgetsPage.tsx:62-79`, `GoalsPage.tsx:112-121` | média |
| C4 | O sinal do valor usa hífen (`-R$ 2.350,00`) em vez do sinal de menos (U+2212), e a transferência fica sem sinal e em cinza. Não existe um componente único de valor. | `TransactionListItem.tsx:19-23, 43-46` | média |
| C5 | O "logo" é um quadrado `CF` reimplementado 3 vezes, com tamanhos e sombras diferentes. | `AppShell.tsx:15-21`, `LoginPage.tsx:37-39`, `RegisterPage.tsx:38-40` | média |
| C6 | Os ícones repetem significados: `wallet` é usado para conta, cartão e "Saldo"; `tag` para despesa e categoria; `plus` para receita e "novo". | `SummaryCards.tsx:13,24,35`, `AccountsPage.tsx:60,147` | baixa |
| C7 | Copy: `<html lang="en">` e `<title>controle-financeiro-web</title>`. O app se chama "Controle Financeiro" no shell, mas o Painel se chama "Início". | `index.html:2,7` | média (lang afeta leitor de tela) |

### 2.3 Layout e responsividade

| # | Problema | Onde | Sev. |
|---|---|---|---|
| L1 | Todo o conteúdo fica preso em `max-w-3xl` (768px). Em 1440px sobram ~430px vazios de cada lado, os gráficos ficam espremidos e o extrato não aproveita a largura para colunas. | `AppShell.tsx:109` | alta |
| L2 | **A sidebar não é fixa**: em páginas longas (extrato, categorias), a navegação e o bloco do usuário rolam junto com a página. O `<main>` tem `overflow-y-auto`, mas quem rola é o documento. | `AppShell.tsx:41-42, 108` | alta |
| L3 | A navegação inferior tem 6 itens com label de 11px, e os labels chegam a encostar uns nos outros em 375px ("Categorias Orçamentos"). | `AppShell.tsx:116-130` | alta |
| L4 | Os modais têm largura fixa `max-w-sm` (384px) em qualquer tela. O formulário de lançamento (até 14 campos) fica estreito e longo no desktop, e o texto "Mensal (sem data fim, até 24 lançamentos)" é cortado. | `Modal.tsx:20`, `TransactionFormModal.tsx:410` | média |
| L5 | No dashboard, com o resumo em erro, o primeiro `ErrorState` encosta no segundo (falta espaçamento entre o bloco do resumo e o `space-y-4`). | `DashboardPage.tsx:37-41` | baixa |
| L6 | No gráfico por categoria em 375px, o eixo Y fixo em 110px e os ticks em BRL completo ("R$ 2.400,00") deixam ~40% da largura para as barras. | `CategoryBreakdownChart.tsx:25, 33` | média |

### 2.4 Legibilidade de valores monetários

| # | Problema | Onde | Sev. |
|---|---|---|---|
| M1 | Nenhum valor usa `tabular-nums`, então colunas de valores não alinham e os dígitos "dançam" ao trocar de mês. | todo `src/` (0 ocorrências) | alta |
| M2 | Receita em `emerald-600` sobre branco tem **3,65:1**, abaixo do AA (4,5:1) para texto de 16 a 20px. | `SummaryCards.tsx:17`, `TransactionListItem.tsx:14` | alta |
| M3 | Todo lançamento de despesa fica vermelho. Como a maioria das linhas de um extrato pessoal é despesa, a tela fica vermelha o tempo todo e o vermelho deixa de sinalizar problema (estouro, saldo negativo). | `TransactionListItem.tsx:15` | média |
| M4 | O saldo negativo de conta (`-R$ 35,50`) aparece na mesma cor do positivo. Só o saldo do mês no dashboard fica vermelho quando é negativo. | `AccountsPage.tsx:67-69` | média |
| M5 | Os eixos dos gráficos mostram valores completos com centavos ("R$ 22.000,00"). Para eixo, a forma compacta ("R$ 22 mil") é mais legível. | `MonthlyEvolutionChart.tsx:37`, `CategoryBreakdownChart.tsx:25` | baixa |
| M6 | O orçamento estourado mostra "R$ 689,00 de R$ 500,00 · 138%", mas não diz quanto passou (R$ 189,00) nem quanto falta nos que não estouraram. | `BudgetsPage.tsx:88-95` | baixa |

### 2.5 Estados (loading, vazio, erro, sucesso)

| # | Problema | Onde | Sev. |
|---|---|---|---|
| E1 | O loading é sempre um spinner centralizado com `py-14`. No dashboard são 3 spinners empilhados; ao carregar, o layout "pula". Não há skeleton. | `Spinner.tsx`, `DashboardPage.tsx:37,42,54` | média |
| E2 | Com erro 5xx, a mensagem só aparece depois de **~3,6s** (2 retentativas do `queryClient`), e até lá o usuário vê o spinner. Não é um problema visual em si, mas fica registrado aqui como contexto. | `queryClient.ts:7-12` | baixa |
| E3 | Erro no dashboard vira 3 caixas vermelhas grandes empilhadas, uma por query, todas com a mesma mensagem. | `DashboardPage.tsx:38,43,55` | média |
| E4 | A evolução mensal sem dados não renderiza nada, nem estado vazio. | `DashboardPage.tsx:58` | baixa |
| E5 | Não há feedback de sucesso: salvar, excluir ou marcar como pago fecha o modal ou atualiza a lista sem nenhuma confirmação visual (toast). As ações de linha (pagar, excluir) não mostram loading no item. | todas as mutations | média |
| E6 | Confirmação de exclusão usa `window.confirm` (8 ocorrências): visual do sistema, fora do tema e sem pt-BR garantido nos botões. | `TransactionListItem.tsx:82,97`, `BudgetsPage.tsx:73`, `GoalsPage.tsx:75,115`, `CategoriesPage.tsx:80,154`, `SubcategoryManager.tsx:44` | média |
| E7 | Os estados vazios não têm ação primária, por exemplo "Nenhuma conta cadastrada" sem o botão "Nova conta" (o `EmptyState` aceita `action`, mas ninguém passa). | `AccountsPage.tsx:43`, `BudgetsPage.tsx:45`, etc. | baixa |
| E8 | No dashboard vazio, receitas e despesas de R$ 0,00 aparecem coloridas como se fossem valores reais. | `SummaryCards.tsx:17,28` | baixa |

### 2.6 Formulários

| # | Problema | Onde | Sev. |
|---|---|---|---|
| F1 | **Bug funcional: editar orçamento não funciona.** `useForm` usa `defaultValues` do primeiro render (sem `budget`) e não há `reset` ao abrir. O modal mostra limite `0`, e "Salvar" não envia nada porque o `categoriaId` vazio (campo oculto na edição) falha no zod sem mostrar o erro. Confirmado no browser. | `BudgetFormModal.tsx:38-48` | **alta** (fora do escopo visual, ver seção 5) |
| F2 | Campos de valor são `type="number"` com valor inicial `0`: aparecem setas de incremento, não há máscara BRL, o usuário precisa apagar o 0 e a vírgula decimal depende do locale do navegador. | `TransactionFormModal.tsx:207-214`, os 5 modais com valor | média |
| F3 | Labels de "Pagar com" e "Tags" são `<p>` estilizados como label, sem associação com o controle. | `TransactionFormModal.tsx:227, 342` | média |
| F4 | O erro de campo não está ligado ao input: faltam `aria-invalid` e `aria-describedby`. | `Field.tsx:19`, `Input.tsx:20` | média |
| F5 | O checkbox "Repetir ou parcelar" é um `input` cru de 16px, sem estilo do sistema. | `TransactionFormModal.tsx:394-398` | baixa |
| F6 | Os inputs crus (busca, datas do filtro, nova tag, nova subcategoria, cor) duplicam a string de `inputClasses` em vez de usar `Input`. | `TransactionFiltersBar.tsx:35,43,49`, `CategoriesPage.tsx:125`, `SubcategoryManager.tsx:62,94`, `CategoryFormModal.tsx:90` | média |
| F7 | Ao submeter com erro, o modal rola até o primeiro campo inválido e o título some. O botão de ação não fica fixo no rodapé. | `Modal.tsx:20-34` | baixa |
| F8 | "Mensal (sem data fim, até 24 lançamentos)" contradiz o campo ao lado, "Repetir até (opcional)". | `TransactionFormModal.tsx:410, 445` | baixa |

### 2.7 Acessibilidade

| # | Problema | Onde | Sev. |
|---|---|---|---|
| A1 | **O modal não é um diálogo acessível**: não tem `role="dialog"` nem `aria-modal`, `Esc` não fecha (testado), o foco não entra no modal ao abrir (fica no botão de trás), não há focus trap e o body continua rolando por trás. | `Modal.tsx:11-38` | alta |
| A2 | Os labels inativos da navegação inferior (`slate-400` em 11px) têm **2,62:1** no claro e **3,77:1** no escuro. Falham AA. | `AppShell.tsx:123` | alta |
| A3 | Contas e cartões inativos usam `opacity-60` no card inteiro, e o texto secundário cai para **2,31:1**. | `AccountsPage.tsx:55, 142` | alta |
| A4 | Alvos de toque menores que 44px: botões `sm` (30px de altura, 102 ocorrências de "Editar"), ícones de editar e excluir de 28px, tema e sair de 34px, mês anterior e próximo de 32px, "Remover" aporte de 16px de altura, "x" da subcategoria de 12×12px, "x" da tag de 14px e links "Criar conta" e "Entrar" de 19px. | `Button.tsx:22`, `BudgetsPage.tsx:65,75`, `GoalsPage.tsx:67,79,119`, `AppShell.tsx:30,79`, `MonthYearPicker.tsx:40,51`, `SubcategoryManager.tsx:80`, `CategoriesPage.tsx:158` | alta |
| A5 | Os filtros do extrato não têm nome acessível: os selects e os dois `date` não têm label nem `aria-label` (o leitor de tela lê só "Todos os tipos" ou "data"). | `TransactionFiltersBar.tsx:39-89` | média |
| A6 | O foco visível só é desenhado de propósito no `Button`. Links da nav, `Tabs`, chips de tag e ícones dependem do outline padrão do navegador (1px, pouco visível no escuro). Nos inputs, o anel `ring-indigo-500/10` quase não aparece, e o indicador real é só a troca de cor da borda. | `Button.tsx:31`, `Input.tsx:13`, `Tabs.tsx:15`, `TransactionFormModal.tsx:360` | média |
| A7 | `Tabs` não tem `role="tablist"`, `role="tab"`, `aria-selected` nem navegação por setas. Os chips de tag selecionáveis não têm `aria-pressed`. | `Tabs.tsx:9-23`, `TransactionFormModal.tsx:351-367` | média |
| A8 | Barras de progresso sem `role="progressbar"` nem `aria-valuenow`. O spinner não tem `role="status"`. A troca de mês não é anunciada (`aria-live`). | `BudgetsPage.tsx:82`, `GoalsPage.tsx:87`, `Spinner.tsx:3`, `MonthYearPicker.tsx:45` | média |
| A9 | Renomear subcategoria só pode ser descoberto pelo `title="Clique para renomear"`, que não aparece no toque nem para o leitor de tela. | `SubcategoryManager.tsx:69-76` | baixa |
| A10 | `prefers-reduced-motion` não é respeitado (fade e slide do modal, `transition-all` das barras, animação dos gráficos Recharts). | `index.css:54-81` | média |
| A11 | Uma única cor separa receita e despesa nos gráficos. Ver também G3. | gráficos | baixa |

### 2.8 Dark mode

| # | Problema | Onde | Sev. |
|---|---|---|---|
| D1 | O escuro é mantido à mão em 296 lugares, e é fácil esquecer um. Exemplos: o `ghost` e o botão fechar do modal não definem `dark:text`, e os ícones de editar e excluir de orçamento e objetivo ficam `slate-400` nos dois temas. | `Modal.tsx:29`, `BudgetsPage.tsx:65` | média |
| D2 | O fundo `slate-950` (#020617) fica praticamente preto, e os cards em `slate-900` têm pouca separação do fundo. Bordas `slate-800` fazem quase todo o trabalho. | `index.css:22`, `Card.tsx:6` | baixa |
| D3 | Os gráficos trocam cores com `theme === 'dark' ? '#hex' : '#hex'` no JS: 8 cores duplicadas em 2 arquivos, que não acompanham tokens. | `CategoryBreakdownChart.tsx:11-15, 45-46`, `MonthlyEvolutionChart.tsx:18-22, 50-51` | média |
| D4 | O escuro não tem sombra nem elevação: o modal no escuro se separa do fundo só pelo overlay. | `Modal.tsx:20` | baixa |

### 2.9 Gráficos

| # | Problema | Onde | Sev. |
|---|---|---|---|
| G1 | O gráfico por categoria usa uma única cor (`#4f46e5`) em todas as barras e ignora a `cor` que o usuário escolheu para cada categoria. | `CategoryBreakdownChart.tsx:6, 49` | média |
| G2 | No tooltip aparece só o nome da série e o valor; falta o mês ou a categoria por extenso. O estilo (`contentStyle`) é inline e foge do sistema. | `MonthlyEvolutionChart.tsx:43-53` | baixa |
| G3 | Legendas em 12px: "Receitas" verde tem **2,54:1** e "Saldo acumulado" no escuro tem **2,84:1**. O texto da legenda herda a cor da série. | `MonthlyEvolutionChart.tsx:54` | média |
| G4 | O "Saldo acumulado" (dezenas de milhares) divide o eixo Y com receitas e despesas (milhares), o que achata as barras na metade inferior. Seria melhor um eixo secundário ou um gráfico separado. | `MonthlyEvolutionChart.tsx:57-64` | média |
| G5 | No mobile, o eixo X pula meses (Mai, Jul e Set somem) e o eixo Y usa 80px para os rótulos. | `MonthlyEvolutionChart.tsx:30-42` | baixa |
| G6 | O gráfico de barras horizontais não tem rótulo de valor na barra, então o usuário precisa do hover ou de estimar pelo eixo. | `CategoryBreakdownChart.tsx:49` | baixa |

---

## 3. Duplicação (markup que deveria virar componente)

| Padrão | Ocorrências | Componente proposto |
|---|---|---|
| Card (`rounded-xl border … bg-white p-4 shadow-sm shadow-slate-900/[0.03] dark:…`) | **14**: SummaryCards ×3, gráficos ×2, TransactionListItem, Accounts ×2, Budgets, Goals, Categories, Login, Register, MonthYearPicker. Só `TransactionFiltersBar` usa o `Card` que já existe. | `Card` (já existe; passar a usar) + `ListItemCard` |
| Alerta de erro do formulário (`rounded-lg bg-red-50 … <Icon alert/> {ApiError ? … }`) | **8**: 6 modais, Login, Register | `FormError` / `Alert tone="danger"` |
| Rodapé do modal (Cancelar + Salvar com "Salvando...") | **7** modais | `ModalFooter` + `Button loading` |
| Barra de progresso | **2** (Budgets, Goals) | `ProgressBar` (com tons e ARIA) |
| Ícone circular colorido (`h-9 w-9 rounded-full bg-indigo-50 …`) | **6** (Summary ×3, Accounts ×2, Goals) | `IconBadge` ou slot do `StatCard` |
| Botão só com ícone (`rounded-lg p-1.5 text-slate-400 hover:…`) | **9** (AppShell ×4, Modal, MonthYearPicker ×2, Budgets ×2, Goals ×2) | `IconButton` (44px de alvo) |
| Controle segmentado (`grid … bg-slate-100 p-1` + botão branco ativo) | **2** (`Tabs`, "Pagar com") | `SegmentedControl` (radiogroup) + `Tabs` (tablist) |
| Chip ou pílula (`rounded-full bg-slate-100 px-3 py-1 …`) | **4** (tag, subcategoria, tag selecionável, Badge) | `Chip` (removível ou selecionável) |
| Valor monetário com sinal e cor | **12+** chamadas de `formatCurrency` com cor ad hoc | `Amount` / `MoneyValue` |
| Logo `CF` | **3** | `Logo` |
| Item de conta × item de cartão | 2 blocos quase idênticos (`AccountsPage.tsx:53-98` vs. `140-190`) | um `ListItemCard` com slots |
| `window.confirm` | **8** | `ConfirmDialog` sobre o `Modal` |
| Cabeçalho das telas de auth (logo + título + subtítulo + card) | **2** | `AuthLayout` |
| Cores de gráfico por tema em JS | **2** arquivos | hook `useChartTheme()` lendo CSS variables |

---

## 4. Direção visual proposta

Referência de tom: **sóbrio e confiável, com densidade de ferramenta** (Mercury e Linear), mas com o calor de um app pessoal (Copilot Money, Nubank). O número é o protagonista; a interface recua.

1. **Neutros frios com leve tom azulado, definidos em OKLCH, como base de 95% da tela.** Os dados financeiros precisam de um fundo calmo. Um único neutro coerente (12 passos) troca os 3 tons de "texto secundário" e as 5 bordas de hoje por papéis: `text`, `text-muted`, `text-subtle`, `border`, `border-strong`.
2. **Uma só cor de marca: um índigo um pouco mais profundo e menos saturado que o atual `indigo-600`.** Mantém a identidade que o usuário já conhece e deixa de "gritar" em botões e gráficos. A marca fica para ação primária, item ativo e foco; deixa de ser cor de dado.
3. **Cores de dado separadas das cores de estado.** `income` (verde, escurecido até passar AA: ~emerald-700 no claro, ~emerald-400 no escuro), `expense` e `danger`. **Proposta (preciso da sua decisão):** nas listas, a despesa fica no texto padrão com sinal "−", e a receita fica verde com "+", como no Nubank e no Copilot. O vermelho fica reservado para saldo negativo, orçamento estourado e erro, para voltar a significar "atenção". Nos cards de resumo e nos gráficos, a despesa mantém um tom próprio (vermelho-coral), coerente entre card e gráfico.
4. **Tipografia: Inter (ou Geist) carregada por CSS do Google Fonts, com `tabular-nums` por padrão em valores.** As duas fontes têm números tabulares e desenho legível em tamanhos pequenos; a fonte do sistema varia por SO e quebra o alinhamento de colunas. Escala de 8 passos: 12 / 13 / 14 / 16 / 18 / 24 / 32 / 40. O saldo do dashboard usa 40 (desktop) e 32 (mobile); os títulos de página usam 24. **Não vou adicionar a fonte sem sua aprovação.**
5. **Densidade média-alta nas listas e generosa nos números de resumo.** No extrato, cada lançamento vira uma linha de ~56px (ícone da categoria, descrição, categoria e conta, valor), agrupada por dia com o subtotal do dia. As ações saem da linha: clique na linha abre a edição, e um menu "⋯" (ou swipe no futuro) dá acesso a pagar, excluir e cancelar recorrência. No desktop a linha ganha colunas.
6. **Superfícies planas: borda hairline, sombra quase nula e 3 raios** (8px controles, 12px cards, 16px modais e sheets). Isso dá a aparência "Linear/Mercury" e simplifica o dark mode. A elevação no escuro vem do tom da superfície (`surface` < `surface-raised`), não de sombra.
7. **Dark mode como tema próprio, não como inversão.** Fundo azul-ardósia escuro (não preto), superfícies um degrau mais claras e texto com contraste AA medido. Tudo via CSS variables trocadas em `.dark`, com zero `dark:` nos componentes.
8. **Layout com 3 larguras de conteúdo**: `wide` (~1200px: dashboard e extrato), `default` (~960px: contas, orçamentos, objetivos, categorias) e `narrow` (~560px: formulários e auth). Sidebar fixa (`sticky`), e no mobile 4 itens + "Mais" (sheet com Categorias, Objetivos, tema e sair).
9. **Movimento curto e funcional** (120 a 200ms, `ease-out`), só para abrir e fechar camadas e para feedback. Com `prefers-reduced-motion`, as animações viram transições de opacidade ou nenhuma, inclusive a animação dos gráficos (`isAnimationActive`).
10. **Logo**: um monograma simples em SVG (sem quadrado com texto) e o nome "Controle Financeiro" em peso semibold. Cabe na sidebar, no header mobile e no favicon.

---

## 5. Pontos que precisam de decisão antes da Fase 2

1. **Fonte**: Inter (Google Fonts, CSS), Geist ou manter a do sistema?
2. **Cor da despesa nas listas**: neutra com "−" (recomendado) ou vermelha como hoje?
3. **Bug F1 (editar orçamento)**: corrigir num commit `fix(budgets)` separado? É mudança de comportamento, fora do escopo "só apresentação".
4. **Git**: `controle-financeiro-web` não é um repositório git hoje. Para os commits pedidos é preciso `git init` (e decidir o que entra no primeiro commit de baseline).
5. **`ConfirmDialog` no lugar de `window.confirm`** e **toast de sucesso**: os dois são só apresentação e não exigem dependência. Incluo na Fase 3?
6. **Extrato com categoria e conta na linha** (lookup no cliente com as queries que já existem, sem tocar na API): ok?

---

## 6. Resultado (Fases 2 a 4)

Decisões aplicadas: Inter via Google Fonts (CSS, sem pacote); despesa neutra com "−" nas listas e vermelho reservado para saldo negativo, estouro e erro; correção do bug F1 em commit `fix` separado; `ConfirmDialog` e toast próprios; categoria e conta no extrato via lookup no cliente.

Verificação final (mesmo método da seção "Como foi feita", API simulada):

| Critério | Antes | Depois |
|---|---|---|
| Classes de paleta (`slate-`, `indigo-`...) em componentes | 602 | **0** (a paleta padrão foi removida do tema: uma classe crua nem compila) |
| Prefixos `dark:` | 296 | **0** |
| Cores hex em TSX | 34 | 1 (cor padrão de categoria nova, que é dado enviado à API) |
| Telas com falha de contraste AA (de 51 medidas) | 33 | **0** |
| Telas com scroll horizontal | 0 | 0 |
| `tabular-nums` em valores | 0 | todos os valores passam por `Amount` |
| Modal: Esc, foco preso, foco restaurado, scroll travado | não | sim |
| `npm run lint` | 3 warnings | 2 warnings (ambos já existiam) |

Fluxos de escrita conferidos no browser, comparando o payload enviado: criar despesa com subcategoria e tag, transferência, compra parcelada no cartão, editar lançamento, marcar como pago, cancelar recorrência, excluir com confirmação e editar orçamento.

Screenshots com os mesmos nomes em [`antes/`](design-audit/antes/) e [`depois/`](design-audit/depois/).

### Pendências e sugestões fora do escopo

- **Teste manual com a API real** ainda não foi feito (API e Docker estavam parados). Os fluxos foram validados com respostas simuladas.
- **Campo de valor** continua `type="number"` (agora com prefixo "R$", sem setas e com o 0 selecionado ao focar). Uma máscara BRL de verdade exigiria mudar a conversão nos schemas zod, que ficaram fora do escopo.
- **Fonte** carregada do Google Fonts: para funcionar offline e não fazer requisição a terceiros, vale servir os arquivos `woff2` da Inter em `public/`.
- **Sem testes automatizados no front**: não há runner configurado. Sugestão: Vitest + Testing Library para `Modal`, `ActionMenu`, `Amount` e `groupByDay` (exige novas dependências).
- **Erro com 5xx** ainda leva ~3,6 s para aparecer por causa das retentativas do `queryClient` (comportamento, não apresentação).
- Os links da sidebar e os campos têm 40px de altura no desktop (ponteiro fino); no mobile, todos os alvos têm 44px.
- Cores de categoria escolhidas pelo usuário não são validadas quanto a contraste; hoje aparecem só em pontos e barras, nunca como cor de texto.
