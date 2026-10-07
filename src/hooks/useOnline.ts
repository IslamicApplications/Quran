import { useSyncExternalStore } from 'react';

const subscribe = (listener: () => void) => {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
};

/** Whether the browser reports a network connection. */
export const useOnline = (): boolean => useSyncExternalStore(subscribe, () => navigator.onLine);
