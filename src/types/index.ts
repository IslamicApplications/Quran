export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type Language = 'en' | 'id' | 'fr' | 'ur' | 'tr' | 'ar' | 'de' | 'am' | 'so';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

export interface SourceCitation {
  id: string;
  title: string;
  authorOrEditor?: string;
  type: 'corpus' | 'lexicon' | 'tafsir' | 'translation' | 'quran_text';
  edition?: string;
  url?: string;
  citationText: string;
  quoteOrNote?: string;
}

export interface MorphologyBreakdown {
  segment: string;
  segmentType: 'prefix' | 'stem' | 'suffix' | 'root' | 'pronoun' | 'particle';
  labelArabic: string;
  labelEnglish: string;
  meaning: string;
}

export interface LevelExplanation {
  meaning: string;
  isApproximate?: boolean;
  inContextExplanation: string;
  languageNote: {
    rootArabic?: string;
    rootTransliteration?: string;
    rootMeaning?: string;
    wordClass: string;
    formOrPattern?: string; // e.g. Form IV (أَفْعَلَ), Ism Fa'il, etc.
    morphologySummary?: string;
    grammarSyntax?: string; // I'rab notes
    breakdown?: MorphologyBreakdown[];
  };

  ambiguityOrNuance?: string;
  alternativeMeanings?: {
    meaning: string;
    scholarOrTranslation: string;
    context: string;
  }[];
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptions?: Record<number, string>;
}

export interface VerseOccurrence {
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  surahNameTransliteration: string;
  ayahNumber: number;
  arabicVerseText: string;
  highlightedWord: string;
  translation: string;
  translationSource: string;
  contextMeaning: string;
  audioReciter?: string;
  audioUrl?: string;
  audioSource?: string;
}

export interface QuranWord {
  id: string;
  arabic: string; // with full tashkeel/diacritics
  arabicSimple: string; // unvowelled / normalized for fuzzy search
  transliteration: string;
  transliterationNote?: string;
  rootArabic: string;
  rootSimple: string;
  rootTransliteration: string;
  rootGeneralMeaning: string;
  frequencyInQuran: number;
  partOfSpeech: 'noun' | 'verb' | 'particle' | 'adjective' | 'proper_noun';
  partOfSpeechArabic: string;
  primaryVerse: VerseOccurrence;
  otherVerses?: VerseOccurrence[];
  category: 'core_theology' | 'worship_devotion' | 'character_ethics' | 'nature_creation' | 'hereafter' | 'divine_names' | 'guidance_knowledge';
  explanations: Record<DifficultyLevel, Partial<Record<Language, LevelExplanation>>>;
  practiceQuestions: PracticeQuestion[];
  sources: SourceCitation[];
  isVerified: boolean;
  verificationStatement: string;
  quranEdition: string;
}

export interface UserProgress {
  wordId: string;
  lastReviewed: string | null;
  nextReviewDue: string;
  intervalDays: number;
  easeFactor: number;
  repetitionCount: number;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  confidenceScore: number; // 1 to 5
  history: {
    date: string;
    confidence: number;
    wasCorrect: boolean;
  }[];
}

export interface StudyList {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  wordIds: string[];
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SurahSummary {
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameTransliteration: string;
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface CrossVerseComparison {
  id: string;
  wordArabic: string;
  transliteration: string;
  rootArabic: string;
  theme: string;
  summary: string;
  verses: {
    surahNumber: number;
    ayahNumber: number;
    surahNameArabic: string;
    surahNameEnglish: string;
    verseArabic: string;
    highlighted: string;
    translation: string;
    translationAttribution?: string;
    meaningInThisVerse: string;
    scholarlyReasoning: string;
    tafsirSource: string;
  }[];

}

export interface SearchFilters {
  query: string;
  surahNumber?: number;
  ayahNumber?: number;
  category?: string;
  level: DifficultyLevel;
  language: Language;
  partOfSpeech?: string;
  onlyDueForReview?: boolean;
  onlySaved?: boolean;
}

export interface AppSettings {
  level: DifficultyLevel;
  language: Language;
  arabicFontSize: 'md' | 'lg' | 'xl' | '2xl';
  arabicFontFamily: 'amiri' | 'scheherazade';
  showTransliteration: boolean;
  autoPlayAudio: boolean;
  reciterPreference: 'husary' | 'alafasy';
  theme: 'cream-emerald' | 'pure-white' | 'night-calm';
}
