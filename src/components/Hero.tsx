import React from 'react';
import { ArrowRight, Target, Layers } from 'lucide-react';

interface HeroProps {
  totalWords: number;
  dueReviewCount: number;
  savedCount: number;
  streak: number;
  onStartReview: () => void;
  onOpenCourse: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalWords,
  dueReviewCount,
  savedCount,
  streak,
  onStartReview,
  onOpenCourse
}) => {
  const stats = [
    { label: 'Verified words', value: totalWords },
    { label: 'Due today', value: dueReviewCount },
    { label: 'Saved', value: savedCount },
    { label: 'Day streak', value: streak }
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl hero-surface shadow-xl shadow-emerald-950/10">
      <div className="absolute inset-0 geo-pattern" aria-hidden />
      <div
        className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 font-quran-amiri text-[9rem] sm:text-[12rem] leading-none text-white/[0.06] select-none pointer-events-none hidden sm:block"
        aria-hidden
      >
        اقْرَأْ
      </div>

      <div className="relative p-6 sm:p-10 space-y-6">
        <div className="space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-[11px] font-semibold text-emerald-100 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Medina Mushaf · Hafs ʿan ʿĀṣim
          </span>
          <h1 className="text-3xl sm:text-[2.6rem] font-extrabold tracking-tight leading-[1.1] text-balance">
            Understand the words of the Quran,{' '}
            <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              in context.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-xl">
            Learn each word through its root, its morphology, and the verse it lives in — then lock it in with
            spaced repetition.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onStartReview}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-900/20 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            {dueReviewCount > 0 ? `Review ${dueReviewCount} due` : 'Practice flashcards'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenCourse}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 ring-1 ring-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold backdrop-blur transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4 text-amber-300" />
            The 85% Course
          </button>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/10 ring-1 ring-white/10 max-w-2xl">
          {stats.map((s) => (
            <div key={s.label} className="bg-emerald-950/40 backdrop-blur px-4 py-3">
              <dt className="text-[11px] font-medium text-emerald-200/80">{s.label}</dt>
              <dd className="text-xl font-bold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
