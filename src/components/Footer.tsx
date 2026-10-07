import React from 'react';
import { BrandMark } from './Header';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200/80 dark:border-stone-700/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand and Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <BrandMark size="sm" />
              <span className="font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">Ayah Words</span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              An educational companion for Quranic Arabic vocabulary, root morphology, and contextual verse meanings.
            </p>
          </div>

          {/* Educational Disclaimer */}
          <div className="space-y-2 rounded-2xl bg-white dark:bg-stone-900 p-4 ring-1 ring-stone-200/80 dark:ring-stone-700/80">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-700 dark:text-amber-300">Scholarly notice</h4>
            <p className="text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed">
              Explanations are for vocabulary study and do not replace qualified scholarship, formal Tafsir, or Tajwid
              instruction under certified teachers.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/80 dark:border-stone-700/80 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Ayah Words · Built for sincere learners of Quranic Arabic.</span>
          {/* The corpus data is GPL-3.0, which requires this credit */}
          <span className="text-center sm:text-right">
            Word data: Quranic Arabic Corpus (GPL-3.0) · Text, tafsir &amp; audio: Quran.com, EveryAyah, Quran API ·
            Translations, tafsirs, surah info &amp; recitation timings: Tarteel's Quranic Universal Library
          </span>
        </div>
      </div>
    </footer>
  );
};
