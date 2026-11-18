import { useCallback, useState, type ReactNode } from 'react';
import { PrivacyContext } from './feedbackContext';

const STORAGE_KEY = 'cf.hide-values';

function readInitial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Modo "ocultar valores": troca os números por pontos em toda a interface. */
export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(readInitial);

  const toggle = useCallback(() => {
    setHidden((current) => {
      try {
        localStorage.setItem(STORAGE_KEY, current ? '0' : '1');
      } catch {
        // Sem storage o modo vale só para a sessão.
      }
      return !current;
    });
  }, []);

  return <PrivacyContext.Provider value={{ hidden, toggle }}>{children}</PrivacyContext.Provider>;
}
