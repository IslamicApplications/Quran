import { useSyncExternalStore } from 'react';
import { StorageService } from '../services/storage';
import LEMMA_FIXES from '../data/lemmaFixes.json';

/**
 * Shared store for lemmas the learner has marked as known, so the 85% Course and the Surah Reader
 * stay in sync without prop drilling. Persisted through StorageService.
 */
// Words marked known before a dictionary-form correction keep their old spelling; carry them over.
const RENAMED = new Map(
  Object.entries(LEMMA_FIXES as Record<string, string>)
    .filter(([from]) => !from.startsWith('_'))
    .map(([from, to]) => [from.normalize('NFC'), to])
);

const load = (): ReadonlySet<string> => {
  const stored = StorageService.getKnownLemmas();
  const migrated = stored.map((lemma) => RENAMED.get(lemma.normalize('NFC')) ?? lemma);
  if (migrated.some((lemma, i) => lemma !== stored[i])) StorageService.setKnownLemmas([...new Set(migrated)]);
  return new Set(migrated);
};

let known: ReadonlySet<string> = load();
const listeners = new Set<() => void>();

const emit = (next: ReadonlySet<string>) => {
  known = next;
  StorageService.setKnownLemmas([...next]);
  listeners.forEach((l) => l());
};

export const knownLemmasStore = {
  get: () => known,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  toggle: (lemma: string) => {
    const next = new Set(known);
    if (next.has(lemma)) next.delete(lemma);
    else next.add(lemma);
    emit(next);
  },
  add: (lemma: string) => {
    if (!known.has(lemma)) emit(new Set(known).add(lemma));
  },
  /** Re-read from storage after a backup import or data reset. */
  reload: () => {
    known = load();
    listeners.forEach((l) => l());
  }
};

export const useKnownLemmas = (): ReadonlySet<string> =>
  useSyncExternalStore(knownLemmasStore.subscribe, knownLemmasStore.get);
