# Ayah Words

Learn the vocabulary of the Quran in context: the words you meet most, how they are built from their roots,
and how they sound in recitation.

**Live site: https://islamicapplications.github.io/Quran/**

## Features

- **85% Course**: the 662 most frequent words, which make up 85% of the Quran's 77,429 words, taught in
  order of frequency in four stages (50%, 70%, 80%, 85%). Each card shows the word as recited in a sample
  verse, with its audio and meaning, and every word you mark as known raises your coverage.
- **Surah Reader**: read any surah with the words you don't know yet highlighted, see how much of each
  surah you already recognise, and play the recitation verse by verse.
- **Word by Word**: any verse, with each word's meaning, root, grammar and pronunciation.
- **Root Dictionary**: all 1,651 roots, every word built from them and every place they appear.
- **Vocabulary lessons** with explanations at three levels, **flashcards** with spaced repetition, a
  **quiz**, saved study lists and progress tracking.
- **Audio** in Arabic (Mishary Rashid Alafasy) and English (Saheeh International, read by Ibrahim Walk),
  plus **whole-Quran search**, light and dark themes.

Progress is stored in the browser (`localStorage`); there is no account or server. It can be exported and
imported from Settings.

## Getting started

Requires Node.js 22.18 or later.

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check and build to dist/
npm run preview  # serve the build at http://localhost:3000/Quran/
```

Every push to `main` is built and published to GitHub Pages by `.github/workflows/deploy.yml`.

## Data

| What | Source |
| --- | --- |
| Verse text, Saheeh International translation, word-by-word meanings and word audio | [Quran.com API v4](https://api-docs.quran.com/), fetched at runtime |
| Verse recitation | Mishary Rashid Alafasy, via Quran.com |
| English translation audio | Ibrahim Walk, via [EveryAyah.com](https://everyayah.com) |
| Roots, lemmas and parts of speech | [Quranic Arabic Corpus](https://corpus.quran.com) morphology (GPL-3.0), bundled in `public/data/morphology` |

The morphology files are generated from a pinned commit of
[mustafa0x/quran-morphology](https://github.com/mustafa0x/quran-morphology), the corpus in Arabic script with
root and lemma corrections. To rebuild them:

```sh
node scripts/build-morphology.mjs                      # downloads the source
node scripts/build-morphology.mjs path/to/morphology.txt  # or uses a local copy
```

Corrections to malformed verb lemmas live in `src/data/lemmaFixes.json`, and dictionary meanings for
particles and pronouns in `src/data/functionWordMeanings.ts`. See
[`public/data/morphology/LICENSE.md`](public/data/morphology/LICENSE.md) for the full list of changes made
to the corpus data.

## Project layout

```
src/components/   tabs and UI (CoverageCourse, SurahReader, WordByWordVerseViewer, …)
src/services/     Quran.com client and data loading (quranCom.ts), local storage, Arabic form matching
src/data/         curated lessons, surah list, lemma corrections, particle meanings
src/hooks/        shared stores: known words, theme, modal behaviour
scripts/          build-morphology.mjs, which generates public/data/morphology
```

## Licence

[GPL-3.0](LICENSE). The bundled morphology data is derived from the Quranic Arabic Corpus, which is
licensed under the GNU General Public License v3.0, so the project is distributed under the same licence.

Quranic text, translation and recitation audio are loaded from Quran.com and EveryAyah.com at runtime and
remain subject to their providers' terms.
