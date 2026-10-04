/**
 * Whole-Quran data layer.
 *
 * - Verse text, word-by-word meaning, transliteration and audio: Quran.com API v4 (public, CORS-enabled).
 * - Root, lemma and part of speech per word: Quranic Arabic Corpus morphology (GPL-3.0), bundled in
 *   public/data/morphology and built by scripts/build-morphology.mjs. Word positions in both sources were
 *   verified to align for all 6,236 verses.
 */

const API = 'https://api.quran.com/api/v4';
const WORD_AUDIO_BASE = 'https://audio.qurancdn.com/';
const VERSE_AUDIO_BASE = 'https://verses.quran.com/';
const COVERAGE_URL = `${import.meta.env.BASE_URL}data/morphology/coverage.json`;
const MORPHOLOGY_BASE = `${import.meta.env.BASE_URL}data/morphology/`;

/** Saheeh International */
export const DEFAULT_TRANSLATION_ID = 20;
export const DEFAULT_RECITATION_ID = 7; // Mishary Rashid Alafasy

export interface QWord {
  location: string; // "surah:ayah:word"
  position: number;
  arabic: string;
  translation: string;
  transliteration: string;
  audioUrl?: string;
  root?: string; // letters without spaces, e.g. "رحم"
  lemma?: string;
  tag?: string; // corpus POS tag of the stem, e.g. "N", "PERF", "ACT_PCPL"
  verbForm?: string; // "1".."12"
}

export interface QVerse {
  key: string;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  juz: number;
  page: number;
  words: QWord[];
}

export interface QSearchResult {
  key: string;
  arabic: string;
  /** Translation HTML from the API with only <em> highlight tags kept. */
  translationHtml: string;
  translationSource: string;
}

export interface RootIndexEntry {
  n: number; // occurrences
  l: Record<string, string[]>; // lemma -> word locations
}

// ---------- caching helpers ----------

const memo = new Map<string, Promise<unknown>>();

const cached = <T>(key: string, load: () => Promise<T>): Promise<T> => {
  if (!memo.has(key)) {
    const p = load().catch((err) => {
      memo.delete(key); // allow retry after a network failure
      throw err;
    });
    memo.set(key, p);
  }
  return memo.get(key) as Promise<T>;
};

const getJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
};

// ---------- text helpers ----------

/** Removes footnote markers and any HTML from API translations. */
export const cleanTranslation = (html: string): string =>
  html
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const keepEmphasisOnly = (html: string): string =>
  html
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')
    .replace(/<(?!\/?em>)[^>]+>/g, '')
    .trim();

/** Spelling-insensitive form: Uthmani dagger alif as alif, no vowel marks, annotation signs or tatweel. */
const plainArabic = (text: string): string =>
  text
    .normalize('NFC')
    .replace(/\u0670/g, 'ا')
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0640]/g, '')
    .replace(/ءا/g, 'ا')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\s۞]/g, '');

/** Same letters apart from vowels and Uthmani spelling (كِتَـٰبٌ = كِتاب); lenient, for locating a word in a verse. */
const sameSpelling = (a: string, b: string): boolean => {
  const x = plainArabic(a);
  const y = plainArabic(b);
  // Accusative tanween is written with a trailing alif (قَوْمًۭا)
  return x === y || x === `${y}ا` || `${x}ا` === y;
};

/** "رحم" -> "ر ح م" */
export const formatRoot = (root?: string): string => (root ? [...root].join(' ') : '');

