import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { fetchSurahInfo } from '../services/surahInfo';
import { useAsync } from './QuranWordBits';
import { t } from '../i18n/strings';

/** "About this surah": a one-paragraph summary that opens into the full introduction. */
export const SurahInfoCard: React.FC<{ surah: number }> = ({ surah }) => {
  const [open, setOpen] = useState(false);
  const { data: loaded } = useAsync(() => fetchSurahInfo(surah), [surah]);
  const info = loaded?.surah === surah ? loaded : undefined;
  // Nothing to show until it loads, or if Quran.com has no introduction for it
  if (!info || (!info.summary && info.blocks.length === 0)) return null;

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left cursor-pointer"
      >
        <div className="min-w-0 space-y-1">
          <div className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-300" /> {t('aboutSurah')}
          </div>
          {!open && (
            <p dir={info.rtl ? 'rtl' : undefined} className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
              {info.summary}
            </p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform shrink-0 mt-0.5 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-3 animate-fadeIn" dir={info.rtl ? 'rtl' : undefined}>
          {info.blocks.map((b, i) =>
            b.kind === 'heading' ? (
              <h4 key={i} className="font-bold text-stone-900 dark:text-stone-100 text-sm pt-1">
                {b.text}
              </h4>
            ) : (
              <p
                key={i}
                className={`text-stone-700 dark:text-stone-300 leading-relaxed ${
                  b.kind === 'arabic' || info.rtl ? 'font-quran-amiri text-lg' : 'text-sm'
                }`}
                dir={b.kind === 'arabic' ? 'rtl' : undefined}
              >
                {b.text}
              </p>
            )
          )}
          <p className="text-[11px] text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3" dir="ltr">
            {info.source} · Quran.com, from Tarteel's Quranic Universal Library
          </p>
        </div>
      )}
    </div>
  );
};
