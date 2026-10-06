import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  Layers,
  BookOpen,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { UserProgress, QuranWord } from '../types';
import { getTodayDateString, isDueForReview } from '../services/storage';
import { getCoverageList } from '../services/quranCom';
import { useAsync } from './QuranWordBits';

interface ProgressDashboardProps {
  progressMap: Record<string, UserProgress>;
  allWords: QuranWord[];
  streak: number;
  onStartDueReview: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progressMap,
  allWords,
  streak,
  onStartDueReview
}) => {
  const today = getTodayDateString();

  // Lesson words and 85% Course words share the review schedule, so count both
  const courseWordCount = useAsync(getCoverageList, []).data?.words.length ?? 0;
  const progressList = Object.values(progressMap);
  const wordsStudiedCount = progressList.length;
  const totalWords = Math.max(allWords.length + courseWordCount, wordsStudiedCount, 1);

  const masteredCount = progressList.filter((p) => p.status === 'mastered').length;
  const reviewingCount = progressList.filter((p) => p.status === 'reviewing').length;
  const learningCount = progressList.filter((p) => p.status === 'learning').length;
  const newCount = totalWords - wordsStudiedCount;

  const dueCount = progressList.filter((p) => isDueForReview(p, today)).length;

  // Calculate total reviews performed
  let totalReviewsDone = 0;
  let totalCorrect = 0;
  progressList.forEach((p) => {
    p.history.forEach((h) => {
      totalReviewsDone++;
      if (h.wasCorrect) totalCorrect++;
    });
  });

  const overallAccuracy = totalReviewsDone > 0 ? Math.round((totalCorrect / totalReviewsDone) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Spaced Repetition &amp; Study Progress</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              SM-2 interval scheduling tracking your retention and daily review milestones.
            </p>
          </div>
        </div>

        {dueCount > 0 && (
          <button
            onClick={onStartDueReview}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>Start Due Review ({dueCount} Words)</span>
          </button>
        )}
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 block">WORDS STUDIED</span>
          <div className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-200">
            {wordsStudiedCount}{' '}
            <span className="text-xs text-stone-400 font-normal">/ {totalWords}</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
            {Math.round((wordsStudiedCount / totalWords) * 100)}% of vocabulary explored
          </span>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 block">DUE FOR REVIEW</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{dueCount}</div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">Scheduled for today</span>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 block">DAILY STREAK</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
            <Award className="w-6 h-6 text-amber-500" />
            <span>{streak}d</span>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">Consecutive study days</span>
        </div>

        <div className="card p-5 space-y-1">
          <span className="text-xs font-semibold text-stone-400 block">RECALL ACCURACY</span>
          <div className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-200">{overallAccuracy}%</div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">Across {totalReviewsDone} reviews</span>
        </div>
      </div>

      {/* Mastery Breakdown Bar */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
          <span>Vocabulary Retention Stages</span>
        </h3>

        {/* Progress Bar Segmented */}
        <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(masteredCount / totalWords) * 100}%` }}
            className="bg-emerald-600 h-full"
            title={`Mastered: ${masteredCount}`}
          />
          <div
            style={{ width: `${(reviewingCount / totalWords) * 100}%` }}
            className="bg-sky-500 h-full"
            title={`Reviewing: ${reviewingCount}`}
          />
          <div
            style={{ width: `${(learningCount / totalWords) * 100}%` }}
            className="bg-amber-400 h-full"
            title={`Learning: ${learningCount}`}
          />
          <div
            style={{ width: `${(newCount / totalWords) * 100}%` }}
            className="bg-stone-200 dark:bg-stone-700 h-full"
            title={`Unstudied / New: ${newCount}`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
            <span className="text-stone-700 dark:text-stone-300 font-medium">Mastered ({masteredCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 shrink-0" />
            <span className="text-stone-700 dark:text-stone-300 font-medium">Reviewing ({reviewingCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
            <span className="text-stone-700 dark:text-stone-300 font-medium">Learning ({learningCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-stone-300 dark:bg-stone-600 shrink-0" />
            <span className="text-stone-500 dark:text-stone-400">Unstudied ({newCount})</span>
          </div>
        </div>
      </div>

      {/* Mandatory Scholarly & Educational Humility Banner */}
      <div className="bg-amber-50/80 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/60 text-xs sm:text-sm text-amber-950 dark:text-amber-100 space-y-2">
        <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-300 shrink-0" />
          <span>Educational Humility &amp; Quranic Reflection</span>
        </div>
        <p className="leading-relaxed text-stone-700 dark:text-stone-300">
          Viewing or rating a lesson does <strong>not</strong> prove spiritual or linguistic mastery of the Holy Quran. These tracking metrics are simply psychological aids to encourage daily engagement with vocabulary. True appreciation of Quranic revelation comes through continuous recitation, righteous action, contemplation (Tadabbur), and seeking guidance from qualified teachers of Tafsir and Arabic.
        </p>
      </div>
    </div>
  );
};
