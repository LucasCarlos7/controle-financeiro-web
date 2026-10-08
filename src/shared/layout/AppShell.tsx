import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils/cn';
import { Icon, type IconName } from '../components/icons';
import { IconButton } from '../components/ui/IconButton';
import { Logo } from '../components/ui/Logo';
import { Modal } from '../components/ui/Modal';

interface NavItem {
  to: string;
  label: string;
  icon: IconName;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Início', icon: 'home' },
  { to: '/extrato', label: 'Extrato', icon: 'document' },
  { to: '/contas', label: 'Contas', icon: 'wallet' },
  { to: '/orcamentos', label: 'Orçamentos', icon: 'pie' },
  { to: '/objetivos', label: 'Objetivos', icon: 'target' },
  { to: '/categorias', label: 'Categorias', icon: 'tag' },
];

/** No mobile cabem 4 destinos fixos; o resto fica em "Mais". */
const PRIMARY_MOBILE = NAV_ITEMS.slice(0, 4);
const SECONDARY_MOBILE = NAV_ITEMS.slice(4);

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton
      icon={theme === 'dark' ? 'sun' : 'moon'}
      label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      onClick={toggleTheme}
    />
  );
}

function Avatar({ nome }: { nome?: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary-text"
    >
      {nome?.charAt(0).toUpperCase()}
    </span>
  );
}

function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
      <div className="px-5 pb-6 pt-6">
        <Logo withName />
      </div>
      <nav aria-label="Principal" className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex h-10 items-center gap-3 rounded-control px-3 text-base font-medium transition-colors duration-(--duration-fast)',
                isActive
                  ? 'bg-primary-soft text-primary-text'
                  : 'text-text-muted hover:bg-surface-hover hover:text-text',
              )
            }
          >
            <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar nome={user?.nome} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-text">{user?.nome}</p>
            <p className="truncate text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <ThemeToggle />
          <IconButton icon="logout" label="Sair" variant="danger" onClick={signOut} />
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            className={tabClasses(moreActive)}
          >
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
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-12 w-full items-center gap-3 rounded-control px-3 text-lg font-medium text-text hover:bg-surface-hover"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="h-5 w-5" />
            {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          </button>
        </nav>
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <Avatar nome={user?.nome} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-text">{user?.nome}</p>
            <p className="truncate text-sm text-text-muted">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex h-11 items-center gap-2 rounded-control px-3 text-base font-medium text-danger hover:bg-danger-soft"
          >
            <Icon name="logout" className="h-4 w-4" />
            Sair
          </button>
        </div>
      </Modal>
    </>
  );
}

export function AppShell() {
  return (
    <div className="flex min-h-svh bg-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:hidden">
          <Logo withName size="sm" />
          <ThemeToggle />
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
