import { t } from '../i18n/strings';
import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, ArrowRight, Award, Volume2, Shuffle } from 'lucide-react';
import { QuranWord, DifficultyLevel, Language } from '../types';
import { getCoverageList, fetchWordAt, formatRoot, playAudio, tagGroup, CoverageWord, QVerse } from '../services/quranCom';
import { knownLemmasStore, useKnownLemmas } from '../hooks/useKnownLemmas';
import { isAnyModalOpen } from '../hooks/useModalBehavior';
import { buildStages, courseCardId, spokenView, DictionaryForm } from './courseWords';
import { useAsync, LoadingBlock, ErrorBlock, WordAudioButton, RecitedVerseText, useSampleVerse } from './QuranWordBits';
import { VerseAudioBar } from './VerseAudioBar';

const QUIZ_LENGTH = 10;
/** Extra course words loaded alongside a quiz's own, to draw wrong answers from. */
const DISTRACTOR_POOL = 30;
/** Thrown when a selection has too few words to build questions with wrong answers. */
const TOO_FEW_WORDS = 'Not enough words loaded';
const LESSONS_SOURCE = 'lessons';
const KNOWN_SOURCE = 'known';

type QuizKind = 'lesson' | 'meaning' | 'arabic' | 'listen' | 'listen-arabic';

/** Mixed: reading and listening questions; listening: every word heard, not seen, until answered. */
type QuizStyle = 'mixed' | 'listening';

const LISTENING: QuizKind[] = ['listen', 'listen-arabic'];

/** One multiple-choice question, from a detailed lesson or generated from an 85% Course word. */
interface QuizItem {
  /** Progress id the answer is recorded under. */
  cardId: string;
  kind: QuizKind;
  prompt: string;
  arabic: string;
  transliteration?: string;
  audioUrl?: string;
  /** Dictionary form, when the word is quizzed in a different recited form. */
  lemma?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  misconceptions?: Record<number, string>;
  reference: string;
  /** The course word's sample verse, shown with the answer. */
  verse?: { verse: QVerse; marked: number };
  /** The verse the question is about ("2:255"), recited with the answer */
  verseKey?: string;
  /** A lesson's word as written in its verse, to mark it there */
  highlighted?: string;
  details?: string;
}

const shuffle = <T,>(items: readonly T[]): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** The question with its options in a new order, keeping the answer and misconception notes with their options. */
const shuffleOptions = (item: QuizItem): QuizItem => {
  const order = shuffle(item.options.map((_, i) => i));
  return {
    ...item,
    options: order.map((i) => item.options[i]),
    correctIndex: order.indexOf(item.correctIndex),
    misconceptions: item.misconceptions
      ? Object.fromEntries(Object.entries(item.misconceptions).map(([i, note]) => [order.indexOf(Number(i)), note]))
      : undefined
  };
};

/** The lessons' own questions, with their options shuffled (most had the answer first). */
const lessonQuiz = (words: QuranWord[]): QuizItem[] =>
  shuffle(
    words.flatMap((w) =>
      w.practiceQuestions.map((q) =>
        shuffleOptions({
          cardId: w.id,
          kind: 'lesson',
          prompt: q.question,
          arabic: w.arabic,
          transliteration: w.transliteration,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          misconceptions: q.misconceptions,
          reference: `Surah ${w.primaryVerse.surahNameTransliteration} ${w.primaryVerse.surahNumber}:${w.primaryVerse.ayahNumber}`,
          verseKey: `${w.primaryVerse.surahNumber}:${w.primaryVerse.ayahNumber}`,
          highlighted: w.primaryVerse.highlightedWord
        })
      )
    )
  );

const sameText = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Questions on course words, each asked one of three ways: the meaning of a word, the word for a meaning,
 * or the meaning of a word heard but not seen. Words and meanings are the ones the course shows: the form
 * recited in the sample verse and Quran.com's gloss of it. Wrong answers are other words of the same stage,
 * of the same kind (verb, noun, particle) where possible, never sharing the answer's meaning or spelling.
 */
