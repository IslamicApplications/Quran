import React, { useEffect } from 'react';
import { BookType, ChevronDown } from 'lucide-react';
import { fetchQuranEncTranslations, translationStore, useTranslationChoice } from '../services/translations';
import { defaultTranslationName } from '../services/quranCom';
import { useAsync } from './QuranWordBits';

/**
 * Chooses the verse translation for a language: Quran.com's default or one of QuranEnc's. Shown only where
 * QuranEnc has translations for the language (none for Arabic, which reads al-Muyassar).
 */
export const TranslationSelect: React.FC<{ language: string; className?: string }> = ({ language, className = '' }) => {
  const choice = useTranslationChoice(language);
  const { data: options } = useAsync(() => fetchQuranEncTranslations(language), [language]);

  // Credit the version QuranEnc serves now, not the one current when the translation was chosen
  useEffect(() => {
    const live = options?.find((o) => o.key === choice?.key);
    if (live && choice && live.version !== choice.version) translationStore.set(language, live);
  }, [options, choice, language]);

  if (language === 'ar' || !options?.length) return null;
  return (
    <label className={`relative inline-flex items-center shrink-0 ${className}`}>
      <BookType className="absolute left-2.5 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
      <select
        value={choice?.key ?? ''}
        onChange={(e) => translationStore.set(language, options.find((o) => o.key === e.target.value) ?? null)}
        aria-label="Translation"
        className="appearance-none max-w-[16rem] pl-7 pr-7 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 ring-1 ring-stone-200/70 dark:ring-stone-700/70 text-xs font-semibold text-stone-700 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
      >
        <option value="">{defaultTranslationName(language)} · Quran.com</option>
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.title} · QuranEnc{o.spoken ? ' · spoken' : ''}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
    </label>
  );
};
