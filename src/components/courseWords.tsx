import React from 'react';
import { CoverageWord, romanVerbForm, tagGroup } from '../services/quranCom';
import { sameSpokenForm } from '../services/arabicForm';
import { functionWordMeaning, vocabularyGloss } from '../data/functionWordMeanings';

/** The 85% Course's stages and how a course word is shown, shared by the course and its flashcards. */

export const MILESTONES = [
  { percent: 50, title: 'Foundations', blurb: 'The particles, pronouns and names that appear in almost every verse.' },
  { percent: 70, title: 'Core vocabulary', blurb: 'The most common verbs and nouns of the Quran’s message.' },
  { percent: 80, title: 'Building fluency', blurb: 'Words that recur across many surahs and stories.' },
  { percent: 85, title: 'Wide reading', blurb: 'Rounding out vocabulary for comfortable reading.' }
];

export interface Stage {
  index: number;
  percent: number;
  title: string;
  blurb: string;
  words: CoverageWord[];
}

export const buildStages = (words: CoverageWord[], totalWords: number): Stage[] => {
  const stages: Stage[] = [];
  let cumulative = 0;
  let start = 0;
  let m = 0;
  words.forEach((w, i) => {
    cumulative += w.count;
    if (m < MILESTONES.length && (cumulative / totalWords) * 100 >= MILESTONES[m].percent) {
      stages.push({ index: m, ...MILESTONES[m], words: words.slice(start, i + 1) });
      start = i + 1;
      m += 1;
    }
  });
  if (start < words.length) stages[stages.length - 1].words.push(...words.slice(start));
  return stages;
};

// Verbs are listed by dictionary form, so tense from the sample occurrence would mislead; show "Verb · Form N".
/** Function words get their dictionary meaning; a verse gloss would describe only that verse (ب in بِى: "in Me"). */
export const meaningOf = (word: CoverageWord, verseGloss?: string) =>
  functionWordMeaning(word.lemma) ?? (verseGloss ? vocabularyGloss(verseGloss) : undefined);

/**
 * What a card shows, built from the sample occurrence so the word on screen is the word in the recording.
 * Some dictionary forms never occur alone (ب is always attached, as in بِى) or only in other forms
 * (مَشَى as يَمْشِى); then the card shows the recited form with its meaning and names the dictionary form.
 */
export const spokenView = (word: CoverageWord, sample: { arabic: string; translation: string } | undefined, failed: boolean) => {
  // Quranic pause and prostration signs belong to the verse, not the word
  const heard = sample?.arabic.replace(/[\u06D6-\u06DC\u06DE\u06E9]/g, '').trim();
  const differs = !!heard && !sameSpokenForm(heard, word.lemma);
  return {
    arabic: heard || (failed ? word.lemma : undefined),
    differs,
    meaning: differs ? vocabularyGloss(sample!.translation) : meaningOf(word, sample?.translation) ?? (failed ? '' : undefined),
    dictionaryMeaning: differs ? functionWordMeaning(word.lemma) : undefined
  };
};

/** "from ب", naming the dictionary form a recited form belongs to. */
export const DictionaryForm: React.FC<{ lemma: string; className?: string }> = ({ lemma, className = '' }) => (
  <div className={`text-[11px] text-stone-500 dark:text-stone-400 ${className}`} title="Dictionary form: marking it known covers every form of the word">
    from{' '}
    <span className="font-quran-amiri text-base font-bold text-stone-700 dark:text-stone-300" dir="rtl">
      {lemma}
    </span>
  </div>
);

export const wordTypeLabel = (w: CoverageWord) =>
  tagGroup(w.tag) === 'verb' ? `Verb${w.verbForm ? ` · Form ${romanVerbForm(w.verbForm)}` : ''}` : '';

/** Flashcard deck that opens on the first course stage with words left to study. */
export const NEXT_COURSE_DECK = 'course-next';

/** Flashcard progress for a course word is stored under this id, apart from the detailed lessons' ids. */
export const courseCardId = (lemma: string) => `course:${lemma}`;
