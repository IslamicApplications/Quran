/**
 * Verse recitations for the reciters of the Quran API (https://quranapi.pages.dev/getting-started/available-reciters).
 * Alafasy, Abu Bakr al-Shatri and Hani ar-Rifai play Quran.com's recordings, which come with timings for each
 * word, so the word being recited lights up exactly. Nasser al-Qatami and Yasser al-Dosari are not on Quran.com;
 * their verses play from the Quran API's files and the word highlighting is estimated from each word's length.
 */
import { useSyncExternalStore } from 'react';
import { DEFAULT_RECITATION_ID, getRecitationTimings, type WordTiming } from './quranCom';

export const RECITERS = [
  { id: 1, name: 'Mishary Rashid Alafasy', quranCom: { recitation: DEFAULT_RECITATION_ID, folder: 'Alafasy' } },
  { id: 2, name: 'Abu Bakr Al-Shatri', quranCom: { recitation: 4, folder: 'Shatri' } },
  { id: 3, name: 'Nasser Al-Qatami' },
  { id: 4, name: 'Yasser Al-Dosari' },
  { id: 5, name: 'Hani Ar-Rifai', quranCom: { recitation: 5, folder: 'Rifai' } }
] as const;

export type ReciterId = (typeof RECITERS)[number]['id'];

const DEFAULT_RECITER: ReciterId = 1;
const RECITER_KEY = 'ayah-words-reciter';

const reciterInfo = (id: ReciterId) => RECITERS.find((r) => r.id === id)!;
const quranComOf = (id: ReciterId) => {
  const r = reciterInfo(id);
  return 'quranCom' in r ? r.quranCom : undefined;
};

export const reciterName = (id: ReciterId): string => reciterInfo(id).name;

/** Whether the word highlighting follows real timings (true) or is estimated from word lengths (false). */
export const hasWordTimings = (id: ReciterId): boolean => !!quranComOf(id);

export const reciterAudioUrl = (verseKey: string, id: ReciterId): string => {
  const [s, a] = verseKey.split(':');
  const qc = quranComOf(id);
  if (qc) return `https://verses.quran.com/${qc.folder}/mp3/${s.padStart(3, '0')}${a.padStart(3, '0')}.mp3`;
  return `https://the-quran-project.github.io/Quran-Audio/Data/${id}/${s}_${a}.mp3`;
};

/** The recording's own word timings, or undefined when the reciter has none (estimate them instead). */
export const reciterTimings = (verseKey: string, id: ReciterId): Promise<WordTiming[] | undefined> => {
  const qc = quranComOf(id);
  return qc ? getRecitationTimings(verseKey, qc.recitation) : Promise.resolve(undefined);
};

const ARABIC_LETTERS = /[\u0621-\u064A\u0671-\u06D3]/g;

/**
 * Timings spread over a recording of `durationMs` by each word's length in letters, for reciters without
 * timings. Verse files open and close with a short silence, which is left out.
 */
export const estimateTimings = (words: string[], durationMs: number): WordTiming[] => {
  const lead = Math.min(250, durationMs * 0.05);
  const span = durationMs - lead - Math.min(300, durationMs * 0.05);
  // A pause of about two letters' length follows each word
  const weights = words.map((w) => (w.match(ARABIC_LETTERS) || []).length + 2);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  let at = lead;
  return weights.map((w, i) => {
    const start = at;
    at += (span * w) / total;
    return { position: i + 1, start: Math.round(start), end: Math.round(at) };
  });
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
