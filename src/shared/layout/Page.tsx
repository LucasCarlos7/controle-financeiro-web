import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

type Width = 'narrow' | 'default' | 'wide';

const WIDTH_CLASSES: Record<Width, string> = {
  narrow: 'max-w-narrow',
  default: 'max-w-default',
  wide: 'max-w-wide',
};

interface PageProps {
  /** `wide` para painel e extrato, `default` para listas, `narrow` para formulários. */
  width?: Width;
  children: ReactNode;
}

export function Page({ width = 'default', children }: PageProps) {
  return (
    <div className={cn('mx-auto w-full px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-10', WIDTH_CLASSES[width])}>
      {children}
    </div>
  );
}
