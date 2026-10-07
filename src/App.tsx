import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { ALL_VERIFIED_WORDS, getWordById } from './data/quranVocab';
import { DifficultyLevel, Language, AppSettings, UserProgress, StudyList } from './types';
import { StorageService, getTodayDateString, isDueForReview } from './services/storage';
import { searchQuranWords } from './services/quranApi';
import { Header, ActiveTab } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
import { VocabularyGrid, LessonDrawer } from './components/VocabularyGrid';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { WholeQuranSearch } from './components/WholeQuranSearch';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NEXT_COURSE_DECK } from './components/courseWords';
import { knownLemmasStore } from './hooks/useKnownLemmas';
import { BookOpen, Loader2 } from 'lucide-react';

// Secondary tabs are code-split so the first paint only ships the vocabulary feed.
const named = <T extends Record<string, unknown>, K extends keyof T>(loader: () => Promise<T>, key: K) =>
  // Each tab has its own props; the lazy wrapper only passes them through
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazy(() => loader().then((m) => ({ default: m[key] as React.ComponentType<any> })));

const FlashcardViewer = named(() => import('./components/FlashcardViewer'), 'FlashcardViewer');
const PracticeQuiz = named(() => import('./components/PracticeQuiz'), 'PracticeQuiz');
const WordComparisonModal = named(() => import('./components/WordComparisonModal'), 'WordComparisonModal');
const SavedListsManager = named(() => import('./components/SavedListsManager'), 'SavedListsManager');
const ProgressDashboard = named(() => import('./components/ProgressDashboard'), 'ProgressDashboard');
const WordByWordVerseViewer = named(() => import('./components/WordByWordVerseViewer'), 'WordByWordVerseViewer');
const SyntacticTreebank = named(() => import('./components/SyntacticTreebank'), 'SyntacticTreebank');
const RootConcordanceViewer = named(() => import('./components/RootConcordanceViewer'), 'RootConcordanceViewer');
const SurahReader = named(() => import('./components/SurahReader'), 'SurahReader');
const SurahVocabulary = named(() => import('./components/SurahVocabulary'), 'SurahVocabulary');
const CoverageCourse = named(() => import('./components/CoverageCourse'), 'CoverageCourse');
const Top100VocabularyExplorer = named(
  () => import('./components/Top100VocabularyExplorer'),
  'Top100VocabularyExplorer'
);

const VALID_TABS: ActiveTab[] = [
  'dictionary',
  'reader',
  'course',
  'top100',
  'wordbyword',
  'treebank',
  'concordance',
  'flashcards',
  'quiz',
  'comparisons',
  'study-lists',
  'progress'
];

