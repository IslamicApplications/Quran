# Quranic morphology data

The files in this folder are derived from the **Quranic Arabic Corpus Morphology v0.4**
(Kais Dukes, University of Leeds — https://corpus.quran.com), licensed under the
GNU General Public License v3.0 (https://www.gnu.org/licenses/gpl-3.0.html), using the
corrected Arabic-script edition at https://github.com/mustafa0x/quran-morphology
(commit 8f38b39016824284f9ed16ae15069ff9102c4acf).

**Changes made:** each word's stem segment was reduced to root, lemma, part-of-speech tag and
verb form, and the data was split into one JSON file per surah (`<surah>.json`, an array of
ayahs, each an array of `root|lemma|tag|form` strings indexed by word position) plus a root
index (`roots.json`: root -> occurrence count and locations per lemma) and a frequency list
(`coverage.json`: the most frequent lemmas covering 85% of the Quran's words, each as
`[lemma, root, tag, verbForm, count, sampleLocation, appearances]`), and per-surah vocabulary
(`surahs.json`: for each surah, total word count and `[lemma, count]` pairs).

Regenerate with `node scripts/build-morphology.mjs`. This derived data is distributed under
the same GPL-3.0 license.
