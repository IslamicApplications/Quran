import React, { useEffect, useMemo, useState } from 'react';
import { BookMarked, Search, Star, ChevronDown, Layers, X } from 'lucide-react';
import { ROOT_CONCORDANCE } from '../data/corpusData';
import { SURAH_LIST } from '../data/surahList';
import { normalizeArabic } from '../services/quranApi';
import { getRootIndex, fetchVerse, formatRoot, RootIndexEntry } from '../services/quranCom';
import { LoadingBlock, ErrorBlock, useAsync, WordAudioButton, TagBadge } from './QuranWordBits';

interface RootConcordanceViewerProps {
  initialRoot?: string;
  onOpenVerse?: (verseKey: string) => void;
}

const MAX_LIST = 150;
const OCCURRENCES_PAGE = 6;

const featuredFor = (root: string) => ROOT_CONCORDANCE.find((r) => r.rootSimple === root);

export const RootConcordanceViewer: React.FC<RootConcordanceViewerProps> = ({ initialRoot, onOpenVerse }) => {
  const { data: index, loading, error, retry } = useAsync(getRootIndex, []);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>(initialRoot || 'رحم');

  useEffect(() => {
    if (initialRoot) setSelected(initialRoot);
  }, [initialRoot]);

  const sortedRoots = useMemo(
    () => (index ? Object.entries(index).sort((a, b) => b[1].n - a[1].n) : []),
    [index]
  );

  const matches = useMemo(() => {
    const raw = query.trim();
    if (!raw) return sortedRoots;
    const q = normalizeArabic(raw).replace(/[\s-]/g, '');
    const latin = raw.toLowerCase();
    return sortedRoots.filter(([root, entry]) => {
      if (normalizeArabic(root).includes(q)) return true;
      if (Object.keys(entry.l).some((lemma) => normalizeArabic(lemma).includes(q))) return true;
      const featured = featuredFor(root);
      return (
        !!featured &&
        (featured.rootTransliteration.toLowerCase().includes(latin) ||
          featured.generalMeaning.toLowerCase().includes(latin))
      );
    });
  }, [sortedRoots, query]);

  const entry = index?.[selected];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-amber-100 dark:bg-amber-900/25 text-amber-900 dark:text-amber-200 flex items-center justify-center">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">Root Dictionary</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Every root in the Quran{index ? ` (${sortedRoots.length.toLocaleString()})` : ''}, with each word built
              from it and every place it appears.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card">
          <LoadingBlock label="Loading root index…" />
        </div>
      ) : error || !index ? (
        <div className="card">
          <ErrorBlock message="Could not load the root index." onRetry={retry} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Root list */}
          <div className="card p-3 md:sticky md:top-20">
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Root or word: رحم, كتاب, mercy"
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 ring-1 ring-stone-200 dark:ring-stone-700 text-sm focus:bg-white dark:focus:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 cursor-pointer"
                  aria-label="Clear"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="px-2 pb-1 text-[11px] text-stone-400">
              {matches.length.toLocaleString()} root{matches.length === 1 ? '' : 's'}
              {matches.length > MAX_LIST ? ` · showing top ${MAX_LIST} by frequency` : ''}
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-0.5 pr-1">
              {matches.slice(0, MAX_LIST).map(([root, e]) => {
                const isSelected = selected === root;
                return (
                  <button
                    key={root}
                    onClick={() => setSelected(root)}
                    className={`w-full px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected ? 'bg-emerald-900 text-white dark:bg-emerald-400/10 dark:text-emerald-200 dark:shadow-none dark:ring-1 dark:ring-emerald-400/20' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-quran-amiri text-xl font-bold">{formatRoot(root)}</span>
                      {featuredFor(root) && (
                        <Star className={`w-3 h-3 ${isSelected ? 'text-amber-300 fill-amber-300' : 'text-amber-500 fill-amber-400'}`} />
                      )}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                        isSelected ? 'bg-emerald-950 text-amber-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {e.n}×
                    </span>
                  </button>
                );
              })}
              {matches.length === 0 && (
                <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-6">No roots match “{query}”.</p>
              )}
            </div>
          </div>

          {/* Root detail */}
          <div className="md:col-span-2">
            {entry ? (
              <RootDetail key={selected} root={selected} entry={entry} onOpenVerse={onOpenVerse} />
            ) : (
              <div className="card p-8 text-center text-sm text-stone-500 dark:text-stone-400">Select a root.</div>
            )}
          </div>
        </div>
      )}

      <p className="text-[11px] text-stone-400 text-center">
        Roots &amp; lemmas: Quranic Arabic Corpus (GPL-3.0) · Verses &amp; meanings: Quran.com
      </p>
    </div>
  );
};

const RootDetail: React.FC<{ root: string; entry: RootIndexEntry; onOpenVerse?: (key: string) => void }> = ({
  root,
  entry,
  onOpenVerse
}) => {
  const featured = featuredFor(root);
  const lemmas = Object.entries(entry.l).sort((a, b) => b[1].length - a[1].length);
  const [openLemma, setOpenLemma] = useState<string | null>(lemmas[0]?.[0] ?? null);

  return (
    <div className="card p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 dark:from-amber-950/30 to-orange-50/40 dark:to-orange-950/30 ring-1 ring-amber-200/70 dark:ring-amber-900/60 p-5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-quran-amiri text-5xl font-bold text-emerald-950 dark:text-emerald-100">{formatRoot(root)}</span>
            {featured && (
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">{featured.rootTransliteration}</div>
                <div className="text-xs text-stone-500 dark:text-stone-400">{featured.semanticCategory}</div>
              </div>
            )}
          </div>
          <div className="flex gap-2 text-xs">
            <span className="bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-3 py-1 rounded-full font-semibold text-stone-700 dark:text-stone-300">
              {entry.n} occurrences
            </span>
            <span className="bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 px-3 py-1 rounded-full font-semibold text-stone-700 dark:text-stone-300">
              {lemmas.length} word form{lemmas.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        {featured && (
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
            <strong>Core meaning:</strong> {featured.generalMeaning}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-stone-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
          Words from this root
        </h3>
        {lemmas.map(([lemma, locations]) => (
          <LemmaRow
            key={lemma}
            lemma={lemma}
            locations={locations}
            isOpen={openLemma === lemma}
            onToggle={() => setOpenLemma(openLemma === lemma ? null : lemma)}
            onOpenVerse={onOpenVerse}
          />
        ))}
      </div>
    </div>
  );
};

const wordAt = async (location: string) => {
  const [s, a, w] = location.split(':').map(Number);
  const verse = await fetchVerse(`${s}:${a}`);
  return { verse, word: verse.words[w - 1] };
};

const LemmaRow: React.FC<{
  lemma: string;
  locations: string[];
  isOpen: boolean;
  onToggle: () => void;
  onOpenVerse?: (key: string) => void;
}> = ({ lemma, locations, isOpen, onToggle, onOpenVerse }) => {
  const { data: first } = useAsync(() => wordAt(locations[0]), [locations[0]]);
  const [shown, setShown] = useState(OCCURRENCES_PAGE);

  return (
    <div className={`rounded-2xl ring-1 transition-colors ${isOpen ? 'ring-emerald-300 dark:ring-emerald-700 bg-emerald-50/30 dark:bg-emerald-950/25' : 'ring-stone-200 dark:ring-stone-700'}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 cursor-pointer text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-quran-amiri text-2xl font-bold text-emerald-950 dark:text-emerald-100 shrink-0">{lemma}</span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
              {first?.word ? first.word.translation : <span className="text-stone-300 dark:text-stone-600">…</span>}
            </div>
            {first?.word && <TagBadge tag={first.word.tag} verbForm={first.word.verbForm} />}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tabular-nums">{locations.length}×</span>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2.5">
          {locations.slice(0, shown).map((loc) => (
            <Occurrence key={loc} location={loc} onOpenVerse={onOpenVerse} />
          ))}
          {shown < locations.length && (
            <button
              onClick={() => setShown(shown + OCCURRENCES_PAGE * 2)}
              className="w-full py-2 rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 hover:bg-stone-50 dark:hover:bg-stone-900 text-xs font-semibold text-stone-600 dark:text-stone-400 cursor-pointer"
            >
              Show more ({locations.length - shown} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Occurrence: React.FC<{ location: string; onOpenVerse?: (key: string) => void }> = ({ location, onOpenVerse }) => {
  const { data, loading, error, retry } = useAsync(() => wordAt(location), [location]);
  const [s, a, w] = location.split(':').map(Number);
  const surah = SURAH_LIST[s - 1];

  if (loading) return <div className="h-24 rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse" />;
  if (error || !data) return <ErrorBlock onRetry={retry} />;

  return (
    <div className="rounded-xl bg-white dark:bg-stone-900 ring-1 ring-stone-200 dark:ring-stone-700 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-stone-500 dark:text-stone-400">
          {surah.nameTransliteration} {s}:{a}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-stone-600 dark:text-stone-400">
            “<span className="font-semibold text-stone-800 dark:text-stone-200">{data.word?.translation}</span>”
          </span>
          <WordAudioButton url={data.word?.audioUrl} />
        </div>
      </div>
      <p className="font-quran-amiri text-xl leading-loose arabic-text text-stone-800 dark:text-stone-200">
        {data.verse.words.map((word, idx) => (
          <React.Fragment key={word.location}>
            <span className={idx === w - 1 ? 'text-emerald-800 dark:text-emerald-200 bg-amber-100 dark:bg-amber-900/25 rounded px-1' : ''}>{word.arabic}</span>{' '}
          </React.Fragment>
        ))}
      </p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-xs text-stone-500 dark:text-stone-400 italic leading-relaxed">“{data.verse.translation}”</p>
        {onOpenVerse && (
          <button
            onClick={() => onOpenVerse(`${s}:${a}`)}
            className="shrink-0 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 cursor-pointer whitespace-nowrap"
          >
            Word by word →
          </button>
        )}
      </div>
    </div>
  );
};
