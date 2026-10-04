#!/usr/bin/env node
/**
 * Builds the per-surah morphology files and the root index served from public/data/morphology.
 *
 * Source: Quranic Arabic Corpus Morphology v0.4 (corpus.quran.com, GPL-3.0), via the
 * mustafa0x/quran-morphology fork (Arabic script, root/lemma corrections), pinned to a commit.
 *
 * Usage: node scripts/build-morphology.mjs [path/to/quran-morphology.txt]
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Shared with the app; Node runs the TypeScript file directly (type stripping)
import { spokenForm, editDistance } from '../src/services/arabicForm.ts';

// Dictionary-form corrections for malformed corpus verb lemmas (shared with the app, see the file's note)
const LEMMA_FIXES = Object.fromEntries(
  Object.entries(JSON.parse(await readFile(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'lemmaFixes.json'), 'utf8')))
    .filter(([k]) => !k.startsWith('_'))
    // Keyed in NFC: the corpus writes shadda before fatha, typed text the other way round
    .map(([k, v]) => [k.normalize('NFC'), v])
);
const fixLemma = (lemma) => LEMMA_FIXES[lemma.normalize('NFC')] || lemma;

const SOURCE_COMMIT = '8f38b39016824284f9ed16ae15069ff9102c4acf';
const SOURCE_URL = `https://raw.githubusercontent.com/mustafa0x/quran-morphology/${SOURCE_COMMIT}/quran-morphology.txt`;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'data', 'morphology');

const loadSource = async () => {
  const localPath = process.argv[2];
  if (localPath) return readFile(localPath, 'utf8');
  console.log(`Downloading ${SOURCE_URL}`);
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  return res.text();
};

// Independent pronouns carry no LEM tag in the corpus; give them their standard form as lemma.
const PRONOUNS = {
  '1S': 'أَنا', '1P': 'نَحْنُ',
  '2MS': 'أَنتَ', '2FS': 'أَنتِ', '2D': 'أَنتُما', '2MD': 'أَنتُما', '2MP': 'أَنتُم', '2FP': 'أَنتُنَّ',
  '3MS': 'هُوَ', '3FS': 'هِيَ', '3D': 'هُما', '3MD': 'هُما', '3FD': 'هُما', '3MP': 'هُم', '3FP': 'هُنَّ'
};

// Pick the segment that carries the word's meaning: the stem, not a prefix (وَ, بِ, ال) or suffix pronoun.
const pickStem = (segments) =>
  segments.find((s) => s.root) ||
  segments.find((s) => !s.feats.includes('PREF') && !s.feats.includes('SUFF')) ||
  segments[0];

const tagFor = (seg) => {
  if (seg.coarse === 'V') return seg.feats[0]; // PERF | IMPF | IMPV
  if (seg.feats.includes('ADJ')) return 'ADJ';
  const first = seg.feats[0] || '';
  if (first && !first.includes(':')) return first;
  return seg.coarse; // plain N / P
};

const main = async () => {
  const text = await loadSource();
  const words = new Map(); // "s:a:w" -> segments[]

  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const [loc, text, coarse, featStr = ''] = line.split('\t');
    const [s, a, w] = loc.split(':');
    const feats = featStr.split('|');
    const get = (key) => feats.find((f) => f.startsWith(`${key}:`))?.slice(key.length + 1) || '';
    const key = `${s}:${a}:${w}`;
    if (!words.has(key)) words.set(key, []);
    const lemma = get('LEM');
    words.get(key).push({ text, coarse, feats, root: get('ROOT'), lemma: fixLemma(lemma), form: get('VF') });
  }

  // A correction must not merge two distinct corpus lemmas into one
  const sourceLemmas = new Set(
    text.split('\n').map((l) => l.match(/LEM:([^|\t\r]+)/)?.[1]?.normalize('NFC')).filter(Boolean)
  );
  for (const [from, to] of Object.entries(LEMMA_FIXES)) {
    if (!sourceLemmas.has(from)) throw new Error(`lemmaFixes: ${from} is not a corpus lemma`);
    if (sourceLemmas.has(to.normalize('NFC'))) throw new Error(`lemmaFixes: ${to} already exists as a separate lemma`);
  }

  const surahs = Array.from({ length: 114 }, () => []);
  const rootIndex = {}; // root -> { n, lemmas: { lemma: [locations] } }
  const lemmaStats = new Map(); // lemma -> { n, root, tag, form, sample, sampleRank }

  for (const [loc, segments] of words) {
    const [s, a, w] = loc.split(':').map(Number);
    let stem = pickStem(segments);
    if (!stem.lemma) {
      // Preposition + pronoun (لَهُ, بِهِ): learn it through the preposition.
      const prep = segments.find((seg) => seg !== stem && seg.feats[0] === 'P' && seg.lemma);
      if (prep) stem = prep;
      else if (stem.feats.includes('PRON')) {
        const person = stem.feats.find((f) => /^[123][MF]?[SDP]$/.test(f));
        if (person && PRONOUNS[person]) stem = { ...stem, lemma: PRONOUNS[person] };
      } else if (stem.feats.includes('INL')) {
        stem = { ...stem, lemma: stem.text }; // Quranic initials such as الٓمٓ
      }
    }
    const tag = tagFor(stem);
    const form = stem.coarse === 'V' && stem.form ? stem.form : '';
    const entry = [stem.root, stem.lemma, tag, form].join('|').replace(/\|+$/, '');

    const ayahs = surahs[s - 1];
    while (ayahs.length < a) ayahs.push([]);
    ayahs[a - 1][w - 1] = entry;

    if (stem.lemma) {
      // The course shows the dictionary form and plays the sample occurrence's audio, so pick the occurrence
      // that sounds closest to that form (قالَ, not يَقُولُ). Prefixes (ال, وَ, فَ, بِ…) are not counted: the
      // dictionary word is still heard whole, so وَذَكَرَ beats ذَكَرْتَ and ٱلْمَوْتِ beats مَوْتِهِۦ. Ties prefer
      // the closest stem (وَءَاتَى over the passive أُوتِيَ for آتَى), then the fewest attachments (عَصَاهُ over
      // بِعَصَاكَ), "ال" counting least, so the contextual gloss is as close to the bare meaning as possible.
      const affixes = segments.filter((seg) => seg !== stem);
      const affixRank = affixes.reduce((sum, seg) => sum + (seg.feats.includes('DET') ? 1 : 2), 0);
      const lemmaSound = spokenForm(stem.lemma);
      const fromStem = segments.slice(segments.indexOf(stem)).map((seg) => seg.text).join('');
      const rank =
        editDistance(spokenForm(fromStem), lemmaSound) * 100 +
        editDistance(spokenForm(stem.text), lemmaSound) * 10 +
        affixRank;
      const stat = lemmaStats.get(stem.lemma);
      if (!stat) {
        lemmaStats.set(stem.lemma, { n: 1, root: stem.root, tag, form, sample: loc, sampleRank: rank });
      } else {
        stat.n += 1;
        if (rank < stat.sampleRank) Object.assign(stat, { sample: loc, sampleRank: rank });
      }
    }

    if (stem.root) {
      const r = (rootIndex[stem.root] ||= { n: 0, l: {} });
      r.n += 1;
      (r.l[stem.lemma || stem.root] ||= []).push(`${s}:${a}:${w}`);
    }
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  let totalWords = 0;
  for (let i = 0; i < 114; i++) {
    totalWords += surahs[i].reduce((sum, ay) => sum + ay.length, 0);
    await writeFile(join(outDir, `${i + 1}.json`), JSON.stringify(surahs[i]));
  }
  await writeFile(join(outDir, 'roots.json'), JSON.stringify(rootIndex));

  // Per-surah vocabulary: total words and lemma counts, so the reader can score coverage for all
  // 114 surahs without downloading every surah file.
  const surahVocab = surahs.map((ayahs) => {
    const counts = new Map();
    let total = 0;
    for (const ayah of ayahs) {
      for (const entry of ayah) {
        total += 1;
        const lemma = entry.split('|')[1];
        if (lemma) counts.set(lemma, (counts.get(lemma) || 0) + 1);
      }
    }
    return { t: total, l: [...counts].sort((a, b) => b[1] - a[1]) };
  });
  await writeFile(join(outDir, 'surahs.json'), JSON.stringify(surahVocab));

  // Coverage course: most frequent lemmas until they account for 85% of all words in the Quran.
  const totalTokens = words.size;
  const segmentCounts = new Map();
  for (const segments of words.values())
    for (const seg of segments) if (seg.lemma) segmentCounts.set(seg.lemma, (segmentCounts.get(seg.lemma) || 0) + 1);
  const coverage = [];
  let cumulative = 0;
  for (const [lemma, stat] of [...lemmaStats].sort((a, b) => b[1].n - a[1].n)) {
    cumulative += stat.n;
    // Last field: every appearance, including as an attached prefix (بِٱللَّهِ, لِلنَّاسِ), which the coverage
    // count gives to the host word; 0 when it equals the count.
    const appearances = segmentCounts.get(lemma) || 0;
    coverage.push([lemma, stat.root, stat.tag, stat.form, stat.n, stat.sample, appearances > stat.n ? appearances : 0]);
    if (cumulative / totalTokens >= 0.85) break;
  }
  await writeFile(join(outDir, 'coverage.json'), JSON.stringify({ totalWords: totalTokens, words: coverage }));

  await writeFile(
    join(outDir, 'LICENSE.md'),
    `# Quranic morphology data

The files in this folder are derived from the **Quranic Arabic Corpus Morphology v0.4**
(Kais Dukes, University of Leeds — https://corpus.quran.com), licensed under the
GNU General Public License v3.0 (https://www.gnu.org/licenses/gpl-3.0.html), using the
corrected Arabic-script edition at https://github.com/mustafa0x/quran-morphology
(commit ${SOURCE_COMMIT}).

**Changes made:** each word's stem segment was reduced to root, lemma, part-of-speech tag and
verb form, and the data was split into one JSON file per surah (\`<surah>.json\`, an array of
ayahs, each an array of \`root|lemma|tag|form\` strings indexed by word position) plus a root
index (\`roots.json\`: root -> occurrence count and locations per lemma) and a frequency list
(\`coverage.json\`: the most frequent lemmas covering 85% of the Quran's words, each as
\`[lemma, root, tag, verbForm, count, sampleLocation, appearances]\`), and per-surah vocabulary
(\`surahs.json\`: for each surah, total word count and \`[lemma, count]\` pairs).

Regenerate with \`node scripts/build-morphology.mjs\`. This derived data is distributed under
the same GPL-3.0 license.
`
  );

  console.log(`Wrote 114 surah files (${totalWords} words) and ${Object.keys(rootIndex).length} roots to ${outDir}`);
  console.log(`Coverage list: ${coverage.length} lemmas cover ${((cumulative / totalTokens) * 100).toFixed(1)}%`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
