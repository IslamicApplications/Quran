export interface CorpusWordSegment {
  segmentArabic: string;
  transliteration: string;
  posTag: 'P' | 'N' | 'PN' | 'V' | 'ADJ' | 'PRON' | 'CONJ' | 'DET' | 'NEG' | 'INTG' | 'COND' | 'RES';
  posLabel: string;
  posColor: string; // Tailwind color classes
  arabicGrammarTerm: string;
  englishExplanation: string;
  caseOrMood?: 'Nominative (مرفوع)' | 'Accusative (منصوب)' | 'Genitive (مجرور)' | 'Jussive (مجزوم)';
  features?: string[];
}

export interface CorpusWordToken {
  location: string; // e.g. "1:2:3" (surah:ayah:word)
  wordIndex: number;
  arabicText: string;
  simpleArabic: string;
  transliteration: string;
  englishMeaning: string;
  rootArabic?: string;
  rootTransliteration?: string;
  lemma?: string;
  segments: CorpusWordSegment[];
}

export interface DependencyNode {
  id: string;
  wordLocation: string;
  arabicText: string;
  transliteration: string;
  posTag: string;
  roleArabic: string;
  roleEnglish: string;
}

export interface DependencyLink {
  sourceId: string;
  targetId: string;
  dependencyTypeArabic: string;
  dependencyTypeEnglish: string; // e.g. "Subject (فاعل)", "Object (مفعول به)", "Adjective (نعت)", "Genitive (مضاف إليه)"
}

export interface VerseTreebank {
  surahNumber: number;
  ayahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  arabicVerseText: string;
  translation: string;
  tokens: CorpusWordToken[];
  dependencies: DependencyLink[];
  summaryIrab: string;
}

export interface RootConcordanceEntry {
  rootArabic: string;
  rootSimple: string;
  rootTransliteration: string;
  frequency: number;
  generalMeaning: string;
  semanticCategory: string;
  derivedForms: {
    formName: string;
    formArabic: string;
    arabicExample: string;
    transliteration: string;
    meaning: string;
    occurrencesCount: number;
    sampleVerse: {
      surah: number;
      ayah: number;
      surahName: string;
      verseText: string;
      translation: string;
    };
  }[];
}

