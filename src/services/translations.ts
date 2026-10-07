/**
 * The verse translation shown for each language: Quran.com's (the default) or one of QuranEnc's
 * (https://quranenc.com, by the Rowad Translation Center), whose terms allow republishing a translation
 * unmodified, credited to QuranEnc.com with its version number, and kept to the latest version. Their API serves
 * the current version, so the app follows updates on its own; the text and footnotes are shown as they come.
 */
import { useSyncExternalStore } from 'react';
import { cached, getJson } from './quranCom';

const QURANENC = 'https://quranenc.com/api/v1';

/** QuranEnc translations with a spoken recording (d.quranenc.com/data/audio/<key>/), checked across the Quran */
const SPOKEN: Record<string, string> = { english_rwwad: 'English', french_rashid: 'Français', somali_yacob: 'Soomaali' };

/** The language a spoken translation is read in, for the audio controls. */
export const spokenLanguage = (key: string): string | undefined => SPOKEN[key];

export interface QuranEncTranslation {
  key: string;
  title: string;
  version: string;
  rtl: boolean;
  spoken: boolean;
}

/** QuranEnc's translations into an app language (none for Arabic). */
export const fetchQuranEncTranslations = (language: string): Promise<QuranEncTranslation[]> =>
  cached(`quranenc-list:${language}`, async () => {
    const { translations } = await getJson<{
      translations?: { key: string; title: string; version: string; direction: string }[];
    }>(`${QURANENC}/translations/list/${language}`);
    return (translations ?? []).map((t) => ({
      key: t.key,
      title: t.title,
      version: t.version,
      rtl: t.direction === 'rtl',
      spoken: t.key in SPOKEN
    }));
  });

export interface QuranEncVerse {
  text: string;
  footnotes: string;
}

/** A whole surah of a QuranEnc translation, by verse number; one request per surah. */
export const fetchQuranEncSurah = (key: string, surah: number): Promise<Map<number, QuranEncVerse>> =>
  cached(`quranenc:${key}:${surah}`, async () => {
    const { result } = await getJson<{ result: { aya: string; translation: string; footnotes: string }[] }>(
      `${QURANENC}/translation/sura/${key}/${surah}`
    );
    return new Map(result.map((r) => [Number(r.aya), { text: r.translation.trim(), footnotes: (r.footnotes || '').trim() }]));
  });

/** The spoken translation of a verse, for the QuranEnc translations that have one. */
export const quranEncAudioUrl = (key: string, verseKey: string): string => {
  const [s, a] = verseKey.split(':');
  return `https://d.quranenc.com/data/audio/${key}/${s.padStart(3, '0')}${a.padStart(3, '0')}.mp3`;
};

// ---------- the chosen translation, per language, remembered on this device ----------

/** A chosen QuranEnc translation; absent means Quran.com's default for the language. */
export interface TranslationChoice {
  key: string;
  title: string;
  version: string;
  rtl: boolean;
  spoken: boolean;
}

const storageKey = (language: string) => `ayah-words-translation-${language}`;

const read = (language: string): TranslationChoice | null => {
  try {
    const raw = localStorage.getItem(storageKey(language));
    return raw ? (JSON.parse(raw) as TranslationChoice) : null;
  } catch {
    return null;
  }
};

const choices = new Map<string, TranslationChoice | null>();
const listeners = new Set<() => void>();

export const translationStore = {
  get: (language: string): TranslationChoice | null => {
    if (!choices.has(language)) choices.set(language, read(language));
    return choices.get(language)!;
  },
  set: (language: string, choice: TranslationChoice | null) => {
    choices.set(language, choice);
    try {
      if (choice) localStorage.setItem(storageKey(language), JSON.stringify(choice));
      else localStorage.removeItem(storageKey(language));
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

export const useTranslationChoice = (language: string): TranslationChoice | null =>
  useSyncExternalStore(translationStore.subscribe, () => translationStore.get(language));
