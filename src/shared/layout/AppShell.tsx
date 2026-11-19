import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { NewTransactionProvider } from '../../features/transactions/components/NewTransactionProvider';
import { useNewTransaction } from '../../features/transactions/hooks/useNewTransaction';
import { useTheme } from '../hooks/useTheme';
import { usePrivacy } from '../hooks/useFeedback';
import { cn } from '../utils/cn';
import { Icon, type IconName } from '../components/icons';
import { ActionMenu } from '../components/ui/ActionMenu';
import { IconButton } from '../components/ui/IconButton';
import { Logo } from '../components/ui/Logo';
import { Modal } from '../components/ui/Modal';
import { PWAInstallBanner } from '../components/ui/PWAInstallBanner';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Início', icon: 'home' },
  { to: '/extrato', label: 'Extrato', icon: 'document' },
  { to: '/contas', label: 'Contas e cartões', icon: 'wallet' },
  { to: '/orcamentos', label: 'Orçamentos', icon: 'pie' },
  { to: '/objetivos', label: 'Objetivos', icon: 'target' },
  { to: '/categorias', label: 'Categorias', icon: 'tag' },
];

/** No mobile cabem 4 destinos fixos; o resto fica em "Mais". */
const PRIMARY_MOBILE: NavItem[] = [
  { to: '/dashboard', label: 'Início', icon: 'home' },
  { to: '/extrato', label: 'Extrato', icon: 'document' },
  { to: '/contas', label: 'Contas', icon: 'wallet' },
  { to: '/orcamentos', label: 'Orçamentos', icon: 'pie' },
];
const SECONDARY_MOBILE = NAV_ITEMS.slice(4);

function initials(nome?: string) {
  const partes = (nome ?? '').trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? (partes.at(-1)?.[0] ?? '') : '')).toUpperCase();
}

function TopBar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { hidden, toggle } = usePrivacy();
  const openNewTransaction = useNewTransaction();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b-2 border-primary bg-surface px-3 sm:px-4">
      <Logo withName size="sm" />
      <button
        type="button"
        onClick={openNewTransaction}
        className="ml-2 hidden h-8 items-center gap-1.5 rounded-control border border-border-strong px-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover sm:inline-flex"
      >
        <Icon name="plus" className="h-4 w-4" />
        Adicionar
      </button>
      <div className="ml-auto flex items-center gap-0.5">
        <IconButton icon={hidden ? 'eye-off' : 'eye'} label={hidden ? 'Mostrar valores' : 'Ocultar valores'} onClick={toggle} />
        <IconButton
          icon={theme === 'dark' ? 'sun' : 'moon'}
          label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          onClick={toggleTheme}
        />
        <ActionMenu
          label="Menu da conta"
          className="ml-1.5"
          trigger={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-hover text-sm font-semibold text-text ring-1 ring-border-strong">
              {initials(user?.nome)}
            </span>
          }
          header={
            <>
              <p className="truncate text-base font-semibold text-text">{user?.nome}</p>
              <p className="truncate text-sm text-text-muted">{user?.email}</p>
            </>
          }
          items={[{ label: 'Sair', icon: 'logout', tone: 'danger', onSelect: signOut }]}
        />
      </div>
    </header>
  );
}

const navItemClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex h-9 items-center gap-2.5 rounded-control px-2.5 text-base font-medium transition-colors duration-(--duration-fast)',
    isActive ? 'bg-primary-soft text-primary-text' : 'text-text-muted hover:bg-surface-hover hover:text-text',
  );

function Sidebar() {
  const openNewTransaction = useNewTransaction();

  return (
    <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 flex-col border-r border-border bg-surface px-2.5 py-4 lg:flex">
      <nav aria-label="Principal" className="space-y-0.5">
        <NavLink to={NAV_ITEMS[0].to} className={navItemClasses}>
          <Icon name={NAV_ITEMS[0].icon} className="h-4 w-4 shrink-0" />
          {NAV_ITEMS[0].label}
        </NavLink>
        <button type="button" onClick={openNewTransaction} className={cn(navItemClasses({ isActive: false }), 'w-full')}>
          <Icon name="plus" className="h-4 w-4 shrink-0" />
          Registrar lançamento
        </button>
        {NAV_ITEMS.slice(1).map((item) => (
          <NavLink key={item.to} to={item.to} className={navItemClasses}>
            <Icon name={item.icon} className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function MobileNav() {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = SECONDARY_MOBILE.some((item) => pathname.startsWith(item.to));

  const tabClasses = (active: boolean) =>
    cn(
      'flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
      active ? 'text-primary-text' : 'text-text-muted hover:text-text',
    );

  return (
    <>
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {PRIMARY_MOBILE.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => tabClasses(isActive)}>
              <Icon name={item.icon} className="h-[22px] w-[22px]" />
              {item.label}
            </NavLink>
          ))}
          <button type="button" onClick={() => setMoreOpen(true)} aria-haspopup="dialog" className={tabClasses(moreActive)}>
            <Icon name="grid" className="h-[22px] w-[22px]" />
            Mais
          </button>
        </div>
      </nav>

      <Modal open={moreOpen} title="Mais opções" onClose={() => setMoreOpen(false)}>
        <nav aria-label="Mais opções" className="-mx-2 space-y-0.5">
          {SECONDARY_MOBILE.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMoreOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex h-12 items-center gap-3 rounded-control px-3 text-lg font-medium',
                  isActive ? 'bg-primary-soft text-primary-text' : 'text-text hover:bg-surface-hover',
                )
              }
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </Modal>
    </>
  );
}

function AddButton() {
  const openNewTransaction = useNewTransaction();
  return (
    <button
      type="button"
      onClick={openNewTransaction}
      aria-label="Novo lançamento"
      title="Novo lançamento"
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-card bg-primary text-primary-fg shadow-raised transition-colors hover:bg-primary-hover lg:bottom-6 lg:right-6"
    >
      <Icon name="plus" className="h-6 w-6" />
    </button>
  );
}

export function AppShell() {
  return (
    <NewTransactionProvider>
      <div className="min-h-svh bg-bg">
        <TopBar />
        <div className="flex">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
        <MobileNav />
        <AddButton />
        <PWAInstallBanner />
      </div>
    </NewTransactionProvider>
  );
}
