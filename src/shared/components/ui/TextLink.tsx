import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Icon, type IconName } from '../icons';

interface TextLinkProps {
  to: string;
  children: ReactNode;
  icon?: IconName;
}

/** Link de ação no cabeçalho dos cards ("Ver extrato", "+ Adicionar"). */
export function TextLink({ to, children, icon }: TextLinkProps) {
  return (
    <Link
      to={to}
      className="hit-area inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-medium text-primary-text hover:underline"
    >
      {icon && <Icon name={icon} className="h-3.5 w-3.5" />}
      {children}
    </Link>
  );
}