const courseQuiz = async (words: CoverageWord[], style: QuizStyle = 'mixed'): Promise<QuizItem[]> => {
  const picked = shuffle(words).slice(0, QUIZ_LENGTH + DISTRACTOR_POOL);
  const settled = await Promise.allSettled(picked.map((w) => fetchWordAt(w.sample)));
  const loaded = picked.flatMap((word, i) => {
    const result = settled[i];
    if (result.status !== 'fulfilled' || !result.value.word) return [];
    const view = spokenView(word, result.value.word, false);
    if (!view.arabic || !view.meaning) return [];
    return [{ word, sample: result.value, arabic: view.arabic, meaning: view.meaning, differs: view.differs }];
  });
  if (loaded.length < 4) throw new Error(TOO_FEW_WORDS);

  // Listening asks for the meaning of the word heard, then for its spelling among written words
  const kinds: QuizKind[] = style === 'listening' ? LISTENING : ['meaning', 'arabic', 'listen'];
  return loaded.slice(0, Math.min(QUIZ_LENGTH, loaded.length - 3)).map((q, i) => {
    const others = shuffle(
      loaded.filter(
        (o) => o.word.lemma !== q.word.lemma && !sameText(o.meaning, q.meaning) && o.arabic !== q.arabic
      )
    );
    const group = tagGroup(q.word.tag);
    const distractors = [...others.filter((o) => tagGroup(o.word.tag) === group), ...others.filter((o) => tagGroup(o.word.tag) !== group)]
      // two wrong answers that share a meaning or a spelling would make each other obviously wrong
      .filter((o, j, all) => all.findIndex((x) => sameText(x.meaning, o.meaning) || x.arabic === o.arabic) === j)
      .slice(0, 3);
    const choices = shuffle([q, ...distractors]);
    let kind = kinds[i % kinds.length];
    if (LISTENING.includes(kind) && !q.sample.word?.audioUrl) kind = kind === 'listen' ? 'meaning' : 'arabic';
    const [s, a, w] = q.word.sample.split(':').map(Number);

    return {
      cardId: courseCardId(q.word.lemma),
      kind,
      prompt:
        kind === 'arabic'
          ? `Which word means “${q.meaning}”?`
          : kind === 'listen'
          ? 'Listen to the word. What does it mean?'
          : kind === 'listen-arabic'
          ? 'Listen to the word. Which one did you hear?'
          : 'What does this word mean?',
      arabic: q.arabic,
      transliteration: q.sample.word?.transliteration,
      audioUrl: q.sample.word?.audioUrl,
      lemma: q.differs ? q.word.lemma : undefined,
      options: choices.map((c) => (kind === 'arabic' || kind === 'listen-arabic' ? c.arabic : c.meaning)),
      correctIndex: choices.indexOf(q),
      reference: `${s}:${a}`,
      verseKey: `${s}:${a}`,
      verse: { verse: q.sample.verse, marked: w - 1 },
      details: `${q.word.appearances.toLocaleString()}× in the Quran${q.word.root ? ` · root ${formatRoot(q.word.root)}` : ''}`
    };
  });
};

