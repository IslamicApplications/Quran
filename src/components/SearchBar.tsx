import React, { useEffect, useRef } from 'react';
import { Search, X, Bookmark, Clock, ChevronDown } from 'lucide-react';
import { isAnyModalOpen } from '../hooks/useModalBehavior';
import { SURAH_LIST } from '../data/surahList';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSurah: number | undefined;
  onSurahChange: (surah: number | undefined) => void;
  onlyDue: boolean;
  onToggleDue: () => void;
  onlySaved: boolean;
  onToggleSaved: () => void;
  resultsCount: number;
  totalCount: number;
}

export const CATEGORIES = [
  { id: 'all', label: 'All themes' },
  { id: 'divine_names', label: 'Divine Names & Attributes' },
  { id: 'core_theology', label: 'Core Theology & Truth' },
  { id: 'guidance_knowledge', label: 'Guidance & Revelation' },
  { id: 'character_ethics', label: 'Spiritual Character & Heart' },
  { id: 'worship_devotion', label: 'Worship & Remembrance' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSurah,
  onSurahChange,
  onlyDue,
  onToggleDue,
  onlySaved,
  onToggleSaved,
  resultsCount,
  totalCount
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses the search field, like most modern search UIs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== '/' || isAnyModalOpen() || target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
        return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hasFilters =
    searchQuery || selectedCategory !== 'all' || selectedSurah !== undefined || onlyDue || onlySaved;

  const toggleClass = (active: boolean, activeTone: string) =>
    `inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold transition-all cursor-pointer ring-1 ${
      active ? activeTone : 'bg-white dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100'
    }`;

  return (
    <div className="card p-3 sm:p-4 space-y-3">
      {/* Main Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Arabic, transliteration, meaning, or verse (2:255)"
          aria-label="Search Quranic vocabulary"
          className="w-full pl-12 pr-16 py-3.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 ring-1 ring-stone-200 dark:ring-stone-700 text-stone-900 dark:text-stone-100 text-[15px] focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all placeholder:text-stone-400 [&::-webkit-search-cancel-button]:hidden"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden sm:flex absolute right-3.5 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-md bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 text-[11px] font-semibold text-stone-400">
            /
          </kbd>
        )}
      </div>

      {/* Theme chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={active}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-emerald-900 text-white shadow-sm dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filters + result count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={selectedSurah || ''}
              onChange={(e) => onSurahChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              className={`appearance-none text-xs pl-3 pr-8 py-2 rounded-xl font-semibold ring-1 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer ${
                selectedSurah !== undefined
                  ? 'bg-emerald-50 dark:bg-emerald-950/25 ring-emerald-200 dark:ring-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-stone-900 ring-stone-200 dark:ring-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'
              }`}
              aria-label="Filter by Surah"
            >
              <option value="">All Surahs</option>
              {SURAH_LIST.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.nameTransliteration} ({s.nameArabic})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          <button
            onClick={onToggleDue}
            aria-pressed={onlyDue}
            className={toggleClass(onlyDue, 'bg-amber-50 dark:bg-amber-950/20 ring-amber-300 dark:ring-amber-900/60 text-amber-900 dark:text-amber-200')}
          >
            <Clock className={`w-3.5 h-3.5 ${onlyDue ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'}`} />
            Due for review
          </button>

          <button
            onClick={onToggleSaved}
            aria-pressed={onlySaved}
            className={toggleClass(onlySaved, 'bg-emerald-50 dark:bg-emerald-950/25 ring-emerald-300 dark:ring-emerald-700 text-emerald-900 dark:text-emerald-200')}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-emerald-700 text-emerald-700 dark:text-emerald-300' : 'text-stone-400'}`} />
            Saved only
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
          <span>
            <strong className="text-stone-800 dark:text-stone-200 tabular-nums">{resultsCount}</strong> of {totalCount} detailed lessons
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('all');
                onSurahChange(undefined);
                if (onlyDue) onToggleDue();
                if (onlySaved) onToggleSaved();
              }}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 font-semibold cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
