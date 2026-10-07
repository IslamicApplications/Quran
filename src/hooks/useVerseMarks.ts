import { useSyncExternalStore } from 'react';
import { StorageService, type VerseBookmark } from '../services/storage';

/**
 * Shared stores for per-verse marks, so the readers and the Saved page stay in step without prop drilling:
 * saved verses with notes, and the comprehension check's understood / not yet marks. Persisted through
 * StorageService, so they are part of the backup.
 */
const createStore = <T,>(load: () => Record<string, T>, save: (value: Record<string, T>) => void) => {
  let value = load();
  const listeners = new Set<() => void>();
  const emit = (next: Record<string, T>) => {
    value = next;
    save(next);
    listeners.forEach((l) => l());
  };
  return {
    get: () => value,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set: (key: string, item: T) => emit({ ...value, [key]: item }),
    remove: (key: string) => {
      if (!(key in value)) return;
      const next = { ...value };
      delete next[key];
      emit(next);
    },
    /** Re-read from storage after a backup import or data reset. */
    reload: () => {
      value = load();
      listeners.forEach((l) => l());
    }
  };
};

export const verseBookmarksStore = createStore<VerseBookmark>(StorageService.getVerseBookmarks, StorageService.setVerseBookmarks);
export const understoodVersesStore = createStore<boolean>(StorageService.getUnderstoodVerses, StorageService.setUnderstoodVerses);

export const useVerseBookmarks = () => useSyncExternalStore(verseBookmarksStore.subscribe, verseBookmarksStore.get);
export const useUnderstoodVerses = () => useSyncExternalStore(understoodVersesStore.subscribe, understoodVersesStore.get);
