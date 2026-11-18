import type { ReactNode } from 'react';
import { Card } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Moldura das telas de entrada e cadastro. */
export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-[25rem]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-text">{title}</h1>
          <p className="mt-1.5 text-base text-text-muted">{description}</p>
        </div>
        <Card padding="lg">{children}</Card>
        <p className="mt-6 text-center text-base text-text-muted">{footer}</p>
      </div>
    </main>
  );
}
