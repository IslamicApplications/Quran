/**
 * Tafsir. The English commentaries come from the Quran API (https://quranapi.pages.dev/getting-started/get-tafsir),
 * one request per verse returning all three as Markdown. The Arabic and Urdu ones come from Quran.com's API as
 * HTML; both sites take their texts from Tarteel's Quranic Universal Library (QUL).
 */
import { API, cached, getJson } from './quranCom';

export const TAFSIRS = [
  { id: 'ibn_kathir', label: 'Ibn Kathir', name: 'Tafsir Ibn Kathir (abridged)', source: 'quranapi', author: 'Ibn Kathir' },
  { id: 'maarif', label: 'Maʿarif al-Qurʾan', name: 'Maʿarif al-Qurʾan', source: 'quranapi', author: 'Maarif Ul Quran' },
  { id: 'tazkirul', label: 'Tazkirul Quran', name: 'Tazkirul Quran', source: 'quranapi', author: 'Tazkirul Quran' },
  { id: 'saadi', label: 'السعدي', name: "Tafsir as-Sa'di (Arabic)", source: 'quranCom', resource: 91, rtl: true },
  { id: 'muyassar', label: 'الميسر', name: 'al-Tafsir al-Muyassar (Arabic)', source: 'quranCom', resource: 16, rtl: true },
  { id: 'ibn_kathir_ar', label: 'ابن كثير', name: 'Tafsir Ibn Kathir (Arabic)', source: 'quranCom', resource: 14, rtl: true },
  // Shown to readers who chose Urdu
  { id: 'ibn_kathir_ur', label: 'ابن کثیر', name: 'Tafsir Ibn Kathir (Urdu)', source: 'quranCom', resource: 160, rtl: true, languages: ['ur'] },
  { id: 'bayan_ul_quran', label: 'بیان القرآن', name: 'Bayan ul Quran, Dr. Israr Ahmad (Urdu)', source: 'quranCom', resource: 159, rtl: true, languages: ['ur'] }
] as const;

export type TafsirId = (typeof TAFSIRS)[number]['id'];
type QuranApiTafsirId = Extract<(typeof TAFSIRS)[number], { source: 'quranapi' }>['id'];

/** The tafsirs offered to a reader of `language`: all but those meant for another language. */
export const tafsirsFor = (language: string) =>
  TAFSIRS.filter((t) => !('languages' in t) || (t.languages as readonly string[]).includes(language));

export interface VerseTafsir {
  text: string;
  /** "112:1–112:4" when the commentary covers a passage rather than this verse alone */
  passage?: string;
}

export interface VerseTafsirs {
  verseKey: string;
  tafsirs: Partial<Record<QuranApiTafsirId, VerseTafsir>>;
}

interface ApiTafsir {
  tafsirs?: { author: string; groupVerse: string | null; content: string }[];
}

const ENTITIES: Record<string, string> = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…'
};

/** Some texts carry HTML entities ("Prophet&nbsp;ﷺ"), which would otherwise show literally. */
export const decodeEntities = (text: string): string =>
  text.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (m, dec, hex, name) => {
    if (!dec && !hex) return ENTITIES[name.toLowerCase()] ?? m;
    const code = dec ? Number(dec) : parseInt(hex, 16);
    return code <= 0x10ffff ? String.fromCodePoint(code) : m;
  });

/** "You are reading a tafsir for the group of verses 112:1 to 112:4" -> "112:1–112:4" */
const passageOf = (groupVerse: string | null): string | undefined => {
  const m = groupVerse?.match(/(\d+:\d+)\s+to\s+(\d+:\d+)/);
  return m ? `${m[1]}–${m[2]}` : undefined;
};

export const fetchVerseTafsirs = (verseKey: string): Promise<VerseTafsirs> =>
  cached(`tafsir:${verseKey}`, async () => {
    const [surah, ayah] = verseKey.split(':');
    const data = await getJson<ApiTafsir>(`https://quranapi.pages.dev/api/tafsir/${surah}_${ayah}.json`);
    const tafsirs: VerseTafsirs['tafsirs'] = {};
    for (const t of data.tafsirs || []) {
      const info = TAFSIRS.find((x) => x.source === 'quranapi' && x.author === t.author);
      if (info?.source === 'quranapi') tafsirs[info.id] = { text: decodeEntities(t.content || ''), passage: passageOf(t.groupVerse) };
    }
    return { verseKey, tafsirs };
  });

export interface TafsirBlock {
  kind: 'heading' | 'text' | 'arabic';
  text: string;
}

const ARABIC_LETTER = /[ء-يٱ-ۓ]/g;
const LATIN_LETTER = /[A-Za-z]/g;

/**
 * Paragraphs of the Markdown text: "#" lines are headings and paragraphs written mostly in Arabic script
 * (a quoted verse or hadith) are set right to left. The texts use no other Markdown than the odd **bold**;
 * their backticks stand for the letter ʿayn (Ka`b), not code.
 */
export const tafsirBlocks = (markdown: string): TafsirBlock[] =>
  markdown
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
    .map<TafsirBlock>((p) => {
      const heading = p.match(/^#{1,6}\s+(.*)$/);
      // A few headings swallow the paragraph after them; show those as text
      if (heading) return { kind: heading[1].length <= 100 ? 'heading' : 'text', text: heading[1] };
      const arabic = (p.match(ARABIC_LETTER) || []).length;
      const latin = (p.match(LATIN_LETTER) || []).length;
      return { kind: arabic > latin * 2 ? 'arabic' : 'text', text: p };
    });

/**
 * Quran.com's HTML as the Markdown that tafsirBlocks reads: headings, paragraphs and list items, with every
 * other tag dropped. Nothing from the API is ever inserted as HTML.
 */
export const htmlToMarkdown = (html: string): string =>
  decodeEntities(
    html
      .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (_, t: string) => `\n\n## ${t.replace(/<[^>]+>/g, '').trim()}\n\n`)
      .replace(/<br\s*\/?>/gi, '\n\n')
      .replace(/<\/?(?:p|div|ul|ol|blockquote)\b[^>]*>/gi, '\n\n')
      .replace(/<li\b[^>]*>/gi, '\n\n• ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/** One verse's commentary in one tafsir, as Markdown, with the passage it covers. */
export interface TafsirText extends VerseTafsir {
  verseKey: string;
  id: TafsirId;
}

const fetchQuranComTafsir = (verseKey: string, resource: number): Promise<VerseTafsir> =>
  cached(`qc-tafsir:${resource}:${verseKey}`, async () => {
    const { tafsir } = await getJson<{ tafsir?: { text?: string; verses?: Record<string, unknown> } }>(
      `${API}/tafsirs/${resource}/by_ayah/${verseKey}`
    );
    const keys = Object.keys(tafsir?.verses ?? {});
    return {
      text: htmlToMarkdown(tafsir?.text ?? ''),
      passage: keys.length > 1 ? `${keys[0]}–${keys[keys.length - 1]}` : undefined
    };
  });

export const loadTafsir = async (verseKey: string, id: TafsirId): Promise<TafsirText> => {
  const info = TAFSIRS.find((t) => t.id === id)!;
  const found =
    info.source === 'quranCom'
      ? await fetchQuranComTafsir(verseKey, info.resource)
      : (await fetchVerseTafsirs(verseKey)).tafsirs[info.id];
  return { verseKey, id, text: found?.text ?? '', passage: found?.passage };
};
