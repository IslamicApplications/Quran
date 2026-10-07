/**
 * Verse recitations by the reciters of the Quran API (https://quranapi.pages.dev/getting-started/available-reciters).
 * Their files follow a fixed address, so no request is needed to find one. Mishary Alafasy plays from Quran.com
 * instead, whose recording comes with the word timings that highlight each word as it is recited.
 */
import { useSyncExternalStore } from 'react';
import { verseAudioUrl } from './quranCom';

export const RECITERS = [
  { id: 1, name: 'Mishary Rashid Alafasy' },
  { id: 2, name: 'Abu Bakr Al-Shatri' },
  { id: 3, name: 'Nasser Al-Qatami' },
  { id: 4, name: 'Yasser Al-Dosari' },
  { id: 5, name: 'Hani Ar-Rifai' }
] as const;

export type ReciterId = (typeof RECITERS)[number]['id'];

const DEFAULT_RECITER: ReciterId = 1;
const RECITER_KEY = 'ayah-words-reciter';

export const reciterName = (id: ReciterId): string => RECITERS.find((r) => r.id === id)!.name;

/** Only the default recitation has word timings to follow. */
export const hasWordTimings = (id: ReciterId): boolean => id === DEFAULT_RECITER;

export const reciterAudioUrl = (verseKey: string, id: ReciterId): string => {
  if (id === DEFAULT_RECITER) return verseAudioUrl(verseKey);
  const [s, a] = verseKey.split(':');
  return `https://the-quran-project.github.io/Quran-Audio/Data/${id}/${s}_${a}.mp3`;
};

// ---------- the chosen reciter, shared by every player and remembered on this device ----------

const load = (): ReciterId => {
  try {
    const id = Number(localStorage.getItem(RECITER_KEY));
    return RECITERS.some((r) => r.id === id) ? (id as ReciterId) : DEFAULT_RECITER;
  } catch {
    return DEFAULT_RECITER;
  }
};

let reciter: ReciterId = load();
const listeners = new Set<() => void>();

export const reciterStore = {
  get: () => reciter,
  set: (id: ReciterId) => {
    reciter = id;
    try {
      localStorage.setItem(RECITER_KEY, String(id));
    } catch {
      /* storage unavailable: keep the choice for this session */
    }
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

export const useReciter = (): ReciterId => useSyncExternalStore(reciterStore.subscribe, reciterStore.get);
