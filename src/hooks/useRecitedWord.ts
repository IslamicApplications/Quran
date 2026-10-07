import { useSyncExternalStore } from 'react';
import { fetchVerse, type WordTiming } from '../services/quranCom';
import { estimateTimings, reciterTimings, type ReciterId } from '../services/reciters';

/** The word being recited right now, shared by every view of the verse. */
let current: { key: string; position: number } | null = null;
let owner: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();

const set = (next: typeof current) => {
  if (next?.key === current?.key && next?.position === current?.position) return;
  current = next;
  listeners.forEach((l) => l());
};

const wordAt = (timings: WordTiming[], ms: number): number | null => {
  let found: number | null = null;
  // A word stays highlighted through the short gap before the next one starts
  for (const t of timings) if (t.start <= ms) found = t.position;
  return found;
};

/**
 * Follows `audio`, the verse recited by `reciter`, and publishes the word being recited. A recording with its
 * own word timings is followed exactly; otherwise the timings are estimated from the verse's `words` (fetched
 * when not given) once the clip's length is known. Stops when the clip pauses, ends or fails, including when
 * another clip takes over.
 */
export const followRecitation = (
  audio: HTMLAudioElement,
  verseKey: string,
  reciter: ReciterId,
  words?: string[]
): void => {
  owner = audio;
  set(null);
  let frame = 0;
  let timings: WordTiming[] | undefined;

  const tick = () => {
    if (owner !== audio) return;
    if (timings) set({ key: verseKey, position: wordAt(timings, audio.currentTime * 1000) ?? 0 });
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    if (owner === audio) set(null);
  };

  const estimate = async () => {
    const arabic = words?.length ? words : (await fetchVerse(verseKey)).words.map((w) => w.arabic);
    const ready = () => Number.isFinite(audio.duration) && audio.duration > 0;
    if (!ready()) await new Promise((resolve) => audio.addEventListener('loadedmetadata', resolve, { once: true }));
    return ready() ? estimateTimings(arabic, audio.duration * 1000) : undefined;
  };

  reciterTimings(verseKey, reciter)
    .then((t) => t ?? estimate())
    .then((t) => (timings = t))
    .catch(() => undefined); // no timings: the audio plays without highlighting

  audio.addEventListener('playing', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  });
  audio.addEventListener('pause', stop);
  audio.addEventListener('ended', stop);
  audio.addEventListener('error', stop);
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Position of the word being recited in `verseKey`, or null when that verse isn't playing. */
export const recitedWord = (verseKey: string | undefined): number | null =>
  current && current.key === verseKey && current.position ? current.position : null;

export const useRecitedWord = (verseKey: string | undefined): number | null =>
  useSyncExternalStore(subscribe, () => recitedWord(verseKey));
