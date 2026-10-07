import React, { useState } from 'react';
import { Compass, BookOpen, X } from 'lucide-react';
import { CROSS_VERSE_COMPARISONS } from '../data/crossVerseComparisons';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface WordComparisonModalProps {
  initialWordId?: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const WordComparisonModal: React.FC<WordComparisonModalProps> = ({
  initialWordId,
  onClose,
  isModal = false
}) => {
  const [selectedComparisonId, setSelectedComparisonId] = useState<string>(
    initialWordId && CROSS_VERSE_COMPARISONS.some(c => c.id.includes(initialWordId))
      ? CROSS_VERSE_COMPARISONS.find(c => c.id.includes(initialWordId))!.id
      : CROSS_VERSE_COMPARISONS[0].id
  );

  useModalBehavior(isModal, onClose);

  const currentComparison =
    CROSS_VERSE_COMPARISONS.find((c) => c.id === selectedComparisonId) ||
    CROSS_VERSE_COMPARISONS[0];

  const content = (
    <div className="space-y-6">
      {/* Selector of comparative words */}
      <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 shrink-0 me-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
          <span>Select Word Study:</span>
        </span>
        {CROSS_VERSE_COMPARISONS.map((comp) => {
          const isSelected = selectedComparisonId === comp.id;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedComparisonId(comp.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white font-bold shadow-xs dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span className="font-quran-amiri font-bold text-sm me-1.5">{comp.wordArabic}</span>
              <span>({comp.transliteration})</span>
            </button>
          );
        })}
      </div>

      {/* Overview Card */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl p-5 border border-amber-200/80 dark:border-amber-900/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100">
              {currentComparison.wordArabic}
            </h2>
            <div>
              <span className="text-base font-bold text-stone-800 dark:text-stone-200 block">
                {currentComparison.transliteration}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400">Root: {currentComparison.rootArabic}</span>
            </div>
          </div>
          <span className="text-xs bg-amber-200/80 dark:bg-amber-900/70 text-amber-950 dark:text-amber-100 px-2.5 py-1 rounded-lg font-semibold">
            {currentComparison.verses.length} Contextual Usages
          </span>
        </div>

        <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100 pt-1">
          {currentComparison.theme}
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
          {currentComparison.summary}
        </p>
      </div>

      {/* Verses Grid Comparison */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
          <span>Cross-Verse Context Analysis</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentComparison.verses.map((v, idx) => (
            <div
              key={idx}
              className="card p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header: Meaning in this Verse */}
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/25 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    Meaning: {v.meaningInThisVerse}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                    Surah {v.surahNameEnglish} ({v.surahNumber}:{v.ayahNumber})
                  </span>
                </div>

                {/* Arabic text */}
                <div className="verse-panel p-3.5 rounded-xl">
                  <p className="font-quran-amiri text-xl arabic-text text-right text-amber-100 leading-relaxed">
                    {v.verseArabic}
                  </p>
                </div>

                {/* Translation */}
                <p className="text-xs text-stone-700 dark:text-stone-300 italic">
                  "{v.translation}" <span className="text-stone-400">({v.translationAttribution})</span>
                </p>

                {/* Scholarly reasoning */}
                <div className="bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1">
                  <strong className="text-emerald-950 dark:text-emerald-100 text-[11px] block">Scholarly Exegesis:</strong>
                  <p className="leading-relaxed">{v.scholarlyReasoning}</p>
                </div>
              </div>

              {/* Source attribution */}
              <div className="text-[11px] text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>Source: {v.tafsirSource}</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-stone-950/50 backdrop-blur-sm animate-fadeIn z-[60] flex items-center justify-center p-4 overflow-y-auto">
        <div role="dialog" aria-modal="true" aria-label="Cross-verse nuance comparisons" className="bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200">Cross-Verse Nuance Comparisons</h2>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto card p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-4">
        <Compass className="w-6 h-6 text-emerald-800 dark:text-emerald-300" />
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Cross-Verse Semantic Comparisons</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Explore how identical Arabic words take nuanced meanings across different Quranic contexts.
          </p>
        </div>
      </div>
      {content}
    </div>
  );
};