// Routes: #/<tab>, plus #/reader/<surah> or #/reader/juz/<juz> for a surah or juz open in the reader
const hashParts = () => window.location.hash.replace(/^#\/?/, '').split('/');

const tabFromHash = (): ActiveTab => {
  const tab = hashParts()[0] as ActiveTab;
  return VALID_TABS.includes(tab) ? tab : 'dictionary';
};

const surahFromHash = (): number | undefined => {
  const [tab, n] = hashParts();
  const surah = Number(n);
  return tab === 'reader' && surah >= 1 && surah <= 114 ? surah : undefined;
};

const juzFromHash = (): number | undefined => {
  const [tab, kind, n] = hashParts();
  const juz = Number(n);
  return tab === 'reader' && kind === 'juz' && juz >= 1 && juz <= 30 ? juz : undefined;
};

const TabFallback = () => (
  <div className="flex items-center justify-center py-24 text-stone-400">
    <Loader2 className="w-6 h-6 animate-spin" />
  </div>
);

export function App() {
  // Navigation and Settings State
  const [activeTab, setActiveTabState] = useState<ActiveTab>(tabFromHash);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [flashcardDeck, setFlashcardDeck] = useState<string>(NEXT_COURSE_DECK);
  const [wbwVerseKey, setWbwVerseKey] = useState<string>('1:2');
  const [rootDictRoot, setRootDictRoot] = useState<string | undefined>(undefined);
  const [readerSurah, setReaderSurah] = useState<number | undefined>(surahFromHash);
  const [readerJuz, setReaderJuz] = useState<number | undefined>(juzFromHash);

  // Storage State
  const [savedWordIds, setSavedWordIds] = useState<string[]>(StorageService.getSavedWordIds());
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>(StorageService.getAllProgress());
  const [studyLists, setStudyLists] = useState<StudyList[]>(StorageService.getStudyLists());
  const [streak, setStreak] = useState<number>(StorageService.getStreak());

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSurah, setSelectedSurah] = useState<number | undefined>(undefined);
  const [onlyDue, setOnlyDue] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);

  // Active word comparison modal state
  const [comparisonWordId, setComparisonWordId] = useState<string | null>(null);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  const setActiveTab = useCallback((tab: ActiveTab) => {
    setActiveTabState(tab);
    if (tab === 'reader') {
      setReaderSurah(undefined);
      setReaderJuz(undefined);
    }
    if (window.location.hash !== `#/${tab}`) {
      window.history.pushState(null, '', `#/${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  // Keep tab in sync with browser back/forward
  useEffect(() => {
    const onPop = () => {
      setActiveTabState(tabFromHash());
      setReaderSurah(surahFromHash());
      setReaderJuz(juzFromHash());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  const openSurah = (surah: number | undefined) => {
    setReaderSurah(surah);
    setReaderJuz(undefined);
    setActiveTabState('reader');
    window.history.pushState(null, '', surah ? `#/reader/${surah}` : '#/reader');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const openJuz = (juz: number | undefined) => {
    setReaderJuz(juz);
    setReaderSurah(undefined);
    setActiveTabState('reader');
    window.history.pushState(null, '', juz ? `#/reader/juz/${juz}` : '#/reader');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const openVerse = (key: string) => {
    setWbwVerseKey(key);
    setActiveTab('wordbyword');
  };

  const openRoot = (root: string) => {
    setRootDictRoot(root);
    setActiveTab('concordance');
  };

  const openFlashcards = (deck: string) => {
    setFlashcardDeck(deck);
    setActiveTab('flashcards');
  };

  // Sync settings when updated
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleLevelChange = (lvl: DifficultyLevel) => {
    handleUpdateSettings({ ...settings, level: lvl });
  };

  const handleLanguageChange = (lang: Language) => {
    handleUpdateSettings({ ...settings, language: lang });
  };

  // Reload all storage data
  const reloadStorageData = () => {
    setSettings(StorageService.getSettings());
    setSavedWordIds(StorageService.getSavedWordIds());
    setProgressMap(StorageService.getAllProgress());
    setStudyLists(StorageService.getStudyLists());
    setStreak(StorageService.getStreak());
    knownLemmasStore.reload();
  };

  const handleToggleSave = (wordId: string) => {
    StorageService.toggleSaveWord(wordId);
    setSavedWordIds(StorageService.getSavedWordIds());
  };

  const handleRateSRS = (wordId: string, confidence: number, wasCorrect: boolean) => {
    StorageService.recordWordReview(wordId, confidence, wasCorrect);
    setProgressMap(StorageService.getAllProgress());
    setStreak(StorageService.getStreak());
  };

  // Calculate Due Reviews
  const today = getTodayDateString();
  // Lesson words and 85% Course words share the review schedule
  // (only ids a deck can show: progress left over from a removed lesson would be counted but never offered)
  const dueReviewCount = useMemo(() => {
    const lessonIds = new Set(ALL_VERIFIED_WORDS.map((w) => w.id));
    return Object.entries(progressMap).filter(
      ([id, p]) => (lessonIds.has(id) || id.startsWith('course:')) && isDueForReview(p, today)
    ).length;
  }, [progressMap, today]);

  // Filter words
  const filteredWords = useMemo(() => {
    let result = searchQuranWords(searchQuery, settings.level, settings.language);

    if (selectedCategory !== 'all') {
      result = result.filter((w) => w.category === selectedCategory);
    }

    if (selectedSurah !== undefined) {
      result = result.filter(
        (w) =>
          w.primaryVerse.surahNumber === selectedSurah ||
          (w.otherVerses && w.otherVerses.some((ov) => ov.surahNumber === selectedSurah))
      );
    }

    if (onlyDue) {
      result = result.filter((w) => isDueForReview(progressMap[w.id], today));
    }

    if (onlySaved) {
      result = result.filter((w) => savedWordIds.includes(w.id));
    }

    return result;
  }, [
    searchQuery,
    settings.level,
    settings.language,
    selectedCategory,
    selectedSurah,
    onlyDue,
    onlySaved,
    progressMap,
    savedWordIds,
    today
  ]);

  // Handle word selection from other tabs
  const handleSelectWordInDictionary = (wordId: string) => {
    if (getWordById(wordId)) {
      setActiveTab('dictionary');
      setOpenLessonId(wordId);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSurah(undefined);
    setOnlyDue(false);
    setOnlySaved(false);
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'all' || selectedSurah !== undefined || onlyDue || onlySaved;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onGoHome={() => setActiveTab('dictionary')}
        onOpenMenu={() => setIsMobileNavOpen(true)}
        level={settings.level}
        onLevelChange={handleLevelChange}
        language={settings.language}
        onLanguageChange={handleLanguageChange}
        streak={streak}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          dueReviewCount={dueReviewCount}
          savedCount={savedWordIds.length}
          streak={streak}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={closeMobileNav}
          level={settings.level}
          onLevelChange={handleLevelChange}
          language={settings.language}
          onLanguageChange={handleLanguageChange}
        />

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full max-w-6xl mx-auto">
            <div key={activeTab} className="animate-fadeIn">
              {/* Keyed by tab with its parent, so switching tabs clears an error */}
              <ErrorBoundary>
                <Suspense fallback={<TabFallback />}>
                  {/* Dictionary & Vocabulary Lessons */}
                  {activeTab === 'dictionary' && (
                    <div className="space-y-6">
                      {!hasActiveFilters && (
                        <Hero
                          totalWords={ALL_VERIFIED_WORDS.length}
                          dueReviewCount={dueReviewCount}
                          savedCount={savedWordIds.length}
                          streak={streak}
                          onStartReview={() => openFlashcards(dueReviewCount > 0 ? 'due' : NEXT_COURSE_DECK)}
                          onOpenCourse={() => setActiveTab('course')}
                        />
                      )}

                      <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        selectedSurah={selectedSurah}
                        onSurahChange={setSelectedSurah}
                        onlyDue={onlyDue}
                        onToggleDue={() => setOnlyDue(!onlyDue)}
                        onlySaved={onlySaved}
                        onToggleSaved={() => setOnlySaved(!onlySaved)}
                        resultsCount={filteredWords.length}
                        totalCount={ALL_VERIFIED_WORDS.length}
                      />

                      {filteredWords.length === 0 ? (
                        // A surah's own word list follows, so its lack of a detailed lesson needs no notice
                        // (unless the due or saved filter emptied the lessons, which that list does not apply)
                        selectedSurah !== undefined && !searchQuery && !onlyDue && !onlySaved ? null : (
                          <div className="card p-10 text-center space-y-4 max-w-md mx-auto">
                            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/20 ring-1 ring-amber-200 dark:ring-amber-900/60 text-amber-700 dark:text-amber-300 rounded-2xl flex items-center justify-center mx-auto">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">No detailed lesson yet</h3>
                            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                              {searchQuery ? (
                                <>
                                  Nothing matched “<strong className="text-stone-700 dark:text-stone-300">{searchQuery}</strong>”.{' '}
                                </>
                              ) : null}
                              {searchQuery
                                ? 'See matches from the whole Quran below, or try root letters or a transliteration.'
                                : 'Try root letters, a transliteration or an English meaning.'}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={resetFilters}
                                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-sm font-semibold cursor-pointer"
                              >
                                Clear filters
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="space-y-6">
                          {filteredWords.length < ALL_VERIFIED_WORDS.length && (
                            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400 px-1">
                              Detailed lessons
                            </div>
                          )}
                          <VocabularyGrid
                            words={filteredWords}
                            level={settings.level}
                            language={settings.language}
                            savedWordIds={savedWordIds}
                            progressMap={progressMap}
                            onOpen={setOpenLessonId}
                            onToggleSave={handleToggleSave}
                          />
                        </div>
                      )}

                      {selectedSurah !== undefined && (
                        <SurahVocabulary
                          surah={selectedSurah}
                          theme={selectedCategory}
                          onThemeChange={setSelectedCategory}
                          onOpenVerse={openVerse}
                          onOpenSurah={openSurah}
                        />
                      )}

                      <WholeQuranSearch query={searchQuery} onOpenVerse={openVerse} onOpenRoot={openRoot} />
                    </div>
                  )}

                  {activeTab === 'reader' && (
                    <SurahReader
                      surah={readerSurah}
                      onSelectSurah={openSurah}
                      juz={readerJuz}
                      onSelectJuz={openJuz}
                      settings={settings}
                      onOpenVerse={openVerse}
                      onOpenRoot={openRoot}
                    />
                  )}

                  {activeTab === 'course' && <CoverageCourse onOpenVerse={openVerse} />}

                  {activeTab === 'top100' && (
                    <Top100VocabularyExplorer
                      onSelectWord={handleSelectWordInDictionary}
                      onOpenRoot={openRoot}
                      onOpenVerse={openVerse}
                    />
                  )}

                  {activeTab === 'wordbyword' && (
                    <WordByWordVerseViewer
                      verseKey={wbwVerseKey}
                      onVerseChange={setWbwVerseKey}
                      onOpenRoot={openRoot}
                      onOpenSurah={openSurah}
                    />
                  )}

                  {activeTab === 'treebank' && <SyntacticTreebank />}

                  {activeTab === 'concordance' && (
                    <RootConcordanceViewer initialRoot={rootDictRoot} onOpenVerse={openVerse} />
                  )}

                  {activeTab === 'flashcards' && (
                    <FlashcardViewer
                      words={ALL_VERIFIED_WORDS}
                      level={settings.level}
                      language={settings.language}
                      settings={settings}
                      progressMap={progressMap}
                      studyLists={studyLists}
                      onRateWord={handleRateSRS}
                      initialFilterMode={flashcardDeck}
                    />
                  )}

                  {activeTab === 'quiz' && (
                    <PracticeQuiz
                      words={ALL_VERIFIED_WORDS}
                      level={settings.level}
                      language={settings.language}
                      onRateWord={handleRateSRS}
                    />
                  )}

                  {activeTab === 'comparisons' && <WordComparisonModal />}

                  {activeTab === 'study-lists' && (
                    <SavedListsManager
                      studyLists={studyLists}
                      savedWordIds={savedWordIds}
                      allWords={ALL_VERIFIED_WORDS}
                      level={settings.level}
                      language={settings.language}
                      onUpdateLists={reloadStorageData}
                      onStartFlashcardsWithList={(listId: string) =>
                        openFlashcards(listId === 'all-saved' ? 'all' : listId)
                      }
                      onSelectWord={handleSelectWordInDictionary}
                    />
                  )}

                  {activeTab === 'progress' && (
                    <ProgressDashboard
                      progressMap={progressMap}
                      allWords={ALL_VERIFIED_WORDS}
                      streak={streak}
                      onStartDueReview={() => openFlashcards('due')}
                    />
                  )}
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      {openLessonId && (
        <LessonDrawer
          words={filteredWords.some((w) => w.id === openLessonId) ? filteredWords : ALL_VERIFIED_WORDS}
          wordId={openLessonId}
          onNavigate={setOpenLessonId}
          onClose={() => setOpenLessonId(null)}
          level={settings.level}
          language={settings.language}
          settings={settings}
          savedWordIds={savedWordIds}
          progressMap={progressMap}
          onToggleSave={handleToggleSave}
          onRateSRS={handleRateSRS}
          onOpenComparison={(wId) => setComparisonWordId(wId)}
        />
      )}

      {/* Comparison Modal when triggered from Lesson Card */}
      {comparisonWordId && (
        <Suspense fallback={null}>
          <WordComparisonModal
            initialWordId={comparisonWordId}
            onClose={() => setComparisonWordId(null)}
            isModal
          />
        </Suspense>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onDataReset={reloadStorageData}
      />
    </div>
  );
}

export default App;