const TAG_LABELS: Record<string, string> = {
  N: 'Noun',
  PN: 'Proper noun',
  ADJ: 'Adjective',
  PRON: 'Pronoun',
  DEM: 'Demonstrative',
  REL: 'Relative pronoun',
  T: 'Time adverb',
  LOC: 'Location adverb',
  VN: 'Verbal noun',
  ACT_PCPL: 'Active participle',
  PASS_PCPL: 'Passive participle',
  INTG: 'Interrogative',
  COND: 'Conditional',
  PERF: 'Verb (past)',
  IMPF: 'Verb (present)',
  IMPV: 'Verb (command)',
  P: 'Preposition',
  CONJ: 'Conjunction',
  NEG: 'Negative particle',
  ACC: 'Accusative particle',
  EMPH: 'Emphatic particle',
  REM: 'Resumption particle',
  SUB: 'Subordinating particle',
  RES: 'Restriction particle',
  CERT: 'Particle of certainty',
  VOC: 'Vocative particle',
  FUT: 'Future particle',
  ANS: 'Answer particle',
  INL: 'Quranic initials',
  EXP: 'Exceptive particle',
  PRP: 'Particle of purpose',
  CIRC: 'Circumstantial particle',
  RSLT: 'Particle of result',
  SUP: 'Supplemental particle',
  PRO: 'Prohibition particle',
  INC: 'Inceptive particle',
  AMD: 'Amendment particle',
  AVR: 'Aversion particle',
  CAUS: 'Particle of cause',
  COM: 'Comitative particle',
  EQ: 'Equalization particle',
  EXH: 'Exhortation particle',
  EXL: 'Explanation particle',
  INT: 'Particle of interpretation',
  PREV: 'Preventive particle',
  RET: 'Retraction particle',
  SUR: 'Surprise particle',
  ATT: 'Attention particle',
  DIST: 'Distance particle',
  ADDR: 'Address particle',
  DET: 'Definite article',
  IMPN: 'Imperative verbal noun',
  NV: 'Verbal noun (ism fiʿl)'
};

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** "10" -> "X" */
export const romanVerbForm = (form: string): string => ROMAN[Number(form)] || form;

export const describeTag = (tag?: string, verbForm?: string): string => {
  if (!tag) return '';
  const label = TAG_LABELS[tag] || (tag.length <= 5 ? `${tag} particle` : tag);
  return verbForm ? `${label} · Form ${romanVerbForm(verbForm)}` : label;
};

/** Broad colour group for a tag, used for badges. */
export const tagGroup = (tag?: string): 'verb' | 'noun' | 'particle' => {
  if (!tag) return 'particle';
  if (['PERF', 'IMPF', 'IMPV'].includes(tag)) return 'verb';
  if (['N', 'PN', 'ADJ', 'PRON', 'DEM', 'REL', 'T', 'LOC', 'VN', 'ACT_PCPL', 'PASS_PCPL', 'INTG', 'NV'].includes(tag))
    return 'noun';
  return 'particle';
};

const ayahFileName = (key: string): string => {
  const [s, a] = key.split(':').map(Number);
  return `${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`;
};

/** Saheeh International English translation recited by Ibrahim Walk (EveryAyah.com). */
export const englishVerseAudioUrl = (key: string): string =>
  `https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/${ayahFileName(key)}`;

export const verseAudioUrl = (key: string): string => {
  const [s, a] = key.split(':').map(Number);
  return `${VERSE_AUDIO_BASE}Alafasy/mp3/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`;
};

// ---------- morphology ----------

type SurahMorphology = string[][]; // [ayah][word] = "root|lemma|tag|form"

export const getSurahMorphology = (surah: number): Promise<SurahMorphology> =>
  cached(`morph:${surah}`, () => getJson<SurahMorphology>(`${MORPHOLOGY_BASE}${surah}.json`));

export const getRootIndex = (): Promise<Record<string, RootIndexEntry>> =>
  cached('roots', () => getJson<Record<string, RootIndexEntry>>(`${MORPHOLOGY_BASE}roots.json`));

const parseMorph = (entry?: string) => {
  if (!entry) return {};
  const [root, lemma, tag, verbForm] = entry.split('|');
  return { root: root || undefined, lemma: lemma || undefined, tag: tag || undefined, verbForm: verbForm || undefined };
};

// ---------- coverage course ----------

export interface CoverageWord {
  rank: number; // 1-based frequency rank
  lemma: string;
  root?: string;
  tag?: string;
  verbForm?: string;
  count: number; // occurrences as a word of its own, used for coverage
  appearances: number; // every occurrence, including as an attached prefix (ب in بِٱللَّهِ); >= count
  sample: string; // "surah:ayah:word" whose recitation sounds closest to the dictionary form
}

export interface CoverageData {
  totalWords: number;
  words: CoverageWord[];
}

export const getCoverageList = (): Promise<CoverageData> =>
  cached('coverage', async () => {
    const raw = await getJson<{
      totalWords: number;
      words: [string, string, string, string, number, string, number?][];
    }>(
      COVERAGE_URL
    );
    return {
      totalWords: raw.totalWords,
      words: raw.words.map(([lemma, root, tag, verbForm, count, sample, appearances], i) => ({
        rank: i + 1,
        lemma,
        root: root || undefined,
        tag: tag || undefined,
        verbForm: verbForm || undefined,
        count,
        appearances: Math.max(count, appearances || 0),
        sample
      }))
    };
  });

