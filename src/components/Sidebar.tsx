import React from 'react';
import {
  BookOpen,
  Layers,
  GraduationCap,
  Bookmark,
  BarChart3,
  Compass,
  Network,
  BookMarked,
  Flame,
  X,
  Clock,
  ArrowRight,
  Type,
  Target,
  BookOpenText
} from 'lucide-react';
import { ActiveTab, BrandMark, LevelSwitcher, LanguageSelect } from './Header';
import { DifficultyLevel, Language } from '../types';
import { useModalBehavior } from '../hooks/useModalBehavior';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  accent?: boolean;
}

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  dueReviewCount: number;
  savedCount: number;
  streak: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  level: DifficultyLevel;
  onLevelChange: (lvl: DifficultyLevel) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const buildNavGroups = (dueReviewCount: number, savedCount: number): { title: string; items: NavItem[] }[] => [
  {
    title: 'Learn',
    items: [
      { id: 'dictionary', label: 'Vocabulary', icon: BookOpen },
      { id: 'reader', label: 'Surah Reader', icon: BookOpenText },
      { id: 'course', label: '85% Course', icon: Target, accent: true },
      { id: 'top100', label: 'Top 100 Words', icon: Flame },
      { id: 'comparisons', label: 'Verse Nuances', icon: Compass }
    ]
  },
  {
    title: 'Analyze',
    items: [
      { id: 'wordbyword', label: 'Word by Word', icon: Type },
      { id: 'treebank', label: 'Treebank (إعراب)', icon: Network },
      { id: 'concordance', label: 'Root Dictionary', icon: BookMarked }
    ]
  },
  {
    title: 'Practice',
    items: [
      { id: 'flashcards', label: 'Flashcards', icon: Layers, badge: dueReviewCount },
      { id: 'quiz', label: 'Practice Quiz', icon: GraduationCap }
    ]
  },
  {
    title: 'You',
    items: [
      { id: 'study-lists', label: 'Saved Lists', icon: Bookmark, badge: savedCount },
      { id: 'progress', label: 'Progress', icon: BarChart3 }
    ]
  }
];

const NavList: React.FC<{
  activeTab: ActiveTab;
  onSelect: (tab: ActiveTab) => void;
  dueReviewCount: number;
  savedCount: number;
}> = ({ activeTab, onSelect, dueReviewCount, savedCount }) => (
  <nav className="space-y-6" aria-label="Main navigation">
    {buildNavGroups(dueReviewCount, savedCount).map((group) => (
      <div key={group.title}>
        <div className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400">
          {group.title}
        </div>
        <ul className="space-y-0.5">
          {group.items.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900 text-white font-semibold shadow-sm shadow-emerald-900/20 dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-700/50 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 ${
                      isActive
                        ? 'text-amber-300 dark:text-emerald-300'
                        : item.accent
                        ? 'text-amber-500'
                        : 'text-stone-400 group-hover:text-emerald-700'
                    }`}
                  />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                        isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </nav>
);

const ReviewCard: React.FC<{ dueReviewCount: number; streak: number; onStart: () => void }> = ({
  dueReviewCount,
  streak,
  onStart
}) => (
  <div className="relative overflow-hidden rounded-2xl hero-surface p-4">
    <div className="absolute inset-0 geo-pattern opacity-60" aria-hidden />
    <div className="relative space-y-2">
      <div className="flex items-center justify-between text-[11px] text-emerald-200 font-medium">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Today
        </span>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-amber-300 font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {streak}-day streak
          </span>
        )}
      </div>
      <p className="text-sm font-semibold leading-snug">
        {dueReviewCount > 0
          ? `${dueReviewCount} word${dueReviewCount === 1 ? '' : 's'} ready for review`
          : 'You’re all caught up. Learn a new word today.'}
      </p>
      <button
        onClick={onStart}
        className="w-full mt-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
      >
        {dueReviewCount > 0 ? 'Start review' : 'Open flashcards'}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  dueReviewCount,
  savedCount,
  streak,
  isMobileOpen,
  onCloseMobile,
  level,
  onLevelChange,
  language,
  onLanguageChange
}) => {
  useModalBehavior(isMobileOpen, onCloseMobile);

  const selectMobile = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] border-r border-stone-200/70 dark:border-stone-700/70 px-3 py-6 overflow-y-auto">
        <div className="flex-1">
          <NavList
            activeTab={activeTab}
            onSelect={onTabChange}
            dueReviewCount={dueReviewCount}
            savedCount={savedCount}
          />
        </div>
        <div className="pt-6">
          <ReviewCard dueReviewCount={dueReviewCount} streak={streak} onStart={() => onTabChange('flashcards')} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm animate-fadeIn" onClick={onCloseMobile} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-[var(--surface-page)] shadow-2xl flex flex-col animate-slide-in-left">
            <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-700/70">
              <div className="flex items-center gap-2.5">
                <BrandMark size="sm" />
                <span className="font-extrabold tracking-tight text-stone-900 dark:text-stone-100">Ayah Words</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60 cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
              <NavList
                activeTab={activeTab}
                onSelect={selectMobile}
                dueReviewCount={dueReviewCount}
                savedCount={savedCount}
              />
              <div className="space-y-2 px-1 md:hidden">
                <div className="px-2 text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400">
                  Preferences
                </div>
                <LevelSwitcher level={level} onLevelChange={onLevelChange} fullWidth />
                <LanguageSelect language={language} onLanguageChange={onLanguageChange} fullWidth />
              </div>
              <ReviewCard
                dueReviewCount={dueReviewCount}
                streak={streak}
                onStart={() => selectMobile('flashcards')}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
