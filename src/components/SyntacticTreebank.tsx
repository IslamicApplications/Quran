import React, { useState } from 'react';
import { Network, Sparkles, BookOpen, Layers, ArrowRight, Info } from 'lucide-react';
import { VERSE_TREEBANKS, VerseTreebank } from '../data/corpusData';

export const SyntacticTreebank: React.FC = () => {
  const [selectedVerseIndex, setSelectedVerseIndex] = useState<number>(0);

  const currentVerse: VerseTreebank = VERSE_TREEBANKS[selectedVerseIndex] || VERSE_TREEBANKS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Syntactic Dependency Treebank (QADT)</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Grammatical dependency graphs linking Arabic words through syntactic graph theory.
            </p>
          </div>
        </div>

        {/* Verse Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">Select Ayah:</span>
          <select
            value={selectedVerseIndex}
            onChange={(e) => setSelectedVerseIndex(parseInt(e.target.value, 10))}
            className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
          >
            {VERSE_TREEBANKS.map((v, idx) => (
              <option key={idx} value={idx}>
                {v.surahNameEnglish} {v.surahNumber}:{v.ayahNumber} ({v.surahNameArabic})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dependency Graph Viewer Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        {/* Full Verse Header */}
        <div className="verse-panel rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300">
            <span>Surah {currentVerse.surahNameEnglish} ({currentVerse.surahNumber}:{currentVerse.ayahNumber})</span>
            <span className="font-quran-amiri text-base">{currentVerse.surahNameArabic}</span>
          </div>
          <p className="font-quran-amiri text-2xl sm:text-3xl arabic-text text-right text-amber-100">
            {currentVerse.arabicVerseText}
          </p>
        </div>

        {/* Visual Graph Diagram */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>Syntactic Dependency Relations (روابط الإعراب):</span>
          </h3>

          <div className="space-y-3">
            {currentVerse.dependencies.map((dep, idx) => {
              const sourceToken = currentVerse.tokens.find((t) => t.location === dep.sourceId);
              const targetToken = currentVerse.tokens.find((t) => t.location === dep.targetId);

              return (
                <div
                  key={idx}
                  className="bg-amber-50/40 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-600/40 transition-all"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Source Word */}
                    <div className="bg-white dark:bg-stone-900 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-center shadow-xs">
                      <div className="font-quran-amiri text-xl font-bold text-emerald-950 dark:text-emerald-100">
                        {sourceToken?.arabicText}
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                        ({dep.sourceId}) {sourceToken?.transliteration}
                      </span>
                    </div>

                    {/* Dependency Link Arrow & Tag */}
                    <div className="flex flex-col items-center px-2">
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700 mb-1">
                        {dep.dependencyTypeEnglish}
                      </span>
                      <div className="flex items-center text-emerald-700 dark:text-emerald-300">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-quran-amiri text-stone-600 dark:text-stone-400 font-semibold mt-0.5">
                        {dep.dependencyTypeArabic}
                      </span>
                    </div>

                    {/* Target Word */}
                    <div className="bg-white dark:bg-stone-900 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-center shadow-xs">
                      <div className="font-quran-amiri text-xl font-bold text-emerald-950 dark:text-emerald-100">
                        {targetToken?.arabicText}
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block">
                        ({dep.targetId}) {targetToken?.transliteration}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-500 dark:text-stone-400 max-w-xs text-left sm:text-right">
                    <span className="font-semibold text-stone-700 dark:text-stone-300 block">Grammatical Function:</span>
                    <span>{dep.dependencyTypeEnglish}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Treebank Academic Explanation */}
        <div className="bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-1.5 leading-relaxed">
          <strong className="text-stone-900 dark:text-stone-100 font-bold block flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            <span>About Quranic Dependency Graphs (QADT):</span>
          </strong>
          <p>
            In traditional Arabic grammar (*I'rāb*), words govern and depend upon other words through structural governance (*'Amal*). The Quranic Arabic Corpus visualizes these classical relations as mathematical directed dependency trees, enabling students to see how words combine into complete propositions.
          </p>
        </div>
      </div>
    </div>
  );
};