export interface SurahVocab {
  total: number; // words in the surah
  lemmas: [string, number][]; // lemma -> occurrences in this surah, most frequent first
}

/** Vocabulary summary for all 114 surahs (index 0 = Al-Fatihah). */
export const getSurahVocab = (): Promise<SurahVocab[]> =>
  cached('surah-vocab', async () => {
    const raw = await getJson<{ t: number; l: [string, number][] }[]>(`${MORPHOLOGY_BASE}surahs.json`);
    return raw.map((s) => ({ total: s.t, lemmas: s.l }));
  });

/** Share of a surah's words whose lemma is in `known` (0–1). */
export const surahCoverage = (vocab: SurahVocab, known: ReadonlySet<string>): number => {
  let covered = 0;
  for (const [lemma, n] of vocab.lemmas) if (known.has(lemma)) covered += n;
  return vocab.total ? covered / vocab.total : 0;
};

/** The word at a "surah:ayah:word" location, together with its verse. */
export const fetchWordAt = async (location: string): Promise<{ verse: QVerse; word?: QWord }> => {
  const [s, a, w] = location.split(':').map(Number);
  const verse = await fetchVerse(`${s}:${a}`);
  return { verse, word: verse.words[w - 1] };
};

/**
 * The word in a verse written as `text` (a lesson's highlighted word), ignoring vowels and Uthmani spelling.
 * Falls back to the word that contains it, e.g. a highlighted stem inside وَٱلصَّلَوٰةَ.
 */
export const findWordInVerse = async (verseKey: string, text: string): Promise<QWord | undefined> => {
  const verse = await fetchVerse(verseKey);
  const target = plainArabic(text);
  return (
    verse.words.find((w) => sameSpelling(w.arabic, text)) ||
    verse.words.find((w) => plainArabic(w.arabic).includes(target)) ||
    verse.words.find((w) => target.includes(plainArabic(w.arabic)) && plainArabic(w.arabic).length > 1)
  );
};

// ---------- verses ----------

interface ApiWord {
  position: number;
  char_type_name: string;
  text_uthmani: string;
  audio_url: string | null;
  location?: string;
  translation?: { text: string };
  transliteration?: { text: string | null };
}

interface ApiVerse {
  verse_key: string;
  verse_number: number;
  juz_number: number;
  page_number: number;
  text_uthmani: string;
  words: ApiWord[];
  translations?: { text: string }[];
  /** Word timings of the recitation: [index, wordPosition, startMs, endMs] */
  audio?: { segments?: number[][] };
}

const VERSE_QUERY = `words=true&word_fields=text_uthmani,location&fields=text_uthmani&translations=${DEFAULT_TRANSLATION_ID}&audio=${DEFAULT_RECITATION_ID}`;

/** When a word is recited in the verse's Alafasy recording, in milliseconds. */
export interface WordTiming {
  position: number;
  start: number;
  end: number;
}

/**
 * Quran.com's timings name the word by position. Across all 6,236 verses, 6,208 cover every word in order
 * and 25 skip a word or two, whose sound is folded into a neighbour's timing. 13:1 counts الٓمٓر as two
 * words, so its positions are shifted by one but its count matches: take those in order. 10:1 and 37:130
 * point past the last word; they get no timings.
 */
const toTimings = (segments: number[][] | undefined, wordCount: number): WordTiming[] | undefined => {
  if (!segments?.length) return undefined;
  const positions = segments.map((seg) => seg[1]);
  const inOrder = positions.every((p, i) => p >= 1 && p <= wordCount && (i === 0 || p > positions[i - 1]));
  if (!inOrder && segments.length !== wordCount) return undefined;
  return segments.map(([, position, start, end], i) => ({ position: inOrder ? position : i + 1, start, end }));
};

// Filled as verses load, so following a recitation needs no extra request for a verse already on screen
const timingsByKey = new Map<string, WordTiming[] | undefined>();

/**
 * Word-by-word audio files are numbered by word position (wbw/002_002_005.mp3 is the 5th word of 2:2).
 * The API's own `audio_url` counts pause marks such as ۛ as words, so after one it points at the next
 * word's file, or at a file that doesn't exist; verified across verses with pause marks. Build the URL here.
 */
