import React, { useState } from 'react';
import {
  Bookmark,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { QuranWord, DifficultyLevel, Language, AppSettings, UserProgress } from '../types';
import { WordAudioButton, useAsync, useSampleVerse, RecitedVerseText } from './QuranWordBits';
import { findWordInVerse } from '../services/quranCom';
import { VerseAudioBar } from './VerseAudioBar';


/** Plays the headword as recited in its verse (the verse player below plays the whole ayah). */
const HeadwordAudio: React.FC<{ verseKey: string; highlightedWord: string }> = ({ verseKey, highlightedWord }) => {
  const { data: word } = useAsync(() => findWordInVerse(verseKey, highlightedWord), [verseKey, highlightedWord]);
  return <WordAudioButton url={word?.audioUrl} label={`Play the word as recited in ${verseKey}`} className="w-9 h-9" />;
};

interface LessonCardProps {
  word: QuranWord;
  level: DifficultyLevel;
  language: Language;
  settings: AppSettings;
  isSaved: boolean;
  progress?: UserProgress;
  onToggleSave: (wordId: string) => void;
  onRateSRS?: (wordId: string, confidence: number, wasCorrect: boolean) => void;
  onOpenComparison?: (wordId: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  word,
  level,
  language,
  settings,
  isSaved,
  progress,
  onToggleSave,
  onRateSRS,
  onOpenComparison
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showGrammarBreakdown, setShowGrammarBreakdown] = useState(level === 'advanced');
  const [showSources, setShowSources] = useState(false);

  // Retrieve current level explanation fallback to English if missing
  const explanation =
    word.explanations[level]?.[language] ||
    word.explanations[level]?.en ||
    word.explanations.beginner.en!;

  const primaryVerse = word.primaryVerse;
  const verseKey = `${primaryVerse.surahNumber}:${primaryVerse.ayahNumber}`;
  // The whole ayah, so the recited word can be followed; the lesson's excerpt until it loads
  const sample = useSampleVerse(verseKey, primaryVerse.highlightedWord);
  const currentQuestion = word.practiceQuestions?.[0];

  // Font size styling
  const fontSizes = {
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
    '2xl': 'text-5xl sm:text-6xl'
  };

  const arabicFontClass =
    settings.arabicFontFamily === 'scheherazade'
      ? 'font-quran-scheherazade'
      : 'font-quran-amiri';

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setIsAnswerSubmitted(true);
    setShowAnswer(true);

    if (onRateSRS && currentQuestion) {
      const isCorrect = selectedAnswerIndex === currentQuestion.correctIndex;
      onRateSRS(word.id, isCorrect ? 4 : 2, isCorrect);
    }
  };

  return (
    <article
      className="card overflow-hidden transition-shadow hover:shadow-lg hover:shadow-stone-900/5"
      aria-labelledby={`word-heading-${word.id}`}
    >
      {/* Card Header: Metadata, Badges & Bookmark */}
      <div className="bg-stone-50/80 dark:bg-stone-900/80 border-b border-stone-100 dark:border-stone-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Verification Badge */}
          {word.isVerified && (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/25 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full ring-1 ring-emerald-200 dark:ring-emerald-800"
              title={word.verificationStatement}
            >
              <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
              <span>Verified Medina Mushaf</span>
            </span>
          )}

          {/* Root Badge */}
          <span className="text-[11px] bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 px-2.5 py-0.5 rounded-full ring-1 ring-stone-200 dark:ring-stone-700 font-medium">
            Root <span className="font-quran-amiri text-sm font-bold text-emerald-900 dark:text-emerald-200">{word.rootArabic}</span> ({word.rootTransliteration})
          </span>

          {/* Frequency in Quran */}
          <span className="text-[11px] text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-2.5 py-1 rounded-full">
            Occurs <strong>{word.frequencyInQuran}×</strong> in Quran
          </span>

          {/* SRS Status */}
          {progress && (
            <span
              className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize ${
                progress.status === 'mastered'
                  ? 'bg-emerald-200 dark:bg-emerald-800/50 text-emerald-950 dark:text-emerald-100 font-bold'
                  : progress.status === 'reviewing'
                  ? 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200'
                  : 'bg-amber-100 dark:bg-amber-900/25 text-amber-900 dark:text-amber-200'
              }`}
            >
              SRS: {progress.status}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          {onOpenComparison && (
            <button
              onClick={() => onOpenComparison(word.id)}
              className="p-2 rounded-xl text-stone-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/25 transition-colors cursor-pointer"
              title="Compare meanings across different verses"
              aria-label="Compare word across verses"
            >
              <Compass className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onToggleSave(word.id)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSaved
                ? 'bg-amber-100 dark:bg-amber-900/25 text-amber-900 dark:text-amber-200'
                : 'text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/20'
            }`}
            title={isSaved ? 'Remove from saved words' : 'Save word to study list'}
            aria-label={isSaved ? 'Remove from saved words' : 'Save word'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600 dark:text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Section 1: Word & Transliteration */}
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2
                id={`word-heading-${word.id}`}
                className={`${arabicFontClass} ${fontSizes[settings.arabicFontSize]} quran-sized font-bold text-emerald-950 dark:text-emerald-100 arabic-text leading-tight`}
              >
                {word.arabic}
              </h2>
              <HeadwordAudio
                verseKey={verseKey}
                highlightedWord={primaryVerse.highlightedWord}
              />
            </div>

            {settings.showTransliteration && (
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-base font-semibold text-stone-700 dark:text-stone-300 tracking-wide">
                  {word.transliteration}
                </span>
                <span className="text-[11px] text-stone-400 italic">
                  (Approx. pronunciation aid)
                </span>
              </div>
            )}
          </div>

          <div className="text-right sm:text-left text-xs text-stone-500 dark:text-stone-400">
            <span className="inline-block bg-emerald-50 dark:bg-emerald-950/25 text-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full font-semibold ring-1 ring-emerald-200 dark:ring-emerald-800">
              {word.partOfSpeechArabic} • {word.partOfSpeech}
            </span>
          </div>
        </div>

        {/* Section 2: General Lexical Meaning */}
        <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-50 dark:from-amber-950/30 to-orange-50/40 dark:to-orange-950/30 ring-1 ring-amber-200/60 dark:ring-amber-900/60 ps-5 sm:ps-6 before:absolute before:start-0 before:top-4 before:bottom-4 before:w-1 before:rounded-full before:bg-amber-400">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>Plain-Language Meaning</span>
            </div>
            {explanation.isApproximate && (
              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/25 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-medium">
                Approximate Translation
              </span>
            )}
          </div>
          <p className="text-stone-900 dark:text-stone-100 text-lg sm:text-xl font-semibold leading-snug tracking-tight">
            {explanation.meaning}
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5">
            <strong>Root Concept:</strong> {word.rootGeneralMeaning}
          </p>
        </div>

        {/* Section 3: In Context (Verse quotation & commentary) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
              <span>In Context (Verse Usage)</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/25 ring-1 ring-emerald-200 dark:ring-emerald-800 px-2.5 py-1 rounded-full">
              Surah {primaryVerse.surahNameTransliteration} ({primaryVerse.surahNumber}:{primaryVerse.ayahNumber})
            </span>
          </div>

          {/* Distinct Visual Quran Quotation Block */}
          <div className="verse-panel rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-emerald-300 text-xs border-b border-emerald-800/80 pb-2">
              <span className="font-quran-amiri text-sm">{primaryVerse.surahNameArabic}</span>
              <span>Hafs ʿan ʿĀṣim · Medina Script</span>
            </div>

            {/* Arabic Verse with the lesson's word marked and the recited word followed */}
            {sample ? (
              <RecitedVerseText
                verse={sample.verse}
                marked={sample.marked}
                fontClass={arabicFontClass}
                className={`${fontSizes[settings.arabicFontSize]} quran-sized text-right text-amber-100 leading-loose`}
              />
            ) : (
              <p
                className={`${arabicFontClass} ${fontSizes[settings.arabicFontSize]} quran-sized arabic-text text-right text-amber-100 leading-loose`}
              >
                {primaryVerse.arabicVerseText}
              </p>
            )}

            {/* Translation with Attribution */}
            <div className="pt-2 border-t border-emerald-800/60">
              <p className="text-emerald-100 text-sm italic leading-relaxed">
                "{sample?.verse.translation || primaryVerse.translation}"
              </p>
              <div className="mt-1 text-[11px] text-emerald-400 flex items-center justify-between">
                <span>Translation: {sample ? 'Saheeh International' : primaryVerse.translationSource}</span>
                <span className="text-emerald-300 font-medium">Verified Citation</span>
              </div>
            </div>
          </div>

          {/* Verse Audio Player Bar */}
          <VerseAudioBar verseKey={verseKey} />

          {/* Contextual Meaning Explanation */}
          <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-4 ring-1 ring-stone-200/70 dark:ring-stone-700/70 text-sm text-stone-700 dark:text-stone-300 space-y-1.5">
            <div className="font-semibold text-emerald-950 dark:text-emerald-100 text-xs uppercase tracking-wide">
              Contextual Nuance in this Ayah:
            </div>
            <p className="leading-relaxed">{explanation.inContextExplanation}</p>
            {explanation.ambiguityOrNuance && (
              <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 text-xs text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/20 p-2.5 rounded-lg">
                <strong>Scholarly Note on Nuance / Ambiguity:</strong> {explanation.ambiguityOrNuance}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Language & Morphology Note */}
        <div className="bg-stone-50/80 dark:bg-stone-900/80 rounded-2xl p-4 sm:p-5 ring-1 ring-stone-200/70 dark:ring-stone-700/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Language &amp; Morphology Note ({level.toUpperCase()})
            </h3>
            {explanation.languageNote.breakdown && (
              <button
                onClick={() => setShowGrammarBreakdown(!showGrammarBreakdown)}
                className="text-xs text-emerald-800 dark:text-emerald-300 font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                {showGrammarBreakdown ? 'Hide Breakdown' : 'Show Breakdown'}
                {showGrammarBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 block text-[10px]">WORD CLASS &amp; PATTERN</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {explanation.languageNote.wordClass}{' '}
                {explanation.languageNote.formOrPattern ? `(${explanation.languageNote.formOrPattern})` : ''}
              </span>
            </div>
            <div className="bg-white dark:bg-stone-900 p-2 rounded-lg border border-stone-200 dark:border-stone-700">
              <span className="text-stone-400 block text-[10px]">ROOT DERIVATION</span>
              <span className="font-semibold text-emerald-900 dark:text-emerald-200 font-quran-amiri text-sm">
                {explanation.languageNote.rootArabic || word.rootArabic}
              </span>
              <span className="text-stone-600 dark:text-stone-400 text-xs ms-1.5">
                ({explanation.languageNote.rootMeaning || word.rootGeneralMeaning})
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {explanation.languageNote.morphologySummary}
          </p>

          {/* Detailed Grammar Syntax (I'rab) for Advanced Level */}
          {explanation.languageNote.grammarSyntax && (
            <div className="bg-emerald-50/80 dark:bg-emerald-950/25 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-100">
              <strong className="block text-emerald-900 dark:text-emerald-200 text-[11px] mb-0.5">Grammatical Role &amp; I'rāb (إعراب):</strong>
              <span className="arabic-text text-right block font-quran-amiri text-sm">
                {explanation.languageNote.grammarSyntax}
              </span>
            </div>
          )}

          {/* Morphological Breakdown Table */}
          {showGrammarBreakdown && explanation.languageNote.breakdown && (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-900">
                <thead className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2">Segment</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {explanation.languageNote.breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-900">
                      <td className="p-2 font-quran-amiri text-sm font-bold text-emerald-900 dark:text-emerald-200 arabic-inline">
                        {item.segment}
                      </td>
                      <td className="p-2 text-stone-700 dark:text-stone-300">{item.labelEnglish}</td>
                      <td className="p-2 text-stone-500 dark:text-stone-400 uppercase text-[10px]">{item.segmentType}</td>
                      <td className="p-2 text-stone-600 dark:text-stone-400">{item.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 5: Sources & Attributions */}
        <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
          <button
            onClick={() => setShowSources(!showSources)}
            className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold hover:underline flex items-center justify-between w-full cursor-pointer py-1"
            aria-expanded={showSources}
          >
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
              <span>Verified Sources Supporting This Lesson ({word.sources.length})</span>
            </span>
            {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSources && (
            <div className="mt-2 space-y-2 text-xs bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
              {word.sources.map((src) => (
                <div key={src.id} className="pb-2 last:pb-0 border-b last:border-0 border-stone-200 dark:border-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{src.title}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 inline-flex items-center gap-0.5 text-[11px] underline"
                      >
                        Source Link <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  {src.authorOrEditor && (
                    <span className="text-stone-500 dark:text-stone-400 block text-[11px]">Author/Editor: {src.authorOrEditor}</span>
                  )}
                  <p className="text-stone-600 dark:text-stone-400 text-[11px] mt-0.5">{src.citationText}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 6 & 7: Practice Question with Hidden Answer */}
        {currentQuestion && (
          <div className="bg-gradient-to-br from-emerald-50/80 dark:from-emerald-950/30 to-teal-50/40 dark:to-teal-950/30 rounded-2xl p-4 sm:p-5 ring-1 ring-emerald-200/70 dark:ring-emerald-800/70 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
                <span>Practice Check</span>
              </h3>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                Test your comprehension
              </span>
            </div>

            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 leading-snug">
              {currentQuestion.question}
            </p>

            {/* Multiple Choice Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = selectedAnswerIndex === optIdx;
                const isCorrect = optIdx === currentQuestion.correctIndex;

                let optionStyle = 'bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-100';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-amber-100 dark:bg-amber-900/25 border-amber-400 text-amber-950 dark:text-amber-100 font-medium shadow-xs';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-2 cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Control Button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswerIndex === null}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedAnswerIndex !== null
                      ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Submit &amp; Check Answer
                </button>
              ) : null}

              {/* Reveal Answer Manual Toggle */}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 flex items-center gap-1.5 cursor-pointer ms-auto"
              >
                {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAnswer ? 'Hide Explanation' : 'Reveal Answer & Explanation'}</span>
              </button>
            </div>

            {/* Hidden Explanation Box (revealed upon submit or reveal click) */}
            {showAnswer && (
              <div className="mt-3 p-3.5 bg-white dark:bg-stone-900 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-stone-700 dark:text-stone-300 space-y-2 animate-fadeIn">
                <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                  <span>
                    Correct Answer: {String.fromCharCode(65 + currentQuestion.correctIndex)}. {currentQuestion.options[currentQuestion.correctIndex]}
                  </span>
                </div>
                <p className="leading-relaxed text-stone-600 dark:text-stone-400">{currentQuestion.explanation}</p>

                {/* Gentle Misconception Feedback for wrong options */}
                {currentQuestion.misconceptions && selectedAnswerIndex !== null && selectedAnswerIndex !== currentQuestion.correctIndex && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-100 text-[11px]">
                    <strong>Why option {String.fromCharCode(65 + selectedAnswerIndex)} was a misconception:</strong>{' '}
                    {currentQuestion.misconceptions[selectedAnswerIndex]}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
