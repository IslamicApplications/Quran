/** Every word of a surah as the course's word records, shared by the surah word list and its flashcard deck. */
import { cached, getCoverageList, getSurahMorphology, getSurahVocab, parseMorph, CoverageWord, SurahVocab } from './quranCom';

export interface SurahWords {
  surah: number;
  summary: SurahVocab;
  /** Most frequent in the surah first */
  words: CoverageWord[];
}

/**
 * Occurrences of each lemma across the whole Quran, counted the way the 85% Course counts them: course words
 * include attached prefixes (ب in بِٱللَّهِ), other words their occurrences as words of their own.
 */
const quranAppearances = (): Promise<Map<string, number>> =>
  cached('quran-appearances', async () => {
    const [vocab, course] = await Promise.all([getSurahVocab(), getCoverageList()]);
    const totals = new Map<string, number>();
    for (const s of vocab) for (const [lemma, n] of s.lemmas) totals.set(lemma, (totals.get(lemma) || 0) + n);
    for (const w of course.words) totals.set(w.lemma, w.appearances);
    return totals;
  });

export const loadSurahWords = (surah: number): Promise<SurahWords> =>
  cached(`surah-words:${surah}`, async () => {
    const [vocab, morph, appearances] = await Promise.all([getSurahVocab(), getSurahMorphology(surah), quranAppearances()]);
    // Each lemma's first occurrence in the surah gives its root, word type and the verse its meaning comes from
    const first = new Map<string, { sample: string; root?: string; tag?: string; verbForm?: string }>();
    morph.forEach((ayah, a) =>
      ayah.forEach((entry, w) => {
        const m = parseMorph(entry);
        if (m.lemma && !first.has(m.lemma)) first.set(m.lemma, { ...m, sample: `${surah}:${a + 1}:${w + 1}` });
      })
    );
    const words = vocab[surah - 1].lemmas.flatMap(([lemma, n], i) => {
      const f = first.get(lemma);
      if (!f) return [];
      const word: CoverageWord = {
        rank: i + 1, // within the surah; the card shows the surah count in its place
        lemma,
        root: f.root,
        tag: f.tag,
        verbForm: f.verbForm,
        count: n,
        appearances: Math.max(appearances.get(lemma) || 0, n),
        sample: f.sample
      };
      return [word];
    });
    return { surah, summary: vocab[surah - 1], words };
  });