interface PracticeQuizProps {
  words: QuranWord[];
  level: DifficultyLevel;
  language: Language;
  onRateWord: (wordId: string, confidence: number, wasCorrect: boolean) => void;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({ words, onRateWord }) => {
  const course = useAsync(getCoverageList, []);
  const known = useKnownLemmas();
  const stages = useMemo(() => (course.data ? buildStages(course.data.words, course.data.totalWords) : []), [course.data]);
  const knownWords = useMemo(() => course.data?.words.filter((w) => known.has(w.lemma)) ?? [], [course.data, known]);
  const [source, setSource] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const [style, setStyle] = useState<QuizStyle>('mixed');

  // Start on the stage the learner is up to, or the lessons' questions if the course can't load
  useEffect(() => {
    if (source) return;
    if (course.error) setSource(LESSONS_SOURCE);
    else if (stages.length) {
      const stage = stages.find((st) => st.words.some((w) => !known.has(w.lemma))) ?? stages[0];
      setSource(`stage-${stage.index}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.data, course.error]);

  // Each quiz is tagged with the selection it was made for. useAsync keeps the previous result until the
  // next one arrives, and a quiz shown under the wrong selection would also keep its questions.
  const quizId = `${source}:${style}:${round}`;
  const quiz = useAsync(async (): Promise<{ id: string; items: QuizItem[] } | null> => {
    if (!source) return null;
    if (source === LESSONS_SOURCE) return { id: quizId, items: lessonQuiz(words) };
    const { words: all, totalWords } = await getCoverageList();
    const pool =
      source === KNOWN_SOURCE
        ? all.filter((w) => knownLemmasStore.get().has(w.lemma))
        : buildStages(all, totalWords)[Number(source.replace('stage-', ''))]?.words ?? [];
    return { id: quizId, items: await courseQuiz(pool, style) };
  }, [source, style, round]);
  const current = quiz.data?.id === quizId ? quiz.data.items : undefined;

  const header = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 card p-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
        <h2 className="text-base font-bold text-stone-800 dark:text-stone-200">{t('quizTitle')}</h2>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-stone-500 dark:text-stone-400 font-medium">{t('quizOn')}</span>
        <select
          value={source ?? ''}
          onChange={(e) => setSource(e.target.value)}
          aria-label="Quiz words"
          className="px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer max-w-[16rem]"
        >
          {!source && <option value="">Loading…</option>}
          <optgroup label="85% Course words">
            {stages.map((stage) => (
              <option key={stage.index} value={`stage-${stage.index}`}>
                Stage {stage.index + 1}: {stage.title} ({stage.words.length})
              </option>
            ))}
            <option value={KNOWN_SOURCE} disabled={knownWords.length < 4}>
              Words you know ({knownWords.length})
            </option>
          </optgroup>
          <optgroup label="Detailed lessons">
            <option value={LESSONS_SOURCE}>Lesson questions ({words.reduce((n, w) => n + w.practiceQuestions.length, 0)})</option>
          </optgroup>
        </select>
        {source !== LESSONS_SOURCE && (
          <span className="inline-flex rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-0.5" role="group" aria-label="Question type">
            {(['mixed', 'listening'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                aria-pressed={style === s}
                className={`px-2 py-1 rounded-md font-semibold cursor-pointer ${
                  style === s ? 'bg-white dark:bg-stone-900 text-emerald-900 dark:text-emerald-200 shadow-sm' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {s === 'mixed' ? t('mixed') : t('listening')}
              </button>
            ))}
          </span>
        )}
        <button
          onClick={() => setRound((n) => n + 1)}
          disabled={!source || quiz.loading}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-50 cursor-pointer"
          title="New questions"
        >
          <Shuffle className="w-3.5 h-3.5" /> {t('newQuiz')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {header}
      {quiz.error ? (
        <div className="card">
          <ErrorBlock
            message={
              quiz.error instanceof Error && quiz.error.message === TOO_FEW_WORDS
                ? 'Not enough words in this selection to make a quiz. Choose another, or mark more words as known.'
                : 'Could not load the quiz words from Quran.com. Check your connection and try again.'
            }
            onRetry={quiz.retry}
          />
        </div>
      ) : !current ? (
        <div className="card">
          <LoadingBlock label="Preparing your quiz…" />
        </div>
      ) : current.length === 0 ? (
        <div className="card p-8 text-center text-stone-600 dark:text-stone-400">No quiz questions available for this selection.</div>
      ) : (
        <QuizRun
          key={quizId}
          items={current}
          onRateWord={onRateWord}
          onNewQuiz={source === LESSONS_SOURCE ? undefined : () => setRound((n) => n + 1)}
        />
      )}
    </div>
  );
};

const QuizRun: React.FC<{
  items: QuizItem[];
  onRateWord: PracticeQuizProps['onRateWord'];
  onNewQuiz?: () => void;
}> = ({ items, onRateWord, onNewQuiz }) => {
  const [questionList, setQuestionList] = useState(items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectList, setIncorrectList] = useState<QuizItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = questionList[currentIndex];

  // A listening question has nothing to read until answered, so it speaks first (after the learner's click)
  useEffect(() => {
    if (currentItem && LISTENING.includes(currentItem.kind) && currentItem.audioUrl) playAudio(currentItem.audioUrl);
  }, [currentItem]);

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentItem.correctIndex;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      onRateWord(currentItem.cardId, 4, true); // picking from options is easier than recall: Good, not Easy
    } else {
      setIncorrectList((prev) => [...prev, currentItem]);
      onRateWord(currentItem.cardId, 2, false);
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
    // Shuffle the options again, so a retry tests the word rather than where its answer was
    setQuestionList((onlyIncorrect ? incorrectList : items).map(shuffleOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setCorrectCount(0);
    setIncorrectList([]);
    setIsFinished(false);
  };

  // Keys: 1-4 or A-D pick an answer, Enter submits and moves on
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        isFinished ||
        isAnyModalOpen() ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      )
        return;
      const pick = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase());
      if (pick >= 0 && pick < currentItem.options.length && e.key.length === 1) handleSelect(pick);
      // Enter on a button outside the quiz card keeps its own meaning
      else if (e.key === 'Enter' && (target.tagName !== 'BUTTON' || target.closest('[data-quiz-card]'))) {
        e.preventDefault();
        if (isSubmitted) handleNext();
        else handleSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Quiz Finished State
  if (isFinished) {
    const accuracy = Math.round((correctCount / questionList.length) * 100);
    return (
      <div className="card p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-200">{t('quizCompleted')}</h2>
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

          {onNewQuiz ? (
            <button
              onClick={onNewQuiz}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>{t('newQuiz')}</span>
            </button>
          ) : (
            <button
              onClick={() => handleRestart(false)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Full Quiz ({items.length} Questions)</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const answeredCorrectly = selectedOption === currentItem.correctIndex;
  const hideWord = LISTENING.includes(currentItem.kind) && !isSubmitted;
  const showWord = currentItem.kind !== 'arabic' || isSubmitted;

  return (
    <>
      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
          <span>
            Question {currentIndex + 1} of {questionList.length}
          </span>
          <span className="text-stone-400 hidden sm:inline">
            Press <strong>1–4</strong> to choose, <strong>Enter</strong> to submit
          </span>
        </div>
        <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questionList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card p-6 sm:p-8 space-y-6" data-quiz-card>
        {currentItem.kind === 'lesson' ? (
          /* Word Context Anchor */
          <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3.5 rounded-2xl border border-amber-200/50 dark:border-amber-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-quran-amiri text-2xl font-bold text-emerald-950 dark:text-emerald-100">{currentItem.arabic}</span>
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">({currentItem.transliteration})</span>
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400">{currentItem.reference}</span>
          </div>
        ) : hideWord ? (
          <div className="flex justify-center py-4">
            <button
              onClick={() => currentItem.audioUrl && playAudio(currentItem.audioUrl)}
              className="w-20 h-20 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white flex items-center justify-center shadow-md cursor-pointer"
              aria-label="Play the word"
            >
              <Volume2 className="w-8 h-8" />
            </button>
          </div>
        ) : (
          showWord && (
            <div className="text-center space-y-2 py-2">
              <div dir="rtl" className="font-quran-amiri text-5xl sm:text-6xl font-bold text-emerald-950 dark:text-emerald-100 leading-snug">
                {currentItem.arabic}
              </div>
              {currentItem.lemma && <DictionaryForm lemma={currentItem.lemma} />}
              <div className="flex items-center justify-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <WordAudioButton url={currentItem.audioUrl} label="Play the word as recited" />
                {isSubmitted && currentItem.transliteration && <span>{currentItem.transliteration}</span>}
              </div>
            </div>
          )
        )}

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200 leading-snug">{currentItem.prompt}</h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentItem.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentItem.correctIndex;

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
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {currentItem.kind === 'arabic' || currentItem.kind === 'listen-arabic' ? (
                    <span dir="rtl" className="font-quran-amiri text-2xl font-bold leading-relaxed">
                      {opt}
                    </span>
                  ) : (
                    <span className="leading-relaxed">{opt}</span>
                  )}
                </div>

                {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-300 shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Explanation & Gentle Feedback on Submit */}
        {isSubmitted && (
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/25 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-stone-700 dark:text-stone-300 space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-100 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
              <span>{answeredCorrectly ? t('correct') : currentItem.explanation ? 'Review the Explanation:' : 'Not quite. Here it is in its verse:'}</span>
            </div>
            {currentItem.explanation && <p className="leading-relaxed text-stone-700 dark:text-stone-300">{currentItem.explanation}</p>}

            {currentItem.verse && (
              <div className="verse-panel rounded-xl p-3 space-y-1.5">
                <RecitedVerseText
                  verse={currentItem.verse.verse}
                  marked={currentItem.verse.marked}
                  className="text-lg text-amber-100 text-right leading-loose"
                />
                <p dir="auto" className="text-emerald-100 italic text-[11px]">
                  “{currentItem.verse.verse.translation}” ({currentItem.reference})
                </p>
              </div>
            )}
            {!currentItem.verse && currentItem.verseKey && (
              <LessonVerse verseKey={currentItem.verseKey} highlighted={currentItem.highlighted} reference={currentItem.reference} />
            )}
            {/* Hear the verse, with each word lit as it is recited (and its translation, if chosen) */}
            {currentItem.verseKey && <VerseAudioBar verseKey={currentItem.verseKey} />}
            {currentItem.details && <p className="text-stone-500 dark:text-stone-400">{currentItem.details}</p>}

            {/* Misconception note */}
            {currentItem.misconceptions?.[selectedOption!] && !answeredCorrectly && (
              <div className="p-3 bg-amber-100/70 dark:bg-amber-900/25 rounded-xl border border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-100 text-xs mt-2">
                <strong>Clarification on option {String.fromCharCode(65 + selectedOption!)}:</strong>{' '}
                {currentItem.misconceptions[selectedOption!]}
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
              {t('submitAnswer')}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{currentIndex < questionList.length - 1 ? t('nextQuestion') : t('finishQuiz')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

/** A lesson question's verse in full, its word marked, following the recitation; nothing until it loads. */
const LessonVerse: React.FC<{ verseKey: string; highlighted?: string; reference: string }> = ({ verseKey, highlighted, reference }) => {
  const sample = useSampleVerse(verseKey, highlighted ?? '');
  // The previous question's verse stays loaded until this one arrives
  if (!sample || sample.verse.key !== verseKey) return null;
  return (
    <div className="verse-panel rounded-xl p-3 space-y-1.5">
      <RecitedVerseText verse={sample.verse} marked={sample.marked} className="text-lg text-amber-100 text-right leading-loose" />
      <p dir="auto" className="text-emerald-100 italic text-[11px]">
        “{sample.verse.translation}” ({reference})
      </p>
    </div>
  );
};
