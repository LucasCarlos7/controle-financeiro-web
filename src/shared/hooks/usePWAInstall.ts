import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type InstallPlatform = 'ios' | 'android' | 'desktop';

function detectPlatform(): InstallPlatform {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

const DISMISSED_UNTIL_KEY = 'pwa-install-dismissed-until';
const SNOOZE_DAYS = 7;

function isDismissed(): boolean {
  try {
    const until = localStorage.getItem(DISMISSED_UNTIL_KEY);
    return !!until && Date.now() < parseInt(until, 10);
  } catch {
    return false;
  }
}

function snooze() {
  try {
    localStorage.setItem(
      DISMISSED_UNTIL_KEY,
      String(Date.now() + SNOOZE_DAYS * 86_400_000),
    );
  } catch {
    // localStorage indisponível (modo privado)
  }
}

export function usePWAInstall() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [platform] = useState<InstallPlatform>(detectPlatform);

  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    if (platform === 'ios') {
      setCanInstall(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const onInstalled = () => {
      setCanInstall(false);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [platform]);

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
      setPromptEvent(null);
    }
  }

  function dismiss() {
    snooze();
    setCanInstall(false);
  }

  return { canInstall, platform, install, dismiss };
}
