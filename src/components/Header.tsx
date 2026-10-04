import React from 'react';
import { Settings, Globe, Menu, Flame, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, ThemePreference } from '../hooks/useTheme';
import { DifficultyLevel, Language } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/quranVocab';

export type ActiveTab =
  | 'dictionary'
  | 'reader'
  | 'course'
  | 'top100'
  | 'wordbyword'
  | 'treebank'
  | 'concordance'
  | 'ontology'
  | 'flashcards'
  | 'quiz'
  | 'comparisons'
  | 'analyzer'
  | 'study-lists'
  | 'progress';

interface HeaderProps {
  onGoHome: () => void;
  onOpenMenu: () => void;
  level: DifficultyLevel;
  onLevelChange: (lvl: DifficultyLevel) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  streak: number;
  onOpenSettings: () => void;
}

export const BrandMark: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div
    className={`${
      size === 'md' ? 'w-9 h-9 text-xl' : 'w-8 h-8 text-lg'
    } rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-amber-300 flex items-center justify-center shadow-sm ring-1 ring-emerald-900/20 shrink-0`}
  >
    <span className="font-quran-amiri leading-none -mt-1">آ</span>
  </div>
);

export const LevelSwitcher: React.FC<{
  level: DifficultyLevel;
  onLevelChange: (lvl: DifficultyLevel) => void;
  fullWidth?: boolean;
}> = ({ level, onLevelChange, fullWidth }) => (
  <div
    role="radiogroup"
    aria-label="Explanation level"
    className={`${fullWidth ? 'flex w-full' : 'inline-flex'} items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1 text-xs ring-1 ring-stone-200/70 dark:ring-stone-700/70`}
  >
    {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
      <button
        key={lvl}
        role="radio"
        aria-checked={level === lvl}
        onClick={() => onLevelChange(lvl)}
        className={`${fullWidth ? 'flex-1' : ''} px-2.5 py-1 rounded-lg capitalize font-semibold transition-all cursor-pointer ${
          level === lvl
            ? 'bg-white dark:bg-stone-900 text-emerald-900 dark:text-emerald-200 shadow-sm ring-1 ring-stone-200 dark:ring-stone-700'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
        }`}
        title={`Switch explanation level to ${lvl}`}
      >
        {fullWidth ? lvl : lvl === 'beginner' ? 'Beginner' : lvl === 'intermediate' ? 'Inter' : 'Adv'}
      </button>
    ))}
  </div>
);

export const LanguageSelect: React.FC<{
  language: Language;
  onLanguageChange: (lang: Language) => void;
  fullWidth?: boolean;
}> = ({ language, onLanguageChange, fullWidth }) => (
  <label
    className={`${fullWidth ? 'flex w-full' : 'inline-flex'} items-center gap-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/70 dark:hover:bg-stone-700/70 rounded-xl px-2.5 py-1.5 ring-1 ring-stone-200/70 dark:ring-stone-700/70 text-xs text-stone-700 dark:text-stone-300 transition-colors cursor-pointer`}
  >
    <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300 shrink-0" />
    <select
      value={language}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer w-full"
      aria-label="Select explanation language"
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name} ({lang.nativeName})
        </option>
      ))}
    </select>
  </label>
);

const THEME_CYCLE: Record<ThemePreference, { next: ThemePreference; icon: typeof Sun; label: string }> = {
  system: { next: 'light', icon: Monitor, label: 'Theme: system' },
  light: { next: 'dark', icon: Sun, label: 'Theme: light' },
  dark: { next: 'system', icon: Moon, label: 'Theme: dark' }
};

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useTheme();
  const { next, icon: Icon, label } = THEME_CYCLE[theme];
  return (
    <button
      onClick={() => setTheme(next)}
      className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
      title={`${label} (click for ${next})`}
      aria-label={`${label}. Switch to ${next}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({
  onGoHome,
  onOpenMenu,
  level,
  onLevelChange,
  language,
  onLanguageChange,
  streak,
  onOpenSettings
}) => {
  return (
    <header className="glass sticky top-0 z-40 border-b border-stone-200/70 dark:border-stone-700/70">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="lg:hidden -ml-1.5 p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button onClick={onGoHome} className="flex items-center gap-2.5 text-left group cursor-pointer">
            <BrandMark />
            <div className="leading-tight">
              <div className="flex items-baseline gap-2">
                <span className="font-extrabold text-[17px] tracking-tight text-stone-900 dark:text-stone-100">Ayah Words</span>
                <span className="font-quran-amiri text-emerald-700 dark:text-emerald-300 text-sm hidden sm:inline">
                  كَلِمَاتُ الْقُرْآنِ
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">Quranic Arabic, word by word</p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div
              title={`${streak} day study streak`}
              className="hidden sm:flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 px-2.5 py-1.5 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{streak}</span>
            </div>
          )}

          <div className="hidden md:block">
            <LevelSwitcher level={level} onLevelChange={onLevelChange} />
          </div>

          <div className="hidden md:block">
            <LanguageSelect language={language} onLanguageChange={onLanguageChange} />
          </div>

          <ThemeToggle />

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Settings & font size"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
