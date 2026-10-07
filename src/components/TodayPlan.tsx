import React, { useMemo } from 'react';
import { CalendarCheck, Layers, Target, BookOpenText } from 'lucide-react';
import { SURAH_LIST } from '../data/surahList';
import { getCoverageList, getSurahVocab, surahCoverage } from '../services/quranCom';
import { useKnownLemmas } from '../hooks/useKnownLemmas';
import { buildStages } from './courseWords';
import { useAsync } from './QuranWordBits';
import { t } from '../i18n/strings';
import { ReadingPlanCard } from './ReadingPlanCard';

interface TodayPlanProps {
  dueReviewCount: number;
  onReview: () => void;
  onLearnCourseWords: () => void;
  onStudySurah: (surah: number) => void;
  onReadSurah: (surah: number) => void;
  onOpenPage: (page: number) => void;
}

const loadPlanData = async () => {
  const [course, vocab] = await Promise.all([getCoverageList(), getSurahVocab()]);
  return { stages: buildStages(course.words, course.totalWords), vocab };
};

/**
 * Three next steps for today: the reviews that are due, the next words of the 85% Course, and the surah the
 * learner is closest to understanding in full (short surahs count, since any word left is a word to learn).
 */
export const TodayPlan: React.FC<TodayPlanProps> = ({ dueReviewCount, onReview, onLearnCourseWords, onStudySurah, onReadSurah, onOpenPage }) => {
  const { data, error } = useAsync(loadPlanData, []);
  const known = useKnownLemmas();

  const plan = useMemo(() => {
    if (!data) return undefined;
    const stage = data.stages.find((s) => s.words.some((w) => !known.has(w.lemma)));
    const stageLeft = stage ? stage.words.filter((w) => !known.has(w.lemma)).length : 0;
    // The surah with the highest share of its text understood that still has words left
    let best: { surah: number; pct: number; left: number } | undefined;
    data.vocab.forEach((v, i) => {
      const pct = surahCoverage(v, known);
      const left = v.lemmas.filter(([lemma]) => !known.has(lemma)).length;
      if (left > 0 && (!best || pct > best.pct)) best = { surah: i + 1, pct, left };
    });
    return { stage, stageLeft, surah: best };
  }, [data, known]);

  const row = 'flex flex-wrap items-center justify-between gap-3 py-3';
  const action =
    'shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer';
  const quiet =
    'shrink-0 inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer';

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <CalendarCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-300" /> {t('todaysPlan')}
      </h2>
      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        <ReadingPlanCard onOpenPage={onOpenPage} />
        <div className={row}>
          <p className="text-sm text-stone-700 dark:text-stone-300 min-w-0">
            {t('dueLine')(dueReviewCount)}
            {dueReviewCount === 0 && <span className="text-stone-500 dark:text-stone-400"> · {t('upToDate')}</span>}
          </p>
          {dueReviewCount > 0 && (
            <button onClick={onReview} className={action}>
              <Layers className="w-3.5 h-3.5" /> {t('reviewNow')}
            </button>
          )}
        </div>

        {/* Without the word lists (offline on a first visit) only the reviews can be planned */}
        {!(error && !plan) && (
        <div className={row}>
          <p className="text-sm text-stone-700 dark:text-stone-300 min-w-0">
            {!plan ? (
              <span className="text-stone-400">Finding your next course words…</span>
            ) : plan.stage ? (
              t('courseLine')(plan.stage.index + 1, plan.stageLeft)
            ) : (
              t('courseDone')
            )}
          </p>
          {plan?.stage && (
            <button onClick={onLearnCourseWords} className={dueReviewCount > 0 ? quiet : action}>
              <Target className="w-3.5 h-3.5" /> {t('learnNewWords')}
            </button>
          )}
        </div>
        )}

        {plan?.surah && (
          <div className={row}>
            <p className="text-sm text-stone-700 dark:text-stone-300 min-w-0">
              {t('closestLine')(SURAH_LIST[plan.surah.surah - 1].nameTransliteration, Math.round(plan.surah.pct * 100), plan.surah.left)}
            </p>
            <span className="flex gap-2">
              <button onClick={() => onStudySurah(plan.surah!.surah)} className={quiet}>
                <Layers className="w-3.5 h-3.5" /> {t('studyItsWords')}
              </button>
              <button onClick={() => onReadSurah(plan.surah!.surah)} className={quiet}>
                <BookOpenText className="w-3.5 h-3.5" /> {t('readIt')}
              </button>
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
