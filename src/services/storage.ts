import { UserProgress, StudyList, AppSettings } from '../types';


const STORAGE_KEYS = {
  PROGRESS: 'ayah_words_progress_v1',
  STUDY_LISTS: 'ayah_words_study_lists_v1',
  SETTINGS: 'ayah_words_settings_v1',
  SAVED_WORD_IDS: 'ayah_words_saved_ids_v1',
  STREAK: 'ayah_words_streak_v1',
  LAST_ACTIVE_DATE: 'ayah_words_last_active_date_v1',
  KNOWN_LEMMAS: 'ayah_words_known_lemmas_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  level: 'beginner',
  language: 'en',
  arabicFontSize: 'lg',
  arabicFontFamily: 'amiri',
  showTransliteration: true,
  autoPlayAudio: false,
  reciterPreference: 'husary',
  theme: 'cream-emerald'
};

export const DEFAULT_STUDY_LISTS: StudyList[] = [
  {
    id: 'default-core-theology',
    title: 'Divine Attributes & Core Theology',
    description: 'Foundational Quranic words describing Allah, guidance, and truth.',
    iconName: 'Sparkles',
    wordIds: ['rabb', 'rahmah', 'nur', 'haqq'],
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'default-character',
    title: 'Spiritual Character & Ethics',
    description: 'Qualities of the heart and righteous character in Quranic discourse.',
    iconName: 'Heart',
    wordIds: ['taqwa', 'sabr', 'hikmah', 'qalb', 'shukr'],
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'default-scripture',
    title: 'Revelation & Sacred Remembrance',
    description: 'Words associated with Quranic scripture, guidance, and continuous remembrance.',
    iconName: 'BookOpen',
    wordIds: ['kitab', 'huda', 'dhikr'],
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

// Local calendar date as YYYY-MM-DD. toISOString() would give the UTC date, which rolls over at the
// wrong hour outside UTC and breaks due dates and the daily streak.
export const toLocalDateString = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const getTodayDateString = (): string => toLocalDateString(new Date());

/** A word is due once it has been reviewed and its next review date has arrived. Unseen words are new, not due. */
export const isDueForReview = (progress: UserProgress | undefined, today = getTodayDateString()): boolean =>
  !!progress && progress.nextReviewDue <= today;

/** Days until the second review, by how well a word was recalled the first time (3 Okay, 4 Good, 5 Easy). */
const FIRST_INTERVAL_DAYS: Record<number, number> = { 3: 1, 4: 2, 5: 4 };
const EASY_BONUS = 1.3;
/** Even a well-known word comes back within a year. */
const MAX_INTERVAL_DAYS = 365;

// Calculate next review due using SM-2 algorithm
export const calculateNextSRSReview = (
  currentProgress: UserProgress | undefined,
  wordId: string,
  confidence: number, // 1 to 5
  wasCorrect: boolean
): UserProgress => {
  const today = getTodayDateString();
  const base = currentProgress || {
    wordId,
    lastReviewed: null,
    nextReviewDue: today,
    intervalDays: 0,
    easeFactor: 2.5,
    repetitionCount: 0,
    status: 'learning',
    confidenceScore: confidence,
    history: []
  };

  let newRepetition = base.repetitionCount;
  let newInterval = base.intervalDays;
  let newEaseFactor = base.easeFactor;

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  // q = confidence (1-5)
  newEaseFactor = newEaseFactor + (0.1 - (5 - confidence) * (0.08 + (5 - confidence) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  if (confidence < 3 || !wasCorrect) {
    // Reset interval if failed or very low confidence
    newRepetition = 0;
    newInterval = 1;
  } else {
    newRepetition += 1;
    if (newRepetition === 1) {
      newInterval = FIRST_INTERVAL_DAYS[confidence] ?? 1;
    } else {
      // Okay grows slowly, Good by the ease factor, Easy with a bonus; always at least a day longer than before
      const growth = confidence === 3 ? 1.2 : confidence === 5 ? newEaseFactor * EASY_BONUS : newEaseFactor;
      newInterval = Math.min(MAX_INTERVAL_DAYS, Math.max(newInterval + 1, Math.round(newInterval * growth)));
    }
  }

  // Calculate target date
  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newInterval);
  const nextDueString = toLocalDateString(nextDueDate);

  let newStatus: UserProgress['status'] = 'learning';
  if (newRepetition >= 4 && confidence >= 4) {
    newStatus = 'mastered';
  } else if (newRepetition >= 1) {
    newStatus = 'reviewing';
  }

  return {
    wordId,
    lastReviewed: today,
    nextReviewDue: nextDueString,
    intervalDays: newInterval,
    easeFactor: parseFloat(newEaseFactor.toFixed(2)),
    repetitionCount: newRepetition,
    status: newStatus,
    confidenceScore: confidence,
    history: [
      ...base.history,
      {
        date: new Date().toISOString(),
        confidence,
        wasCorrect
      }
    ]
  };
};

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

/**
 * Checks a backup's shape before anything is written, so a damaged or foreign file can't leave data behind
 * that crashes the app on every load. Every field is optional, but at least one must be present.
 */
const isBackup = (v: unknown): v is Record<string, unknown> => {
  if (!isPlainObject(v)) return false;
  const checks: Record<string, (x: unknown) => boolean> = {
    settings: isPlainObject,
    progress: (x) =>
      isPlainObject(x) &&
      Object.values(x).every((p) => isPlainObject(p) && typeof p.nextReviewDue === 'string' && Array.isArray(p.history)),
    savedWordIds: isStringArray,
    studyLists: (x) =>
      Array.isArray(x) &&
      x.every((l) => isPlainObject(l) && typeof l.id === 'string' && typeof l.title === 'string' && isStringArray(l.wordIds)),
    streak: (x) => typeof x === 'number',
    lastActiveDate: (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x),
    knownLemmas: isStringArray
  };
  const present = Object.keys(checks).filter((k) => v[k] !== undefined && v[k] !== null);
  return present.length > 0 && present.every((k) => checks[k](v[k]));
};

export const StorageService = {
  // Settings
  getSettings: (): AppSettings => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!stored) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  // Progress map
  getAllProgress: (): Record<string, UserProgress> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  getProgressForWord: (wordId: string): UserProgress | undefined => {
    const all = StorageService.getAllProgress();
    return all[wordId];
  },

  recordWordReview: (wordId: string, confidence: number, wasCorrect: boolean): UserProgress => {
    const all = StorageService.getAllProgress();
    const updated = calculateNextSRSReview(all[wordId], wordId, confidence, wasCorrect);
    all[wordId] = updated;
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
      StorageService.updateStreak();
    } catch (e) {
      console.error('Failed to record review progress', e);
    }
    return updated;
  },

  // Saved word bookmarks
  getSavedWordIds: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_WORD_IDS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleSaveWord: (wordId: string): boolean => {
    const ids = StorageService.getSavedWordIds();
    const exists = ids.includes(wordId);
    let newIds: string[];
    if (exists) {
      newIds = ids.filter(id => id !== wordId);
    } else {
      newIds = [...ids, wordId];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_WORD_IDS, JSON.stringify(newIds));
    } catch (e) {
      console.error('Failed to toggle saved word', e);
    }
    return !exists;
  },

  isWordSaved: (wordId: string): boolean => {
    return StorageService.getSavedWordIds().includes(wordId);
  },

  // Study Lists
  getStudyLists: (): StudyList[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDY_LISTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.STUDY_LISTS, JSON.stringify(DEFAULT_STUDY_LISTS));
        return DEFAULT_STUDY_LISTS;
      }
      return JSON.parse(stored);
    } catch {
      return DEFAULT_STUDY_LISTS;
    }
  },

  saveStudyLists: (lists: StudyList[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDY_LISTS, JSON.stringify(lists));
    } catch (e) {
      console.error('Failed to save study lists', e);
    }
  },

  createStudyList: (title: string, description: string, initialWordIds: string[] = []): StudyList => {
    const lists = StorageService.getStudyLists();
    const newList: StudyList = {
      id: `list-${Date.now()}`,
      title,
      description,
      wordIds: initialWordIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDefault: false
    };
    lists.push(newList);
    StorageService.saveStudyLists(lists);
    return newList;
  },

  toggleWordInList: (listId: string, wordId: string): boolean => {
    const lists = StorageService.getStudyLists();
    const list = lists.find(l => l.id === listId);
    if (!list) return false;

    const hasWord = list.wordIds.includes(wordId);
    if (hasWord) {
      list.wordIds = list.wordIds.filter(id => id !== wordId);
    } else {
      list.wordIds.push(wordId);
    }
    list.updatedAt = new Date().toISOString();
    StorageService.saveStudyLists(lists);
    return !hasWord;
  },

  deleteStudyList: (listId: string): void => {
    const lists = StorageService.getStudyLists().filter(l => l.id !== listId || l.isDefault);
    StorageService.saveStudyLists(lists);
  },

  // Daily streak tracker
  getStreak: (): number => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.STREAK);
      // A streak only counts while the learner studied today or yesterday
      const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastActive && lastActive < toLocalDateString(yesterday)) return 0;
      return s ? parseInt(s, 10) || 0 : 0;
    } catch {
      return 0;
    }
  },

  updateStreak: (): void => {
    try {
      const today = getTodayDateString();
      const lastActive = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE);
      let currentStreak = StorageService.getStreak();

      if (!lastActive) {
        currentStreak = 1;
      } else if (lastActive === today) {
        // already counted today
        return;
      } else {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }

      localStorage.setItem(STORAGE_KEYS.STREAK, currentStreak.toString());
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
    } catch (e) {
      console.error('Failed to update study streak', e);
    }
  },

  // Coverage course: lemmas the learner has marked as known
  getKnownLemmas: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.KNOWN_LEMMAS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setKnownLemmas: (lemmas: string[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWN_LEMMAS, JSON.stringify(lemmas));
    } catch (e) {
      console.error('Failed to save known words', e);
    }
  },

  // Backup and Export
  exportAllUserDataJson: (): string => {
    const data = {
      exportedAt: new Date().toISOString(),
      appName: 'Ayah Words',
      settings: StorageService.getSettings(),
      progress: StorageService.getAllProgress(),
      savedWordIds: StorageService.getSavedWordIds(),
      studyLists: StorageService.getStudyLists(),
      streak: StorageService.getStreak(),
      lastActiveDate: localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_DATE),
      knownLemmas: StorageService.getKnownLemmas()
    };
    return JSON.stringify(data, null, 2);
  },

  importUserDataJson: (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!isBackup(parsed)) return false;
      if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      if (parsed.progress) localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(parsed.progress));
      if (parsed.savedWordIds) localStorage.setItem(STORAGE_KEYS.SAVED_WORD_IDS, JSON.stringify(parsed.savedWordIds));
      if (parsed.studyLists) localStorage.setItem(STORAGE_KEYS.STUDY_LISTS, JSON.stringify(parsed.studyLists));
      if (typeof parsed.streak === 'number') localStorage.setItem(STORAGE_KEYS.STREAK, String(parsed.streak));
      if (typeof parsed.lastActiveDate === 'string') localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, parsed.lastActiveDate);
      if (Array.isArray(parsed.knownLemmas)) localStorage.setItem(STORAGE_KEYS.KNOWN_LEMMAS, JSON.stringify(parsed.knownLemmas));
      return true;
    } catch (e) {
      console.error('Failed to import user study data', e);
      return false;
    }
  },

  clearAllUserData: (): void => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
