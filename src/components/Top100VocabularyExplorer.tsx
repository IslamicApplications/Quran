import React, { useState } from 'react';
import {
  Flame,
  BookOpen,
  Sparkles,
  Layers,
  GraduationCap,
  Info,
  ChevronRight,
  Filter,
  CheckCircle2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import {
  HIGH_FREQUENCY_100_WORDS,
  E_ARABIC_CATEGORIES,
  HighFrequencyWord
} from '../data/highFrequencyVocab';
import { ALL_VERIFIED_WORDS } from '../data/quranVocab';
import { normalizeArabic } from '../services/quranApi';
import { QuranWord } from '../types';

const stripArticle = (text: string) => normalizeArabic(text).replace(/^ال/, '');

// The Dictionary's written lesson for this exact word, if there is one
const findDictionaryLesson = (word: HighFrequencyWord): QuranWord | undefined => {
  const target = stripArticle(word.arabic);
  return ALL_VERIFIED_WORDS.find((w) => stripArticle(w.arabic) === target);
};

/** "ر ح م" -> "رحم", the Root Dictionary's key (roots here come from the corpus data). */
const rootKey = (root?: string) => (root || '').replace(/\s+/g, '');

interface Top100VocabularyExplorerProps {
  onSelectWord?: (wordId: string) => void;
  onOpenRoot?: (root: string) => void;
  onOpenVerse?: (verseKey: string) => void;
  onOpenPracticeWithCategory?: (categoryId: number) => void;
}

const linkClass =
  'text-xs text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 font-bold flex items-center gap-1 cursor-pointer shrink-0';

export const Top100VocabularyExplorer: React.FC<Top100VocabularyExplorerProps> = ({
  onSelectWord,
  onOpenRoot,
  onOpenVerse,
  onOpenPracticeWithCategory
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0); // 0 = all
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedWord, setSelectedWord] = useState<HighFrequencyWord | null>(null);

  const filteredWords = HIGH_FREQUENCY_100_WORDS.filter((w) => {
    const matchesCat = selectedCategoryId === 0 || w.categoryNumber === selectedCategoryId;
    const q = searchFilter.trim().toLowerCase();
    const matchesQuery =
      !q ||
      w.arabic.includes(q) ||
      w.transliteration.toLowerCase().includes(q) ||
      w.englishMeaning.toLowerCase().includes(q) ||
      (w.rootArabic && w.rootArabic.includes(q));

    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 70% Quran Coverage Banner */}
      <div className="hero-surface text-amber-50 rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>High-Yield Quranic Vocabulary Track</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              The 100 Most Common Quranic Words
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
              Curated by <em>eArabicLearning</em> and verified via the <em>Quranic Arabic Corpus</em>. These top word-forms account for roughly <strong>50% to 70%</strong> of the Quran’s total word count (~77,430 words).
            </p>
          </div>

          <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-700/80 text-center shrink-0 min-w-[140px]">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 block">70%</span>
            <span className="text-[11px] text-emerald-300 font-medium">Text Coverage</span>
          </div>
        </div>

        {/* 8-Category Progress Indicators */}
        <div className="pt-2 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-400 block text-[10px] uppercase">100 WORDS</span>
            <span className="font-bold text-white">~50% of Quran</span>
          </div>
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-400 block text-[10px] uppercase">300 WORDS</span>
            <span className="font-bold text-white">~70–80% of Quran</span>
          </div>
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-400 block text-[10px] uppercase">ROOT SYSTEM</span>
            <span className="font-bold text-white">Triliteral Families</span>
          </div>
          <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/60">
            <span className="text-emerald-400 block text-[10px] uppercase">METHODOLOGY</span>
            <span className="font-bold text-white">Spaced Repetition (SRS)</span>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>Select Curriculum Category (8 Pedagogical Groups):</span>
          </span>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter words..."
            className="px-3 py-1.5 bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 w-full sm:w-48"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategoryId(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryId === 0
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
            }`}
          >
            All 100 Words
          </button>

          {E_ARABIC_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span>{cat.nameEnglish}</span>
                <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-950 text-amber-300' : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Word Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => {
          const isSelected = selectedWord?.id === word.id;
          return (
            <div
              key={word.id}
              onClick={() => setSelectedWord(word)}
              className={`bg-white dark:bg-stone-900 rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md bg-amber-50/20 dark:bg-amber-950/20'
                  : 'border-stone-200 dark:border-stone-700 hover:border-emerald-700/40 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-md">
                    Cat {word.categoryNumber}: {word.categoryNameArabic}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/25 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {word.frequency}× in Quran
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <div className="font-quran-amiri text-3xl font-bold text-emerald-950 dark:text-emerald-100">
                    {word.arabic}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                      {word.transliteration}
                    </span>
                    {word.rootArabic && (
                      <span className="text-[10px] text-stone-400">
                        Root: {word.rootArabic}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs font-medium text-stone-800 dark:text-stone-200 leading-snug">
                  {word.englishMeaning}
                </p>
              </div>

              {/* Teacher Note Excerpt */}
              {word.teacherNote && (
                <div className="bg-amber-50/70 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-950 dark:text-amber-100 space-y-1">
                  <strong className="block text-[10px] text-amber-900 dark:text-amber-200 uppercase font-bold">
                    Teacher's Insight:
                  </strong>
                  <p className="line-clamp-2 leading-relaxed">{word.teacherNote}</p>
                </div>
              )}

              {/* Sample Verse Preview */}
              <div className="verse-panel p-2.5 rounded-xl text-[11px] space-y-1">
                <div className="flex items-center justify-between text-emerald-300 text-[10px]">
                  <span>Surah ({word.sampleVerseLocation})</span>
                  <span>Sample Usage</span>
                </div>
                <p className="font-quran-amiri text-sm text-amber-100 arabic-text text-right leading-relaxed">
                  {word.sampleVerseArabic}
                </p>
                <p className="text-emerald-200 italic text-[10px] line-clamp-1">
                  "{word.sampleVerseTranslation}"
                </p>
              </div>

              {/* Every word opens its root in the Root Dictionary and its sample verse word by word */}
              {(() => {
                const lesson = findDictionaryLesson(word);
                const root = rootKey(word.rootArabic);
                const open = (action: () => void) => (e: React.MouseEvent) => {
                  e.stopPropagation();
                  action();
                };
                return (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {onSelectWord && lesson && (
                      <button onClick={open(() => onSelectWord(lesson.id))} className={linkClass}>
                        <span>Full lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onOpenRoot && root && (
                      <button onClick={open(() => onOpenRoot(root))} className={linkClass}>
                        <span>
                          Root <span className="font-quran-amiri text-sm">{word.rootArabic}</span>
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onOpenVerse && (
                      <button onClick={open(() => onOpenVerse(word.sampleVerseLocation))} className={linkClass}>
                        <span>Verse {word.sampleVerseLocation} word by word</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
};
