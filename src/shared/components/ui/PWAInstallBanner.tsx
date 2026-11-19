import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Button } from './Button';
import { cn } from '../../utils/cn';

/** Ícone do app em miniatura (32×32 viewBox, cores fixas para contexto fora do tema). */
function AppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <rect width="32" height="32" rx="9" fill="#863bff" />
      <path
        d="M8 21.5 13.5 16l4 3.5L24 12"
        fill="none"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="12" r="2.2" fill="white" />
    </svg>
  );
}

/** Ícone de compartilhamento do iOS (caixa com seta para cima). */
function IOSShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('inline-block', className)}
    >
      <path d="M8.5 7.5 12 4l3.5 3.5" />
      <line x1="12" y1="4" x2="12" y2="15" />
      <path d="M6 10H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}

/** Ícone genérico de download/instalar. */
function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M12 3v12M8 11l4 4 4-4" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function PWAInstallBanner() {
  const { canInstall, platform, install, dismiss } = usePWAInstall();

  if (!canInstall) return null;

  const isIOS = platform === 'ios';

  return (
    <div
      role="banner"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 mx-auto max-w-md rounded-card border border-border bg-surface p-4 shadow-raised lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-xs"
    >
      {/* Cabeçalho */}
      <div className="flex items-start gap-3">
        <AppIcon className="h-10 w-10 rounded-xl" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-text">Controle Financeiro</p>
          <p className="text-sm text-text-muted">
            {isIOS ? 'Adicione à tela inicial' : 'Instale o app no seu dispositivo'}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar"
          className="hit-area -mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-text-muted hover:bg-surface-hover hover:text-text"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-4 w-4">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
      </div>

      {/* Instruções iOS */}
      {isIOS && (
        <p className="mt-3 rounded-lg bg-surface-sunken px-3 py-2.5 text-sm text-text-muted leading-relaxed">
          Toque em{' '}
          <IOSShareIcon className="mx-0.5 h-4 w-4 align-text-bottom text-primary" />
          {' '}no Safari e depois em{' '}
          <strong className="font-medium text-text">"Adicionar à tela de início"</strong>
          .
        </p>
      )}

      {/* Botão Android / Desktop */}
      {!isIOS && (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={dismiss}>
            Agora não
          </Button>
          <Button size="sm" onClick={install}>
            <DownloadIcon className="h-4 w-4" />
            Instalar
          </Button>
        </div>
      )}
    </div>
  );
}
