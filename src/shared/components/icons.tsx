import type { ReactNode, SVGProps } from 'react';
import { iconShape } from './iconCatalog';
import { UI_ICON_SHAPES, type IconName } from './iconShapes';

export type { IconName };

function Svg({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  return <Svg {...props}>{UI_ICON_SHAPES[name]}</Svg>;
}

interface EntityIconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  /** Ícone escolhido pelo usuário (catálogo) ou nome de ícone da interface. */
  name?: string | null;
  /** Usado quando não há ícone escolhido ou o nome não é conhecido. */
  fallback?: IconName;
}

/** Ícone de conta, cartão, categoria ou tag: o escolhido pelo usuário, ou o padrão. */
export function EntityIcon({ name, fallback = 'tag', ...props }: EntityIconProps) {
  return <Svg {...props}>{iconShape(name) ?? UI_ICON_SHAPES[fallback]}</Svg>;
}
