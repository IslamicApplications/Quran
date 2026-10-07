/**
 * Saving a surah or juz for offline reading. The app's service worker (public/sw.js) keeps every response it
 * passes through, so downloading means requesting what the reader will request: the same verse pages, word data,
 * translation, introduction, and each verse's recitation with its word timings. Only the published app has the
 * service worker; the development server has nothing to save into.
 */
import { useSyncExternalStore } from 'react';
import { SURAH_LIST } from '../data/surahList';
import { contentLanguage, fetchChapterPage, getSurahMorphology, getSurahVocab, getRecitationTimings, DEFAULT_RECITATION_ID } from './quranCom';
import { fetchSurahInfo } from './surahInfo';
import { loadTafsir, readTafsirChoice } from './tafsir';
import { fetchJuz } from './ummahApi';
import { reciterAudioUrl, reciterName, reciterStore, RECITERS, type ReciterId } from './reciters';

/** The Surah Reader's page size: the download must ask for the same pages the reader does */
const READER_PAGE_SIZE = 20;
const PARALLEL = 4;

export type DownloadId = `surah:${number}` | `juz:${number}`;

export interface DownloadRecord {
  id: DownloadId;
  title: string;
  verses: number;
  reciter: string;
  /** What was saved, so removing it can free the recordings */
  reciterId: ReciterId;
  keys: string[];
  savedAt: string;
}

// ---------- the list of downloads, remembered on this device ----------

const STORE_KEY = 'ayah-words-downloads';

const load = (): Record<string, DownloadRecord> => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
};

let records = load();
const listeners = new Set<() => void>();
const save = (next: Record<string, DownloadRecord>) => {
  records = next;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* the list is a convenience; the saved files stay either way */
  }
  listeners.forEach((l) => l());
};

export const downloadsStore = {
  get: () => records,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

export const useDownloads = () => useSyncExternalStore(downloadsStore.subscribe, downloadsStore.get);

/** Whether this page can save for offline use: the published app, once its service worker is running. */
export const canDownload = (): boolean => typeof navigator !== 'undefined' && !!navigator.serviceWorker?.controller;

// ---------- downloading ----------

export interface Progress {
  done: number;
  total: number;
}

/** Runs `tasks` a few at a time, reporting each one finished; stops early when `signal` aborts. */
const runAll = async (tasks: (() => Promise<unknown>)[], onDone: () => void, signal: AbortSignal) => {
  let next = 0;
  let failed = 0;
  const worker = async () => {
    while (next < tasks.length && !signal.aborted) {
      const task = tasks[next++];
      try {
        await task();
      } catch {
        failed++;
      }
      onDone();
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, worker));
  return failed;
};

/** Fetches a recording through the service worker, which saves the whole file. */
const fetchAudio = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Audio ${res.status}`);
  await res.arrayBuffer();
};

const verseTasks = (keys: string[], reciter: ReciterId) => {
  const recitation = RECITERS.find((r) => r.id === reciter);
  const qc = recitation && 'quranCom' in recitation ? recitation.quranCom : undefined;
  return keys.flatMap((key) => [
    () => fetchAudio(reciterAudioUrl(key, reciter)),
    // Alafasy's timings come with the verse pages; other Quran.com reciters have their own per verse
    ...(qc && qc.recitation !== DEFAULT_RECITATION_ID ? [() => getRecitationTimings(key, qc.recitation)] : [])
  ]);
};

const requestPersistence = () => navigator.storage?.persist?.().catch(() => false);

/**
 * Saves a surah: its verse pages (text, translation and word data in the current language), its word lists and
 * introduction, every verse recited by the chosen reciter, and the chosen tafsir of every verse. Resolves with the
 * number of files that failed.
 */
export const downloadSurah = async (surah: number, onProgress: (p: Progress) => void, signal: AbortSignal) => {
  requestPersistence();
  const info = SURAH_LIST[surah - 1];
  const reciter = reciterStore.get();
  const keys = Array.from({ length: info.totalAyahs }, (_, i) => `${surah}:${i + 1}`);
  const pages = Math.ceil(info.totalAyahs / READER_PAGE_SIZE);
  const tasks: (() => Promise<unknown>)[] = [
    () => getSurahMorphology(surah),
    () => getSurahVocab(),
    () => fetchSurahInfo(surah),
    ...Array.from({ length: pages }, (_, i) => () => fetchChapterPage(surah, i + 1, READER_PAGE_SIZE)),
    ...verseTasks(keys, reciter),
    // The tafsir chosen in the tafsir panel, for every verse
    ...keys.map((key) => () => loadTafsir(key, readTafsirChoice(contentLanguage())))
  ];
  let done = 0;
  onProgress({ done, total: tasks.length });
  const failed = await runAll(tasks, () => onProgress({ done: ++done, total: tasks.length }), signal);
  if (!signal.aborted && failed === 0) {
    save({
      ...records,
      [`surah:${surah}`]: {
        id: `surah:${surah}`,
        title: `Surah ${info.nameTransliteration}`,
        verses: info.totalAyahs,
        reciter: reciterName(reciter),
        reciterId: reciter,
        keys,
        savedAt: new Date().toISOString()
      }
    });
  }
  return failed;
};

/** Saves a juz: its verses with their translations, the word data of its surahs, and every verse recited. */
export const downloadJuz = async (juz: number, onProgress: (p: Progress) => void, signal: AbortSignal) => {
  requestPersistence();
  const reciter = reciterStore.get();
  const verses = await fetchJuz(juz);
  const keys = verses.map((v) => v.key);
  const surahs = [...new Set(verses.map((v) => v.surah))];
  const tasks: (() => Promise<unknown>)[] = [
    ...surahs.map((s) => () => getSurahMorphology(s)),
    ...verseTasks(keys, reciter)
  ];
  let done = 0;
  onProgress({ done, total: tasks.length });
  const failed = await runAll(tasks, () => onProgress({ done: ++done, total: tasks.length }), signal);
  if (!signal.aborted && failed === 0) {
    save({
      ...records,
      [`juz:${juz}`]: {
        id: `juz:${juz}`,
        title: `Juz ${juz}`,
        verses: keys.length,
        reciter: reciterName(reciter),
        reciterId: reciter,
        keys,
        savedAt: new Date().toISOString()
      }
    });
  }
  return failed;
};

/**
 * Removes a download and deletes its recordings, which take nearly all of its space. Recordings another download
 * still uses are kept; the small text files stay, as the reader would fetch them again anyway.
 */
export const removeDownload = async (id: DownloadId) => {
  const record = records[id];
  const next = { ...records };
  delete next[id];
  save(next);
  if (!record || typeof caches === 'undefined') return;
  const stillUsed = new Set(
    Object.values(next).flatMap((r) => (r.keys ?? []).map((key) => reciterAudioUrl(key, r.reciterId)))
  );
  const cache = await caches.open('audio-v1');
  await Promise.all(
    (record.keys ?? [])
      .map((key) => reciterAudioUrl(key, record.reciterId))
      .filter((url) => !stillUsed.has(url))
      .map((url) => cache.delete(url))
  );
};

/** Storage this site uses on the device, in bytes, where the browser says. */
export const storageUsed = async (): Promise<number | undefined> => (await navigator.storage?.estimate?.())?.usage;
