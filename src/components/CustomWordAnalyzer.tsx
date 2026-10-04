import React, { useState } from 'react';
import {
  SearchCode,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Info,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { SURAH_LIST, getSurahByNumber } from '../data/surahList';
import {
  normalizeArabic,
  parseVerseReference,
  checkVerseReferenceMatch
} from '../services/quranApi';
import { ALL_VERIFIED_WORDS } from '../data/quranVocab';
import { DifficultyLevel, Language } from '../types';

interface CustomWordAnalyzerProps {
  level: DifficultyLevel;
  language: Language;
  onSelectVerifiedWord?: (wordId: string) => void;
}

export const CustomWordAnalyzer: React.FC<CustomWordAnalyzerProps> = ({
  level,
  language,
  onSelectVerifiedWord
}) => {
  const [inputText, setInputText] = useState('');
  const [surahInput, setSurahInput] = useState('');
  const [ayahInput, setAyahInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !surahInput.trim()) return;

    const trimmedText = inputText.trim();
    const surahNum = surahInput ? parseInt(surahInput, 10) : undefined;
    const ayahNum = ayahInput ? parseInt(ayahInput, 10) : undefined;

    // Check Surah validity
    if (surahNum) {
      const surah = getSurahByNumber(surahNum);
      if (!surah) {
        setAnalysisResult({
          type: 'error',
          title: 'Invalid Surah Reference',
          message: `Surah #${surahNum} does not exist. The Holy Quran consists of 114 Surahs.`
        });
        return;
      }
      if (ayahNum && (ayahNum < 1 || ayahNum > surah.totalAyahs)) {
        setAnalysisResult({
          type: 'error',
          title: 'Invalid Ayah Number',
          message: `Surah ${surah.nameTransliteration} (${surah.nameArabic}) contains ${surah.totalAyahs} ayahs. Ayah #${ayahNum} does not exist.`
        });
        return;
      }
    }

    // Check for verse text & reference discrepancy / conflict
    const conflictCheck = checkVerseReferenceMatch(trimmedText, surahNum, ayahNum);
    if (conflictCheck.hasConflict) {
      setAnalysisResult({
        type: 'conflict',
        title: 'Verse Text & Reference Mismatch Detected',
        message: conflictCheck.message,
        expectedText: conflictCheck.expectedText,
        referenceSurah: conflictCheck.referenceSurah
      });
      return;
    }

    // Check if word exists in verified collection
    const normInput = normalizeArabic(trimmedText);
    const verifiedMatch = ALL_VERIFIED_WORDS.find(
      (w) =>
        normalizeArabic(w.arabic) === normInput ||
        w.transliteration.toLowerCase() === trimmedText.toLowerCase() ||
        normalizeArabic(w.rootArabic) === normInput
    );

    if (verifiedMatch) {
      setAnalysisResult({
        type: 'verified',
        word: verifiedMatch
      });
      return;
    }

    // If not in verified collection:
    // Follow Accuracy Requirement #7: If a word cannot be verified, ask for spelling or verse context. Never guess or silently replace.
    const isArabicScript = /[\u0600-\u06FF]/.test(trimmedText);

    setAnalysisResult({
      type: 'unverified_request_context',
      input: trimmedText,
      isArabicScript,
      surahNum,
      ayahNum,
      message: isArabicScript
        ? `The word "${trimmedText}" was received. To ensure strict scholarly accuracy without inventing meanings, please provide its complete verse text or Surah:Ayah citation so we can locate its contextual Quranic morphology.`
        : `"${trimmedText}" is in Latin script. Transliterations can represent multiple distinct Arabic roots. Please supply the exact Arabic spelling or cite the Surah and Ayah reference.`
    });
  };

  const loadExample = (text: string, surah?: number, ayah?: number) => {
    setInputText(text);
    setSurahInput(surah ? surah.toString() : '');
    setAyahInput(ayah ? ayah.toString() : '');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="card p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
            <SearchCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200">Custom Word &amp; Verse Analyzer</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Enter any Quranic Arabic word, phrase, or citation to verify references and examine morphology.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Arabic Word, Phrase, or English Transliteration:
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. رَبّ, تَقْوَى, نُور, ٱلْحَمْدُ لِلَّهِ, or Taqwa..."
              className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-emerald-900/20 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-sm focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Surah Number (Optional, 1-114):
              </label>
              <select
                value={surahInput}
                onChange={(e) => setSurahInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-emerald-900/20 dark:border-stone-700 text-xs sm:text-sm text-stone-700 dark:text-stone-300 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="">-- Choose Surah (Optional) --</option>
                {SURAH_LIST.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.nameTransliteration} ({s.nameArabic})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Ayah Number (Optional):
              </label>
              <input
                type="number"
                min={1}
                max={286}
                value={ayahInput}
                onChange={(e) => setAyahInput(e.target.value)}
                placeholder="e.g. 2, 255, 197"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-emerald-900/20 dark:border-stone-700 text-xs sm:text-sm text-stone-700 dark:text-stone-300 focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* Quick Examples */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-stone-500 dark:text-stone-400 pt-1">
            <span className="font-semibold">Test Examples:</span>
            <button
              type="button"
              onClick={() => loadExample('رَبّ', 1, 2)}
              className="text-emerald-800 dark:text-emerald-300 hover:underline bg-emerald-50 dark:bg-emerald-950/25 px-2 py-0.5 rounded cursor-pointer"
            >
              رَبّ (1:2)
            </button>
            <button
              type="button"
              onClick={() => loadExample('تَقْوَى', 2, 197)}
              className="text-emerald-800 dark:text-emerald-300 hover:underline bg-emerald-50 dark:bg-emerald-950/25 px-2 py-0.5 rounded cursor-pointer"
            >
              تَقْوَى (2:197)
            </button>
            <button
              type="button"
              onClick={() => loadExample('ٱلْحَمْدُ لِلَّهِ', 2, 10)}
              className="text-amber-800 dark:text-amber-300 hover:underline bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded cursor-pointer"
              title="Test Conflict Detector: Mismatched Surah 2:10"
            >
              Mismatch Test (1:2 cited as 2:10)
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <SearchCode className="w-4 h-4" />
            <span>Analyze &amp; Verify Word Reference</span>
          </button>
        </form>
      </div>

      {/* Analysis Output Section */}
      {analysisResult && (
        <div className="animate-fadeIn">
          {/* Case 1: Verified Word Found */}
          {analysisResult.type === 'verified' && (
            <div className="card ring-2 ring-emerald-500/30 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/25 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100 uppercase tracking-wide">
                    Verified Quranic Entry Found
                  </span>
                </div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300">
                  {analysisResult.word.verificationStatement}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <div className="font-quran-amiri text-4xl font-bold text-emerald-950 dark:text-emerald-100">
                    {analysisResult.word.arabic}
                  </div>
                  <div className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    {analysisResult.word.transliteration} • Root: {analysisResult.word.rootArabic}
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                  {analysisResult.word.frequencyInQuran} Quranic Occurrences
                </span>
              </div>

              <div className="text-sm text-stone-700 dark:text-stone-300">
                <strong>General Meaning:</strong> {analysisResult.word.explanations[level]?.en?.meaning || analysisResult.word.explanations.beginner.en?.meaning}
              </div>

              {onSelectVerifiedWord && (
                <button
                  onClick={() => onSelectVerifiedWord(analysisResult.word.id)}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Full Interactive Lesson &amp; Sources</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Case 2: Conflict / Mismatch Detected */}
          {analysisResult.type === 'conflict' && (
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-300 dark:border-amber-900/60 space-y-4">
              <div className="flex items-center gap-2 text-amber-950 dark:text-amber-100 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                <span>{analysisResult.title}</span>
              </div>

              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed bg-white/70 dark:bg-stone-900/70 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60">
                {analysisResult.message}
              </p>

              {analysisResult.expectedText && (
                <div className="verse-panel p-4 rounded-xl text-xs space-y-1">
                  <span className="text-emerald-300 text-[11px]">Matching Quranic Verse:</span>
                  <p className="font-quran-amiri text-lg text-amber-100 arabic-text text-right">
                    {analysisResult.expectedText}
                  </p>
                </div>
              )}

              <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                *In accordance with our scholarly verification guidelines, we do not guess or silently alter cited verse references without clarification.
              </p>
            </div>
          )}

          {/* Case 3: Error */}
          {analysisResult.type === 'error' && (
            <div className="bg-rose-50 dark:bg-rose-950/40 rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-200 dark:border-rose-800 space-y-3 text-rose-950 dark:text-rose-100">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-900 dark:text-rose-200">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span>{analysisResult.title}</span>
              </div>
              <p className="text-xs sm:text-sm">{analysisResult.message}</p>
            </div>
          )}

          {/* Case 4: Unverified - Request Context / Clarification */}
          {analysisResult.type === 'unverified_request_context' && (
            <div className="card p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                <span>Context Required for Strict Scholarly Verification</span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-700">
                {analysisResult.message}
              </p>

              <div className="bg-amber-50/80 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-100 space-y-1.5">
                <div className="font-bold flex items-center gap-1 text-amber-900 dark:text-amber-200">
                  <Info className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                  <span>Why do we ask for verse context?</span>
                </div>
                <p className="leading-relaxed">
                  Arabic words often have distinct root derivations and nuanced meanings depending on their specific verse syntax (إعراب) and Surah context. To avoid unverified speculation or AI hallucinations, our verified engine requires the cited verse to anchor morphological analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
