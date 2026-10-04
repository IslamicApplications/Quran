import { SURAH_LIST, getSurahByNumber } from '../data/surahList';
import { ALL_VERIFIED_WORDS } from '../data/quranVocab';
import { QuranWord, DifficultyLevel, Language } from '../types';

// Arabic diacritic stripping and normalization for resilient fuzzy matching
export const normalizeArabic = (text: string): string => {
  if (!text) return '';
  return text
    // Remove Quranic recitation symbols and annotations (e.g. small meem, sajda mark, stop signs)
    .replace(/[\u06D6-\u06ED\u0615-\u061A]/g, '')
    // Remove standard Arabic Tashkeel / Harakat (Fatha, Damma, Kasra, Sukun, Shadda, Tanween)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alif forms (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Ya and Alif Maqsura (ى -> ي)
    .replace(/ى/g, 'ي')
    // Normalize Ta Marbuta (ة -> ه)
    .replace(/ة/g, 'ه')
    // Strip tatweel / kashida (ـ)
    .replace(/ـ/g, '')
    .trim();
};

export interface VerseReferenceParsed {
  surahNumber: number;
  ayahNumber?: number;
  surahName?: string;
  isValid: boolean;
  errorMessage?: string;
}

// Parse user input like "2:255", "112:1", "Al-Baqarah 2", "1:2"
export const parseVerseReference = (input: string): VerseReferenceParsed | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check format "Surah:Ayah" or "Surah Ayah" e.g. "2:255", "2 255", "114:1"
  const colonMatch = trimmed.match(/^(\d{1,3})[:\s](\d{1,3})$/);
  if (colonMatch) {
    const surahNum = parseInt(colonMatch[1], 10);
    const ayahNum = parseInt(colonMatch[2], 10);
    const surah = getSurahByNumber(surahNum);

    if (!surah) {
      return {
        surahNumber: surahNum,
        ayahNumber: ayahNum,
        isValid: false,
        errorMessage: `Surah #${surahNum} does not exist. The Quran contains 114 Surahs.`
      };
    }

    if (ayahNum < 1 || ayahNum > surah.totalAyahs) {
      return {
        surahNumber: surahNum,
        ayahNumber: ayahNum,
        surahName: `${surah.nameTransliteration} (${surah.nameArabic})`,
        isValid: false,
        errorMessage: `Surah ${surah.nameTransliteration} has ${surah.totalAyahs} ayahs. Ayah #${ayahNum} is out of bounds.`
      };
    }

    return {
      surahNumber: surahNum,
      ayahNumber: ayahNum,
      surahName: `${surah.nameTransliteration} (${surah.nameArabic})`,
      isValid: true
    };
  }

  // Check just Surah number "2"
  const singleNumMatch = trimmed.match(/^(\d{1,3})$/);
  if (singleNumMatch) {
    const surahNum = parseInt(singleNumMatch[1], 10);
    const surah = getSurahByNumber(surahNum);
    if (!surah) {
      return {
        surahNumber: surahNum,
        isValid: false,
        errorMessage: `Surah #${surahNum} does not exist (1-114).`
      };
    }
    return {
      surahNumber: surahNum,
      surahName: `${surah.nameTransliteration} (${surah.nameArabic})`,
      isValid: true
    };
  }

  // Match by name e.g. "Baqarah 255" or "Fatihah 2"
  for (const s of SURAH_LIST) {
    const cleanTrans = s.nameTransliteration.toLowerCase().replace(/['-]/g, '');
    const cleanEnglish = s.nameEnglish.toLowerCase();
    const cleanArabic = normalizeArabic(s.nameArabic);
    const cleanInput = normalizeArabic(trimmed.toLowerCase()).replace(/['-]/g, '');

    if (cleanInput.includes(cleanTrans) || cleanInput.includes(cleanEnglish) || cleanInput.includes(cleanArabic)) {
      // Look for trailing number
      const numMatch = trimmed.match(/(\d{1,3})$/);
      const ayahNum = numMatch ? parseInt(numMatch[1], 10) : undefined;

      if (ayahNum !== undefined) {
        if (ayahNum < 1 || ayahNum > s.totalAyahs) {
          return {
            surahNumber: s.number,
            ayahNumber: ayahNum,
            surahName: `${s.nameTransliteration} (${s.nameArabic})`,
            isValid: false,
            errorMessage: `Surah ${s.nameTransliteration} has ${s.totalAyahs} ayahs. Ayah #${ayahNum} is invalid.`
          };
        }
      }

      return {
        surahNumber: s.number,
        ayahNumber: ayahNum,
        surahName: `${s.nameTransliteration} (${s.nameArabic})`,
        isValid: true
      };
    }
  }

  return null;
};

// Check if user-provided text matches a known verse reference or exhibits conflict
export interface VerificationConflictResult {
  hasConflict: boolean;
  message?: string;
  matchingWord?: QuranWord;
  referenceSurah?: string;
  expectedText?: string;
}

export const checkVerseReferenceMatch = (
  textProvided: string,
  surahNumber?: number,
  ayahNumber?: number
): VerificationConflictResult => {
  if (!textProvided || !surahNumber) {
    return { hasConflict: false };
  }

  const normInput = normalizeArabic(textProvided);

  // Search in verified collection
  for (const word of ALL_VERIFIED_WORDS) {
    const pVerse = word.primaryVerse;
    if (pVerse.surahNumber === surahNumber && (!ayahNumber || pVerse.ayahNumber === ayahNumber)) {
      const normVerse = normalizeArabic(pVerse.arabicVerseText);
      const normWord = normalizeArabic(word.arabic);

      if (normInput.includes(normWord) || normVerse.includes(normInput)) {
        return {
          hasConflict: false,
          matchingWord: word
        };
      }
    }

    // Check other verses
    if (word.otherVerses) {
      for (const ov of word.otherVerses) {
        if (ov.surahNumber === surahNumber && (!ayahNumber || ov.ayahNumber === ayahNumber)) {
          const normVerse = normalizeArabic(ov.arabicVerseText);
          const normWord = normalizeArabic(word.arabic);
          if (normInput.includes(normWord) || normVerse.includes(normInput)) {
            return {
              hasConflict: false,
              matchingWord: word
            };
          }
        }
      }
    }
  }

  // If user entered a known verse text like Al-Hamdu Lillahi Rabbil Alamin, but gave Surah 2:10 instead of 1:2:
  for (const word of ALL_VERIFIED_WORDS) {
    const normVerse = normalizeArabic(word.primaryVerse.arabicVerseText);
    if (normVerse.includes(normInput) && word.primaryVerse.surahNumber !== surahNumber) {
      const actualSurah = getSurahByNumber(word.primaryVerse.surahNumber);
      return {
        hasConflict: true,
        message: `Discrepancy detected: The text "${textProvided}" matches Surah ${actualSurah?.nameTransliteration} (${word.primaryVerse.surahNumber}:${word.primaryVerse.ayahNumber}), but the reference cited was Surah #${surahNumber}${ayahNumber ? `:${ayahNumber}` : ''}. Please verify the reference.`,
        expectedText: word.primaryVerse.arabicVerseText,
        referenceSurah: actualSurah?.nameTransliteration
      };
    }
  }

  return { hasConflict: false };
};

// Search verified dictionary by Arabic, Transliteration, English/Translated meaning, Root, or Reference
export const searchQuranWords = (
  query: string,
  level: DifficultyLevel = 'beginner',
  language: Language = 'en'
): QuranWord[] => {
  const q = query.trim();
  if (!q) return ALL_VERIFIED_WORDS;

  const normQ = normalizeArabic(q).toLowerCase();
  const lowerQ = q.toLowerCase();

  // Check if query is a verse reference like "1:2" or "2:255"
  const refParsed = parseVerseReference(q);
  if (refParsed && refParsed.isValid) {
    const matched = ALL_VERIFIED_WORDS.filter(w => {
      if (w.primaryVerse.surahNumber === refParsed.surahNumber) {
        if (!refParsed.ayahNumber || w.primaryVerse.ayahNumber === refParsed.ayahNumber) return true;
      }
      if (w.otherVerses) {
        return w.otherVerses.some(ov => 
          ov.surahNumber === refParsed.surahNumber && (!refParsed.ayahNumber || ov.ayahNumber === refParsed.ayahNumber)
        );
      }
      return false;
    });
    if (matched.length > 0) return matched;
  }

  return ALL_VERIFIED_WORDS.filter(w => {
    // Exact or normalized Arabic match
    const normWordArabic = normalizeArabic(w.arabic);
    const normRoot = normalizeArabic(w.rootArabic);
    if (normWordArabic.includes(normQ) || normRoot.includes(normQ)) return true;

    // Transliteration match
    if (w.transliteration.toLowerCase().includes(lowerQ) || w.rootTransliteration.toLowerCase().includes(lowerQ)) return true;

    // Meaning match in active language or English
    const currentLangExp = w.explanations[level]?.[language] || w.explanations[level]?.en;
    if (currentLangExp?.meaning.toLowerCase().includes(lowerQ)) return true;
    if (currentLangExp?.inContextExplanation.toLowerCase().includes(lowerQ)) return true;

    // Root meaning match
    if (w.rootGeneralMeaning.toLowerCase().includes(lowerQ)) return true;

    // Surah name match
    if (
      w.primaryVerse.surahNameEnglish.toLowerCase().includes(lowerQ) ||
      w.primaryVerse.surahNameTransliteration.toLowerCase().includes(lowerQ)
    ) return true;

    return false;
  });
};
