/**
 * A surah's introduction (name, period of revelation, themes) from Quran.com, which takes it from Tarteel's
 * Quranic Universal Library. Written by Sayyid Abul Ala Maududi (Tafhim al-Qur'an), in English, Indonesian and
 * Urdu; other languages read the English.
 */
import { API, cached, contentLanguage, getJson } from './quranCom';
import { htmlToMarkdown, tafsirBlocks, type TafsirBlock } from './tafsir';

const INFO_LANGUAGES = ['en', 'id', 'ur'];

export interface SurahInfo {
  surah: number;
  source: string;
  summary: string;
  blocks: TafsirBlock[];
  rtl: boolean;
}

export const fetchSurahInfo = (surah: number): Promise<SurahInfo> => {
  const language = INFO_LANGUAGES.includes(contentLanguage()) ? contentLanguage() : 'en';
  return cached(`surah-info:${language}:${surah}`, async () => {
    const { chapter_info: info } = await getJson<{
      chapter_info: { short_text: string | null; source: string; text: string };
    }>(`${API}/chapters/${surah}/info?language=${language}`);
    const blocks = tafsirBlocks(htmlToMarkdown(info.text || ''));
    return {
      surah,
      source: info.source,
      summary: info.short_text?.trim() || blocks.find((b) => b.kind === 'text')?.text || '',
      blocks,
      rtl: language === 'ur'
    };
  });
};
