import type { ReactNode } from 'react';
import { UI_ICON_SHAPES, type IconName } from './iconShapes';

/**
 * Ícones que o usuário escolhe para contas, cartões, categorias e tags. O nome é o que vai para a API
 * (campo `icone`, até 50 caracteres), então não renomeie uma chave depois de publicada.
 */
const CATALOG_SHAPES: Record<string, ReactNode> = {
  piggy: (
    <>
      <path d="M5 11.5a7 6 0 0 1 12.2-3.5H19l1 2.5v3.5h-1.8L16.5 16v3h-3v-1.5h-3V19h-3v-2.8A5.8 5.8 0 0 1 5 11.5Z" />
      <line x1="10" y1="8" x2="13.5" y2="8" />
      <circle cx="16.2" cy="11" r=".8" fill="currentColor" stroke="none" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5" ry="2.5" />
      <path d="M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" />
      <path d="M14 10.6c.3 0 .7-.1 1-.1 2.8 0 5 1.1 5 2.5v4c0 1.4-2.2 2.5-5 2.5s-5-1.1-5-2.5v-1.5" />
      <path d="M10 13c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5" />
    </>
  ),
  cash: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="1.5" />
      <circle cx="12" cy="12" r="2.5" />
      <line x1="6" y1="12" x2="6.01" y2="12" />
      <line x1="18" y1="12" x2="18.01" y2="12" />
    </>
  ),
  'chart-up': (
    <>
      <polyline points="3,17 9,11 13,15 21,7" />
      <polyline points="15,7 21,7 21,13" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <line x1="3" y1="13" x2="21" y2="13" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21Z" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </>
  ),
  percent: (
    <>
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
    </>
  ),
  umbrella: (
    <>
      <path d="M3 12a9 9 0 0 1 18 0Z" />
      <path d="M12 12v6.5a2 2 0 0 1-4 0" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="14" height="17" rx="1" />
      <line x1="9" y1="7.5" x2="10" y2="7.5" />
      <line x1="14" y1="7.5" x2="15" y2="7.5" />
      <line x1="9" y1="11.5" x2="10" y2="11.5" />
      <line x1="14" y1="11.5" x2="15" y2="11.5" />
      <path d="M10 20.5v-4h4v4" />
    </>
  ),
  bolt: <polygon points="13,2.5 5,13.5 11,13.5 10,21.5 19,10 13,10" />,
  droplet: <path d="M12 3.5c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0c0-2.9 2.5-6.3 6-10.5Z" />,
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0" />
      <path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </>
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.4-3.4a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9Z" />
  ),
  car: (
    <>
      <path d="M5 12l1.6-4.2A2 2 0 0 1 8.5 6.5h7a2 2 0 0 1 1.9 1.3L19 12" />
      <rect x="3" y="12" width="18" height="5" rx="1.5" />
      <line x1="5.5" y1="17" x2="5.5" y2="19" />
      <line x1="18.5" y1="17" x2="18.5" y2="19" />
      <circle cx="7" cy="14.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  bus: (
    <>
      <rect x="5" y="3.5" width="14" height="14" rx="2" />
      <line x1="5" y1="11" x2="19" y2="11" />
      <line x1="7.5" y1="17.5" x2="7.5" y2="20" />
      <line x1="16.5" y1="17.5" x2="16.5" y2="20" />
      <circle cx="8.5" cy="14.3" r=".9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.3" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  fuel: (
    <>
      <rect x="4" y="4" width="9" height="16" rx="1" />
      <line x1="4" y1="10" x2="13" y2="10" />
      <path d="M13 8h2.5A1.5 1.5 0 0 1 17 9.5V16a1.5 1.5 0 0 0 3 0V9l-2.5-2.5" />
      <line x1="2.5" y1="20" x2="14.5" y2="20" />
    </>
  ),
  plane: (
    <path d="M21 15.5v-2l-8-5V4a1.5 1.5 0 0 0-3 0v4.5l-8 5v2l8-2.5V18l-2.5 1.5V21l4-1 4 1v-1.5L13 18v-5Z" />
  ),
  bike: (
    <>
      <circle cx="6" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="3.5" />
      <polyline points="6,16 10,9 15,9 18,16" />
      <polyline points="10,9 12.5,16 15,9" />
      <line x1="8.5" y1="6.5" x2="11" y2="6.5" />
    </>
  ),
  cart: (
    <>
      <polyline points="3,4 5.5,4 8,15.5 18,15.5 20,8 6.5,8" />
      <circle cx="9.5" cy="19" r="1.3" />
      <circle cx="16.5" cy="19" r="1.3" />
    </>
  ),
  food: (
    <>
      <line x1="7" y1="3" x2="7" y2="21" />
      <path d="M4.5 3v5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M17 21V3c-2 1-3 3.5-3 7v3h3" />
    </>
  ),
  coffee: (
    <>
      <path d="M4.5 9h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5Z" />
      <path d="M16.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-2" />
      <line x1="8.5" y1="3.5" x2="8.5" y2="6" />
      <line x1="12.5" y1="3.5" x2="12.5" y2="6" />
    </>
  ),
  wine: (
    <>
      <path d="M8 3h8l-.5 5a3.5 3.5 0 0 1-7 0Z" />
      <line x1="12" y1="11.5" x2="12" y2="20" />
      <line x1="8.5" y1="20" x2="15.5" y2="20" />
    </>
  ),
  store: (
    <>
      <path d="M4.5 12v8.5h15V12" />
      <path d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0L19 4H5Z" />
      <path d="M10 20.5v-5h4v5" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10Z" />,
  pill: (
    <>
      <rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)" />
      <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" />
    </>
  ),
  dumbbell: (
    <>
      <line x1="7" y1="12" x2="17" y2="12" />
      <rect x="4" y="8" width="3" height="8" rx="1" />
      <rect x="17" y="8" width="3" height="8" rx="1" />
      <line x1="2.5" y1="10.5" x2="2.5" y2="13.5" />
      <line x1="21.5" y1="10.5" x2="21.5" y2="13.5" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6.5" r="2.5" />
      <circle cx="6" cy="17.5" r="2.5" />
      <line x1="8" y1="8" x2="20" y2="17" />
      <line x1="8" y1="16" x2="20" y2="7" />
    </>
  ),
  paw: (
    <>
      <circle cx="6.5" cy="10" r="1.6" />
      <circle cx="10" cy="6.5" r="1.6" />
      <circle cx="14" cy="6.5" r="1.6" />
      <circle cx="17.5" cy="10" r="1.6" />
      <path d="M12 12c-2.5 0-5 3-5 5.2 0 1.8 1.5 2.6 3 2.3 1.2-.2 2.8-.2 4 0 1.5.3 3-.5 3-2.3 0-2.2-2.5-5.2-5-5.2Z" />
    </>
  ),
  book: (
    <>
      <path d="M3.5 5.5A1.5 1.5 0 0 1 5 4h6v16H5a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M20.5 5.5A1.5 1.5 0 0 0 19 4h-6v16h6a1.5 1.5 0 0 0 1.5-1.5Z" />
    </>
  ),
  graduation: (
    <>
      <polygon points="12,4.5 22,9 12,13.5 2,9" />
      <path d="M6 11v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3V11" />
      <line x1="22" y1="9" x2="22" y2="14" />
    </>
  ),
  laptop: (
    <>
      <rect x="5" y="5" width="14" height="10" rx="1.5" />
      <path d="M2.5 19h19l-1.5-4h-16Z" />
    </>
  ),
  film: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <line x1="7.5" y1="4" x2="7.5" y2="20" />
      <line x1="16.5" y1="4" x2="16.5" y2="20" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
      <line x1="3.5" y1="8" x2="7.5" y2="8" />
      <line x1="3.5" y1="16" x2="7.5" y2="16" />
      <line x1="16.5" y1="8" x2="20.5" y2="8" />
      <line x1="16.5" y1="16" x2="20.5" y2="16" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  gamepad: (
    <>
      <path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.4l-.8 4a2.5 2.5 0 0 1-4.2 1.1l-2.2-2.5H9.8L7.6 18a2.5 2.5 0 0 1-4.2-1.1l-.8-4A4.5 4.5 0 0 1 7 7.5Z" />
      <line x1="8" y1="10.5" x2="8" y2="13.5" />
      <line x1="6.5" y1="12" x2="9.5" y2="12" />
      <circle cx="15.5" cy="11" r=".9" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="13" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v8h14v-8" />
      <line x1="12" y1="8" x2="12" y2="20" />
      <path d="M12 8c-1.5-4-5-3.5-4.5-1.5S12 8 12 8Zm0 0c1.5-4 5-3.5 4.5-1.5S12 8 12 8Z" />
    </>
  ),
  ticket: (
    <>
      <path d="M3.5 8.5v-2a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v2a2.5 2.5 0 0 0 0 5v2a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-2a2.5 2.5 0 0 0 0-5Z" />
      <line x1="14" y1="7.5" x2="14" y2="16.5" strokeDasharray="2 2" />
    </>
  ),
  shirt: <path d="M8.5 3.5 4 6l-1.5 4.5L6 12v8.5h12V12l3.5-1.5L20 6l-4.5-2.5a3.5 3.5 0 0 1-7 0Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  star: <polygon points="12,3.5 14.6,9 20.5,9.6 16,13.6 17.3,19.5 12,16.5 6.7,19.5 8,13.6 3.5,9.6 9.4,9" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="3.5" ry="8.5" />
      <line x1="3.5" y1="12" x2="20.5" y2="12" />
    </>
  ),
};

