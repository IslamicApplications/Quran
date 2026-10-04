import React, { useState } from 'react';
import { GitBranch, Sparkles, BookOpen, Layers, ArrowRight, Compass } from 'lucide-react';
import { QURANIC_ONTOLOGY, QuranConcept } from '../data/corpusData';

export const QuranOntologyViewer: React.FC = () => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(QURANIC_ONTOLOGY[0].id);

  const activeConcept: QuranConcept =
    QURANIC_ONTOLOGY.find((c) => c.id === selectedConceptId) || QURANIC_ONTOLOGY[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Ontology of Quranic Concepts</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Knowledge representation linking theological doctrines, moral ethics, and sacred entities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Concepts List + Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Concept Selector Sidebar */}
        <div className="card p-4 space-y-2 h-fit">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 px-2 block">
            Ontological Concepts
          </span>

          <div className="space-y-1.5">
            {QURANIC_ONTOLOGY.map((c) => {
              const isSelected = activeConcept.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConceptId(c.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-900 text-white font-bold shadow-xs'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="font-semibold text-xs leading-snug">{c.titleEnglish}</div>
                  <div className={`font-quran-amiri text-sm mt-0.5 ${isSelected ? 'text-amber-200' : 'text-purple-900 dark:text-purple-200'}`}>
                    {c.titleArabic}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Concept Details Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 sm:p-8 space-y-6">
            <div className="bg-purple-50/70 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200/80 dark:border-purple-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-quran-amiri text-2xl font-bold text-purple-950 dark:text-purple-100">
                  {activeConcept.titleArabic}
                </span>
                <span className="text-xs bg-purple-200 dark:bg-purple-800/50 text-purple-950 dark:text-purple-100 px-2.5 py-0.5 rounded-full font-semibold uppercase">
                  {activeConcept.category.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">{activeConcept.titleEnglish}</h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                {activeConcept.description}
              </p>
            </div>

            {/* Associated Roots */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Connected Triliteral Roots
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {activeConcept.associatedRoots.map((r, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-3 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200"
                  >
                    Root: <strong className="font-quran-amiri text-sm font-bold text-emerald-900 dark:text-emerald-200">{r}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Quranic Verses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                <span>Foundational Quranic Verses</span>
              </h4>

              <div className="space-y-3">
                {activeConcept.keyVerses.map((v, vIdx) => (
                  <div
                    key={vIdx}
                    className="verse-panel p-4 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-300">
                      <span>Surah {v.surahName} ({v.surah}:{v.ayah})</span>
                    </div>
                    <p className="font-quran-amiri text-xl text-amber-100 arabic-text text-right leading-relaxed">
                      {v.arabic}
                    </p>
                    <p className="text-xs text-emerald-100 italic pt-1 border-t border-emerald-800/60">
                      "{v.translation}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
