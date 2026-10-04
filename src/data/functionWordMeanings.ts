/**
 * Dictionary meanings for the function words in the 85% Course (prepositions, particles, pronouns, adverbs).
 * Content words take their meaning from a sample verse, but a function word's gloss there depends on the
 * verse: ب in بِى reads "in Me", إِلَى in 2:14 reads "with". Keys are corpus lemmas, matched after NFC.
 */
const MEANINGS: Record<string, string> = {
  'مِن': 'from, of',
  'ما': 'what; not',
  'فِي': 'in',
  'لا': 'no, not',
  'إِنّ': 'indeed, truly',
  'الَّذِي': 'who, which, the one who',
  'عَلَى': 'on, upon, against',
  'ل': 'for, to',
  'ذا': 'this, that',
  'مَن': 'who, whoever',
  'إِلَى': 'to, towards',
  'إِن': 'if',
  'إِلّا': 'except, only',
  'أَن': 'that, to',
  'ب': 'with, by, in',
  'هُوَ': 'he, it',
  'عَن': 'from, about',
  'هُم': 'they',
  'إِذا': 'when, whenever',
  'قَد': 'indeed, already',
  'أَنّ': 'that',
  'لَم': 'did not',
  'ثُمّ': 'then, afterwards',
  'أَو': 'or',
  'بَيْن': 'between, among',
  'إِذ': 'when',
  'لَو': 'if, if only',
  'عِند': 'with, near',
  'لَمّا': 'when; not yet',
  'مَع': 'with, together with',
  'حَتَّى': 'until, even',
  'أَم': 'or (in questions)',
  'أَنتُم': 'you (plural)',
  'لَعَلّ': 'perhaps, so that',
  'بَل': 'rather, nay',
  'لَن': 'will never, will not',
  'هَل': 'is…? do…? (question word)',
  'نَحْنُ': 'we',
  'كَيْف': 'how',
  'أَنتَ': 'you (one man)',
  'لَوْلا': 'if not for; why not',
  'أَنا': 'I',
  'لٰكِن': 'but',
  'لٰكِنّ': 'but, however',
  'هِيَ': 'she, it',
  'أَمّا': 'as for',
  'سَوْف': 'will (soon)',
  'فَوْق': 'above, over',
  'أَلا': 'surely, behold',
  'كَلّا': 'no indeed, by no means',
  'حَيْث': 'where, wherever',
  'إِذًا': 'then, in that case',
  'كَأَنّ': 'as if',
  'أَبَدًا': 'ever, forever',
  'أَنَّى': 'how, from where',
  'ماذا': 'what',
  'إِيّا': 'only (you / him…), as in إِيَّاكَ “You alone”',
  'وَراء': 'behind, beyond',
  'إِمّا': 'either, whether',
  'خَلْف': 'behind, after',
  'بَلَى': 'yes indeed',
  'لَدَى': 'with, at',
  'كَم': 'how many, how much',
  'أَيْن': 'where, wherever',
  'حَوْل': 'around',
  'كُلَّما': 'whenever',
  'لَيْت': 'if only, would that'
};

const BY_NFC = new Map(Object.entries(MEANINGS).map(([lemma, meaning]) => [lemma.normalize('NFC'), meaning]));

export const functionWordMeaning = (lemma: string): string | undefined => BY_NFC.get(lemma.normalize('NFC'));

/**
 * A verse gloss as a vocabulary meaning: drops the words Quran.com brackets because the translation implies
 * them, "(of) Allah" → "Allah", "[the] Last" → "Last", unless nothing would be left.
 */
export const vocabularyGloss = (gloss: string): string => {
  const trimmed = gloss.replace(/\s*[([][^)\]]*[)\]]\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return trimmed || gloss.replace(/[()[\]]/g, '').trim();
};
