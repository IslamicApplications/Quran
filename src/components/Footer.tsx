import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { BrandMark } from './Header';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-stone-200/80 dark:border-stone-700/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          {/* Academic & Classical Sources */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Sources &amp; citations</span>
            </h4>
            <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1.5">
              <li>
                <a
                  href="https://corpus.quran.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  Quranic Arabic Corpus (Leeds, GPL-3.0) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://quran.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  Quran.com (word-by-word &amp; audio) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://everyayah.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  EveryAyah.com (recitations, English audio) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://tanzil.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1"
                >
                  Tanzil.net (Medina Mushaf text) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Lane’s Arabic-English Lexicon</li>
              <li>Hans Wehr Dictionary</li>
              <li>Tafsir Ibn Kathir, Al-Saʿdi &amp; Al-Qurtubi</li>
            </ul>
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
          <span>Hafs ʿan ʿĀṣim · Medina Mushaf</span>
        </div>
      </div>
    </footer>
  );
};