const wordAudioUrl = (surah: number, ayah: number, position: number): string =>
  `${WORD_AUDIO_BASE}wbw/${String(surah).padStart(3, '0')}_${String(ayah).padStart(3, '0')}_${String(position).padStart(3, '0')}.mp3`;

const toVerse = (v: ApiVerse, morph: SurahMorphology): QVerse => {
  const [surah, ayah] = v.verse_key.split(':').map(Number);
  const ayahMorph = morph[ayah - 1] || [];
  const words = v.words
    .filter((w) => w.char_type_name === 'word')
    .map<QWord>((w) => ({
      location: w.location || `${surah}:${ayah}:${w.position}`,
      position: w.position,
      arabic: w.text_uthmani,
      translation: w.translation?.text || '',
      transliteration: w.transliteration?.text || '',
      audioUrl: w.audio_url ? wordAudioUrl(surah, ayah, w.position) : undefined,
      ...parseMorph(ayahMorph[w.position - 1])
    }));
  timingsByKey.set(v.verse_key, toTimings(v.audio?.segments, words.length));

  return {
    key: v.verse_key,
    surah,
    ayah,
    arabic: v.text_uthmani,
    translation: cleanTranslation(v.translations?.[0]?.text || ''),
    juz: v.juz_number,
    page: v.page_number,
    words
  };
};

export const fetchVerse = (key: string): Promise<QVerse> =>
  cached(`verse:${key}`, async () => {
    const surah = Number(key.split(':')[0]);
    const [data, morph] = await Promise.all([
      getJson<{ verse: ApiVerse }>(`${API}/verses/by_key/${key}?${VERSE_QUERY}`),
      getSurahMorphology(surah)
    ]);
    return toVerse(data.verse, morph);
  });

/** Word timings for the verse's default recitation (verseAudioUrl), if Quran.com has usable ones. */
export const getVerseTimings = async (key: string): Promise<WordTiming[] | undefined> => {
  if (!timingsByKey.has(key)) await fetchVerse(key);
  return timingsByKey.get(key);
};

export interface ChapterPage {
  verses: QVerse[];
  nextPage: number | null;
  totalVerses: number;
}

export const fetchChapterPage = (surah: number, page = 1, perPage = 20): Promise<ChapterPage> =>
  cached(`chapter:${surah}:${page}:${perPage}`, async () => {
    const [data, morph] = await Promise.all([
      getJson<{ verses: ApiVerse[]; pagination: { next_page: number | null; total_records: number } }>(
        `${API}/verses/by_chapter/${surah}?${VERSE_QUERY}&per_page=${perPage}&page=${page}`
      ),
      getSurahMorphology(surah)
    ]);
    return {
      verses: data.verses.map((v) => toVerse(v, morph)),
      nextPage: data.pagination.next_page,
      totalVerses: data.pagination.total_records
    };
  });

// ---------- search ----------

export interface SearchPage {
  results: QSearchResult[];
  total: number;
  totalPages: number;
}

export const searchQuran = (query: string, page = 1, size = 10): Promise<SearchPage> =>
  cached(`search:${query}:${page}:${size}`, async () => {
    const data = await getJson<{
      search: {
        total_results: number;
        total_pages: number;
        results: { verse_key: string; text: string; translations?: { text: string; name: string }[] }[];
      };
    }>(`${API}/search?q=${encodeURIComponent(query)}&size=${size}&page=${page}&language=en`);

    return {
      total: data.search.total_results,
      totalPages: data.search.total_pages,
      results: data.search.results.map((r) => ({
        key: r.verse_key,
        arabic: r.text,
        translationHtml: keepEmphasisOnly(r.translations?.[0]?.text || ''),
        translationSource: r.translations?.[0]?.name || ''
      }))
    };
  });

// ---------- shared audio ----------

let currentAudio: HTMLAudioElement | null = null;

/** Plays one clip at a time across the app; returns the element so callers can track its state. */
export const playAudio = (url: string): HTMLAudioElement => {
  currentAudio?.pause();
  const audio = new Audio(url);
  currentAudio = audio;
  // Load failures fire the element's own error event. A blocked play() (NotAllowedError) does not, so raise
  // one to stop callers waiting in a loading state. AbortError just means another clip took over.
  audio.play().catch((err) => {
    if (err?.name === 'NotAllowedError') audio.dispatchEvent(new Event('error'));
  });
  return audio;
};
