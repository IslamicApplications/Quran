/**
 * The Quran script the readers show: Uthmani (the Madinah Mushaf, the default), IndoPak (as printed and learned in
 * South Asia) or simple spelling (imlaei, modern Arabic spelling without the Uthmani signs), all from Quran.com.
 * Tajweed colouring is marked on the Uthmani text only. Remembered on this device.
 */
import type { QWord } from './quranCom';

export type QuranScript = 'uthmani' | 'indopak' | 'imlaei';

export const SCRIPTS: { id: QuranScript; label: string }[] = [
  { id: 'uthmani', label: 'Uthmani' },
  { id: 'indopak', label: 'IndoPak' },
  { id: 'imlaei', label: 'Simple' }
];

const SCRIPT_KEY = 'ayah-words-script';
const TRANSLITERATION_KEY = 'ayah-words-transliteration';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* per-viewer convenience only */
  }
};

export const readScript = (): QuranScript => {
  const s = read(SCRIPT_KEY);
  return s === 'indopak' || s === 'imlaei' ? s : 'uthmani';
};
export const saveScript = (script: QuranScript) => write(SCRIPT_KEY, script);

export const readTransliteration = (): boolean => read(TRANSLITERATION_KEY) === '1';
export const saveTransliteration = (on: boolean) => write(TRANSLITERATION_KEY, on ? '1' : '0');

/** A word in the chosen script, or in Uthmani where Quran.com has no other spelling of it. */
export const wordText = (word: QWord, script: QuranScript): string =>
  (script === 'indopak' ? word.indopak : script === 'imlaei' ? word.imlaei : undefined) || word.arabic;
