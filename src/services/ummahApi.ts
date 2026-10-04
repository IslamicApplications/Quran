/**
 * The Quran juz by juz from UmmahAPI (https://ummahapi.com/quran-api): text, transliteration and 12
 * translations per verse. Words are split on spaces and joined to the bundled corpus morphology by
 * position, which matches for 6,232 of the 6,236 verses; the other 4 write one word as two (بَعْدَ مَا)
 * and are shown without word data.
 */
import { cached, getJson, getSurahMorphology, parseMorph, QVerse, QWord } from './quranCom';

const API = 'https://ummahapi.com/api/quran';

export const TRANSLATIONS = [
  { id: 'sahih_international', label: 'English · Saheeh International' },
  { id: 'pickthall', label: 'English · Pickthall' },
  { id: 'yusuf_ali', label: 'English · Yusuf Ali' },
  { id: 'urdu', label: 'اردو · Urdu', rtl: true },
  { id: 'turkish', label: 'Türkçe · Turkish' },
  { id: 'indonesian', label: 'Bahasa Indonesia' },
  { id: 'malay', label: 'Bahasa Melayu' },
  { id: 'french', label: 'Français · French' },
  { id: 'german', label: 'Deutsch · German' },
  { id: 'spanish', label: 'Español · Spanish' },
  { id: 'bengali', label: 'বাংলা · Bengali' },
  { id: 'bosnian', label: 'Bosanski · Bosnian' }
] as const;

export type TranslationId = (typeof TRANSLATIONS)[number]['id'];

/** First and last verse of each juz. */
export const JUZ_RANGES: [string, string][] = [
  ['1:1', '2:141'], ['2:142', '2:252'], ['2:253', '3:92'], ['3:93', '4:23'], ['4:24', '4:147'],
  ['4:148', '5:81'], ['5:82', '6:110'], ['6:111', '7:87'], ['7:88', '8:40'], ['8:41', '9:92'],
  ['9:93', '11:5'], ['11:6', '12:52'], ['12:53', '14:52'], ['15:1', '16:128'], ['17:1', '18:74'],
  ['18:75', '20:135'], ['21:1', '22:78'], ['23:1', '25:20'], ['25:21', '27:55'], ['27:56', '29:45'],
  ['29:46', '33:30'], ['33:31', '36:27'], ['36:28', '39:31'], ['39:32', '41:46'], ['41:47', '45:37'],
  ['46:1', '51:30'], ['51:31', '57:29'], ['58:1', '66:12'], ['67:1', '77:50'], ['78:1', '114:6']
];

export interface JuzVerse extends QVerse {
  transliteration: string;
  translations: Partial<Record<TranslationId, string>>;
  /** False for the few verses whose words don't line up with the corpus; `words` is then empty. */
  aligned: boolean;
}

interface ApiJuz {
  data: {
    verses: {
      verse_key: string;
      ayah: number;
      arabic: string;
      transliteration: string;
      translations: Partial<Record<TranslationId, string>>;
    }[];
  };
}

const hasLetter = (token: string) => /\p{L}/u.test(token);

/**
 * Drops footnote markers, which the translations attach as bare numbers ("Allāh,1 the", "[ 656]"). Every digit
 * in them is one: they write numbers out in words.
 */
const withoutFootnotes = (text = ''): string =>
  text
    .replace(/\s*\[?\s*\d+\s*\]?/g, ' ')
    .replace(/\s+([.,;:!?،؟])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

export const fetchJuz = (juz: number): Promise<JuzVerse[]> =>
  cached(`ummah-juz:${juz}`, async () => {
    const { data } = await getJson<ApiJuz>(`${API}/juz/${juz}`);
    const surahs = [...new Set(data.verses.map((v) => Number(v.verse_key.split(':')[0])))];
    const morph = new Map(await Promise.all(surahs.map(async (s) => [s, await getSurahMorphology(s)] as const)));

    return data.verses.map((v) => {
      const [surah, ayah] = v.verse_key.split(':').map(Number);
      const ayahMorph = morph.get(surah)?.[ayah - 1] || [];
      const arabic = v.arabic.trim();
      const translations = Object.fromEntries(
        Object.entries(v.translations).map(([id, text]) => [id, withoutFootnotes(text)])
      ) as JuzVerse['translations'];
      // Pause marks such as ۚ stand alone between words; keep them with the word before, and a ۞ that opens
      // a verse with the word after
      const tokens: string[] = [];
      let lead = '';
      for (const t of arabic.split(/\s+/)) {
        if (hasLetter(t)) {
          tokens.push(lead + t);
          lead = '';
        } else if (tokens.length) tokens[tokens.length - 1] += ` ${t}`;
        else lead += `${t} `;
      }
      const aligned = tokens.length === ayahMorph.length;
      const words = aligned
        ? tokens.map<QWord>((t, i) => ({
            location: `${surah}:${ayah}:${i + 1}`,
            position: i + 1,
            arabic: t,
            translation: '',
            transliteration: '',
            ...parseMorph(ayahMorph[i])
          }))
        : [];
      return {
        key: v.verse_key,
        surah,
        ayah,
        arabic,
        translation: translations.sahih_international || '',
        juz,
        page: 0,
        words,
        transliteration: v.transliteration,
        translations,
        aligned
      };
    });
  });
