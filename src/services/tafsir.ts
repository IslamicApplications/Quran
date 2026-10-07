/**
 * Tafsir from the Quran API (https://quranapi.pages.dev/getting-started/get-tafsir), which takes its texts
 * from Quran.com. One request per verse returns all three commentaries as Markdown.
 */
import { cached, getJson } from './quranCom';

export const TAFSIRS = [
  { id: 'ibn_kathir', label: 'Ibn Kathir', name: 'Tafsir Ibn Kathir (abridged)', author: 'Ibn Kathir' },
  { id: 'maarif', label: 'Maʿarif al-Qurʾan', name: 'Maʿarif al-Qurʾan', author: 'Maarif Ul Quran' },
  { id: 'tazkirul', label: 'Tazkirul Quran', name: 'Tazkirul Quran', author: 'Tazkirul Quran' }
] as const;

export type TafsirId = (typeof TAFSIRS)[number]['id'];

export interface VerseTafsir {
  text: string;
  /** "112:1–112:4" when the commentary covers a passage rather than this verse alone */
  passage?: string;
}

export interface VerseTafsirs {
  verseKey: string;
  tafsirs: Partial<Record<TafsirId, VerseTafsir>>;
}

interface ApiTafsir {
  tafsirs?: { author: string; groupVerse: string | null; content: string }[];
}

const ENTITIES: Record<string, string> = {
  nbsp: ' ', amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', hellip: '…'
};

/** Some texts carry HTML entities ("Prophet&nbsp;ﷺ"), which would otherwise show literally. */
const decodeEntities = (text: string): string =>
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
      const info = TAFSIRS.find((x) => x.author === t.author);
      if (info) tafsirs[info.id] = { text: decodeEntities(t.content || ''), passage: passageOf(t.groupVerse) };
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