export interface CatalogIcon {
  name: string;
  label: string;
}

export interface CatalogGroup {
  label: string;
  icons: CatalogIcon[];
}

export const ICON_GROUPS: CatalogGroup[] = [
  {
    label: 'Finanças',
    icons: [
      { name: 'bank', label: 'Banco' },
      { name: 'wallet', label: 'Carteira' },
      { name: 'card', label: 'Cartão' },
      { name: 'piggy', label: 'Cofrinho' },
      { name: 'coins', label: 'Moedas' },
      { name: 'cash', label: 'Dinheiro' },
      { name: 'chart-up', label: 'Investimentos' },
      { name: 'briefcase', label: 'Trabalho' },
      { name: 'receipt', label: 'Conta a pagar' },
      { name: 'percent', label: 'Impostos e taxas' },
      { name: 'umbrella', label: 'Seguro' },
      { name: 'target', label: 'Meta' },
    ],
  },
  {
    label: 'Casa',
    icons: [
      { name: 'home', label: 'Casa' },
      { name: 'building', label: 'Prédio' },
      { name: 'bolt', label: 'Energia' },
      { name: 'droplet', label: 'Água' },
      { name: 'wifi', label: 'Internet' },
      { name: 'phone', label: 'Celular' },
      { name: 'wrench', label: 'Manutenção' },
    ],
  },
  {
    label: 'Transporte',
    icons: [
      { name: 'car', label: 'Carro' },
      { name: 'fuel', label: 'Combustível' },
      { name: 'bus', label: 'Ônibus' },
      { name: 'bike', label: 'Bicicleta' },
      { name: 'plane', label: 'Viagem' },
    ],
  },
  {
    label: 'Compras e alimentação',
    icons: [
      { name: 'cart', label: 'Mercado' },
      { name: 'food', label: 'Restaurante' },
      { name: 'coffee', label: 'Café' },
      { name: 'wine', label: 'Bebidas' },
      { name: 'store', label: 'Loja' },
      { name: 'shirt', label: 'Roupas' },
      { name: 'gift', label: 'Presente' },
    ],
  },
  {
    label: 'Saúde e cuidados',
    icons: [
      { name: 'heart', label: 'Saúde' },
      { name: 'pill', label: 'Farmácia' },
      { name: 'dumbbell', label: 'Academia' },
      { name: 'scissors', label: 'Beleza' },
      { name: 'paw', label: 'Pet' },
    ],
  },
  {
    label: 'Educação e lazer',
    icons: [
      { name: 'book', label: 'Livros' },
      { name: 'graduation', label: 'Educação' },
      { name: 'laptop', label: 'Tecnologia' },
      { name: 'film', label: 'Cinema e streaming' },
      { name: 'music', label: 'Música' },
      { name: 'gamepad', label: 'Jogos' },
      { name: 'ticket', label: 'Eventos' },
      { name: 'sun', label: 'Férias' },
    ],
  },
  {
    label: 'Outros',
    icons: [
      { name: 'user', label: 'Pessoal' },
      { name: 'star', label: 'Favorito' },
      { name: 'globe', label: 'Internacional' },
      { name: 'tag', label: 'Etiqueta' },
      { name: 'calendar', label: 'Assinatura' },
      { name: 'repeat', label: 'Recorrente' },
      { name: 'flag', label: 'Bandeira' },
      { name: 'document', label: 'Documento' },
    ],
  },
];

const LABELS = new Map(ICON_GROUPS.flatMap((group) => group.icons.map((icon) => [icon.name, icon.label])));

/** Desenho do ícone pelo nome: catálogo de escolha ou ícones da interface. */
export function iconShape(name: string | null | undefined): ReactNode | undefined {
  if (!name) return undefined;
  return CATALOG_SHAPES[name] ?? UI_ICON_SHAPES[name as IconName];
}

export function iconLabel(name: string | null | undefined): string | undefined {
  return name ? LABELS.get(name) : undefined;
}