// Full Word-by-Word and Treebank data for high-frequency Quranic verses
export const VERSE_TREEBANKS: VerseTreebank[] = [
  {
    surahNumber: 1,
    ayahNumber: 2,
    surahNameArabic: 'الفاتحة',
    surahNameEnglish: 'The Opening',
    arabicVerseText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
    translation: 'All praise is [due] to Allah, Lord of the worlds.',
    summaryIrab: 'جملة اسمية: (الْحَمْدُ) مبتدأ مرفوع بالضمة، (لِلَّهِ) جار ومجرور متعلق بمحذوف خبر، (رَبِّ) نعت أو بدل مجرور بالكسرة وهو مضاف، (الْعَالَمِينَ) مضاف إليه مجرور بالياء.',
    tokens: [
      {
        location: '1:2:1',
        wordIndex: 1,
        arabicText: 'ٱلْحَمْدُ',
        simpleArabic: 'الحمد',
        transliteration: 'al-ḥamdu',
        englishMeaning: 'All praise',
        rootArabic: 'ح م د',
        rootTransliteration: 'ḥ-m-d',
        lemma: 'ḥamd',
        segments: [
          {
            segmentArabic: 'ٱلْ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل التعريف)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article denoting generic comprehensiveness (Lil-Istighraq).'
          },
          {
            segmentArabic: 'حَمْدُ',
            transliteration: 'ḥamdu',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'مبتدأ مرفوع بالضمة',
            englishExplanation: 'Nominative masculine singular noun acting as Subject/Topic (Mubtada\').',
            caseOrMood: 'Nominative (مرفوع)',
            features: ['Singular', 'Masculine', 'Definite']
          }
        ]
      },
      {
        location: '1:2:2',
        wordIndex: 2,
        arabicText: 'لِلَّهِ',
        simpleArabic: 'لله',
        transliteration: 'lillāhi',
        englishMeaning: '(be) to Allah',
        rootArabic: 'إ ل ه',
        rootTransliteration: 'ʾ-l-h',
        lemma: 'Allāh',
        segments: [
          {
            segmentArabic: 'لِـ',
            transliteration: 'li',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'لام الجر للاستحقاق والاختصاص',
            englishExplanation: 'Prefixed preposition Lam expressing rightful ownership and entitlement.'
          },
          {
            segmentArabic: 'ٱللَّهِ',
            transliteration: 'llāhi',
            posTag: 'PN',
            posLabel: 'Proper Noun (اسم الجلالة)',
            posColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
            arabicGrammarTerm: 'اسم الجلالة مجرور بالكسرة',
            englishExplanation: 'Genitive proper noun of majesty governed by the preposition Lam.',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Proper Noun', 'Genitive']
          }
        ]
      },
      {
        location: '1:2:3',
        wordIndex: 3,
        arabicText: 'رَبِّ',
        simpleArabic: 'رب',
        transliteration: 'rabbi',
        englishMeaning: 'the Lord',
        rootArabic: 'ر ب ب',
        rootTransliteration: 'r-b-b',
        lemma: 'rabb',
        segments: [
          {
            segmentArabic: 'رَبِّ',
            transliteration: 'rabbi',
            posTag: 'N',
            posLabel: 'Noun / Epithet (صفة / بدل)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'نعت أو بدل مجرور بالكسرة وهو مضاف',
            englishExplanation: 'Genitive noun modifying Allah, annexed (Mudaf) to the universe.',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Possessor (Mudaf)', 'Genitive']
          }
        ]
      },
      {
        location: '1:2:4',
        wordIndex: 4,
        arabicText: 'ٱلْعَـٰلَمِينَ',
        simpleArabic: 'العالمين',
        transliteration: 'l-ʿālamīna',
        englishMeaning: 'of the worlds',
        rootArabic: 'ع ل م',
        rootTransliteration: 'ʿ-l-m',
        lemma: 'ʿālam',
        segments: [
          {
            segmentArabic: 'ٱلْـ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'عَـٰلَمِينَ',
            transliteration: 'ʿālamīna',
            posTag: 'N',
            posLabel: 'Noun Plural (مضاف إليه)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'مضاف إليه مجرور بالياء',
            englishExplanation: 'Possessed genitive plural (Mudaf Ilayh) marked with Ya.',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Plural', 'Masculine', 'Genitive with Ya']
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '1:2:1',
        targetId: '1:2:2',
        dependencyTypeArabic: 'خبر شبه جملة (متعلق بمحذوف)',
        dependencyTypeEnglish: 'Predicate (Khabar) <— Topic (Mubtada)'
      },
      {
        sourceId: '1:2:2',
        targetId: '1:2:3',
        dependencyTypeArabic: 'نعت / بدل',
        dependencyTypeEnglish: 'Adjective Epithet (Na\'t) <— Head Noun'
      },
      {
        sourceId: '1:2:3',
        targetId: '1:2:4',
        dependencyTypeArabic: 'إضافة (مضاف ومضاف إليه)',
        dependencyTypeEnglish: 'Genitive Annexation (Mudaf <— Mudaf Ilayh)'
      }
    ]
  },
  {
    surahNumber: 2,
    ayahNumber: 2,
    surahNameArabic: 'البقرة',
    surahNameEnglish: 'The Cow',
    arabicVerseText: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ',
    translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
    summaryIrab: '(ذَٰلِكَ) اسم إشارة مبتدأ، (الْكِتَابُ) بدل أو خبر أول، (لَا رَيْبَ فِيهِ) جملة اسمية في محل رفع خبر، (هُدًى) خبر ثانٍ مرفوع بضمة مقدرة، (لِلْمُتَّقِينَ) جار ومجرور متعلق بهدى.',
    tokens: [
      {
        location: '2:2:1',
        wordIndex: 1,
        arabicText: 'ذَٰلِكَ',
        simpleArabic: 'ذلك',
        transliteration: 'dhālika',
        englishMeaning: 'This [distant/elevated]',
        segments: [
          {
            segmentArabic: 'ذَا',
            transliteration: 'dhā',
            posTag: 'PRON',
            posLabel: 'Demonstrative Pronoun (اسم إشارة)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'اسم إشارة مبتدأ',
            englishExplanation: 'Demonstrative pronoun functioning as Subject Topic.'
          },
          {
            segmentArabic: 'لِـ',
            transliteration: 'li',
            posTag: 'P',
            posLabel: 'Lam of Distance (لام البعد)',
            posColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
            arabicGrammarTerm: 'حرف دال على البعد والرفعة',
            englishExplanation: 'Particle expressing majestic distance and elevated station.'
          },
          {
            segmentArabic: 'كَ',
            transliteration: 'ka',
            posTag: 'PRON',
            posLabel: 'Address Kaf (كاف الخطاب)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'حرف خطاب لا محل له من الإعراب',
            englishExplanation: 'Pronominal suffix of address.'
          }
        ]
      },
      {
        location: '2:2:2',
        wordIndex: 2,
        arabicText: 'ٱلْكِتَـٰبُ',
        simpleArabic: 'الكتاب',
        transliteration: 'al-kitābu',
        englishMeaning: 'the Book',
        rootArabic: 'ك ت ب',
        rootTransliteration: 'k-t-b',
        lemma: 'kitāb',
        segments: [
          {
            segmentArabic: 'ٱلْـ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'أل العهدية',
            englishExplanation: 'Definite article of magnificence.'
          },
          {
            segmentArabic: 'كِتَـٰبُ',
            transliteration: 'kitābu',
            posTag: 'N',
            posLabel: 'Noun (بدل / خبر)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'بدل مرفوع بالضمة',
            englishExplanation: 'Nominative noun acting as Permutation/Badal or Predicate.',
            caseOrMood: 'Nominative (مرفوع)'
          }
        ]
      },
      {
        location: '2:2:3',
        wordIndex: 3,
        arabicText: 'لَا',
        simpleArabic: 'لا',
        transliteration: 'lā',
        englishMeaning: 'no',
        segments: [
          {
            segmentArabic: 'لَا',
            transliteration: 'lā',
            posTag: 'NEG',
            posLabel: 'Negative Particle (لا النافية للجنس)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'لا النافية للجنس تعمل عمل إن',
            englishExplanation: 'Categorical negative particle of genus (Nasb on noun).'
          }
        ]
      },
      {
        location: '2:2:4',
        wordIndex: 4,
        arabicText: 'رَيْبَ',
        simpleArabic: 'ريب',
        transliteration: 'rayba',
        englishMeaning: 'doubt',
        rootArabic: 'ر ي ب',
        rootTransliteration: 'r-y-b',
        segments: [
          {
            segmentArabic: 'رَيْبَ',
            transliteration: 'rayba',
            posTag: 'N',
            posLabel: 'Noun of Lā (اسم لا)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم لا النافية للجنس مبني على الفتح',
            englishExplanation: 'Noun built on Fatha in place of accusative case.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '2:2:5',
        wordIndex: 5,
        arabicText: 'فِيهِ',
        simpleArabic: 'فيه',
        transliteration: 'fīhi',
        englishMeaning: 'in it',
        segments: [
          {
            segmentArabic: 'فِي',
            transliteration: 'fī',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر للظرفية',
            englishExplanation: 'Preposition of containment.'
          },
          {
            segmentArabic: 'هِ',
            transliteration: 'hi',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل في محل جر',
            englishExplanation: '3rd person singular pronoun referring back to the Book.'
          }
        ]
      },
      {
        location: '2:2:6',
        wordIndex: 6,
        arabicText: 'هُدًۭى',
        simpleArabic: 'هدى',
        transliteration: 'hudan',
        englishMeaning: 'a guidance',
        rootArabic: 'ه د ي',
        rootTransliteration: 'h-d-y',
        lemma: 'hudan',
        segments: [
          {
            segmentArabic: 'هُدًى',
            transliteration: 'hudan',
            posTag: 'N',
            posLabel: 'Noun / Masdar (خبر ثان)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'خبر ثان مرفوع بضمة مقدرة',
            englishExplanation: 'Indefinite noun expressing greatness (Tankir li-l-Ta\'dhim).',
            caseOrMood: 'Nominative (مرفوع)'
          }
        ]
      },
      {
        location: '2:2:7',
        wordIndex: 7,
        arabicText: 'لِّلْمُتَّقِينَ',
        simpleArabic: 'للمتقين',
        transliteration: 'lil-muttaqīna',
        englishMeaning: 'for those conscious of Allah',
        rootArabic: 'و ق ي',
        rootTransliteration: 'w-q-y',
        lemma: 'muttaqī',
        segments: [
          {
            segmentArabic: 'لِـ',
            transliteration: 'li',
            posTag: 'P',
            posLabel: 'Preposition (لام الجر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر للاختصاص',
            englishExplanation: 'Preposition denoting special designation.'
          },
          {
            segmentArabic: 'ٱلْـ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'مُتَّقِينَ',
            transliteration: 'muttaqīna',
            posTag: 'N',
            posLabel: 'Active Participle Plural (اسم فاعل)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'اسم مجرور بالياء (اسم فاعل من اتقى)',
            englishExplanation: 'Form VIII active participle plural in the genitive case with Ya.',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '2:2:1',
        targetId: '2:2:2',
        dependencyTypeArabic: 'بدل / خبر أول',
        dependencyTypeEnglish: 'Permutation (Badal) <— Demonstrative'
      },
      {
        sourceId: '2:2:3',
        targetId: '2:2:4',
        dependencyTypeArabic: 'نفي الجنس واسمها',
        dependencyTypeEnglish: 'Categorical Negation <— Genus Noun'
      },
      {
        sourceId: '2:2:1',
        targetId: '2:2:6',
        dependencyTypeArabic: 'خبر ثانٍ',
        dependencyTypeEnglish: 'Second Predicate (Khabar) <— Subject'
      },
      {
        sourceId: '2:2:6',
        targetId: '2:2:7',
        dependencyTypeArabic: 'شبه جملة متعلق بهدى',
        dependencyTypeEnglish: 'Prepositional Attachment (Muta\'alliq)'
      }
    ]
  }
];

// Quran Root Concordance Dataset (Curated high-frequency roots)
export const ROOT_CONCORDANCE: RootConcordanceEntry[] = [
  {
    rootArabic: 'ر ب ب',
    rootSimple: 'ربب',
    rootTransliteration: 'r-b-b',
    frequency: 975,
    generalMeaning: 'Lordship, continuous nurturing, ownership, and maintenance.',
    semanticCategory: 'Divine Sovereignty & Care',
    derivedForms: [
      {
        formName: 'Noun (Lord / Sustainer)',
        formArabic: 'رَبّ',
        arabicExample: 'رَبِّ ٱلْعَـٰلَمِينَ',
        transliteration: 'Rabb',
        meaning: 'Lord, Master, and Sustainer of all existence.',
        occurrencesCount: 975,
        sampleVerse: {
          surah: 1,
          ayah: 2,
          surahName: 'Al-Fatihah',
          verseText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
          translation: 'All praise is to Allah, Lord of the worlds.'
        }
      },
      {
        formName: 'Plural Noun (Masters / False gods)',
        formArabic: 'أَرْبَاب',
        arabicExample: 'أَرْبَابًا مِّن دُونِ ٱللَّهِ',
        transliteration: 'Arbāb',
        meaning: 'Plural lords or false deities revered alongside Allah.',
        occurrencesCount: 4,
        sampleVerse: {
          surah: 3,
          ayah: 80,
          surahName: 'Ali \'Imran',
          verseText: 'وَلَا يَأْمُرَكُمْ أَن تَتَّخِذُوا۟ ٱلْمَلَـٰٓئِكَةَ وَٱلنَّبِيِّـۧنَ أَرْبَابًا',
          translation: 'Nor would he order you to take the angels and prophets as lords.'
        }
      }
    ]
  },
  {
    rootArabic: 'ر ح م',
    rootSimple: 'رحم',
    rootTransliteration: 'r-ḥ-m',
    frequency: 563,
    generalMeaning: 'Mercy, compassion, love, protective sheltering (connected to womb).',
    semanticCategory: 'Divine Mercy & Compassion',
    derivedForms: [
      {
        formName: 'Intensive Epithet (All-Merciful)',
        formArabic: 'الرَّحْمَـٰن',
        arabicExample: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
        transliteration: 'Ar-Raḥmān',
        meaning: 'The Entirely Merciful whose vast mercy embraces all creation.',
        occurrencesCount: 57,
        sampleVerse: {
          surah: 1,
          ayah: 3,
          surahName: 'Al-Fatihah',
          verseText: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
          translation: 'The Entirely Merciful, the Especially Merciful.'
        }
      },
      {
        formName: 'Continuous Epithet (Especially Merciful)',
        formArabic: 'الرَّحِيم',
        arabicExample: 'وَكَانَ بِٱلْمُؤْمِنِينَ رَحِيمًا',
        transliteration: 'Ar-Raḥīm',
        meaning: 'The Especially Merciful to believers in this life and the hereafter.',
        occurrencesCount: 114,
        sampleVerse: {
          surah: 33,
          ayah: 43,
          surahName: 'Al-Ahzab',
          verseText: 'وَكَانَ بِٱلْمُؤْمِنِينَ رَحِيمًا',
          translation: 'And ever is He, to the believers, Merciful.'
        }
      },
      {
        formName: 'Noun (Mercy / Grace)',
        formArabic: 'رَحْمَة',
        arabicExample: 'رَحْمَتِى وَسِعَتْ كُلَّ شَىْءٍ',
        transliteration: 'Raḥmah',
        meaning: 'Divine benevolence, grace, tenderness, and rescue.',
        occurrencesCount: 326,
        sampleVerse: {
          surah: 7,
          ayah: 156,
          surahName: 'Al-A\'raf',
          verseText: 'وَرَحْمَتِى وَسِعَتْ كُلَّ شَىْءٍ',
          translation: '...but My mercy encompasses all things.'
        }
      }
    ]
  },
  {
    rootArabic: 'و ق ي',
    rootSimple: 'وقي',
    rootTransliteration: 'w-q-y',
    frequency: 258,
    generalMeaning: 'Shielding, protection, guarding, erecting a barrier against harm.',
    semanticCategory: 'Spiritual Vigilance & Piety',
    derivedForms: [
      {
        formName: 'Form VIII Verb (To protect oneself / fear Allah)',
        formArabic: 'ٱتَّقَىٰ / يَتَّقِي',
        arabicExample: 'وَٱتَّقُوا۟ ٱللَّهَ',
        transliteration: 'Ittaqā / Yattaqī',
        meaning: 'To maintain God-consciousness and guard against disobedience.',
        occurrencesCount: 164,
        sampleVerse: {
          surah: 2,
          ayah: 194,
          surahName: 'Al-Baqarah',
          verseText: 'وَٱتَّقُوا۟ ٱللَّهَ وَٱعْلَمُوٓا۟ أَنَّ ٱللَّهَ مَعَ ٱلْمُتَّقِينَ',
          translation: 'And fear Allah and know that Allah is with those who fear Him.'
        }
      },
      {
        formName: 'Noun (God-consciousness / Piety)',
        formArabic: 'تَقْوَى',
        arabicExample: 'خَيْرَ ٱلزَّادِ ٱلتَّقْوَىٰ',
        transliteration: 'Taqwā',
        meaning: 'Spiritual vigilance creating a protective shield from sins.',
        occurrencesCount: 17,
        sampleVerse: {
          surah: 2,
          ayah: 197,
          surahName: 'Al-Baqarah',
          verseText: 'فَإِنَّ خَيْرَ ٱلزَّادِ ٱلتَّقْوَىٰ',
          translation: 'Indeed, the best provision is Taqwa.'
        }
      },
      {
        formName: 'Active Participle (The God-conscious)',
        formArabic: 'مُتَّقِين',
        arabicExample: 'هُدًۭى لِّلْمُتَّقِينَ',
        transliteration: 'Muttaqīn',
        meaning: 'Those who conscientiously shield themselves with righteousness.',
        occurrencesCount: 49,
        sampleVerse: {
          surah: 2,
          ayah: 2,
          surahName: 'Al-Baqarah',
          verseText: 'هُدًۭى لِّلْمُتَّقِينَ',
          translation: 'A guidance for those conscious of Allah.'
        }
      }
    ]
  },
  {
    rootArabic: 'ك ت ب',
    rootSimple: 'كتب',
    rootTransliteration: 'k-t-b',
    frequency: 319,
    generalMeaning: 'Writing, compiling, binding together, decreeing laws, registered records.',
    semanticCategory: 'Scripture & Divine Decrees',
    derivedForms: [
      {
        formName: 'Noun (Book / Scripture / Record)',
        formArabic: 'كِتَاب',
        arabicExample: 'ذَٰلِكَ ٱلْكِتَـٰبُ',
        transliteration: 'Kitāb',
        meaning: 'The revealed Quran, celestial record, or personal ledger.',
        occurrencesCount: 261,
        sampleVerse: {
          surah: 2,
          ayah: 2,
          surahName: 'Al-Baqarah',
          verseText: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ',
          translation: 'This is the Book about which there is no doubt.'
        }
      },
      {
        formName: 'Passive Verb (To be decreed/prescribed)',
        formArabic: 'كُتِبَ',
        arabicExample: 'كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ',
        transliteration: 'Kutiba',
        meaning: 'Ordained as an obligatory commandment.',
        occurrencesCount: 16,
        sampleVerse: {
          surah: 2,
          ayah: 183,
          surahName: 'Al-Baqarah',
          verseText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ',
          translation: 'O you who have believed, decreed upon you is fasting.'
        }
      }
    ]
  }
];
