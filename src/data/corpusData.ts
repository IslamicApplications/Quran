export interface CorpusWordSegment {
  segmentArabic: string;
  transliteration: string;
  posTag: 'P' | 'N' | 'PN' | 'V' | 'ADJ' | 'PRON' | 'CONJ' | 'DET' | 'NEG' | 'INTG' | 'COND' | 'RES' | 'ACC' | 'EMPH';
  posLabel: string;
  posColor: string; // Tailwind color classes
  arabicGrammarTerm: string;
  englishExplanation: string;
  caseOrMood?: 'Nominative (مرفوع)' | 'Accusative (منصوب)' | 'Genitive (مجرور)' | 'Jussive (مجزوم)' | 'Indicative (مرفوع)';
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
    ayahNumber: 1,
    surahNameArabic: 'الفاتحة',
    surahNameEnglish: 'The Opening',
    arabicVerseText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    summaryIrab: '(بِسْمِ) الباء حرف جر، و(اسْمِ) اسم مجرور بالكسرة وهو مضاف، والجار والمجرور متعلق بفعل محذوف تقديره: أبدأ أو أقرأ. (اللَّهِ) لفظ الجلالة مضاف إليه مجرور بالكسرة. (الرَّحْمَٰنِ) نعت أول مجرور بالكسرة. (الرَّحِيمِ) نعت ثانٍ مجرور بالكسرة.',
    tokens: [
      {
        location: '1:1:1',
        wordIndex: 1,
        arabicText: 'بِسْمِ',
        simpleArabic: 'بسم',
        transliteration: 'bismi',
        englishMeaning: 'In (the) name',
        rootArabic: 'س م و',
        lemma: 'اسْم',
        segments: [
          {
            segmentArabic: 'بِ',
            transliteration: 'bi',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر للاستعانة',
            englishExplanation: 'Prefixed preposition Bā\' of seeking help: "with / by means of" the Name of Allah.'
          },
          {
            segmentArabic: 'سْمِ',
            transliteration: 'smi',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم مجرور بالكسرة وهو مضاف',
            englishExplanation: 'Genitive noun governed by Bā\', annexed (Muḍāf) to the Name of Majesty. The phrase attaches to an implied verb such as "I begin".',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Singular', 'Masculine', 'Muḍāf']
          }
        ]
      },
      {
        location: '1:1:2',
        wordIndex: 2,
        arabicText: 'ٱللَّهِ',
        simpleArabic: 'الله',
        transliteration: 'l-lahi',
        englishMeaning: '(of) Allah',
        rootArabic: 'أ ل ه',
        lemma: 'اللَّه',
        segments: [
          {
            segmentArabic: 'ٱللَّهِ',
            transliteration: 'llāhi',
            posTag: 'PN',
            posLabel: 'Proper Noun (اسم الجلالة)',
            posColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
            arabicGrammarTerm: 'لفظ الجلالة مضاف إليه مجرور بالكسرة',
            englishExplanation: 'Proper noun of majesty in the genitive as the second term of the annexation (Muḍāf Ilayh).',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      },
      {
        location: '1:1:3',
        wordIndex: 3,
        arabicText: 'ٱلرَّحْمَـٰنِ',
        simpleArabic: 'الرحمن',
        transliteration: 'l-raḥmāni',
        englishMeaning: 'the Most Gracious',
        rootArabic: 'ر ح م',
        lemma: 'رَحْمٰن',
        segments: [
          {
            segmentArabic: 'ٱل',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'رَّحْمَـٰنِ',
            transliteration: 'raḥmāni',
            posTag: 'ADJ',
            posLabel: 'Adjective (صفة)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'نعت أول مجرور بالكسرة',
            englishExplanation: 'First adjective (Na\'t) describing Allah, agreeing with it in the genitive case. Intensive form fa\'lān: vast, all-embracing mercy.',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      },
      {
        location: '1:1:4',
        wordIndex: 4,
        arabicText: 'ٱلرَّحِيمِ',
        simpleArabic: 'الرحيم',
        transliteration: 'l-raḥīmi',
        englishMeaning: 'the Most Merciful',
        rootArabic: 'ر ح م',
        lemma: 'رَحِيم',
        segments: [
          {
            segmentArabic: 'ٱل',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'رَّحِيمِ',
            transliteration: 'raḥīmi',
            posTag: 'ADJ',
            posLabel: 'Adjective (صفة)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'نعت ثانٍ مجرور بالكسرة',
            englishExplanation: 'Second adjective describing Allah, in the genitive. Intensive form fa\'īl: mercy that reaches its recipients.',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '1:1:1',
        targetId: '1:1:2',
        dependencyTypeArabic: 'إضافة (مضاف ومضاف إليه)',
        dependencyTypeEnglish: 'Genitive Annexation (Muḍāf <— Muḍāf Ilayh)'
      },
      {
        sourceId: '1:1:2',
        targetId: '1:1:3',
        dependencyTypeArabic: 'نعت أول',
        dependencyTypeEnglish: 'First Adjective (Na\'t) <— Described Noun'
      },
      {
        sourceId: '1:1:2',
        targetId: '1:1:4',
        dependencyTypeArabic: 'نعت ثانٍ',
        dependencyTypeEnglish: 'Second Adjective (Na\'t) <— Described Noun'
      }
    ]
  },
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
    surahNumber: 1,
    ayahNumber: 5,
    surahNameArabic: 'الفاتحة',
    surahNameEnglish: 'The Opening',
    arabicVerseText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    translation: 'It is You we worship and You we ask for help.',
    summaryIrab: '(إِيَّاكَ) ضمير نصب منفصل مبني على السكون في محل نصب مفعول به مقدم، والكاف حرف خطاب. (نَعْبُدُ) فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر وجوبًا تقديره نحن. (وَ) حرف عطف. (إِيَّاكَ نَسْتَعِينُ) تعرب كسابقتها. وتقديم المفعول به يفيد الحصر والاختصاص: لا نعبد إلا إياك.',
    tokens: [
      {
        location: '1:5:1',
        wordIndex: 1,
        arabicText: 'إِيَّاكَ',
        simpleArabic: 'إياك',
        transliteration: 'iyyāka',
        englishMeaning: 'You Alone',
        lemma: 'إِيّا',
        segments: [
          {
            segmentArabic: 'إِيَّا',
            transliteration: 'iyyā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير منفصل)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'ضمير منفصل مبني في محل نصب مفعول به مقدم',
            englishExplanation: 'Detached accusative pronoun placed before its verb as a fronted object; fronting it restricts worship to Allah alone.',
            caseOrMood: 'Accusative (منصوب)'
          },
          {
            segmentArabic: 'كَ',
            transliteration: 'ka',
            posTag: 'PRON',
            posLabel: 'Address Kaf (كاف الخطاب)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'حرف خطاب',
            englishExplanation: 'Suffix of address marking the second person: "You".'
          }
        ]
      },
      {
        location: '1:5:2',
        wordIndex: 2,
        arabicText: 'نَعْبُدُ',
        simpleArabic: 'نعبد',
        transliteration: 'naʿbudu',
        englishMeaning: 'we worship',
        rootArabic: 'ع ب د',
        lemma: 'عَبَدَ',
        segments: [
          {
            segmentArabic: 'نَعْبُدُ',
            transliteration: 'naʿbudu',
            posTag: 'V',
            posLabel: 'Imperfect Verb (فعل مضارع)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر تقديره نحن',
            englishExplanation: 'Imperfect verb in the indicative mood; its subject is the implied pronoun "we".',
            caseOrMood: 'Indicative (مرفوع)',
            features: ['First Person', 'Plural']
          }
        ]
      },
      {
        location: '1:5:3',
        wordIndex: 3,
        arabicText: 'وَإِيَّاكَ',
        simpleArabic: 'وإياك',
        transliteration: 'wa-iyyāka',
        englishMeaning: 'and You Alone',
        lemma: 'إِيّا',
        segments: [
          {
            segmentArabic: 'وَ',
            transliteration: 'wa',
            posTag: 'CONJ',
            posLabel: 'Conjunction (حرف عطف)',
            posColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
            arabicGrammarTerm: 'حرف عطف',
            englishExplanation: 'Conjunction joining the second sentence to the first.'
          },
          {
            segmentArabic: 'إِيَّا',
            transliteration: 'iyyā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير منفصل)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'ضمير منفصل مبني في محل نصب مفعول به مقدم',
            englishExplanation: 'Detached accusative pronoun, fronted object of "we ask for help".',
            caseOrMood: 'Accusative (منصوب)'
          },
          {
            segmentArabic: 'كَ',
            transliteration: 'ka',
            posTag: 'PRON',
            posLabel: 'Address Kaf (كاف الخطاب)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'حرف خطاب',
            englishExplanation: 'Suffix of address marking the second person.'
          }
        ]
      },
      {
        location: '1:5:4',
        wordIndex: 4,
        arabicText: 'نَسْتَعِينُ',
        simpleArabic: 'نستعين',
        transliteration: 'nastaʿīnu',
        englishMeaning: 'we ask for help',
        rootArabic: 'ع و ن',
        lemma: 'اسْتَعِينُ',
        segments: [
          {
            segmentArabic: 'نَسْتَعِينُ',
            transliteration: 'nastaʿīnu',
            posTag: 'V',
            posLabel: 'Imperfect Verb (فعل مضارع)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر تقديره نحن',
            englishExplanation: 'Form X imperfect verb (istaf\'ala: to seek something) in the indicative; subject is the implied "we".',
            caseOrMood: 'Indicative (مرفوع)',
            features: ['Form X', 'First Person', 'Plural']
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '1:5:2',
        targetId: '1:5:1',
        dependencyTypeArabic: 'مفعول به مقدم',
        dependencyTypeEnglish: 'Fronted Object (Maf\'ūl Bihi) <— Verb'
      },
      {
        sourceId: '1:5:4',
        targetId: '1:5:3',
        dependencyTypeArabic: 'مفعول به مقدم',
        dependencyTypeEnglish: 'Fronted Object (Maf\'ūl Bihi) <— Verb'
      },
      {
        sourceId: '1:5:2',
        targetId: '1:5:4',
        dependencyTypeArabic: 'عطف جملة على جملة',
        dependencyTypeEnglish: 'Coordination (\'Aṭf) of Two Verbal Sentences'
      }
    ]
  },
  {
    surahNumber: 1,
    ayahNumber: 6,
    surahNameArabic: 'الفاتحة',
    surahNameEnglish: 'The Opening',
    arabicVerseText: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
    translation: 'Guide us to the straight path -',
    summaryIrab: '(اهْدِ) فعل دعاء بصيغة الأمر مبني على حذف حرف العلة (الياء)، والفاعل ضمير مستتر وجوبًا تقديره أنت، و(نَا) ضمير متصل مبني في محل نصب مفعول به أول. (الصِّرَاطَ) مفعول به ثانٍ منصوب بالفتحة. (الْمُسْتَقِيمَ) نعت منصوب بالفتحة.',
    tokens: [
      {
        location: '1:6:1',
        wordIndex: 1,
        arabicText: 'ٱهْدِنَا',
        simpleArabic: 'اهدنا',
        transliteration: 'ihdinā',
        englishMeaning: 'Guide us',
        rootArabic: 'ه د ي',
        lemma: 'هَدَى',
        segments: [
          {
            segmentArabic: 'ٱهْدِ',
            transliteration: 'ihdi',
            posTag: 'V',
            posLabel: 'Imperative Verb (فعل أمر)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل دعاء مبني على حذف حرف العلة، والفاعل ضمير مستتر تقديره أنت',
            englishExplanation: 'Imperative used as a supplication (Du\'ā\'), built on dropping the final weak letter Yā\' of hadā; subject is the implied "You".'
          },
          {
            segmentArabic: 'نَا',
            transliteration: 'nā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل نصب مفعول به أول',
            englishExplanation: 'Attached pronoun "us" as the first object.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '1:6:2',
        wordIndex: 2,
        arabicText: 'ٱلصِّرَٰطَ',
        simpleArabic: 'الصرط',
        transliteration: 'l-ṣirāṭa',
        englishMeaning: '(to) the path',
        rootArabic: 'ص ر ط',
        lemma: 'صِراط',
        segments: [
          {
            segmentArabic: 'ٱل',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article: the one well-known path.'
          },
          {
            segmentArabic: 'صِّرَٰطَ',
            transliteration: 'ṣirāṭa',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'مفعول به ثانٍ منصوب بالفتحة',
            englishExplanation: 'Second object of the doubly transitive verb hadā (guide someone to something).',
            caseOrMood: 'Accusative (منصوب)',
            features: ['Singular', 'Masculine', 'Definite']
          }
        ]
      },
      {
        location: '1:6:3',
        wordIndex: 3,
        arabicText: 'ٱلْمُسْتَقِيمَ',
        simpleArabic: 'المستقيم',
        transliteration: 'l-mustaqīma',
        englishMeaning: 'the straight',
        rootArabic: 'ق و م',
        lemma: 'مُسْتَقِيم',
        segments: [
          {
            segmentArabic: 'ٱلْ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article, matching the described noun.'
          },
          {
            segmentArabic: 'مُسْتَقِيمَ',
            transliteration: 'mustaqīma',
            posTag: 'ADJ',
            posLabel: 'Adjective (صفة)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'نعت منصوب بالفتحة',
            englishExplanation: 'Adjective agreeing with al-ṣirāṭ in case, gender and definiteness; a Form X active participle: "straight, upright".',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '1:6:1',
        targetId: '1:6:2',
        dependencyTypeArabic: 'مفعول به ثانٍ',
        dependencyTypeEnglish: 'Second Object (Maf\'ūl Bihi Thānin) <— Verb'
      },
      {
        sourceId: '1:6:2',
        targetId: '1:6:3',
        dependencyTypeArabic: 'نعت',
        dependencyTypeEnglish: 'Adjective (Na\'t) <— Described Noun'
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
  },
  {
    surahNumber: 97,
    ayahNumber: 1,
    surahNameArabic: 'القدر',
    surahNameEnglish: 'The Power',
    arabicVerseText: 'إِنَّآ أَنزَلْنَـٰهُ فِى لَيْلَةِ ٱلْقَدْرِ',
    translation: 'Indeed, We sent it [i.e., the Quran] down during the Night of Decree.',
    summaryIrab: '(إِنَّا) إنّ حرف توكيد ونصب، و(نَا) ضمير متصل في محل نصب اسم إنّ. (أَنزَلْنَاهُ) فعل ماض مبني على السكون، و(نَا) ضمير متصل في محل رفع فاعل، و(الهاء) ضمير متصل في محل نصب مفعول به يعود على القرآن. (فِي) حرف جر، (لَيْلَةِ) اسم مجرور بالكسرة وهو مضاف، والجار والمجرور متعلق بـ(أنزلناه). (الْقَدْرِ) مضاف إليه مجرور بالكسرة. وجملة (أنزلناه) في محل رفع خبر إنّ.',
    tokens: [
      {
        location: '97:1:1',
        wordIndex: 1,
        arabicText: 'إِنَّآ',
        simpleArabic: 'إنا',
        transliteration: 'innā',
        englishMeaning: 'Indeed, We',
        lemma: 'إِنّ',
        segments: [
          {
            segmentArabic: 'إِنَّ',
            transliteration: 'inna',
            posTag: 'ACC',
            posLabel: 'Accusative Particle (حرف توكيد ونصب)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف توكيد ونصب',
            englishExplanation: 'Particle of emphasis governing a nominal sentence.'
          },
          {
            segmentArabic: 'آ',
            transliteration: 'ā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل نصب اسم إنّ',
            englishExplanation: 'Pronoun "We" (of majesty) as the subject of inna.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '97:1:2',
        wordIndex: 2,
        arabicText: 'أَنزَلْنَـٰهُ',
        simpleArabic: 'أنزلنه',
        transliteration: 'anzalnāhu',
        englishMeaning: 'revealed it',
        rootArabic: 'ن ز ل',
        lemma: 'أَنزَلَ',
        segments: [
          {
            segmentArabic: 'أَنزَلْ',
            transliteration: 'anzal',
            posTag: 'V',
            posLabel: 'Perfect Verb (فعل ماض)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل ماض مبني على السكون',
            englishExplanation: 'Form IV perfect verb "sent down".',
            features: ['Form IV']
          },
          {
            segmentArabic: 'نَـٰ',
            transliteration: 'nā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل رفع فاعل',
            englishExplanation: 'Attached pronoun "We" as the subject (Fā\'il).',
            caseOrMood: 'Nominative (مرفوع)'
          },
          {
            segmentArabic: 'هُ',
            transliteration: 'hu',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل نصب مفعول به',
            englishExplanation: 'Attached pronoun "it" as the object, referring to the Quran though not named before: a sign of its fame and greatness.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '97:1:3',
        wordIndex: 3,
        arabicText: 'فِى',
        simpleArabic: 'فى',
        transliteration: 'fī',
        englishMeaning: 'in',
        lemma: 'فِي',
        segments: [
          {
            segmentArabic: 'فِى',
            transliteration: 'fī',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر',
            englishExplanation: 'Preposition "in", here of time.'
          }
        ]
      },
      {
        location: '97:1:4',
        wordIndex: 4,
        arabicText: 'لَيْلَةِ',
        simpleArabic: 'ليلة',
        transliteration: 'laylati',
        englishMeaning: '(the) Night',
        rootArabic: 'ل ي ل',
        lemma: 'لَيْلَة',
        segments: [
          {
            segmentArabic: 'لَيْلَةِ',
            transliteration: 'laylati',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم مجرور بفي وهو مضاف',
            englishExplanation: 'Genitive noun after fī, annexed to al-qadr.',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Muḍāf']
          }
        ]
      },
      {
        location: '97:1:5',
        wordIndex: 5,
        arabicText: 'ٱلْقَدْرِ',
        simpleArabic: 'القدر',
        transliteration: 'l-qadri',
        englishMeaning: '(of) Power',
        rootArabic: 'ق د ر',
        lemma: 'قَدْر',
        segments: [
          {
            segmentArabic: 'ٱلْ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'قَدْرِ',
            transliteration: 'qadri',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'مضاف إليه مجرور بالكسرة',
            englishExplanation: 'Second term of the annexation, genitive: decree, and high honour.',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '97:1:1',
        targetId: '97:1:2',
        dependencyTypeArabic: 'خبر إنّ (جملة فعلية)',
        dependencyTypeEnglish: 'Predicate of Inna (Verbal Sentence)'
      },
      {
        sourceId: '97:1:2',
        targetId: '97:1:3',
        dependencyTypeArabic: 'متعلق بأنزلناه',
        dependencyTypeEnglish: 'Prepositional Attachment (Muta\'alliq) <— Verb'
      },
      {
        sourceId: '97:1:3',
        targetId: '97:1:4',
        dependencyTypeArabic: 'اسم مجرور',
        dependencyTypeEnglish: 'Genitive Object of Preposition (Majrūr)'
      },
      {
        sourceId: '97:1:4',
        targetId: '97:1:5',
        dependencyTypeArabic: 'إضافة (مضاف ومضاف إليه)',
        dependencyTypeEnglish: 'Genitive Annexation (Muḍāf <— Muḍāf Ilayh)'
      }
    ]
  },
  {
    surahNumber: 103,
    ayahNumber: 2,
    surahNameArabic: 'العصر',
    surahNameEnglish: 'The Declining Day',
    arabicVerseText: 'إِنَّ ٱلْإِنسَـٰنَ لَفِى خُسْرٍ',
    translation: 'Indeed, mankind is in loss,',
    summaryIrab: '(إِنَّ) حرف توكيد ونصب. (الْإِنسَانَ) اسم إنّ منصوب بالفتحة. (لَ) اللام المزحلقة للتوكيد. (فِي) حرف جر، (خُسْرٍ) اسم مجرور بالكسرة، والجار والمجرور متعلق بمحذوف في محل رفع خبر إنّ.',
    tokens: [
      {
        location: '103:2:1',
        wordIndex: 1,
        arabicText: 'إِنَّ',
        simpleArabic: 'إن',
        transliteration: 'inna',
        englishMeaning: 'Indeed',
        lemma: 'إِنّ',
        segments: [
          {
            segmentArabic: 'إِنَّ',
            transliteration: 'inna',
            posTag: 'ACC',
            posLabel: 'Accusative Particle (حرف توكيد ونصب)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف توكيد ونصب',
            englishExplanation: 'Particle of emphasis: puts its subject in the accusative.'
          }
        ]
      },
      {
        location: '103:2:2',
        wordIndex: 2,
        arabicText: 'ٱلْإِنسَـٰنَ',
        simpleArabic: 'الإنسن',
        transliteration: 'l-insāna',
        englishMeaning: 'mankind',
        rootArabic: 'أ ن س',
        lemma: 'إِنسان',
        segments: [
          {
            segmentArabic: 'ٱلْ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف للجنس',
            englishExplanation: 'Definite article of the genus: every human being.'
          },
          {
            segmentArabic: 'إِنسَـٰنَ',
            transliteration: 'insāna',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم إنّ منصوب بالفتحة',
            englishExplanation: 'Subject of inna (Ism Inna) in the accusative.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '103:2:3',
        wordIndex: 3,
        arabicText: 'لَفِى',
        simpleArabic: 'لفى',
        transliteration: 'lafī',
        englishMeaning: '(is) surely, in',
        lemma: 'فِي',
        segments: [
          {
            segmentArabic: 'لَ',
            transliteration: 'la',
            posTag: 'EMPH',
            posLabel: 'Emphatic Lām (اللام المزحلقة)',
            posColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
            arabicGrammarTerm: 'اللام المزحلقة',
            englishExplanation: 'Emphatic Lām "moved" onto the predicate of inna, adding a second layer of emphasis.'
          },
          {
            segmentArabic: 'فِى',
            transliteration: 'fī',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر',
            englishExplanation: 'Preposition "in": loss surrounds man like a container.'
          }
        ]
      },
      {
        location: '103:2:4',
        wordIndex: 4,
        arabicText: 'خُسْرٍ',
        simpleArabic: 'خسر',
        transliteration: 'khusrin',
        englishMeaning: 'loss',
        rootArabic: 'خ س ر',
        lemma: 'خُسْر',
        segments: [
          {
            segmentArabic: 'خُسْرٍ',
            transliteration: 'khusrin',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم مجرور بالكسرة',
            englishExplanation: 'Genitive noun after fī; indefinite to convey loss of every great kind.',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Indefinite']
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '103:2:1',
        targetId: '103:2:2',
        dependencyTypeArabic: 'اسم إنّ',
        dependencyTypeEnglish: 'Subject of Inna (Ism Inna)'
      },
      {
        sourceId: '103:2:1',
        targetId: '103:2:3',
        dependencyTypeArabic: 'خبر إنّ (شبه جملة)',
        dependencyTypeEnglish: 'Predicate of Inna (Prepositional Phrase)'
      },
      {
        sourceId: '103:2:3',
        targetId: '103:2:4',
        dependencyTypeArabic: 'اسم مجرور',
        dependencyTypeEnglish: 'Genitive Object of Preposition (Majrūr)'
      }
    ]
  },
  {
    surahNumber: 108,
    ayahNumber: 1,
    surahNameArabic: 'الكوثر',
    surahNameEnglish: 'The Abundance',
    arabicVerseText: 'إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ',
    translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
    summaryIrab: '(إِنَّا) إنّ حرف توكيد ونصب، و(نَا) ضمير متصل مبني في محل نصب اسم إنّ. (أَعْطَيْنَاكَ) فعل ماض مبني على السكون لاتصاله بـ(نا) الفاعلين، و(نَا) ضمير متصل في محل رفع فاعل، و(الكاف) ضمير متصل في محل نصب مفعول به أول. (الْكَوْثَرَ) مفعول به ثانٍ منصوب بالفتحة. وجملة (أَعْطَيْنَاكَ الْكَوْثَرَ) في محل رفع خبر إنّ.',
    tokens: [
      {
        location: '108:1:1',
        wordIndex: 1,
        arabicText: 'إِنَّآ',
        simpleArabic: 'إنآ',
        transliteration: 'innā',
        englishMeaning: 'Indeed, We',
        lemma: 'إِنّ',
        segments: [
          {
            segmentArabic: 'إِنَّ',
            transliteration: 'inna',
            posTag: 'ACC',
            posLabel: 'Accusative Particle (حرف توكيد ونصب)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف توكيد ونصب',
            englishExplanation: 'Particle of emphasis that puts its subject in the accusative and its predicate in the nominative.'
          },
          {
            segmentArabic: 'آ',
            transliteration: 'ā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل نصب اسم إنّ',
            englishExplanation: 'Pronoun "We" (of majesty) as the subject of inna; innā is innanā with one nūn dropped.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '108:1:2',
        wordIndex: 2,
        arabicText: 'أَعْطَيْنَـٰكَ',
        simpleArabic: 'أعطينك',
        transliteration: 'aʿṭaynāka',
        englishMeaning: 'We have given you',
        rootArabic: 'ع ط و',
        lemma: 'أَعْطَى',
        segments: [
          {
            segmentArabic: 'أَعْطَيْ',
            transliteration: 'aʿṭay',
            posTag: 'V',
            posLabel: 'Perfect Verb (فعل ماض)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل ماض مبني على السكون',
            englishExplanation: 'Form IV perfect verb "gave", built on sukūn because a subject pronoun is attached.',
            features: ['Form IV']
          },
          {
            segmentArabic: 'نَـٰ',
            transliteration: 'nā',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل رفع فاعل',
            englishExplanation: 'Attached pronoun "We" as the subject (Fā\'il).',
            caseOrMood: 'Nominative (مرفوع)'
          },
          {
            segmentArabic: 'كَ',
            transliteration: 'ka',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل نصب مفعول به أول',
            englishExplanation: 'Attached pronoun "you" (the Prophet ﷺ) as the first object.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      },
      {
        location: '108:1:3',
        wordIndex: 3,
        arabicText: 'ٱلْكَوْثَرَ',
        simpleArabic: 'الكوثر',
        transliteration: 'l-kawthara',
        englishMeaning: 'Al-Kauthar',
        rootArabic: 'ك ث ر',
        lemma: 'كَوْثَر',
        segments: [
          {
            segmentArabic: 'ٱلْ',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'كَوْثَرَ',
            transliteration: 'kawthara',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'مفعول به ثانٍ منصوب بالفتحة',
            englishExplanation: 'Second object of the doubly transitive verb a\'ṭā. Fawʿal pattern of abundance (root k-th-r): a river in Paradise and abundant good.',
            caseOrMood: 'Accusative (منصوب)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '108:1:1',
        targetId: '108:1:2',
        dependencyTypeArabic: 'خبر إنّ (جملة فعلية)',
        dependencyTypeEnglish: 'Predicate of Inna (Verbal Sentence)'
      },
      {
        sourceId: '108:1:2',
        targetId: '108:1:3',
        dependencyTypeArabic: 'مفعول به ثانٍ',
        dependencyTypeEnglish: 'Second Object (Maf\'ūl Bihi Thānin) <— Verb'
      }
    ]
  },
  {
    surahNumber: 112,
    ayahNumber: 1,
    surahNameArabic: 'الإخلاص',
    surahNameEnglish: 'The Sincerity',
    arabicVerseText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    translation: 'Say, "He is Allah, [who is] One,',
    summaryIrab: '(قُلْ) فعل أمر مبني على السكون، والفاعل ضمير مستتر وجوبًا تقديره أنت. (هُوَ) ضمير الشأن مبني في محل رفع مبتدأ أول. (اللَّهُ) مبتدأ ثانٍ مرفوع بالضمة. (أَحَدٌ) خبر المبتدأ الثاني مرفوع بالضمة، والجملة (اللَّهُ أَحَدٌ) في محل رفع خبر ضمير الشأن. وجملة (هُوَ اللَّهُ أَحَدٌ) في محل نصب مقول القول. وقيل: (هو) مبتدأ و(الله) خبره و(أحد) خبر ثانٍ.',
    tokens: [
      {
        location: '112:1:1',
        wordIndex: 1,
        arabicText: 'قُلْ',
        simpleArabic: 'قل',
        transliteration: 'qul',
        englishMeaning: 'Say',
        rootArabic: 'ق و ل',
        lemma: 'قالَ',
        segments: [
          {
            segmentArabic: 'قُلْ',
            transliteration: 'qul',
            posTag: 'V',
            posLabel: 'Imperative Verb (فعل أمر)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل أمر مبني على السكون، والفاعل ضمير مستتر تقديره أنت',
            englishExplanation: 'Imperative "Say", addressed to the Prophet ﷺ; its object is the whole sentence that follows.'
          }
        ]
      },
      {
        location: '112:1:2',
        wordIndex: 2,
        arabicText: 'هُوَ',
        simpleArabic: 'هو',
        transliteration: 'huwa',
        englishMeaning: 'He',
        lemma: 'هُوَ',
        segments: [
          {
            segmentArabic: 'هُوَ',
            transliteration: 'huwa',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير منفصل)',
            posColor: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
            arabicGrammarTerm: 'ضمير الشأن مبني في محل رفع مبتدأ',
            englishExplanation: 'Pronoun of the matter (Ḍamīr al-Sha\'n): "The fact is…", announcing something of great importance.',
            caseOrMood: 'Nominative (مرفوع)'
          }
        ]
      },
      {
        location: '112:1:3',
        wordIndex: 3,
        arabicText: 'ٱللَّهُ',
        simpleArabic: 'الله',
        transliteration: 'l-lahu',
        englishMeaning: '(is) Allah',
        rootArabic: 'أ ل ه',
        lemma: 'اللَّه',
        segments: [
          {
            segmentArabic: 'ٱللَّهُ',
            transliteration: 'allāhu',
            posTag: 'PN',
            posLabel: 'Proper Noun (اسم الجلالة)',
            posColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
            arabicGrammarTerm: 'مبتدأ ثانٍ مرفوع بالضمة',
            englishExplanation: 'Second subject (Mubtada\') in the nominative.',
            caseOrMood: 'Nominative (مرفوع)'
          }
        ]
      },
      {
        location: '112:1:4',
        wordIndex: 4,
        arabicText: 'أَحَدٌ',
        simpleArabic: 'أحد',
        transliteration: 'aḥadun',
        englishMeaning: 'the One',
        rootArabic: 'أ ح د',
        lemma: 'أَحَد',
        segments: [
          {
            segmentArabic: 'أَحَدٌ',
            transliteration: 'aḥadun',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'خبر مرفوع بالضمة',
            englishExplanation: 'Predicate (Khabar) in the nominative: absolutely One, without partner or division.',
            caseOrMood: 'Nominative (مرفوع)',
            features: ['Indefinite', 'Singular']
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '112:1:1',
        targetId: '112:1:2',
        dependencyTypeArabic: 'مقول القول',
        dependencyTypeEnglish: 'Speech Content (Maqūl al-Qawl) <— Verb of Saying'
      },
      {
        sourceId: '112:1:2',
        targetId: '112:1:3',
        dependencyTypeArabic: 'خبر ضمير الشأن (جملة اسمية)',
        dependencyTypeEnglish: 'Predicate Clause <— Pronoun of the Matter'
      },
      {
        sourceId: '112:1:3',
        targetId: '112:1:4',
        dependencyTypeArabic: 'خبر',
        dependencyTypeEnglish: 'Predicate (Khabar) <— Subject (Mubtada\')'
      }
    ]
  },
  {
    surahNumber: 112,
    ayahNumber: 2,
    surahNameArabic: 'الإخلاص',
    surahNameEnglish: 'The Sincerity',
    arabicVerseText: 'ٱللَّهُ ٱلصَّمَدُ',
    translation: 'Allah, the Eternal Refuge.',
    summaryIrab: '(اللَّهُ) لفظ الجلالة مبتدأ مرفوع بالضمة. (الصَّمَدُ) خبر مرفوع بالضمة. والتعريف في الطرفين يفيد الحصر: هو وحده الصمد.',
    tokens: [
      {
        location: '112:2:1',
        wordIndex: 1,
        arabicText: 'ٱللَّهُ',
        simpleArabic: 'الله',
        transliteration: 'al-lahu',
        englishMeaning: 'Allah',
        rootArabic: 'أ ل ه',
        lemma: 'اللَّه',
        segments: [
          {
            segmentArabic: 'ٱللَّهُ',
            transliteration: 'allāhu',
            posTag: 'PN',
            posLabel: 'Proper Noun (اسم الجلالة)',
            posColor: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700',
            arabicGrammarTerm: 'مبتدأ مرفوع بالضمة',
            englishExplanation: 'Subject (Mubtada\') in the nominative.',
            caseOrMood: 'Nominative (مرفوع)'
          }
        ]
      },
      {
        location: '112:2:2',
        wordIndex: 2,
        arabicText: 'ٱلصَّمَدُ',
        simpleArabic: 'الصمد',
        transliteration: 'l-ṣamadu',
        englishMeaning: 'the Eternal, the Absolute',
        rootArabic: 'ص م د',
        lemma: 'صَمَد',
        segments: [
          {
            segmentArabic: 'ٱل',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article; with both parts definite, the sentence restricts the description to Allah.'
          },
          {
            segmentArabic: 'صَّمَدُ',
            transliteration: 'ṣamadu',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'خبر مرفوع بالضمة',
            englishExplanation: 'Predicate (Khabar) in the nominative: the Master to whom all turn in need.',
            caseOrMood: 'Nominative (مرفوع)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '112:2:1',
        targetId: '112:2:2',
        dependencyTypeArabic: 'خبر',
        dependencyTypeEnglish: 'Predicate (Khabar) <— Subject (Mubtada\')'
      }
    ]
  },
  {
    surahNumber: 112,
    ayahNumber: 3,
    surahNameArabic: 'الإخلاص',
    surahNameEnglish: 'The Sincerity',
    arabicVerseText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    translation: 'He neither begets nor is born,',
    summaryIrab: '(لَمْ) حرف نفي وجزم وقلب. (يَلِدْ) فعل مضارع مجزوم بلم وعلامة جزمه السكون، والفاعل ضمير مستتر تقديره هو. (وَ) حرف عطف. (لَمْ) حرف نفي وجزم وقلب. (يُولَدْ) فعل مضارع مبني للمجهول مجزوم بالسكون، ونائب الفاعل ضمير مستتر تقديره هو.',
    tokens: [
      {
        location: '112:3:1',
        wordIndex: 1,
        arabicText: 'لَمْ',
        simpleArabic: 'لم',
        transliteration: 'lam',
        englishMeaning: 'Not',
        lemma: 'لَم',
        segments: [
          {
            segmentArabic: 'لَمْ',
            transliteration: 'lam',
            posTag: 'NEG',
            posLabel: 'Negative Particle (لم الجازمة)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف نفي وجزم وقلب',
            englishExplanation: 'Negates the verb, puts it in the jussive, and turns its meaning to the past (Qalb): "He did not / does not".'
          }
        ]
      },
      {
        location: '112:3:2',
        wordIndex: 2,
        arabicText: 'يَلِدْ',
        simpleArabic: 'يلد',
        transliteration: 'yalid',
        englishMeaning: 'He begets',
        rootArabic: 'و ل د',
        lemma: 'وَلَدَ',
        segments: [
          {
            segmentArabic: 'يَلِدْ',
            transliteration: 'yalid',
            posTag: 'V',
            posLabel: 'Imperfect Verb (فعل مضارع)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل مضارع مجزوم بالسكون، والفاعل ضمير مستتر تقديره هو',
            englishExplanation: 'Imperfect verb in the jussive after lam; its first radical Wāw drops in the imperfect (walada → yalidu).',
            caseOrMood: 'Jussive (مجزوم)',
            features: ['Third Person', 'Masculine', 'Singular']
          }
        ]
      },
      {
        location: '112:3:3',
        wordIndex: 3,
        arabicText: 'وَلَمْ',
        simpleArabic: 'ولم',
        transliteration: 'walam',
        englishMeaning: 'and not',
        lemma: 'لَم',
        segments: [
          {
            segmentArabic: 'وَ',
            transliteration: 'wa',
            posTag: 'CONJ',
            posLabel: 'Conjunction (حرف عطف)',
            posColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
            arabicGrammarTerm: 'حرف عطف',
            englishExplanation: 'Conjunction.'
          },
          {
            segmentArabic: 'لَمْ',
            transliteration: 'lam',
            posTag: 'NEG',
            posLabel: 'Negative Particle (لم الجازمة)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف نفي وجزم وقلب',
            englishExplanation: 'Jussive negative particle.'
          }
        ]
      },
      {
        location: '112:3:4',
        wordIndex: 4,
        arabicText: 'يُولَدْ',
        simpleArabic: 'يولد',
        transliteration: 'yūlad',
        englishMeaning: 'He is begotten',
        rootArabic: 'و ل د',
        lemma: 'وَلَدَ',
        segments: [
          {
            segmentArabic: 'يُولَدْ',
            transliteration: 'yūlad',
            posTag: 'V',
            posLabel: 'Imperfect Verb (فعل مضارع)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل مضارع مبني للمجهول مجزوم بالسكون، ونائب الفاعل ضمير مستتر تقديره هو',
            englishExplanation: 'Passive imperfect verb in the jussive: "He was not born"; its deputy subject is the implied "He".',
            caseOrMood: 'Jussive (مجزوم)',
            features: ['Passive', 'Third Person']
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '112:3:2',
        targetId: '112:3:1',
        dependencyTypeArabic: 'جزم ونفي',
        dependencyTypeEnglish: 'Jussive Negation <— Lam'
      },
      {
        sourceId: '112:3:4',
        targetId: '112:3:3',
        dependencyTypeArabic: 'جزم ونفي',
        dependencyTypeEnglish: 'Jussive Negation <— Lam'
      },
      {
        sourceId: '112:3:2',
        targetId: '112:3:4',
        dependencyTypeArabic: 'عطف',
        dependencyTypeEnglish: 'Coordination (\'Aṭf)'
      }
    ]
  },
  {
    surahNumber: 112,
    ayahNumber: 4,
    surahNameArabic: 'الإخلاص',
    surahNameEnglish: 'The Sincerity',
    arabicVerseText: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
    translation: 'Nor is there to Him any equivalent."',
    summaryIrab: '(وَ) حرف عطف. (لَمْ) حرف نفي وجزم وقلب. (يَكُنْ) فعل مضارع ناقص مجزوم بالسكون، وحذفت الواو لالتقاء الساكنين. (لَهُ) جار ومجرور متعلق بـ(كُفُوًا). (كُفُوًا) خبر يكن مقدم منصوب بالفتحة. (أَحَدٌ) اسم يكن مؤخر مرفوع بالضمة.',
    tokens: [
      {
        location: '112:4:1',
        wordIndex: 1,
        arabicText: 'وَلَمْ',
        simpleArabic: 'ولم',
        transliteration: 'walam',
        englishMeaning: 'And not',
        lemma: 'لَم',
        segments: [
          {
            segmentArabic: 'وَ',
            transliteration: 'wa',
            posTag: 'CONJ',
            posLabel: 'Conjunction (حرف عطف)',
            posColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600',
            arabicGrammarTerm: 'حرف عطف',
            englishExplanation: 'Conjunction joining this verse to the previous one.'
          },
          {
            segmentArabic: 'لَمْ',
            transliteration: 'lam',
            posTag: 'NEG',
            posLabel: 'Negative Particle (لم الجازمة)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف نفي وجزم وقلب',
            englishExplanation: 'Jussive negative particle.'
          }
        ]
      },
      {
        location: '112:4:2',
        wordIndex: 2,
        arabicText: 'يَكُن',
        simpleArabic: 'يكن',
        transliteration: 'yakun',
        englishMeaning: 'is',
        rootArabic: 'ك و ن',
        lemma: 'كانَ',
        segments: [
          {
            segmentArabic: 'يَكُن',
            transliteration: 'yakun',
            posTag: 'V',
            posLabel: 'Imperfect Verb (فعل مضارع)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل مضارع ناقص مجزوم بالسكون',
            englishExplanation: 'Defective verb kāna (to be) in the jussive; its middle Wāw drops to avoid two consecutive sukūns (yakūnu → yakun).',
            caseOrMood: 'Jussive (مجزوم)',
            features: ['Defective Verb (Kāna)']
          }
        ]
      },
      {
        location: '112:4:3',
        wordIndex: 3,
        arabicText: 'لَّهُۥ',
        simpleArabic: 'له',
        transliteration: 'lahu',
        englishMeaning: 'for Him',
        lemma: 'ل',
        segments: [
          {
            segmentArabic: 'لَ',
            transliteration: 'la',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر',
            englishExplanation: 'Preposition "to / for".'
          },
          {
            segmentArabic: 'هُۥ',
            transliteration: 'hu',
            posTag: 'PRON',
            posLabel: 'Pronoun (ضمير متصل)',
            posColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
            arabicGrammarTerm: 'ضمير متصل مبني في محل جر',
            englishExplanation: 'Attached pronoun "Him" in the genitive; the phrase attaches to kufuwan: "equal to Him".',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      },
      {
        location: '112:4:4',
        wordIndex: 4,
        arabicText: 'كُفُوًا',
        simpleArabic: 'كفوا',
        transliteration: 'kufuwan',
        englishMeaning: 'equivalent',
        rootArabic: 'ك ف أ',
        lemma: 'كُفُو',
        segments: [
          {
            segmentArabic: 'كُفُوًا',
            transliteration: 'kufuwan',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'خبر يكن مقدم منصوب بالفتحة',
            englishExplanation: 'Predicate of kāna, placed before its subject, in the accusative: "an equal".',
            caseOrMood: 'Accusative (منصوب)',
            features: ['Indefinite']
          }
        ]
      },
      {
        location: '112:4:5',
        wordIndex: 5,
        arabicText: 'أَحَدٌۢ',
        simpleArabic: 'أحد',
        transliteration: 'aḥadun',
        englishMeaning: 'any [one]',
        rootArabic: 'أ ح د',
        lemma: 'أَحَد',
        segments: [
          {
            segmentArabic: 'أَحَدٌۢ',
            transliteration: 'aḥadun',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم يكن مؤخر مرفوع بالضمة',
            englishExplanation: 'Subject of kāna, delayed to the end, in the nominative: "anyone". Delaying it stresses that no one at all is His equal.',
            caseOrMood: 'Nominative (مرفوع)',
            features: ['Indefinite']
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '112:4:2',
        targetId: '112:4:1',
        dependencyTypeArabic: 'جزم ونفي',
        dependencyTypeEnglish: 'Jussive Negation <— Lam'
      },
      {
        sourceId: '112:4:2',
        targetId: '112:4:5',
        dependencyTypeArabic: 'اسم كان مؤخر',
        dependencyTypeEnglish: 'Subject of Kāna (Ism Kāna), Delayed'
      },
      {
        sourceId: '112:4:2',
        targetId: '112:4:4',
        dependencyTypeArabic: 'خبر كان مقدم',
        dependencyTypeEnglish: 'Predicate of Kāna (Khabar Kāna), Fronted'
      },
      {
        sourceId: '112:4:4',
        targetId: '112:4:3',
        dependencyTypeArabic: 'متعلق بكفوًا',
        dependencyTypeEnglish: 'Prepositional Attachment (Muta\'alliq)'
      }
    ]
  },
  {
    surahNumber: 114,
    ayahNumber: 1,
    surahNameArabic: 'الناس',
    surahNameEnglish: 'Mankind',
    arabicVerseText: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
    translation: 'Say, "I seek refuge in the Lord of mankind,',
    summaryIrab: '(قُلْ) فعل أمر مبني على السكون، والفاعل ضمير مستتر وجوبًا تقديره أنت. (أَعُوذُ) فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر وجوبًا تقديره أنا. (بِرَبِّ) جار ومجرور متعلق بـ(أعوذ)، و(ربّ) مضاف. (النَّاسِ) مضاف إليه مجرور بالكسرة. وجملة (أعوذ برب الناس) في محل نصب مقول القول.',
    tokens: [
      {
        location: '114:1:1',
        wordIndex: 1,
        arabicText: 'قُلْ',
        simpleArabic: 'قل',
        transliteration: 'qul',
        englishMeaning: 'Say',
        rootArabic: 'ق و ل',
        lemma: 'قالَ',
        segments: [
          {
            segmentArabic: 'قُلْ',
            transliteration: 'qul',
            posTag: 'V',
            posLabel: 'Imperative Verb (فعل أمر)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل أمر مبني على السكون، والفاعل ضمير مستتر تقديره أنت',
            englishExplanation: 'Imperative "Say"; the sentence that follows is its object.'
          }
        ]
      },
      {
        location: '114:1:2',
        wordIndex: 2,
        arabicText: 'أَعُوذُ',
        simpleArabic: 'أعوذ',
        transliteration: 'aʿūdhu',
        englishMeaning: 'I seek refuge',
        rootArabic: 'ع و ذ',
        lemma: 'عاذَ',
        segments: [
          {
            segmentArabic: 'أَعُوذُ',
            transliteration: 'aʿūdhu',
            posTag: 'V',
            posLabel: 'Imperfect Verb (فعل مضارع)',
            posColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-700',
            arabicGrammarTerm: 'فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر تقديره أنا',
            englishExplanation: 'Imperfect verb in the indicative: "I seek refuge"; subject is the implied "I".',
            caseOrMood: 'Indicative (مرفوع)',
            features: ['First Person', 'Singular']
          }
        ]
      },
      {
        location: '114:1:3',
        wordIndex: 3,
        arabicText: 'بِرَبِّ',
        simpleArabic: 'برب',
        transliteration: 'birabbi',
        englishMeaning: 'in (the) Lord',
        rootArabic: 'ر ب ب',
        lemma: 'رَبّ',
        segments: [
          {
            segmentArabic: 'بِ',
            transliteration: 'bi',
            posTag: 'P',
            posLabel: 'Preposition (حرف جر)',
            posColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700',
            arabicGrammarTerm: 'حرف جر',
            englishExplanation: 'Preposition "in / with", introducing the One whose protection is sought.'
          },
          {
            segmentArabic: 'رَبِّ',
            transliteration: 'rabbi',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'اسم مجرور بالباء وهو مضاف',
            englishExplanation: 'Genitive noun after bi, annexed to al-nās.',
            caseOrMood: 'Genitive (مجرور)',
            features: ['Muḍāf']
          }
        ]
      },
      {
        location: '114:1:4',
        wordIndex: 4,
        arabicText: 'ٱلنَّاسِ',
        simpleArabic: 'الناس',
        transliteration: 'l-nāsi',
        englishMeaning: '(of) mankind',
        rootArabic: 'أ ن س',
        lemma: 'ناس',
        segments: [
          {
            segmentArabic: 'ٱل',
            transliteration: 'al',
            posTag: 'DET',
            posLabel: 'Determiner (أل)',
            posColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700',
            arabicGrammarTerm: 'حرف تعريف',
            englishExplanation: 'Definite article.'
          },
          {
            segmentArabic: 'نَّاسِ',
            transliteration: 'nāsi',
            posTag: 'N',
            posLabel: 'Noun (اسم)',
            posColor: 'bg-sky-100 dark:bg-sky-900/40 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700',
            arabicGrammarTerm: 'مضاف إليه مجرور بالكسرة',
            englishExplanation: 'Second term of the annexation, genitive: "mankind".',
            caseOrMood: 'Genitive (مجرور)'
          }
        ]
      }
    ],
    dependencies: [
      {
        sourceId: '114:1:1',
        targetId: '114:1:2',
        dependencyTypeArabic: 'مقول القول',
        dependencyTypeEnglish: 'Speech Content (Maqūl al-Qawl) <— Verb of Saying'
      },
      {
        sourceId: '114:1:2',
        targetId: '114:1:3',
        dependencyTypeArabic: 'متعلق بأعوذ',
        dependencyTypeEnglish: 'Prepositional Attachment (Muta\'alliq) <— Verb'
      },
      {
        sourceId: '114:1:3',
        targetId: '114:1:4',
        dependencyTypeArabic: 'إضافة (مضاف ومضاف إليه)',
        dependencyTypeEnglish: 'Genitive Annexation (Muḍāf <— Muḍāf Ilayh)'
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
