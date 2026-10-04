import React, { useState } from 'react';
import { BookOpen, AlertCircle, Info, ChevronDown, ShieldCheck, X } from 'lucide-react';

const DISMISS_KEY = 'ayah-words-disclaimer-dismissed';

const readDismissed = () => {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
};

export const DisclaimerBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(readDismissed);

  if (isDismissed) return null;

  const dismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* storage unavailable: dismiss for this session only */
    }
  };

  const details = [
    {
      icon: BookOpen,
      tone: 'text-emerald-700 dark:text-emerald-300',
      title: 'Verified text & morphology',
      body: (
        <>
          Quranic text follows the standard Medina Mushaf (Hafs ʿan ʿĀṣim). Morphology is sourced from the{' '}
          <em>Quranic Arabic Corpus</em> (University of Leeds) and classical lexicons (<em>Lane’s Lexicon</em> &amp;{' '}
          <em>Hans Wehr</em>).
        </>
      )
    },
    {
      icon: AlertCircle,
      tone: 'text-amber-600 dark:text-amber-400',
      title: 'Translations & transliteration',
      body: (
        <>
          Translations (Saheeh International, Mustafa Khattab, Pickthall) are human approximations of the Arabic.
          Transliteration is an approximate phonetic guide and does not teach Tajwid.
        </>
      )
    },
    {
      icon: Info,
      tone: 'text-sky-600 dark:text-sky-400',
      title: 'Privacy & storage',
      body: (
        <>
          Study lists, review schedules and history are stored only in your browser. Nothing is sent to tracking
          servers; back up or wipe it any time in Settings.
        </>
      )
    }
  ];

  return (
    <div className="mb-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 ring-1 ring-amber-200/70 dark:ring-amber-900/60 text-sm text-amber-950 dark:text-amber-100">
      <div className="flex items-start sm:items-center gap-3 px-4 py-3">
        <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5 sm:mt-0" />
        <p className="flex-1 text-[13px] leading-snug text-amber-900/90 dark:text-amber-200">
          <span className="font-semibold text-amber-950 dark:text-amber-100">Educational aid.</span> Explanations here do not replace
          classical Tafsir or qualified scholarly instruction.{' '}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-0.5 font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 underline-offset-2 hover:underline cursor-pointer"
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide sources' : 'Sources & details'}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </p>
        <button
          onClick={dismiss}
          className="p-1 -m-1 rounded-lg text-amber-800/60 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/25 cursor-pointer"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fadeIn">
          {details.map(({ icon: Icon, tone, title, body }) => (
            <div key={title} className="bg-white/80 dark:bg-stone-900/80 p-3 rounded-xl ring-1 ring-amber-200/60 dark:ring-amber-900/60">
              <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-1 text-xs">
                <Icon className={`w-3.5 h-3.5 ${tone}`} />
                <span>{title}</span>
              </div>
              <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">{body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
