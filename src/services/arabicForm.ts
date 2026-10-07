/**
 * Comparing a word as written in the Quran (Uthmani script) with its dictionary form, by how it sounds.
 * Shared by the app and scripts/build-morphology.mjs (Node runs this file directly), so keep it to plain,
 * type-erasable TypeScript with no imports.
 */

/**
 * The word reduced to what tells two forms apart when spoken: consonants, long vowels, shadda and inner
 * short vowels. Dropped: the final case vowel and tanween (كِتابٌ = كِتاب), sukun, Quranic pause and
 * annotation signs, tatweel. Uthmani spellings become standard ones (صَلَوٰة = صَلاة, ٱ = ا, ءَا = آ).
 */
export const spokenForm = (text: string): string =>
  text
    .normalize('NFC') // also orders marks: fatha/kasra/tanween before shadda
    // Marks first: a plain letter (tatweel) right before a mark reads as one combined character
    .replace(/[\u0653-\u0655\u06D6-\u06ED\u0615-\u061A\u0640\s]/g, '')
    .replace(/^([^ً-ْ])([ً-ِ]?)ّ/, '$1$2') // shadda joining the word to the one before: لَّيْسَ
    .replace(/[ئؤ]/g, 'ء') // hamza seat: إِسْرَٰٓءِيل = إِسْرائِيل
    .replace(/ىٰ/g, 'ى')
    .replace(/[وي]ٰ/g, 'ا')
    .replace(/ٰ/g, 'ا')
    .replace(/ءَ?ا/g, 'ا')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ً(ّ?)ا$/, '$1') // accusative tanween with its seat alif: قَوْمًا, حَيًّا
    .replace(/اً$/, '')
    .replace(/[ً-ٍْ]/g, '')
    .replace(/[َ-ِ](?=ّ?$)/, '') // final case vowel, before or after a final shadda
    // fatha before its own long vowel (قَالَ = قال, إِلَّا = إِلّا), but not before a consonantal ى (أَىُّ)
    .replace(/َ(?=ّ?(?:ا|ى(?![ً-ّ])))/g, '')
    .replace(/ى/g, 'ي')
    .replace(/ِ(?=ي)|ُ(?=و)/g, '')
    .replace(/ة/g, 'ه');

/** True when both spellings sound like the same word form (يَقُولُ ≠ قالَ, أُحِبُّ ≠ أَحَبَّ, كِتَـٰبٌ = كِتاب). */
export const sameSpokenForm = (a: string, b: string): boolean => spokenForm(a) === spokenForm(b);

export const editDistance = (a: string, b: string): number => {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return row[b.length];
};
