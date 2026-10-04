import { useSyncExternalStore } from 'react';
import { getVerseTimings, type WordTiming } from '../services/quranCom';

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
 * Follows `audio`, the verse's default recitation (verseAudioUrl), and publishes the word being recited.
 * Stops when the clip pauses, ends or fails, including when another clip takes over.
 */
export const followRecitation = (audio: HTMLAudioElement, verseKey: string): void => {
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

  getVerseTimings(verseKey)
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
export const useRecitedWord = (verseKey: string | undefined): number | null =>
  useSyncExternalStore(subscribe, () => (current && current.key === verseKey && current.position ? current.position : null));
