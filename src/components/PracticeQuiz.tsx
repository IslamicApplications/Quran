import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';
import { QuranWord, DifficultyLevel, Language, PracticeQuestion } from '../types';

interface PracticeQuizProps {
  words: QuranWord[];
  level: DifficultyLevel;
  language: Language;
  onRateWord: (wordId: string, confidence: number, wasCorrect: boolean) => void;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({
  words,
  level,
  language,
  onRateWord
}) => {
  // Extract all available practice questions
  const allQuestions: { word: QuranWord; question: PracticeQuestion }[] = [];
  words.forEach((w) => {
    w.practiceQuestions.forEach((q) => {
      allQuestions.push({ word: w, question: q });
    });
  });

  const [questionList, setQuestionList] = useState(allQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectList, setIncorrectList] = useState<{ word: QuranWord; question: PracticeQuestion }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = questionList[currentIndex];

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentItem.question.correctIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      onRateWord(currentItem.word.id, 5, true);
    } else {
      setIncorrectList((prev) => [...prev, currentItem]);
      onRateWord(currentItem.word.id, 2, false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = (onlyIncorrect = false) => {
    if (onlyIncorrect && incorrectList.length > 0) {
      setQuestionList(incorrectList);
    } else {
      setQuestionList(allQuestions);
    }
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setIncorrectList([]);
    setIsFinished(false);
  };

  if (allQuestions.length === 0) {
    return (
      <div className="card p-8 text-center text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
        No quiz questions available for current selection.
      </div>
    );
  }

  // Quiz Finished State
  if (isFinished) {
    const accuracy = Math.round((correctCount / questionList.length) * 100);
    return (
      <div className="max-w-2xl mx-auto card p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-200">Quiz Completed!</h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
            You answered <strong>{correctCount}</strong> of <strong>{questionList.length}</strong> questions correctly ({accuracy}% accuracy).
          </p>
        </div>

        <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed max-w-lg mx-auto">
          <strong>Scholarly Note:</strong> Active recall reinforces vocabulary retention, but consistent recitation and pondering (Tadabbur) in prayer solidify true understanding.
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {incorrectList.length > 0 && (
            <button
              onClick={() => handleRestart(true)}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry {incorrectList.length} Missed Questions</span>
            </button>
          )}

          <button
            onClick={() => handleRestart(false)}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Full Quiz ({allQuestions.length} Questions)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Top Header */}
      <div className="flex items-center justify-between card p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
          <h2 className="text-base font-bold text-stone-800 dark:text-stone-200">Quranic Vocabulary Quiz</h2>
        </div>
        <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 px-3 py-1 rounded-full">
          Question {currentIndex + 1} of {questionList.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-emerald-700 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questionList.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        {/* Word Context Anchor */}
        <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-quran-amiri text-2xl font-bold text-emerald-950 dark:text-emerald-100">
              {currentItem.word.arabic}
            </span>
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              ({currentItem.word.transliteration})
            </span>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Surah {currentItem.word.primaryVerse.surahNameTransliteration} {currentItem.word.primaryVerse.surahNumber}:{currentItem.word.primaryVerse.ayahNumber}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200 leading-snug">
          {currentItem.question.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentItem.question.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentItem.question.correctIndex;

            let btnStyle = 'bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200';

            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold ring-2 ring-emerald-400/30';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-100 font-medium';
              }
            } else if (isSelected) {
              btnStyle = 'bg-amber-100 dark:bg-amber-900/25 border-amber-400 text-amber-950 dark:text-amber-100 font-semibold shadow-xs';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isSubmitted}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>

                {isSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation & Gentle Feedback on Submit */}
        {isSubmitted && (
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/25 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-stone-700 dark:text-stone-300 space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-100 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
              <span>
                {selectedOption === currentItem.question.correctIndex ? 'Correct!' : 'Review the Explanation:'}
              </span>
            </div>
            <p className="leading-relaxed text-stone-700 dark:text-stone-300">{currentItem.question.explanation}</p>

            {/* Misconception note */}
            {currentItem.question.misconceptions &&
              selectedOption !== null &&
              selectedOption !== currentItem.question.correctIndex && (
                <div className="p-3 bg-amber-100/70 dark:bg-amber-900/25 rounded-xl border border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-100 text-xs mt-2">
                  <strong>Clarification on option {String.fromCharCode(65 + selectedOption)}:</strong>{' '}
                  {currentItem.question.misconceptions[selectedOption]}
                </div>
              )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedOption !== null
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{currentIndex < questionList.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
