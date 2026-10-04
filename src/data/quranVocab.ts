import { QuranWord, LanguageInfo } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
];

export const VERIFIED_WORDS: QuranWord[] = [
  {
    id: 'rabb',
    arabic: 'رَبّ',
    arabicSimple: 'رب',
    transliteration: 'Rabb',
    transliterationNote: 'Often rendered in English as "Lord", though classical Arabic lexicons note that Rabb encompasses Lord, Sustainer, Cherisher, Master, and Nurturer who guides creation step by step.',
    rootArabic: 'ر ب ب',
    rootSimple: 'ربب',
    rootTransliteration: 'r-b-b',
    rootGeneralMeaning: 'To foster, nourish, nurture, rear something gradually until it reaches full completion; also possession and lordship.',
    frequencyInQuran: 975,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (صفة مشبهة / اسم معنى)',
    category: 'divine_names',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Uthmanic Text, Quranic Arabic Corpus (Lemma rabb), and Lane\'s Arabic-English Lexicon (Book 1, p. 1004).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 1,
      surahNameArabic: 'الفاتحة',
      surahNameEnglish: 'The Opening',
      surahNameTransliteration: 'Al-Fatihah',
      ayahNumber: 2,
      arabicVerseText: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ',
      highlightedWord: 'رَبِّ',
      translation: '[All] praise is [due] to Allah, Lord of the worlds.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'The Sole Creator, Sustainer, and Caregiver of all creation who nurtures every existent being towards its perfection.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/001002.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 114,
        surahNameArabic: 'الناس',
        surahNameEnglish: 'Mankind',
        surahNameTransliteration: 'An-Nas',
        ayahNumber: 1,
        arabicVerseText: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
        highlightedWord: 'بِرَبِّ',
        translation: 'Say, "I seek refuge in the Lord of mankind."',
        translationSource: 'Mustafa Khattab, The Clear Quran',
        contextMeaning: 'The protector, owner, and nurturer of humanity to whom all return in distress.'
      },
      {
        surahNumber: 12,
        surahNameArabic: 'يوسف',
        surahNameEnglish: 'Joseph',
        surahNameTransliteration: 'Yusuf',
        ayahNumber: 42,
        arabicVerseText: 'ٱذْكُرْنِى عِندَ رَبِّكَ',
        highlightedWord: 'رَبِّكَ',
        translation: '"Mention me in the presence of your master."',
        translationSource: 'Saheeh International',
        contextMeaning: 'Human master/king in earthly context (illustrating that Rabb can lexically denote master when attached to humans, but absolute Rabb with al- refers uniquely to Allah).'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Lord, Sustainer, Provider, and Master who takes care of everything.',
          isApproximate: true,
          inContextExplanation: 'In Al-Fatihah 1:2, Rabb means that Allah is the Creator who constantly looks after, feeds, protects, and guides all worlds and beings.',
          languageNote: {
            rootArabic: 'ر ب ب',
            rootTransliteration: 'r-b-b',
            rootMeaning: 'To nurture, raise step-by-step.',
            wordClass: 'Noun (Master / Sustainer)',
            morphologySummary: 'A three-letter root with doubled letter (Geminate root: Ba-Ba).'
          },
          ambiguityOrNuance: 'English "Lord" sounds like feudal royalty, but Quranic "Rabb" emphasizes loving care, nurturing (tarbiyah), and sustenance.'
        },
        id: {
          meaning: 'Tuhan, Pemelihara, Pengasuh, dan Pemilik yang memelihara seluruh alam.',
          isApproximate: true,
          inContextExplanation: 'Dalam Surah Al-Fatihah 1:2, "Rabb" menunjukkan bahwa Allah adalah Pencipta yang memelihara dan mendidik seluruh makhluk setahap demi setahap.',
          languageNote: {
            wordClass: 'Kata Benda (Ism)',
            morphologySummary: 'Berasal dari akar kata R-B-B yang bermakna mendidik dan memelihara.'
          }
        },
        fr: {
          meaning: 'Seigneur, Éducateur, Nourricier et Maître de la création.',
          isApproximate: true,
          inContextExplanation: 'Dans Al-Fatiha 1:2, Rabb désigne Allah comme Celui qui soutient, nourrit et guide l\'univers entier pas à pas.',
          languageNote: {
            wordClass: 'Nom (Maître / Soutien)',
            morphologySummary: 'Racine R-B-B (nourrir progressivement).'
          }
        },
        ur: {
          meaning: 'پروردگار، پالنہار، مالک اور مربی جو تمام مخلوقات کی تدریجاً پرورش فرماتا ہے۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ الفاتحہ 1:2 میں رب کا مطلب ہے کہ اللہ تمام جہانوں کا تنہا خالق، پالنے والا اور نگہبان ہے۔',
          languageNote: {
            wordClass: 'اسم (پروردگار)',
            morphologySummary: 'مادہ: ر ب ب (تربیت اور تدریجی پرورش)'
          }
        },
        tr: {
          meaning: 'Rabb, Terbiye eden, Yaratan ve tüm varlıkları basamak basamak olgunlaştıran Sahip.',
          isApproximate: true,
          inContextExplanation: 'Fatiha 1:2\'de Rabb, Allah\'ın tüm alemleri var eden, besleyen ve yöneten yegâne efendi olduğunu ifade eder.',
          languageNote: {
            wordClass: 'İsim (Rabb / Terbiye eden)',
            morphologySummary: 'Kök: R-B-B (tedricen yetiştirmek).'
          }
        },
        ar: {
          meaning: 'المالك، السيد، المربي، المنعم المصلح للشيء.',
          isApproximate: false,
          inContextExplanation: 'في سورة الفاتحة (1:2): رَبّ العالمين أي خالقهم ومالكهم ومربيهم بإنعامه وتدبيره سبحانه.',
          languageNote: {
            wordClass: 'اسم دال على الصفة',
            morphologySummary: 'من الجذر (ر ب ب) وهو مضعف، ومنه التربية والتدبير.'
          }
        },
        de: {
          meaning: 'Herr, Erhalter, Erzieher und Schöpfer aller Welten.',
          isApproximate: true,
          inContextExplanation: 'In Al-Fatihah 1:2 beschreibt Rabb Allah als den fürsorglichen Erhalter, der alle Geschöpfe schrittweise versorgt.',
          languageNote: {
            wordClass: 'Nomen (Herr / Versorger)',
            morphologySummary: 'Wurzel: R-B-B (schrittweise großziehen).'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'The Sovereign Master, Sustainer, and Caregiver who develops creation from state to state.',
          isApproximate: false,
          inContextExplanation: 'In 1:2, "رَبِّ" appears in genitive construction (mudaf) governed by the preceding name of majesty "لِلَّهِ" (Majrur as Badal or Na\'t), qualifying Allah\'s relationship with "العالمين" (all categories of created beings).',
          languageNote: {
            rootArabic: 'ر ب ب',
            rootTransliteration: 'r-b-b',
            rootMeaning: 'To foster, bring something gradually to maturity (Tarbiyah).',
            wordClass: 'Noun / Adjectival quality (Mudaf)',
            formOrPattern: 'Fa\'l (فَعْل) originating from Verbal Noun',
            morphologySummary: 'Geminate root (مضعف ثلاثي). Used as an active descriptor with intensive scope.',
            breakdown: [
              { segment: 'رَبِّ', segmentType: 'stem', labelArabic: 'مضاف مجرور', labelEnglish: 'Genitive Noun (Possessor)', meaning: 'Lord / Sustainer' },
              { segment: 'ٱلْعَـٰلَمِينَ', segmentType: 'suffix', labelArabic: 'مضاف إليه مجرور بالياء', labelEnglish: 'Possessed Genitive plural', meaning: 'the worlds / domains of creation' }
            ]
          },
          ambiguityOrNuance: 'When used with the definite article "الرَّبُّ" or in unrestricted annexation, it refers exclusively to Allah. When annexed to worldly objects (e.g. رَبُّ البَيْتِ or Yusuf 12:42), it denotes a human householder or master.',
          alternativeMeanings: [
            { meaning: 'Master / King (in human master-servant context)', scholarOrTranslation: 'Ibn Kathir / Tafsir Al-Tabari on Surah Yusuf 12:42', context: 'Surah Yusuf 12:42 (عِندَ رَبِّكَ)' },
            { meaning: 'Idol deities claimed by polytheists (in plural arbāb)', scholarOrTranslation: 'Quranic usage in Ali \'Imran 3:80', context: 'أَرْبَابًا مِّن دُونِ اللَّهِ' }
          ]
        },
        id: {
          meaning: 'Sang Penguasa, Pemelihara, dan Pendidik yang menumbuhkan makhluk-Nya dari satu tahap ke tahap berikutnya.',
          inContextExplanation: 'Di QS 1:2, kata "رَبِّ" berkedudukan sebagai mudhaf (kasrah/majrur) yang menjelaskan relasi Allah dengan "al-\'alamin" (alam semesta).',
          languageNote: {
            wordClass: 'Ism Mudhaf',
            morphologySummary: 'Akar kata R-B-B (Muda\'af). Memiliki kaitan erat dengan kata Tarbiyah.'
          }
        },
        fr: {
          meaning: 'Le Maître absolu, Pourvoyeur et Éducateur divin.',
          inContextExplanation: 'En 1:2, Rabb est à l\'état d\'annexion (Idafa) avec al-\'alamin, désignant la souveraineté active et bienveillante d\'Allah.',
          languageNote: {
            wordClass: 'Nom en annexion (Mudaf)',
            morphologySummary: 'Racine R-B-B (verbe rabba / tarbiya).'
          }
        },
        ur: {
          meaning: 'وہ ہستی جو تدریج کے ساتھ کسی شے کو کمال تک پہنچائے اور پوری کائنات کا مالک و منتظم ہو۔',
          inContextExplanation: 'سورۃ الفاتحہ میں رب مضاف ہے "العالمین" کی طرف، جو اللہ کی ہمہ گیر ربوبیت اور پرورش کو ظاہر کرتا ہے۔',
          languageNote: {
            wordClass: 'اسم مضاف مجرور',
            morphologySummary: 'ثلاثی مجرد مضعف (ر ب ب)'
          }
        },
        tr: {
          meaning: 'Varlıkları yoktan var edip, kemale erinceye kadar adım adım terbiye eden ve idare eden sahip.',
          inContextExplanation: 'Fatiha 1:2\'de \'Rabb\' kelimesi \'el-Âlemîn\' kelimesine muzaf olup esre (cer) durumundadır.',
          languageNote: {
            wordClass: 'Muzaf İsim',
            morphologySummary: 'R-B-B kökü, tedricî terbiye ve tasarruf ifade eder.'
          }
        },
        ar: {
          meaning: 'السيد المطاع، المالك المدبر، المربي لخلقه بنعمه.',
          inContextExplanation: 'في الفاتحة 1:2 وقعت صفة أو بدلاً من لفظ الجلالة (لله)، وهي مضافة إلى العالمين، دلالة على عموم ربوبيته لجميع الخلائق.',
          languageNote: {
            wordClass: 'اسم صفة مضاف',
            morphologySummary: 'الجذر (ر-ب-ب)، أصله مصدر سُمِّي به الفاعل مبالغة.'
          }
        },
        de: {
          meaning: 'Der erhabene Herr und Schöpfer, der Seine Geschöpfe schrittweise zur Vollendung führt.',
          inContextExplanation: 'In Sure 1:2 steht Rabb in Genitiv-Konstruktion (Idafa) zu al-\'Alamin.',
          languageNote: {
            wordClass: 'Substantiv (Mudaf)',
            morphologySummary: 'Wurzel R-B-B, enge Verwandtschaft mit Tarbiyah (Erziehung/Förderung).'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The Primordial Master, Originator, Sustainer, and Guardian possessing absolute Rububiyyah (Lordship and Providence).',
          isApproximate: false,
          inContextExplanation: 'Grammatically in 1:2: "رَبِّ" is Majrur with kasrah as a descriptive adjective (Na\'t) or permutation (Badal) of the Ism al-Jalalah "اللَّهِ". Morphologically, it is a Verbal Noun (Masdar) used hyperbolically as an epithet (Ism Fa\'il). In Balaghah, putting Rabb before al-\'Alamin establishes universal cosmic dependency before detailing divine mercy (Ar-Rahman Ar-Rahim).',
          languageNote: {
            rootArabic: 'ر ب ب',
            rootTransliteration: 'r-b-b',
            rootMeaning: 'التربية والسياسة والملك والإصلاح (Nurturing, administration, dominion, and restoration).',
            wordClass: 'Masdar transferred to adjectival epithet (صفة مشبهة / بدل)',
            formOrPattern: 'Wazn: فَعْل (Fa\'l)',
            morphologySummary: 'Tri-consonantal geminate (مضعف ثلاثي). Plural is أَرْبَاب (Arbab) when referring to human rulers or false deities.',
            grammarSyntax: 'إعراب: نعت للفظ الجلالة مجرور وعلامة جره الكسرة الظاهرة، وهو مضاف، و(الْعَالَمِينَ) مضاف إليه مجرور بالياء لأنه ملحق بجمع المذكر السالم.'
          },
          ambiguityOrNuance: 'Classical grammarians (Al-Raghib Al-Isfahani in Mufradat Alfaz al-Qur\'an) distinguish: Rabb is derived from Tarbiyah (bringing something step-by-step to its destined completion). It is not permissible to use "Ar-Rabb" with the definite article for anyone other than Allah the Almighty.',
          alternativeMeanings: [
            { meaning: 'Master / Patron (in slave-master or owner-estate relationship)', scholarOrTranslation: 'Lane\'s Lexicon & Al-Qurtubi', context: 'Surah Yusuf 12:50 (ارْجِعْ إِلَىٰ رَبِّكَ)' },
            { meaning: 'Cultivator / Fosterer', scholarOrTranslation: 'Al-Raghib al-Isfahani (Mufradat)', context: 'Etymological root base' }
          ]
        },
        id: {
          meaning: 'Al-Rabb: Dzat yang memiliki Rububiyyah mutlak, memelihara, mengatur, dan membimbing seluruh eksistensi.',
          inContextExplanation: 'I\'rab: Na\'at atau Badal dari Ism Jalalah (Lillah), berstatus majrur bil-kasrah, dan berfungsi sebagai mudhaf.',
          languageNote: {
            wordClass: 'Ism Sifah / Masdar Mu\'awwal',
            formOrPattern: 'Fa\'l (فَعْل)',
            morphologySummary: 'Muda\'af Tsulatsi (ر-ب-ب). Jamak: Arbab.',
            grammarSyntax: 'نعت مجرور بالكسرة وهو مضاف.'
          }
        },
        fr: {
          meaning: 'Le Seigneur détenant la Seigneurie absolue (Rububiyyah), Créateur et Tuteur.',
          inContextExplanation: 'Analyse syntaxique (I\'rab) : Na\'t (épithète) ou Badal de "Allah", au génitif (majrur) avec kasra.',
          languageNote: {
            wordClass: 'Nom épithète / Mudaf',
            formOrPattern: 'Fa\'l',
            morphologySummary: 'Racine géminée R-B-B.',
            grammarSyntax: 'Épithète génitive gouvernée par la préposition Li-.'
          }
        },
        ur: {
          meaning: 'وہ ذاتِ اقدس جو صفتِ ربوبیت کی کامل ترین اور مطلق مالک ہے، اور تمام موجودات کی تکوینی و تشریعی نگہبان ہے۔',
          inContextExplanation: 'نحوی ترکیب: لفظ جلالہ "لله" کی صفت یا بدل ہے، مجرور بالکسرہ، مضاف الی "العالمین"۔',
          languageNote: {
            wordClass: 'صفت مشبہ / اسم مضاف',
            formOrPattern: 'وزن: فَعْل',
            morphologySummary: 'مضعف ثلاثی (ر ب ب)، جمع: ارباب۔',
            grammarSyntax: 'إعراب: نعت أو بدل مجرور بالكسرة، وهو مضاف.'
          }
        },
        tr: {
          meaning: 'Mutlak Rububiyet sahibi; tüm mahlukatı var edip halden hale sevk ederek terbiye eden Yüce Yaratıcı.',
          inContextExplanation: 'İ\'rab: Lafza-i Celal\'in sıfatı veya bedeli olup lafzen mecrurdur, \'el-Âlemîn\' kelimesine muzaftır.',
          languageNote: {
            wordClass: 'Sıfat-ı Müşebbehe / Muzaf',
            formOrPattern: 'Fa\'l vezni',
            morphologySummary: 'Mudaaf sülâsî (R-B-B). Çoğulu: Erbâb.',
            grammarSyntax: 'Lafzatullah için sıfat veya bedel, cer alameti kesre.'
          }
        },
        ar: {
          meaning: 'المربي لجميع العالمين بنعمه، المالك المدبر لأمور خلقه القائم بتصريف شؤونهم.',
          inContextExplanation: 'إعرابياً: نعت للفظ الجلالة (لله) أو بدل منه مجرور بالكسرة، وهو مضاف و(العالمين) مضاف إليه مجرور بالياء. وفي البلاغة: تقديم الربوبية العامة يقرر الافتقار الوجودي قبل ذكر الرحمة الخاصة.',
          languageNote: {
            wordClass: 'صفة مشبهة / أصلها مصدر',
            formOrPattern: 'وزن: فَعْل',
            morphologySummary: 'ثلاثي مضعف (ر ب ب)، جمعه أرباب ولا يُطلق معرفاً بأل إلا على الله.',
            grammarSyntax: 'نعت للفظ الجلالة مجرور بالكسرة الظاهرة وهو مضاف.'
          }
        },
        de: {
          meaning: 'Der absolute Herr und Schöpfer (Rububiyyah), der die gesamte Schöpfung in Seiner Vorsehung hält.',
          inContextExplanation: 'Syntax (I\'rab): Adjektivattribut (Na\'t) oder Apposition (Badal) zu "Allah", genitivisch markiert durch Kasrah.',
          languageNote: {
            wordClass: 'Attributives Nomen (Mudaf)',
            formOrPattern: 'Schema Fa\'l',
            morphologySummary: 'Geminierte Wurzel R-B-B. Plural: Arbab.',
            grammarSyntax: 'Genitiv-Attribut zu Allah mit folgendem Mudaf Ilayh.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'rabb-q1',
        question: 'What is the primary classical root concept behind the Quranic word "رَبّ" (Rabb)?',
        options: [
          'A strict earthly judge who enforces legal penalties',
          'Nurturing, caring for, and developing something step by step until it reaches completion',
          'A simple synonym for "creator" without ongoing maintenance',
          'A temporary earthly property owner'
        ],
        correctIndex: 1,
        explanation: 'The root R-B-B denotes Tarbiyah: nurturing, sustaining, and guiding creation progressively with continuous care.',
        misconceptions: {
          0: 'While Allah is the Judge (Al-Hakam/Al-Malik), "Rabb" specifically focuses on nurturing and providence rather than judicial sentencing.',
          2: 'Creator is "Al-Khaliq". "Rabb" emphasizes continuous post-creation sustenance, nurturing, and guidance.',
          3: 'While "rabb" can denote owner in worldly Arabic (like rabb al-bayt), the theological root is continuous fosterage and complete mastery.'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-rabb',
        title: 'Quranic Arabic Corpus - Lemma (رَبّ)',
        authorOrEditor: 'Kais Dukes, Language Research Group, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=rbb',
        citationText: 'Corpus Quran, Morphological Search: Root (ر ب ب), occurs 975 times as noun rabb.',
        quoteOrNote: 'Noun (رَبّ): Lord, Sustainer, Master.'
      },
      {
        id: 'lane-rabb',
        title: 'Arabic-English Lexicon (Book 1, p. 1004)',
        authorOrEditor: 'Edward William Lane',
        type: 'lexicon',
        url: 'https://ejtaal.net/aa/#hw4=383,ll=1084',
        citationText: 'Lane\'s Lexicon, Root ر ب ب: "He brought him up, or reared him, and took care of him... Lord, master, owner, fosterer."'
      },
      {
        id: 'tafsir-ibn-kathir-1-2',
        title: 'Tafsir Al-Qur\'an Al-\'Azim (Surah Al-Fatihah 1:2)',
        authorOrEditor: 'Al-Hafiz Ibn Kathir (d. 774 AH)',
        type: 'tafsir',
        url: 'https://quran.com/1:2/tafsirs/en-tafisr-ibn-kathir',
        citationText: 'Tafsir Ibn Kathir: "Ar-Rabb is the Owner who has full authority over His property; linguistically, Ar-Rabb means the Master and the One Who fosters and nurtures."'
      }
    ]
  },
  {
    id: 'rahmah',
    arabic: 'رَحْمَة',
    arabicSimple: 'رحمة',
    transliteration: 'Rahmah',
    transliterationNote: 'Encompasses mercy, deep compassion, tenderness, active beneficence, and sheltering care.',
    rootArabic: 'ر ح م',
    rootSimple: 'رحم',
    rootTransliteration: 'r-ḥ-m',
    rootGeneralMeaning: 'Mercy, compassion, kindness; closely tied etymologically to رحم (raḥim, the womb) representing protective love.',
    frequencyInQuran: 326,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (مصدر)',
    category: 'divine_names',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Uthmanic Text, Quranic Arabic Corpus (Root r-h-m), and Lane\'s Lexicon (Book 1, p. 1056).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 21,
      surahNameArabic: 'الأنبياء',
      surahNameEnglish: 'The Prophets',
      surahNameTransliteration: 'Al-Anbiya',
      ayahNumber: 107,
      arabicVerseText: 'وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةًۭ لِّلْعَـٰلَمِينَ',
      highlightedWord: 'رَحْمَةًۭ',
      translation: 'And We have not sent you, [O Muhammad], except as a mercy to the worlds.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'A manifestation of divine grace, compassion, and salvation sent for all humans, jinn, and creation.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/021107.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 7,
        surahNameArabic: 'الأعراف',
        surahNameEnglish: 'The Heights',
        surahNameTransliteration: 'Al-A\'raf',
        ayahNumber: 156,
        arabicVerseText: 'وَرَحْمَتِى وَسِعَتْ كُلَّ شَىْءٍ',
        highlightedWord: 'وَرَحْمَتِى',
        translation: '"...but My mercy encompasses all things."',
        translationSource: 'Mustafa Khattab, The Clear Quran',
        contextMeaning: 'Allah\'s universal, infinite benevolence that embraces every created thing.'
      },
      {
        surahNumber: 30,
        surahNameArabic: 'الروم',
        surahNameEnglish: 'The Romans',
        surahNameTransliteration: 'Ar-Rum',
        ayahNumber: 21,
        arabicVerseText: 'وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً',
        highlightedWord: 'وَرَحْمَةً',
        translation: 'And He placed between you affection and mercy.',
        translationSource: 'Saheeh International',
        contextMeaning: 'Mutual tenderness, empathy, and protective care between spouses in family life.'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Mercy, compassion, love, and tender care.',
          isApproximate: true,
          inContextExplanation: 'In 21:107, Prophet Muhammad is described as a pure gift of mercy and kindness for all created beings.',
          languageNote: {
            rootArabic: 'ر ح م',
            rootTransliteration: 'r-ḥ-m',
            rootMeaning: 'Compassion; connected to the word for mother\'s womb (raḥim).',
            wordClass: 'Noun (Feminine)',
            morphologySummary: 'Three-letter root with ta marbutah ending.'
          },
          ambiguityOrNuance: 'Quranic Rahmah is not just feeling pity from afar; it is active goodness and protection.'
        },
        id: {
          meaning: 'Rahmat, kasih sayang, kelembutan, dan karunia yang melimpah.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 21:107, Nabi Muhammad diutus sebagai bentuk rahmat dan kasih sayang untuk seluruh alam.',
          languageNote: {
            wordClass: 'Kata Benda (Ism Mu\'annats)',
            morphologySummary: 'Akar R-H-M yang juga berhubungan dengan rahim ibu.'
          }
        },
        fr: {
          meaning: 'Miséricorde, grâce, tendresse et compassion infinie.',
          isApproximate: true,
          inContextExplanation: 'Dans 21:107, l\'envoi du Prophète est qualifié de miséricorde vivante pour l\'humanité entière.',
          languageNote: {
            wordClass: 'Nom féminin',
            morphologySummary: 'Racine R-H-M (utérus/matrice de tendresse protectrice).'
          }
        },
        ur: {
          meaning: 'رحمت، شفقت، مہربانی، اور بخشش۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ الانبیاء 21:107 میں نبی کریم ﷺ کو تمام جہانوں کے لیے مجسم رحمت بنا کر بھیجے جانے کا ذکر ہے۔',
          languageNote: {
            wordClass: 'اسم مونث',
            morphologySummary: 'مادہ: ر ح م (جس سے رحمِ مادر بھی مشتق ہے)'
          }
        },
        tr: {
          meaning: 'Rahmet, şefkat, merhamet ve ihsan.',
          isApproximate: true,
          inContextExplanation: 'Enbiyâ 21:107\'de Hz. Peygamber\'in tüm âlemlere bir rahmet olarak gönderildiği bildirilir.',
          languageNote: {
            wordClass: 'İsim (Müennes)',
            morphologySummary: 'R-H-M kökü şefkat ve koruyucu sevgiyi ifade eder.'
          }
        },
        ar: {
          meaning: 'الرأفة والعطف والإحسان والمغفرة.',
          isApproximate: false,
          inContextExplanation: 'في سورة الأنبياء 107: أُرسل النبي ﷺ رحمة وهداية وإنقاذاً لجميع العالمين من ظلمات الجهل.',
          languageNote: {
            wordClass: 'اسم مصدر مؤنث',
            morphologySummary: 'الجذر (ر ح م)، ومنه الرَّحِم لاشتمالها على العطف والحماية.'
          }
        },
        de: {
          meaning: 'Barmherzigkeit, Gnade, tiefes Mitgefühl und Fürsorge.',
          isApproximate: true,
          inContextExplanation: 'In 21:107 wird der Prophet als Barmherzigkeit und Licht für die gesamte Schöpfung beschrieben.',
          languageNote: {
            wordClass: 'Substantiv (feminin)',
            morphologySummary: 'Wurzel R-H-M, etymologisch verwandt mit der Gebärmutter (Raḥim).'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'Divine empathy, benevolence, and loving protection.',
          isApproximate: false,
          inContextExplanation: 'In 21:107, "رَحْمَةًۭ" is in the accusative case (Mansub) functioning as an object of purpose (Maf\'ul li-Ajlih) or Hal (circumstantial descriptor), highlighting that the entire mission of the Prophet embodies mercy.',
          languageNote: {
            rootArabic: 'ر ح م',
            rootTransliteration: 'r-ḥ-m',
            rootMeaning: 'Tenderness requiring beneficence towards the recipient.',
            wordClass: 'Noun (Accusative / Maf\'ul li-Ajlih)',
            formOrPattern: 'Fa\'lah (فَعْلَة)',
            morphologySummary: 'Masdar with Ta Marbutah. Derivative intensive adjectives include Rahman (all-encompassing mercy) and Rahim (continuous mercy).'
          },
          ambiguityOrNuance: 'Classical scholars note the difference between Ra\'fah (intense pity to avert harm) and Rahmah (comprehensive provision of good and aversion of harm).'
        },
        id: {
          meaning: 'Kasih sayang ilahi yang mendalam dan perlindungan yang menyeluruh.',
          inContextExplanation: 'Di QS 21:107, berkedudukan sebagai maf\'ul li-ajlih (alasan pengutusan) atau hal.',
          languageNote: {
            wordClass: 'Ism Manshub',
            morphologySummary: 'Wazan Fa\'lah (فَعْلَة).'
          }
        },
        fr: {
          meaning: 'Bienveillance active et protection providentielle.',
          inContextExplanation: 'Dans 21:107, c\'est un complément de cause (Maf\'ul li-ajlih) indiquant la finalité même du message.',
          languageNote: {
            wordClass: 'Nom à l\'accusatif',
            morphologySummary: 'Schème Fa\'lah.'
          }
        },
        ur: {
          meaning: 'وہ دلی شفقت جو احسان اور خیر رسانی کی متقاضی ہو۔',
          inContextExplanation: 'آیت 21:107 میں "رحمةً" مفعول لہ یا حال کے طور پر منصوب ہے، جو بعثتِ نبوی کا اصل مقصد بیان کرتا ہے۔',
          languageNote: {
            wordClass: 'اسم مفعول لہ / حال منصوب',
            morphologySummary: 'وزن: فَعْلَة'
          }
        },
        tr: {
          meaning: 'İyilik ve ihsanı gerektiren derin şefkat ve koruma duygusu.',
          inContextExplanation: 'Enbiyâ 107\'de \'rahmeten\' mef\'ûlün lieclih veya hâl konumunda mansubdur.',
          languageNote: {
            wordClass: 'Mansub İsim',
            morphologySummary: 'Fe\'leh vezni.'
          }
        },
        ar: {
          meaning: 'رقة تقتضي الإحسان إلى المرحوم وجلب النفع له ودفع الضر عنه.',
          inContextExplanation: 'في الأنبياء 107: إعراب (رَحْمَةً) مفعول لأجله منصوب، أو حال منصوبة، دلالة على أن جوهر الرسالة هو الرحمة المحضة.',
          languageNote: {
            wordClass: 'مصدر منصوب',
            formOrPattern: 'فَعْلَة',
            morphologySummary: 'من الجذر (ر ح م)، واشتق منه الرَّحْمَن والرَّحِيم.'
          }
        },
        de: {
          meaning: 'Aktive göttliche Güte und schützendes Erbarmen.',
          inContextExplanation: 'In 21:107 steht Rahmah im Akkusativ (Mansub) als Zweckbestimmung (Maf\'ul li-Ajlih).',
          languageNote: {
            wordClass: 'Akkusativ-Nomen',
            morphologySummary: 'Schema Fa\'lah.'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'Ontological and soteriological beneficence rooted in divine grace.',
          isApproximate: false,
          inContextExplanation: 'In 21:107, the restrictive structure "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً" combines Nafy (negation with Mā) and Istithnā\' (exception with Illā) to produce Qasr / Hasr (exclusive restriction), signifying that the Prophet\'s character, message, and legacy are purely defined by Rahmah.',
          languageNote: {
            rootArabic: 'ر ح م',
            rootTransliteration: 'r-ḥ-m',
            rootMeaning: 'العطف والرقة والإحسان الموصل للخير.',
            wordClass: 'Masdar (مفعول لأجله / حال)',
            formOrPattern: 'Wazn: فَعْلَة',
            grammarSyntax: 'إعراب: مستثنى مفرغ؛ مفعول لأجله منصوب بالفتحة، أو حال من الكاف في (أرسلناك).'
          },
          ambiguityOrNuance: 'Al-Zamakhshari (Al-Kashshaf) and Al-Razi (Mafatih al-Ghayb) clarify that mercy in Allah\'s right is the will to deliver unmitigated goodness (Iradat al-Ihsan), free from human emotional weakness (Riqqah).'
        },
        id: {
          meaning: 'Rahmat ontologis dan keselamatan yang bersumber dari kasih sayang mutlak.',
          inContextExplanation: 'Struktur balaghah Qasr (Nafy + Istitsna) menegaskan esensi mutlak risalah Islam sebagai rahmat.',
          languageNote: {
            wordClass: 'Maf\'ul li-ajlih / Hal',
            grammarSyntax: 'مفعول لأجله منصوب وعلامة نصبه الفتحة الظاهرة.'
          }
        },
        fr: {
          meaning: 'Grâce universelle salvatrice.',
          inContextExplanation: 'La structure rhétorique (restriction par Ma... Illa) exprime l\'exclusivité de la miséricorde prophétique.',
          languageNote: {
            wordClass: 'Complément de cause circonstanciel',
            grammarSyntax: 'Accusatif par exception restreinte (Mustathna mufarragh).'
          }
        },
        ur: {
          meaning: 'رحمتِ تامہ جو ہر خیر کا سرچشمہ اور شر کی دافع ہے۔',
          inContextExplanation: 'بلاغت: اسلوبِ حصر (نفی اور استثناء) سے ثابت ہوتا ہے کہ آپ ﷺ کی بعثت سراپا رحمت ہے۔',
          languageNote: {
            wordClass: 'مفعول لأجله / حال',
            grammarSyntax: 'مستثنى مفرغ منصوب على المفعولية لأجله.'
          }
        },
        tr: {
          meaning: 'Mutlak ilahî lütuf ve her şeyi kuşatan varlıksal merhamet.',
          inContextExplanation: 'Kasr üslubu ile nefy ve istisna (mâ... illâ) risaletin yalnızca rahmet eksenli olduğunu bildirir.',
          languageNote: {
            wordClass: 'Mef\'ûlün lieclih',
            grammarSyntax: 'Müstesnâ-i müferrağ olarak nasb üzere mebnidir.'
          }
        },
        ar: {
          meaning: 'إرادة الخير للمرحوم وإيصاله إليه مع دفع المكاره عنه.',
          inContextExplanation: 'في البلاغة: أسلوب قصر بالحصر (ما النافية وإلا الاستثنائية)، دال على أن الغاية العظمى لبعثة المصطفى ﷺ هي إفاضة الرحمة على سائر الموجودات.',
          languageNote: {
            wordClass: 'مصدر (مفعول لأجله)',
            formOrPattern: 'فَعْلَة',
            grammarSyntax: 'إعراب: مفعول لأجله منصوب، أو حال مؤولة بالمشتق (راحمين).'
          }
        },
        de: {
          meaning: 'Umfassendes göttliches Erbarmen und rettende Gnade.',
          inContextExplanation: 'Rhetorische Restriktion (Hasr mit Mā und Illā) hebt hervor, dass die prophetische Sendung wesenseigen reine Barmherzigkeit ist.',
          languageNote: {
            wordClass: 'Akkusativ-Attribut',
            grammarSyntax: 'Mustathna mufarragh als Maf\'ul li-Ajlih.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'rahmah-q1',
        question: 'Which bodily organ shares the same Arabic tri-consonantal root (R-Ḥ-M) with "Rahmah", reflecting intimate protection and tender care?',
        options: [
          'The heart (Qalb)',
          'The womb (Raḥim)',
          'The tongue (Lisān)',
          'The eye (\'Ayn)'
        ],
        correctIndex: 1,
        explanation: 'The word for womb is "الرَّحِم" (raḥim), derived directly from R-Ḥ-M, reflecting how maternal love and protective shelter exemplify compassion.',
        misconceptions: {
          0: 'Heart is from Q-L-B (signifying turning/fluctuating).',
          2: 'Tongue is from L-S-N.',
          3: 'Eye is from \'-Y-N.'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-rahmah',
        title: 'Quranic Arabic Corpus - Root (ر ح م)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=rHm',
        citationText: 'Corpus Quran: Root (ر ح م) occurs 563 times across nouns, verbs, and divine attributes (Ar-Rahman, Ar-Rahim).'
      },
      {
        id: 'lane-rahmah',
        title: 'Arabic-English Lexicon (Book 1, p. 1056)',
        authorOrEditor: 'Edward William Lane',
        type: 'lexicon',
        url: 'https://ejtaal.net/aa/#hw4=398,ll=1142',
        citationText: 'Lane\'s Lexicon: "رحمة: Mercy, pity, compassion, tenderness of heart; also inclination of beneficence."'
      },
      {
        id: 'tafsir-saadi-21-107',
        title: 'Taysir al-Karim al-Rahman (Surah Al-Anbiya 21:107)',
        authorOrEditor: 'Shaykh \'Abd al-Rahman al-Sa\'di (d. 1376 AH)',
        type: 'tafsir',
        url: 'https://quran.com/21:107/tafsirs/ar-tafsir-as-sadi',
        citationText: 'Tafsir As-Sa\'di: Allah sent His messenger as a mercy to all creatures, guiding them to eternal bliss and saving them from destruction.'
      }
    ]
  },
  {
    id: 'taqwa',
    arabic: 'تَقْوَى',
    arabicSimple: 'تقوى',
    transliteration: 'Taqwā',
    transliterationNote: 'Often translated as "piety", "fear of God", or "God-consciousness", though its core root means creating a protective shield (wiqāyah) against divine displeasure.',
    rootArabic: 'و ق ي',
    rootSimple: 'وقي',
    rootTransliteration: 'w-q-y',
    rootGeneralMeaning: 'To protect, preserve, guard, shield against harm or destruction.',
    frequencyInQuran: 258,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (مصدر / صفة)',
    category: 'character_ethics',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Uthmanic Text, Quranic Arabic Corpus (Lemma taqwā), and Hans Wehr Dictionary (4th ed., p. 1284).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 2,
      surahNameArabic: 'البقرة',
      surahNameEnglish: 'The Cow',
      surahNameTransliteration: 'Al-Baqarah',
      ayahNumber: 197,
      arabicVerseText: 'وَتَزَوَّدُوا۟ فَإِنَّ خَيْرَ ٱلزَّادِ ٱلتَّقْوَىٰ ۚ وَٱتَّقُونِ يَـٰٓأُو۟لِى ٱلْأَلْبَـٰبِ',
      highlightedWord: 'ٱلتَّقْوَىٰ',
      translation: 'And take provisions, but indeed, the best provision is fear of Allah [Taqwa]. And fear Me, O you of understanding.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'Internal spiritual vigilance and conscientious obedience that guards the soul against sin and moral ruin.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/002197.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 49,
        surahNameArabic: 'الحجرات',
        surahNameEnglish: 'The Rooms',
        surahNameTransliteration: 'Al-Hujurat',
        ayahNumber: 13,
        arabicVerseText: 'إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ',
        highlightedWord: 'أَتْقَىٰكُمْ',
        translation: 'Indeed, the most noble of you in the sight of Allah is the most righteous of you.',
        translationSource: 'Saheeh International',
        contextMeaning: 'The ultimate standard of nobility in Islam is based on inner spiritual mindfulness rather than lineage or wealth.'
      },
      {
        surahNumber: 2,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        surahNameTransliteration: 'Al-Baqarah',
        ayahNumber: 2,
        arabicVerseText: 'هُدًى لِّلْمُتَّقِينَ',
        highlightedWord: 'لِّلْمُتَّقِينَ',
        translation: 'A guidance for those conscious of Allah.',
        translationSource: 'Mustafa Khattab, The Clear Quran',
        contextMeaning: 'Active seekers who maintain vigilance and readiness to obey divine guidance.'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'God-consciousness, mindfulness, and protecting oneself from doing wrong.',
          isApproximate: true,
          inContextExplanation: 'In 2:197, Allah tells pilgrims that while food and supplies are needed for travel, the most essential provision for life and the hereafter is Taqwa—a pure, cautious heart that remembers Allah.',
          languageNote: {
            rootArabic: 'و ق ي',
            rootTransliteration: 'w-q-y',
            rootMeaning: 'To shield, build a barrier against danger.',
            wordClass: 'Noun (Spiritual virtue)',
            morphologySummary: 'Derived from W-Q-Y; the letter Waw changed to Ta in the Form VIII noun pattern.'
          },
          ambiguityOrNuance: 'Taqwa is not paralyzing terror of God; it is reverent awe and conscious care not to displease the One you love.'
        },
        id: {
          meaning: 'Takwa: Kesadaran penuh kepada Allah, menjalankan perintah-Nya dan menjauhi larangan-Nya.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 2:197, takwa disebut sebagai sebaik-baik bekal bagi manusia dalam perjalanan hidup dunia dan akhirat.',
          languageNote: {
            wordClass: 'Kata Benda (Ism)',
            morphologySummary: 'Akar W-Q-Y yang bermakna membuat perisai pelindung.'
          }
        },
        fr: {
          meaning: 'Conscience pieuse de Dieu, vigilance spirituelle et piété protectrice.',
          isApproximate: true,
          inContextExplanation: 'Dans 2:197, la Taqwa est la meilleure provision spirituelle pour le voyage vers l\'au-delà.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Racine W-Q-Y (se prémunir d\'un bouclier protecteur).'
          }
        },
        ur: {
          meaning: 'تقویٰ: اللہ کا خوف، پرہیزگاری، اور گناہوں سے بچنے کی قلبی بیداری۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ البقرہ 2:197 میں تقویٰ کو سب سے بہترین زادِ راہ قرار دیا گیا ہے۔',
          languageNote: {
            wordClass: 'اسم (قلبی کیفیت)',
            morphologySummary: 'مادہ: و ق ی (ڈھال بنانا اور بچنا)'
          }
        },
        tr: {
          meaning: 'Takva: Allah bilinci, günahlardan sakınma ve O\'nun rızasını gözetme hassasiyeti.',
          isApproximate: true,
          inContextExplanation: 'Bakara 197\'de takvanın yolculuktaki en hayırlı azık olduğu bildirilir.',
          languageNote: {
            wordClass: 'İsim',
            morphologySummary: 'Kök: V-K-Y (kendini korumak, kalkan edinmek).'
          }
        },
        ar: {
          meaning: 'امتثال أوامر الله واجتناب نواهيه، واتخاذ وقاية من عذابه وسخطه.',
          isApproximate: false,
          inContextExplanation: 'في البقرة 197: الإرشاد إلى أن خير ما يتزود به المرء لسفره إلى الدار الآخرة هو تقوى الله.',
          languageNote: {
            wordClass: 'اسم مصدر / صفة',
            morphologySummary: 'أصلها من (و ق ي)، أُبدلت الواو تاءً (تَقْوَى على وزن فَعْلَى).'
          }
        },
        de: {
          meaning: 'Gottesbewusstsein, Achtsamkeit und das Errichten eines Schutzschildes gegen Verfehlungen.',
          isApproximate: true,
          inContextExplanation: 'In 2:197 ist Taqwa die beste Wegzehrung für diese Welt und das Jenseits.',
          languageNote: {
            wordClass: 'Substantiv',
            morphologySummary: 'Wurzel W-Q-Y (beschützen / abschirmen).'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'Spiritual vigilance creating a protective barrier (wiqāyah) between oneself and divine wrath.',
          isApproximate: false,
          inContextExplanation: 'In 2:197, "ٱلتَّقْوَىٰ" is the predicate of Inna (Khabar Inna) in an absolute nominal sentence emphasizing exclusivity: "Indeed, the best provision IS Taqwa."',
          languageNote: {
            rootArabic: 'و ق ي',
            rootTransliteration: 'w-q-y',
            rootMeaning: 'Wiqāyah (وقاية) - taking shelter, defensive barrier.',
            wordClass: 'Ism Maqsur (اسم مقصور)',
            formOrPattern: 'Fa\'lā (فَعْلَى)',
            morphologySummary: 'Phonological transformation (Ibdāl): original form *waqwā had its initial Waw substituted with Ta, giving Taqwā.',
            grammarSyntax: 'خبر (إنَّ) مرفوع بضمة مقدرة على الألف للتعذر.'
          },
          ambiguityOrNuance: 'Often mistranslated merely as "fear". Classical exegete Ibn Rajab Al-Hanbali explains: Taqwa is to place between yourself and what you fear from Allah\'s wrath a barrier of obedience.'
        },
        id: {
          meaning: 'Kewaspadaan batin yang menciptakan tameng pelindung dari murka Allah.',
          inContextExplanation: 'Di QS 2:197, kata al-Taqwa berkedudukan sebagai khabar Inna yang marfu\' dengan dhummah muqaddarah.',
          languageNote: {
            wordClass: 'Ism Maqshur',
            morphologySummary: 'Perubahan fonologis (Ibdal) dari akar W-Q-Y.'
          }
        },
        fr: {
          meaning: 'Vigilance spirituelle formant un bouclier protecteur entre l\'âme et le courroux divin.',
          inContextExplanation: 'En 2:197, Al-Taqwa est l\'attribut (Khabar Inna) au nominatif implicite sur l\'alif.',
          languageNote: {
            wordClass: 'Ism Maqsur (nom terminé par alif maqsurah)',
            morphologySummary: 'Transformation phonologique Waw -> Ta.'
          }
        },
        ur: {
          meaning: 'قلب کی وہ چوکسی جو بندے اور اللہ کی ناراضگی کے درمیان نیکیوں کی ڈھال کھڑی کر دے۔',
          inContextExplanation: 'نحو: 2:197 میں "التقوى" جملہ اسمیہ میں خبرِ إنّ ہے۔',
          languageNote: {
            wordClass: 'اسم مقصور',
            morphologySummary: 'اصل: وَقْوَى، واو کو تا سے بدلا گیا (ابدال)۔'
          }
        },
        tr: {
          meaning: 'Kişi ile Allah\'ın gazabı arasına itaat ve sakınma kalkanı koyma hassasiyeti.',
          inContextExplanation: 'Bakara 197\'de \'et-Takvâ\' inne\'nin haberi konumundadır.',
          languageNote: {
            wordClass: 'Maksur İsim',
            morphologySummary: 'V-K-Y kökünden tebdîl ile türetilmiştir.'
          }
        },
        ar: {
          meaning: 'أن تجعل بينك وبين عذاب الله وقاية بفعل أوامره واجتناب نواهيه.',
          inContextExplanation: 'في البقرة 197: (التَّقْوَىٰ) خبر (إِنَّ) مرفوع بضمة مقدرة على الألف منع من ظهورها التعذر.',
          languageNote: {
            wordClass: 'اسم مقصور',
            formOrPattern: 'فَعْلَى',
            morphologySummary: 'أصله (وَقْوَى) فأُبدلت الواو تاءً للاستثقال، كما في تُخَمَة وتُجَاه.'
          }
        },
        de: {
          meaning: 'Innere Wachsamkeit, die eine schützende Barriere vor spirituellem Schaden bildet.',
          inContextExplanation: 'In 2:197 steht Taqwa als Prädikat (Khabar Inna) im Nominativ mit impliziter Kasusendung.',
          languageNote: {
            wordClass: 'Ism Maqsur',
            morphologySummary: 'Lautwandel von W-Q-Y zu Taqwa.'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The consummate state of heart vigilance (Muraqabah) producing prophylactic spiritual integrity.',
          isApproximate: false,
          inContextExplanation: 'In 2:197, the pairing "وَتَزَوَّدُوا۟ ... وَٱتَّقُونِ يَـٰٓأُو۟لِى ٱلْأَلْبَـٰبِ" creates a transition from material provisions to metaphysical sustenance. The root W-Q-Y governs the entire verb paradigm in Form VIII (Ittaqā / Yattaqī / Muttaqūn).',
          languageNote: {
            rootArabic: 'و ق ي',
            rootTransliteration: 'w-q-y',
            rootMeaning: 'الحفظ والصيانة والتحرز من المكروه.',
            wordClass: 'اسم مقصور ممنوع من الصرف على وزن فَعْلَى',
            formOrPattern: 'Wazn: فَعْلَى (Fa\'lā)',
            morphologySummary: 'Derived through Ibdal (substitution of radical Waw with Ta) followed by Idgham in the verb (اِتَّقَى اصله اِوْتَقَى).'
          },
          ambiguityOrNuance: 'Talq ibn Habib famously defined Taqwa: "To act in obedience to Allah, upon light from Allah, hoping for the reward of Allah; and to leave disobedience to Allah, upon light from Allah, fearing the punishment of Allah."'
        },
        id: {
          meaning: 'Kondisi puncak muraqabah batiniah yang melahirkan integritas spiritual menyeluruh.',
          inContextExplanation: 'Peralihan metafora dari perbekalan fisik haji menuju bekal ukhrawi.',
          languageNote: {
            wordClass: 'Ism Maqshur',
            grammarSyntax: 'خبر إن مرفوع بضمة مقدرة على الألف.'
          }
        },
        fr: {
          meaning: 'État suprême de vigilance contemplative et d\'intégrité salvatrice.',
          inContextExplanation: 'Parallélisme entre la provision matérielle du pèlerin et la provision métaphysique de l\'âme.',
          languageNote: {
            wordClass: 'Ism Maqsur',
            grammarSyntax: 'Khabar Inna avec terminaison fléchie virtuelle.'
          }
        },
        ur: {
          meaning: 'مراقبتِ الٰہی کی وہ اعلیٰ کیفیت جو انسان کے ظاہر و باطن کو معصیت سے محفوظ رکھے۔',
          inContextExplanation: 'حج کے مادی زادِ راہ سے روحانی زادِ راہ کی طرف حسین انتقال (براعتِ استہلال و التفات)۔',
          languageNote: {
            wordClass: 'اسم مقصور',
            grammarSyntax: 'إعراب: خبر إن مرفوع بالضمة المقدرة على الألف للتعذر.'
          }
        },
        tr: {
          meaning: 'Mürakabe ve ihsan şuurunun doğurduğu en üstün manevi korunma zırhı.',
          inContextExplanation: 'Hac yolculuğunun maddi azığından ahiret yolculuğunun manevi azığına edebi intikal.',
          languageNote: {
            wordClass: 'Maksur İsim',
            grammarSyntax: 'Takdiri damme ile merfudur.'
          }
        },
        ar: {
          meaning: 'كمال المراقبة لله، والتحصن بطاعته، وهي جماع الخير كله في الدنيا والآخرة.',
          inContextExplanation: 'في البلاغة: الانتقال البديع من زاد السفر الحسي في الحج إلى زاد الروح الأخروي، مع تخصيص أولي الألباب بالخطاب لأنهم أهل الفهم الحقيقي.',
          languageNote: {
            wordClass: 'اسم مقصور',
            formOrPattern: 'فَعْلَى',
            grammarSyntax: 'خبر إنَّ مرفوع وعلامة رفعه الضمة المقدرة على الألف منع من ظهورها التعذر.'
          }
        },
        de: {
          meaning: 'Höchster Zustand spiritueller Wachsamkeit und gottesfürchtiger Rechtschaffenheit.',
          inContextExplanation: 'Rhetorischer Übergang vom physischen Reiseproviant der Pilgerfahrt zur metaphysischen Seelennahrung.',
          languageNote: {
            wordClass: 'Ism Maqsur',
            grammarSyntax: 'Khabar Inna mit geschätzter Endung auf Alif.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'taqwa-q1',
        question: 'What is the literal, root-level meaning of the root letters (و - ق - ي) from which "Taqwa" is derived?',
        options: [
          'To establish a defensive barrier or shield (wiqāyah)',
          'To weep loudly out of grief',
          'To fast continuously without eating',
          'To travel on long desert journeys'
        ],
        correctIndex: 0,
        explanation: 'The tri-consonantal root W-Q-Y literally signifies creating a barrier or shield (wiqāyah) to protect against harm, which spiritually translates to shielding the soul from sin.',
        misconceptions: {
          1: 'Weeping is related to B-K-Y (Buka\').',
          2: 'Fasting is S-W-M (Sawm).',
          3: 'Traveling is S-F-R (Safar).'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-taqwa',
        title: 'Quranic Arabic Corpus - Root (و ق ي)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=wqy',
        citationText: 'Corpus Quran: Root (و ق ي) occurs 258 times across various verbal forms and derived nouns.'
      },
      {
        id: 'hans-wehr-taqwa',
        title: 'Dictionary of Modern Written Arabic (p. 1284)',
        authorOrEditor: 'Hans Wehr / J. Milton Cowan',
        type: 'lexicon',
        url: 'https://ejtaal.net/aa/#hw4=1284',
        citationText: 'Hans Wehr: "تَقْوَى: godliness, devoutness, piety, fear of God."'
      },
      {
        id: 'ibn-rajab-jami',
        title: 'Jami\' al-\'Ulum wa al-Hikam (Hadith 18 on Taqwa)',
        authorOrEditor: 'Al-Hafiz Ibn Rajab Al-Hanbali (d. 795 AH)',
        type: 'tafsir',
        citationText: 'Ibn Rajab: The essence of Taqwa is making a protective screen between the servant and what is feared from Allah\'s anger and retribution.'
      }
    ]
  },
  {
    id: 'huda',
    arabic: 'هُدًى',
    arabicSimple: 'هدى',
    transliteration: 'Hudan',
    transliterationNote: 'Guidance that shows the clear path and leads safely to the destination.',
    rootArabic: 'ه د ي',
    rootSimple: 'هدي',
    rootTransliteration: 'h-d-y',
    rootGeneralMeaning: 'To guide, direct gently, show the way, give a gift.',
    frequencyInQuran: 316,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (مصدر مقصور)',
    category: 'guidance_knowledge',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Hafs Text, Quranic Arabic Corpus (Lemma huda), and Mufradat Alfaz al-Qur\'an by Al-Raghib Al-Isfahani.',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 2,
      surahNameArabic: 'البقرة',
      surahNameEnglish: 'The Cow',
      surahNameTransliteration: 'Al-Baqarah',
      ayahNumber: 2,
      arabicVerseText: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ',
      highlightedWord: 'هُدًۭى',
      translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'A definitive, unerring roadmap that directs seekers towards truth, righteousness, and eternal peace.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/002002.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 2,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        surahNameTransliteration: 'Al-Baqarah',
        ayahNumber: 185,
        arabicVerseText: 'شَهْرُ رَمَضَانَ ٱلَّذِىٓ أُنزِلَ فِيهِ ٱلْقُرْءَانُ هُدًۭى لِّلنَّاسِ',
        highlightedWord: 'هُدًۭى',
        translation: 'The month of Ramadan in which was revealed the Quran, a guidance for the people...',
        translationSource: 'Saheeh International',
        contextMeaning: 'Universal guidance available for all of humanity to distinguish truth from falsehood.'
      },
      {
        surahNumber: 28,
        surahNameArabic: 'القصص',
        surahNameEnglish: 'The Stories',
        surahNameTransliteration: 'Al-Qasas',
        ayahNumber: 56,
        arabicVerseText: 'إِنَّكَ لَا تَهْدِى مَنْ أَحْبَبْتَ وَلَـٰكِنَّ ٱللَّهَ يَهْدِى مَن يَشَآءُ',
        highlightedWord: 'تَهْدِى',
        translation: 'Indeed, [O Muhammad], you do not guide whom you like, but Allah guides whom He wills.',
        translationSource: 'Saheeh International',
        contextMeaning: 'Distinction between Hidayat al-Irshad (pointing out the path, which prophets do) and Hidayat al-Tawfiq (transforming the heart, which only Allah can do).'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Guidance, clear direction, and the right roadmap for life.',
          isApproximate: true,
          inContextExplanation: 'In 2:2, the Quran is called "Hudan" because it provides clear light and directions on how to live rightly and reach paradise.',
          languageNote: {
            rootArabic: 'ه د ي',
            rootTransliteration: 'h-d-y',
            rootMeaning: 'To gently guide or lead.',
            wordClass: 'Noun (Guidance)',
            morphologySummary: 'Ends with an alif maqsurah (ى) with tanween fath (اً).'
          },
          ambiguityOrNuance: 'Guidance in Arabic is gentle leading with kindness, not forceful coercion.'
        },
        id: {
          meaning: 'Petunjuk, arah jalan yang lurus dan benar.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 2:2, Al-Qur\'an adalah petunjuk bagi orang-orang yang bertakwa.',
          languageNote: {
            wordClass: 'Kata Benda (Ism Maqshur)',
            morphologySummary: 'Akar H-D-Y (menunjukkan jalan dengan lemah lembut).'
          }
        },
        fr: {
          meaning: 'Guidée, orientation claire et lumière directrice.',
          isApproximate: true,
          inContextExplanation: 'En 2:2, le Coran est désigné comme le guide infaillible pour les personnes pieuses.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Racine H-D-Y.'
          }
        },
        ur: {
          meaning: 'ہدایت، سیدھا راستہ، اور سچی رہنمائی۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ البقرہ 2:2 میں قرآن مجید کو متقین کے لیے سراپا ہدایت قرار دیا گیا ہے۔',
          languageNote: {
            wordClass: 'اسم مقصور',
            morphologySummary: 'مادہ: ہ د ی (نرمی سے راستہ دکھانا)'
          }
        },
        tr: {
          meaning: 'Hidayet, doğru yol rehberliği ve aydınlık kılavuz.',
          isApproximate: true,
          inContextExplanation: 'Bakara 2\'de Kur\'an\'ın takva sahipleri için dosdoğru bir rehber olduğu bildirilir.',
          languageNote: {
            wordClass: 'İsim',
            morphologySummary: 'H-D-Y kökü.'
          }
        },
        ar: {
          meaning: 'الدلالة والإرشاد بلطف إلى ما يوصل إلى البغية والنجاة.',
          isApproximate: false,
          inContextExplanation: 'في البقرة 2: القرآن هداية تامة ونور ساطع للمتقين الذين استعدت قلوبهم لقبول الحق.',
          languageNote: {
            wordClass: 'اسم مصدر مقصور',
            morphologySummary: 'الجذر (هـ د ي)، ومنه الهدية لكونها تأليفاً ومودة.'
          }
        },
        de: {
          meaning: 'Rechtleitung, Wegweisung und Orientierung.',
          isApproximate: true,
          inContextExplanation: 'In 2:2 ist der Koran die vollkommene Rechtleitung für die Gottesbewussten.',
          languageNote: {
            wordClass: 'Substantiv',
            morphologySummary: 'Wurzel H-D-Y.'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'Illuminating pathfinding and divine direction that safely leads to the intended goal.',
          isApproximate: false,
          inContextExplanation: 'In 2:2, "هُدًى" is a Khabar Thān (second predicate) or Hal, characterizing the entire Book as guidance itself (hyperbolic Masdar).',
          languageNote: {
            rootArabic: 'ه د ي',
            rootTransliteration: 'h-d-y',
            rootMeaning: 'Gentle direction with love and clarity.',
            wordClass: 'Ism Maqsur (Masdar used as description)',
            formOrPattern: 'Fu\'al (فُعَل)',
            morphologySummary: 'Weak root (معتل ناقص). The tanween reflects phonetic Nunation on the Alif Maqsurah.',
            grammarSyntax: 'خبر ثان للمبتدأ (ذلك) مرفوع بضمة مقدرة على الألف منع من ظهورها التعذر.'
          },
          ambiguityOrNuance: 'Classical theologians categorize Hidayah into 4 levels: 1) Universal instinct given to all organisms, 2) Intellectual and sensory discernment, 3) Revelation through prophets (Hidayat al-Bayan), and 4) Spiritual inner acceptance and entrance to Paradise (Hidayat al-Tawfiq).'
        },
        id: {
          meaning: 'Petunjuk yang membimbing secara tepat menuju keselamatan hakiki.',
          inContextExplanation: 'Di QS 2:2, berstatus khabar marfu\' dengan dhummah muqaddarah.',
          languageNote: {
            wordClass: 'Ism Maqshur',
            morphologySummary: 'Fi\'il Mu\'tal Naqis (هـ د ي).'
          }
        },
        fr: {
          meaning: 'Orientation divine bienveillante menant au salut.',
          inContextExplanation: 'En 2:2, prédicat caractérisant le Coran comme l\'incarnation même de la guidance.',
          languageNote: {
            wordClass: 'Nom maqsur',
            morphologySummary: 'Racine défective H-D-Y.'
          }
        },
        ur: {
          meaning: 'وہ رہنمائی جو مطلوب تک پہنچا دے۔',
          inContextExplanation: 'نحو: 2:2 میں خبر ثانی ہے، جو مبالغے کے طور پر کتاب کو عینِ ہدایت قرار دیتی ہے۔',
          languageNote: {
            wordClass: 'اسم مقصور معتل اللام',
            morphologySummary: 'وزن: فُعَل'
          }
        },
        tr: {
          meaning: 'Amaca ulaştıran nazik ve aydınlatıcı yol göstericilik.',
          inContextExplanation: 'Bakara 2\'de mübteda için ikinci haber konumundadır.',
          languageNote: {
            wordClass: 'Maksur İsim',
            morphologySummary: 'H-D-Y nakıs kökünden türetilmiştir.'
          }
        },
        ar: {
          meaning: 'الدلالة الموصلة إلى البغية بلطف ورفق.',
          inContextExplanation: 'في البقرة 2: الإخبار بالمصدر (هُدى) مبالغة، كأن الكتاب في ذاته تجسيدٌ للهداية لا مجرد هادٍ.',
          languageNote: {
            wordClass: 'مصدر مقصور',
            formOrPattern: 'فُعَل',
            grammarSyntax: 'خبر ثانٍ للمبتدأ مرفوع بضمة مقدرة على الألف للتعذر.'
          }
        },
        de: {
          meaning: 'Vollkommene Wegweisung zur Erlösung.',
          inContextExplanation: 'In 2:2 wird das Buch hyperbolisch als die personifizierte Rechtleitung bezeichnet.',
          languageNote: {
            wordClass: 'Substantiv (Ism Maqsur)',
            morphologySummary: 'Defektive Wurzel H-D-Y.'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The ontological, discursive, and salvific illumination bestowed by Allah.',
          isApproximate: false,
          inContextExplanation: 'In 2:2, employing the indefinite "هُدًۭى" (Tankīr) carries the rhetorical function of Ta\'dhīm (magnification), signifying an extraordinary, incomparable degree of guidance.',
          languageNote: {
            rootArabic: 'ه د ي',
            rootTransliteration: 'h-d-y',
            rootMeaning: 'الدلالة بلطف المؤدية إلى الغاية المحمودة.',
            wordClass: 'مصدر سمي به اسم الفاعل مبالغة',
            formOrPattern: 'Wazn: فُعَل',
            grammarSyntax: 'إعراب: خبر ثانٍ للمبتدأ (ذَٰلِكَ)، أو حال مؤكدة، مرفوع بضمة مقدرة على الألف المحذوفة لفظاً لالتقاء الساكنين.'
          },
          ambiguityOrNuance: 'Contrast Surah Al-Qasas 28:56 (لَا تَهْدِي مَنْ أَحْبَبْتَ) with Surah Ash-Shura 42:52 (وَإِنَّكَ لَتَهْدِي إِلَىٰ صِرَاطٍ مُسْتَقِيمٍ): The former negates the Prophet\'s power over hearts (Tawfiq), while the latter affirms his duty of clear verbal explanation and teaching (Irshad).'
        },
        id: {
          meaning: 'Penerangan ilahi yang mencakup petunjuk penjelasan dan petunjuk taufik.',
          inContextExplanation: 'Pola tankir (indefinit) dalam balaghah berfungsi sebagai ta\'zhim (pengagungan derajat petunjuk).',
          languageNote: {
            wordClass: 'Masdar Mu\'awwal',
            grammarSyntax: 'خبر ثان مرفوع بضمة مقدرة.'
          }
        },
        fr: {
          meaning: 'Guidance ontologique et salvatrice intégrale.',
          inContextExplanation: 'La forme indéfinie (Tanwin) exprime la magnificence et l\'immensité de cette guidée (Tankir li-l-Ta\'dhim).',
          languageNote: {
            wordClass: 'Nom indéfini d\'exaltation',
            grammarSyntax: 'Prédikat secondaire avec voyelle longue virtuelle.'
          }
        },
        ur: {
          meaning: 'وہ ہمہ گیر رہنمائی جو عقل، وحی اور توفیقِ قلبی کو احاطہ کرے۔',
          inContextExplanation: 'تنکیرِ تعظیم: "هُدًى" کا نکرہ آنا اس کی عظمت اور بے پایاں تاثیر کو ظاہر کرتا ہے۔',
          languageNote: {
            wordClass: 'مصدر دال على المبالغة',
            grammarSyntax: 'خبر ثانٍ مرفوع بضمة مقدرة.'
          }
        },
        tr: {
          meaning: 'Küllî ve salvifik rehberlik; irşad ve tevfik mertebelerinin tamamı.',
          inContextExplanation: 'Nekre gelişi (tenvin) ta\'zim ifade eder; eşsiz ve yüce bir hidayet kaynağı olduğuna delildir.',
          languageNote: {
            wordClass: 'Nekre Masdar',
            grammarSyntax: 'Takdiri damme ile merfu ikinci haber.'
          }
        },
        ar: {
          meaning: 'البيان والإرشاد والتوفيق الموصل إلى رضوان الله وجنته.',
          inContextExplanation: 'تنكير (هُدًى) للتعظيم؛ أي هدى عظيم لا يُقادر قدره. والفرق بين هداية الدلالة (المثبتة للرسول في الشورى 52) وهداية التوفيق والقلوب (المنفية عنه في القصص 56 والمختصة بالله وحده).',
          languageNote: {
            wordClass: 'مصدر نكرة للتعظيم',
            formOrPattern: 'فُعَل',
            grammarSyntax: 'خبر ثانٍ مرفوع بضمة مقدرة على الألف المحذوفة لفظاً للتنوين.'
          }
        },
        de: {
          meaning: 'Umfassende göttliche Offenbarung und Herzensführung.',
          inContextExplanation: 'Die Indefinitheit (Tankīr) drückt rhetorische Großartigkeit (Ta\'dhīm) aus.',
          languageNote: {
            wordClass: 'Masdar',
            grammarSyntax: 'Zweites Prädikat im Nominativ.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'huda-q1',
        question: 'In Quranic scholarship, how are Surah 28:56 ("You cannot guide whom you love") and Surah 42:52 ("Indeed you guide to a straight path") reconciled?',
        options: [
          'They refer to two different types of guidance: general teaching (Irshād) vs. opening the heart with faith (Tawfīq)',
          'One verse abrogated (cancelled) the other verse entirely',
          'One verse refers only to angels, while the other refers to humans',
          'There is no difference; they mean the exact same thing'
        ],
        correctIndex: 0,
        explanation: 'Prophets provide Hidayat al-Irshad (clarification, preaching, and teaching the truth), while Hidayat al-Tawfiq (infusing conviction into the heart) belongs solely to Allah.',
        misconceptions: {
          1: 'Neither verse is abrogated (mansukh); both are valid descriptive facets of guidance.',
          2: 'Both verses address the Prophet Muhammad regarding guiding people.',
          3: 'They distinguish two distinct theological categories of guidance in Arabic (Irshad vs. Tawfiq).'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-huda',
        title: 'Quranic Arabic Corpus - Root (ه د ي)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=hdy',
        citationText: 'Corpus Quran: Root (ه د ي) occurs 316 times in the Quran.'
      },
      {
        id: 'raghib-mufradat-huda',
        title: 'Mufradat Alfaz al-Qur\'an (p. 835)',
        authorOrEditor: 'Al-Raghib Al-Isfahani (d. 502 AH)',
        type: 'lexicon',
        citationText: 'Al-Raghib: "الهداية دلالة بلطف" (Hidayah is direction with gentleness towards a praised outcome).'
      }
    ]
  },
  {
    id: 'kitab',
    arabic: 'كِتَاب',
    arabicSimple: 'كتاب',
    transliteration: 'Kitāb',
    transliterationNote: 'Book, scripture, decree, ordained record, or registered law.',
    rootArabic: 'ك ت ب',
    rootSimple: 'كتب',
    rootTransliteration: 'k-t-b',
    rootGeneralMeaning: 'To join, bind together, gather pieces, prescribe, write down.',
    frequencyInQuran: 261,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (فعال)',
    category: 'guidance_knowledge',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Hafs Text, Quranic Arabic Corpus (Lemma kitāb), and Lane\'s Lexicon (Book 1, p. 2589).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 2,
      surahNameArabic: 'البقرة',
      surahNameEnglish: 'The Cow',
      surahNameTransliteration: 'Al-Baqarah',
      ayahNumber: 2,
      arabicVerseText: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ',
      highlightedWord: 'ٱلْكِتَـٰبُ',
      translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'The divine Quranic scripture preserved with Allah and recited to humanity.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/002002.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 17,
        surahNameArabic: 'الإسراء',
        surahNameEnglish: 'The Night Journey',
        surahNameTransliteration: 'Al-Isra',
        ayahNumber: 14,
        arabicVerseText: 'ٱقْرَأْ كِتَـٰبَكَ كَفَىٰ بِنَفْسِكَ ٱلْيَوْمَ عَلَيْكَ حَسِيبًا',
        highlightedWord: 'كِتَـٰبَكَ',
        translation: '[It will be said], "Read your record. Sufficient is yourself against you this Day as accountant."',
        translationSource: 'Saheeh International',
        contextMeaning: 'Personal ledger / record of deeds on the Day of Judgment (illustrating semantic range beyond a printed physical book).'
      },
      {
        surahNumber: 2,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        surahNameTransliteration: 'Al-Baqarah',
        ayahNumber: 183,
        arabicVerseText: 'كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ',
        highlightedWord: 'كُتِبَ',
        translation: 'Fasting is prescribed for you...',
        translationSource: 'Saheeh International',
        contextMeaning: 'Verbal derivative (Kutiba) meaning "decreed / made obligatory".'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Book, scripture, written record, or divine decree.',
          isApproximate: true,
          inContextExplanation: 'In 2:2, Al-Kitab refers to the holy Quran, the complete revealed message from Allah.',
          languageNote: {
            rootArabic: 'ك ت ب',
            rootTransliteration: 'k-t-b',
            rootMeaning: 'To join letters or write.',
            wordClass: 'Noun (Masculine)',
            morphologySummary: 'Pattern Fi\'āl (فِعَال).'
          },
          ambiguityOrNuance: 'In the Quran, Kitab can mean the Quran, earlier scriptures (Torah/Gospel), the record of human deeds, or divine decrees.'
        },
        id: {
          meaning: 'Kitab, buku, wahyu tertulis, atau catatan amal perbuatan.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 2:2, Al-Kitab merujuk kepada Al-Qur\'an al-Karim.',
          languageNote: {
            wordClass: 'Kata Benda (Ism)',
            morphologySummary: 'Akar K-T-B (menulis / mengumpulkan).'
          }
        },
        fr: {
          meaning: 'Livre, Écriture sainte, décret ou registre des actes.',
          isApproximate: true,
          inContextExplanation: 'Dans 2:2, Al-Kitab désigne le noble Coran révélé.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Racine K-T-B.'
          }
        },
        ur: {
          meaning: 'کتاب، صحیفہ، تحریر، یا اعمال نامہ۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ البقرہ 2:2 میں الکتاب سے مراد قرآن مجید ہے۔',
          languageNote: {
            wordClass: 'اسم',
            morphologySummary: 'مادہ: ک ت ب'
          }
        },
        tr: {
          meaning: 'Kitap, vahiy, yazılı belge veya amel defteri.',
          isApproximate: true,
          inContextExplanation: 'Bakara 2\'de el-Kitâb, Kur\'ân-ı Kerîm\'i kasteder.',
          languageNote: {
            wordClass: 'İsim',
            morphologySummary: 'K-T-B kökü.'
          }
        },
        ar: {
          meaning: 'الكتاب، الصحيفة، المكتوب، الفرض المقدر.',
          isApproximate: false,
          inContextExplanation: 'في البقرة 2: (الكتاب) هو القرآن الكريم المجموع بين دفتي المصحف وفي الصدور.',
          languageNote: {
            wordClass: 'اسم',
            morphologySummary: 'الجذر (ك ت ب)، وأصله الجمع والضم ومنه الكتيبة لجماعة الخيل.'
          }
        },
        de: {
          meaning: 'Buch, Schrift, göttliche Verordnung oder Tatenregister.',
          isApproximate: true,
          inContextExplanation: 'In 2:2 bezeichnet Al-Kitab den edlen Koran.',
          languageNote: {
            wordClass: 'Substantiv',
            morphologySummary: 'Wurzel K-T-B.'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'Bound compilation of signs, scripture, or binding covenant.',
          isApproximate: false,
          inContextExplanation: 'In 2:2, "ٱلْكِتَـٰبُ" functions as a Badal (permutation) or Khabar (predicate) of the demonstrative pronoun "ذَٰلِكَ".',
          languageNote: {
            rootArabic: 'ك ت ب',
            rootTransliteration: 'k-t-b',
            rootMeaning: 'Al-Katb: joining items together into a cohesive whole.',
            wordClass: 'Ism Jāmid (Noun / Singular)',
            formOrPattern: 'Fi\'āl (فِعَال)',
            morphologySummary: 'Passive meaning (Maktūb - that which is written/compiled).'
          },
          ambiguityOrNuance: 'Why does 2:2 use "Dhālika" (that distant book) instead of "Hādhā" (this book)? Classical scholars explain this distant demonstrative signifies elevated grandeur and high station (Lilu\'luwwi al-martabah).'
        },
        id: {
          meaning: 'Himpunan wahyu yang terikat dan terpelihara.',
          inContextExplanation: 'Di QS 2:2, berkedudukan sebagai badal atau khabar bagi dhalika.',
          languageNote: {
            wordClass: 'Ism Jamid',
            morphologySummary: 'Wazan Fi\'al bermakna Maf\'ul (Maktub).'
          }
        },
        fr: {
          meaning: 'Compilation scripturaire ordonnée et inviolable.',
          inContextExplanation: 'En 2:2, apposition (Badal) ou attribut du pronom démonstratif de majesté.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Schème Fi\'al au sens passif (ce qui est écrit).'
          }
        },
        ur: {
          meaning: 'الفاظ و معانی کا وہ مجموعہ جو مرتب اور لازم ہو۔',
          inContextExplanation: 'نحو: 2:2 میں "ذَٰلِكَ" کا بدل یا خبر ہے۔ "ذلك" کا اشارہ دوری کے بجائے رفعتِ مرتبت کے لیے ہے۔',
          languageNote: {
            wordClass: 'اسم جامد',
            morphologySummary: 'وزن: فِعَال (بمعنى مفعول / مكتوب)'
          }
        },
        tr: {
          meaning: 'Bir araya toplanmış, yazılmış ve bağlayıcı kılınmış kutsal metin.',
          inContextExplanation: 'Bakara 2\'de işaret isminin bedeli veya haberi konumundadır.',
          languageNote: {
            wordClass: 'İsim',
            morphologySummary: 'Fi\'âl vezni, mef\'ûl manasındadır.'
          }
        },
        ar: {
          meaning: 'المجموع من الكلمات والحروف، ويُطلق على القرآن والتوراة والإنجيل وسجل الأعمال.',
          inContextExplanation: 'في البقرة 2: (الكتاب) بدل من اسم الإشارة (ذلك) أو خبر له. واستعمال اسم الإشارة للبعيد (ذلك) دلالة على علو قدره ورفعة منزلته.',
          languageNote: {
            wordClass: 'اسم بمعنى مفعول',
            formOrPattern: 'فِعَال',
            morphologySummary: 'من الجمع والضم، و(كتب) بمعنى فرض وقضى.'
          }
        },
        de: {
          meaning: 'Geregelte Sammlung von Offenbarungen oder Schicksalsbeschluss.',
          inContextExplanation: 'In 2:2 steht Al-Kitab als Apposition (Badal) zum Fern-Demonstrativpronomen.',
          languageNote: {
            wordClass: 'Substantiv',
            morphologySummary: 'Schema Fi\'al im passiven Sinn (Maktūb).'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The archetypal celestial codex (Umm al-Kitab / Al-Lawh al-Mahfuz) and its earthly historical revelations.',
          isApproximate: false,
          inContextExplanation: 'In 2:2: "ذَٰلِكَ ٱلْكِتَـٰبُ" exhibits Balaghic Ijaz (conciseness). The definitive article Al- is for Ahd \'Ilmi / Jinsi, distinguishing the Quran as the ultimate archetype of all divine scriptures.',
          languageNote: {
            rootArabic: 'ك ت ب',
            rootTransliteration: 'k-t-b',
            rootMeaning: 'الجمع والضم والتقرير الحكمي.',
            wordClass: 'اسم جامد (بمعنى مفعول)',
            formOrPattern: 'Wazn: فِعَال',
            grammarSyntax: 'إعراب: بدل من اسم الإشارة مرفوع بالضمة، أو خبر للمبتدأ (ذلك).'
          },
          ambiguityOrNuance: 'Compare occurrences across Surahs: 1) The Quran itself (2:2), 2) Pre-Quranic revelations (2:213), 3) The Heavenly Preserved Tablet (13:39), 4) Human deed records on Judgement Day (17:14), 5) Legal decrees / obligations (2:183).'
        },
        id: {
          meaning: 'Mushaf surgawi purwarupa (Lauh Mahfuzh) serta seluruh manifestasi wahyu tertulis.',
          inContextExplanation: 'Huruf lam ta\'rif (al-) bermakna lil-\'ahd, menegaskan Al-Qur\'an sebagai kitab paripurna.',
          languageNote: {
            wordClass: 'Ism Jamid',
            grammarSyntax: 'بدل مرفوع بالضمة الظاهرة.'
          }
        },
        fr: {
          meaning: 'L\'archétype céleste préservé et ses manifestations textuelles terrestres.',
          inContextExplanation: 'L\'article défini marque l\'universalité et la perfection insurpassable du texte sacré.',
          languageNote: {
            wordClass: 'Nom',
            grammarSyntax: 'Badal ou Khabar au cas nominatif.'
          }
        },
        ur: {
          meaning: 'لوحِ محفوظ کا اصل صحیفہ اور زمین پر نازل شدہ آخری کامل کتاب۔',
          inContextExplanation: 'بلاغت: "ال" عہدِ ذہنی کے لیے ہے، جو قرآن کو تمام کتبِ سماوی کا خلاصہ اور اصل قرار دیتا ہے۔',
          languageNote: {
            wordClass: 'اسم جامد',
            grammarSyntax: 'إعراب: بدل أو خبر مرفوع بالضمة.'
          }
        },
        tr: {
          meaning: 'Levh-i Mahfuz\'daki ana kitap ve bunun yeryüzündeki ilahî tezahürü.',
          inContextExplanation: 'Harf-i tarif (el-) ahd-i zihnî içindir; Kur\'an\'ın bütün vahiylerin zirvesi olduğunu vurgular.',
          languageNote: {
            wordClass: 'İsim',
            grammarSyntax: 'İşaret isminin bedeli olarak merfudur.'
          }
        },
        ar: {
          meaning: 'الجامع للحقائق الإلهية، ويشمل اللوح المحفوظ والقرآن وسائر الكتب المنزلة وصحائف الأعمال.',
          inContextExplanation: 'في البلاغة: التعريف بـ (أل) للعهد الذهني أو للجنس المبالغ في كماله، كأنه هو الكتاب الكامل الحقيق بأن يُسمى كتاباً.',
          languageNote: {
            wordClass: 'اسم',
            formOrPattern: 'فِعَال',
            grammarSyntax: 'بدل من اسم الإشارة مرفوع بالضمة، أو خبر أول.'
          }
        },
        de: {
          meaning: 'Der himmlische Urtext (Umm al-Kitab) und Seine historische irdische Offenbarung.',
          inContextExplanation: 'Der bestimmte Artikel (Al-) fungiert als Hervorhebung der Vollkommenheit der Schrift.',
          languageNote: {
            wordClass: 'Substantiv',
            grammarSyntax: 'Apposition im Nominativ.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'kitab-q1',
        question: 'In Surah Al-Isra (17:14), when a person is told "Read your Kitāb (اقْرَأْ كِتَابَكَ)", what does "Kitāb" specifically refer to in that context?',
        options: [
          'A copy of the Quran printed on paper',
          'Their personal record/ledger of deeds recorded by angels',
          'A secular dictionary of classical Arabic',
          'A letter from their relatives'
        ],
        correctIndex: 1,
        explanation: 'In 17:14, "Kitāb" refers to the individual\'s record of worldly deeds presented on the Day of Judgment, showing that Kitāb encompasses recorded registers beyond just religious scripture.',
        misconceptions: {
          0: 'Quran is Al-Kitab in 2:2, but in 17:14 it is the personal deed ledger (Sijill / Sahifah).',
          2: 'Dictionaries are modern reference books.',
          3: 'Letters between humans do not decide Judgment Day accountings.'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-kitab',
        title: 'Quranic Arabic Corpus - Root (ك ت ب)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=ktb',
        citationText: 'Corpus Quran: Root (ك ت ب) occurs 319 times, with the noun "kitāb" appearing 261 times.'
      },
      {
        id: 'lane-kitab',
        title: 'Arabic-English Lexicon (Book 1, p. 2589)',
        authorOrEditor: 'Edward William Lane',
        type: 'lexicon',
        url: 'https://ejtaal.net/aa/#hw4=948,ll=2673',
        citationText: 'Lane\'s Lexicon: "كتاب: A writing, book, scripture, ordinance, decree, written mandate."'
      }
    ]
  },
  {
    id: 'nur',
    arabic: 'نُور',
    arabicSimple: 'نور',
    transliteration: 'Nūr',
    transliterationNote: 'Light that illuminates, clarifies vision, dispels darkness, and manifests reality.',
    rootArabic: 'ن و ر',
    rootSimple: 'نور',
    rootTransliteration: 'n-w-r',
    rootGeneralMeaning: 'Light, brightness, illumination, revelation, clarity.',
    frequencyInQuran: 49,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (فُعْل)',
    category: 'core_theology',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Hafs Text, Quranic Arabic Corpus (Lemma nūr), and Tafsir Ibn Kathir (Surah An-Nur 24:35).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 24,
      surahNameArabic: 'النور',
      surahNameEnglish: 'The Light',
      surahNameTransliteration: 'An-Nur',
      ayahNumber: 35,
      arabicVerseText: 'ٱللَّهُ نُورُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ',
      highlightedWord: 'نُورُ',
      translation: 'Allah is the Light of the heavens and the earth.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'The Illuminator, Guide, and Sustainer of the cosmos who brings truth into view and guides whom He wills.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/024035.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 5,
        surahNameArabic: 'المائدة',
        surahNameEnglish: 'The Table Spread',
        surahNameTransliteration: 'Al-Ma\'idah',
        ayahNumber: 15,
        arabicVerseText: 'قَدْ جَآءَكُم مِّنَ ٱللَّهِ نُورٌۭ وَكِتَـٰبٌۭ مُّبِينٌۭ',
        highlightedWord: 'نُورٌۭ',
        translation: 'There has come to you from Allah a light and a clear Book.',
        translationSource: 'Saheeh International',
        contextMeaning: 'Referring to the Prophet Muhammad and the radiant truth of divine guidance.'
      },
      {
        surahNumber: 2,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        surahNameTransliteration: 'Al-Baqarah',
        ayahNumber: 257,
        arabicVerseText: 'يُخْرِجُهُم مِّنَ ٱلظُّلُمَـٰتِ إِلَى ٱلنُّورِ',
        highlightedWord: 'ٱلنُّورِ',
        translation: 'He brings them out from darknesses into the light.',
        translationSource: 'Mustafa Khattab, The Clear Quran',
        contextMeaning: 'Single singular truth (Nūr) contrasting with multiple multifaceted darknesses (dhulumāt) of doubt and polytheism.'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Light, spiritual clarity, and divine guidance.',
          isApproximate: true,
          inContextExplanation: 'In 24:35, Allah is described as the Light of the universe—the One who creates all light and guides minds and hearts to understand truth.',
          languageNote: {
            rootArabic: 'ن و ر',
            rootTransliteration: 'n-w-r',
            rootMeaning: 'Illumination, radiant fire.',
            wordClass: 'Noun (Masculine Singular)',
            morphologySummary: 'Hollow root (معتل أجوف).'
          },
          ambiguityOrNuance: 'Notice that in the Quran, "Light" (Nūr) is always singular, while "Darkness" (Dhulumāt) is plural, symbolizing that Truth is one, while errors are many.'
        },
        id: {
          meaning: 'Cahaya, penerang, petunjuk kebenaran yang menyingkap kegelapan.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 24:35, Allah adalah Pemberi Cahaya bagi langit dan bumi.',
          languageNote: {
            wordClass: 'Kata Benda (Ism)',
            morphologySummary: 'Akar N-W-R.'
          }
        },
        fr: {
          meaning: 'Lumière, clarté spirituelle et illumination divine.',
          isApproximate: true,
          inContextExplanation: 'Dans 24:35, Allah est la Lumière suprême des cieux et de la terre.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Racine N-W-R.'
          }
        },
        ur: {
          meaning: 'نور، روشنی، ہدایت، اور باطنی بصیرت۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ النور 24:35 میں اللہ تعالیٰ کو آسمانوں اور زمین کا نور قرار دیا گیا ہے۔',
          languageNote: {
            wordClass: 'اسم',
            morphologySummary: 'مادہ: ن و ر'
          }
        },
        tr: {
          meaning: 'Nur, aydınlık, ilahi hidayet ve hakikat ışığı.',
          isApproximate: true,
          inContextExplanation: 'Nûr 35\'te Allah\'ın göklerin ve yerin nuru olduğu beyan edilir.',
          languageNote: {
            wordClass: 'İsim',
            morphologySummary: 'N-V-R kökü.'
          }
        },
        ar: {
          meaning: 'الضوء، الهداية، جلاء البصيرة، المنور للكون.',
          isApproximate: false,
          inContextExplanation: 'في النور 35: (اللهُ نُورُ السَّمَاوَاتِ وَالأَرْضِ) أي منورهما وهادي أهلهما ومدبر أمرهما.',
          languageNote: {
            wordClass: 'اسم (مصدر)',
            morphologySummary: 'الجذر (ن و ر)، وهو أجوف واوي.'
          }
        },
        de: {
          meaning: 'Licht, Erleuchtung, Klarheit und göttliche Rechtleitung.',
          isApproximate: true,
          inContextExplanation: 'In 24:35 ist Allah das Licht der Himmel und der Erde.',
          languageNote: {
            wordClass: 'Substantiv',
            morphologySummary: 'Wurzel N-W-R.'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'The luminous principle of discernment, manifest guidance, and cosmological sustenance.',
          isApproximate: false,
          inContextExplanation: 'In 24:35, "نُورُ" is the Khabar (predicate) in genitive annexation (Mudaf) to "السماوات والأرض", signifying that Allah is their Creator, Illuminator, and Director.',
          languageNote: {
            rootArabic: 'ن و ر',
            rootTransliteration: 'n-w-r',
            rootMeaning: 'Illumination which is visible in itself and makes other things visible.',
            wordClass: 'Noun (Mudaf)',
            formOrPattern: 'Fu\'l (فُعْل)',
            morphologySummary: 'Hollow triliteral with medial Waw (أجوف واوي).'
          },
          ambiguityOrNuance: 'Ibn Abbas commented: "Allah is the Guide (Hādi) of the inhabitants of the heavens and the earth." Exegetes distinguish between Allah\'s essential light and the created physical/spiritual light in creation.'
        },
        id: {
          meaning: 'Prinsip cahaya penerang yang menyingkap kebenaran.',
          inContextExplanation: 'Di QS 24:35, berfungsi sebagai khabar mudhaf yang marfu\'.',
          languageNote: {
            wordClass: 'Ism Mudhaf',
            morphologySummary: 'Fi\'il Ajwaf Wawi (ن-و-ر).'
          }
        },
        fr: {
          meaning: 'Principe lumineux de discernement et de direction providentielle.',
          inContextExplanation: 'En 24:35, attribut en annexion signifiant l\'Illuminateur et Guide du cosmos.',
          languageNote: {
            wordClass: 'Nom en annexion',
            morphologySummary: 'Racine creuse N-W-R.'
          }
        },
        ur: {
          meaning: 'وہ روشنی جو خود بھی ظاہر ہو اور دوسری اشیاء کو بھی عیاں کرے۔',
          inContextExplanation: 'نحو: 24:35 میں خبر مضاف ہے۔ ابن عباسؓ کے مطابق اس کا معنی ہے: آسمان و زمین والوں کو ہدایت دینے والا۔',
          languageNote: {
            wordClass: 'اسم مضاف',
            morphologySummary: 'معتل اجوف واوی (ن و ر)'
          }
        },
        tr: {
          meaning: 'Kendisi görünür olan ve diğer her şeyi görünür kılan hakikat aydınlığı.',
          inContextExplanation: 'Nûr 35\'te muzaf haber konumundadır; kainatın aydınlatıcısı ve hidayet kaynağıdır.',
          languageNote: {
            wordClass: 'Muzaf İsim',
            morphologySummary: 'Ecvef-i vâvî kök.'
          }
        },
        ar: {
          meaning: 'الظاهر في نفسه المظهر لغيره، الهادي لأهل سمواته وأرضه.',
          inContextExplanation: 'في النور 35: إعراب (نُورُ) خبر المبتدأ مرفوع بالضمة وهو مضاف. قال ابن عباس: أي هادي أهل السموات والأرض.',
          languageNote: {
            wordClass: 'اسم مضاف',
            formOrPattern: 'فُعْل',
            morphologySummary: 'ثلاثي معتل أجوف (ن و ر).'
          }
        },
        de: {
          meaning: 'Das erhellende Prinzip der Erkenntnis und kosmischen Führung.',
          inContextExplanation: 'In 24:35 steht Nūr als Prädikat in Genitivkonstruktion.',
          languageNote: {
            wordClass: 'Substantiv (Mudaf)',
            morphologySummary: 'Hohle Wurzel N-W-R.'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The transcendent manifestation of divine reality (Al-Zahir al-Muzhir) dispelling cosmic non-existence and epistemic ignorance.',
          isApproximate: false,
          inContextExplanation: 'In 24:35, the celebrated "Ayat al-Nur" presents an intricate parable of faith inside the believer\'s heart (the niche, glass, lamp, and olive tree). In Quranic syntax, Nūr is consistently juxtaposed as a singular against the plural Dhulumāt (ظُلُمَات), demonstrating the unity of Haqq vs the multiplicity of Batil.',
          languageNote: {
            rootArabic: 'ن و ر',
            rootTransliteration: 'n-w-r',
            rootMeaning: 'الظهور والبيان والجلاء.',
            wordClass: 'مصدر سمي به اسم الفاعل مجازاً',
            formOrPattern: 'Wazn: فُعْل',
            grammarSyntax: 'إعراب: خبر المبتدأ مرفوع وعلامة رفعه الضمة الظاهرة، وهو مضاف.'
          },
          ambiguityOrNuance: 'Imam Al-Ghazali in Mishkat al-Anwar explains that true Nur is that by which things are disclosed to perception, and ultimately Allah alone possesses real, unborrowed light.'
        },
        id: {
          meaning: 'Manifestasi transenden dari hakikat ketuhanan yang menghidupkan dan menerangi qalb.',
          inContextExplanation: 'Kontras singularitas Nur dengan pluralitas Dhulumat menegaskan ketunggalan jalan kebenaran.',
          languageNote: {
            wordClass: 'Ism Mudhaf',
            grammarSyntax: 'خبر المبتدأ مرفوع بالضمة.'
          }
        },
        fr: {
          meaning: 'Manifestation transcendantale de la vérité divine dissipant l\'égarement.',
          inContextExplanation: 'L\'usage du singulier Nur face au pluriel Dhulumat souligne l\'unicité de la vérité.',
          languageNote: {
            wordClass: 'Nom',
            grammarSyntax: 'Khabar au cas nominatif.'
          }
        },
        ur: {
          meaning: 'حقیقتِ مطلقہ کا وہ ظہور جو کائنات کو وجود اور ہدایت بخشتا ہے۔',
          inContextExplanation: 'بلاغت: قرآن میں نور ہمیشہ مفرد اور ظلمات ہمیشہ جمع آتی ہیں، تاکہ حق کی وحدت اور باطل کی کثرت واضح ہو۔',
          languageNote: {
            wordClass: 'اسم / خبر',
            grammarSyntax: 'إعراب: خبر المبتدأ مرفوع بالضمة وهو مضاف.'
          }
        },
        tr: {
          meaning: 'Varlığı ve idraki aydınlatan mutlak ilahi tecelli.',
          inContextExplanation: 'Kur\'an\'da nur daima tekil, zulümât ise çoğul kullanılır; bu hakikatin birliğini simgeler.',
          languageNote: {
            wordClass: 'Haber İsim',
            grammarSyntax: 'Merfu haber.'
          }
        },
        ar: {
          meaning: 'النور الحقيقي الذي به انكشف كل مجهول وقامت به السموات والأرض بهدايته وتدبيره.',
          inContextExplanation: 'في الإعجاز البلاغي: إفراد (النور) وجمع (الظلمات) في سائر القرآن؛ لأن الحق واحد لا يتعدد، وسبل الباطل والضلال كثيرة متشعبة.',
          languageNote: {
            wordClass: 'اسم مفرد',
            formOrPattern: 'فُعْل',
            grammarSyntax: 'خبر للمبتدأ (الله) مرفوع بالضمة وهو مضاف.'
          }
        },
        de: {
          meaning: 'Die transzendente Manifestation göttlicher Wahrheit.',
          inContextExplanation: 'Im Koran steht Nūr stets im Singular, Dhulumāt stets im Plural, um die Einheit der Wahrheit zu verdeutlichen.',
          languageNote: {
            wordClass: 'Substantiv',
            grammarSyntax: 'Prädikat im Nominativ.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'nur-q1',
        question: 'In Quranic usage, why does "Nūr" (Light) consistently appear in the singular form while "Dhulumāt" (Darknesses) appears in the plural form?',
        options: [
          'Because the divine path of truth is unified and one, while paths of falsehood, doubt, and desire are multifaceted and many',
          'It is just an accidental stylistic choice without theological significance',
          'Because Arabic grammar prohibits pluralizing the word Nur',
          'Because darkness occupies more physical space than light'
        ],
        correctIndex: 0,
        explanation: 'Classical scholars (e.g. Ibn al-Qayyim) emphasize that Truth (Al-Haqq) is single and cohesive (hence singular Nūr), whereas falsehoods, heresies, and misguidance are fragmented and numerous (hence plural Dhulumāt).',
        misconceptions: {
          1: 'Classical rhetoric (Balaghah) shows this deliberate consistency across the entire Quran.',
          2: 'Arabic does have plurals for light (anwār), but the Quran intentionally avoided it for theological precision.',
          3: 'The distinction is spiritual and epistemic rather than physical volume.'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-nur',
        title: 'Quranic Arabic Corpus - Root (ن و ر)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=nwr',
        citationText: 'Corpus Quran: Root (ن و ر) occurs 194 times across derivatives.'
      },
      {
        id: 'ghazali-mishkat',
        title: 'Mishkat al-Anwar (The Niche for Lights)',
        authorOrEditor: 'Imam Abu Hamid Al-Ghazali (d. 505 AH)',
        type: 'tafsir',
        citationText: 'Al-Ghazali: Commentary on the Light Verse (24:35) and the hierarchies of cosmic light.'
      }
    ]
  },
  {
    id: 'sabr',
    arabic: 'صَبْر',
    arabicSimple: 'صبر',
    transliteration: 'Ṣabr',
    transliterationNote: 'Patience, steadfast endurance, perseverance, restraint, and constancy in doing good.',
    rootArabic: 'ص ب ر',
    rootSimple: 'صبر',
    rootTransliteration: 'ṣ-b-r',
    rootGeneralMeaning: 'To bind, withhold, restrain oneself from agitation, despair, or sinful reaction.',
    frequencyInQuran: 103,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (مصدر)',
    category: 'character_ethics',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Hafs Text, Quranic Arabic Corpus (Lemma ṣabr), and Lane\'s Lexicon (Book 1, p. 1643).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 2,
      surahNameArabic: 'البقرة',
      surahNameEnglish: 'The Cow',
      surahNameTransliteration: 'Al-Baqarah',
      ayahNumber: 153,
      arabicVerseText: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ',
      highlightedWord: 'بِٱلصَّبْرِ',
      translation: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'Fortifying the self through disciplined endurance, steadfastness, and regular prayer in the face of life\'s trials.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/002153.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 39,
        surahNameArabic: 'الزمر',
        surahNameEnglish: 'The Troops',
        surahNameTransliteration: 'Az-Zumar',
        ayahNumber: 10,
        arabicVerseText: 'إِنَّمَا يُوَفَّى ٱلصَّـٰبِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍۢ',
        highlightedWord: 'ٱلصَّـٰبِرُونَ',
        translation: 'Indeed, the patient will be given their reward without account [limit].',
        translationSource: 'Saheeh International',
        contextMeaning: 'The boundless, unmeasured reward reserved for those who hold fast to patience.'
      },
      {
        surahNumber: 103,
        surahNameArabic: 'العصر',
        surahNameEnglish: 'The Declining Day',
        surahNameTransliteration: 'Al-\'Asr',
        ayahNumber: 3,
        arabicVerseText: 'وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ',
        highlightedWord: 'بِٱلصَّبْرِ',
        translation: '...and advised each other to truth and advised each other to patience.',
        translationSource: 'Mustafa Khattab, The Clear Quran',
        contextMeaning: 'Mutual societal encouragement towards steadfast perseverance in faith and justice.'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Patience, endurance, self-control, and staying strong during hard times.',
          isApproximate: true,
          inContextExplanation: 'In 2:153, believers are advised to overcome hardship and emotional distress by pairing inner patience with regular prayer.',
          languageNote: {
            rootArabic: 'ص ب ر',
            rootTransliteration: 'ṣ-b-r',
            rootMeaning: 'To hold back, restrain.',
            wordClass: 'Noun (Masdar)',
            morphologySummary: 'Three-letter solid root.'
          },
          ambiguityOrNuance: 'Sabr is not passive weakness or surrender; it is active courage, discipline, and emotional steadfastness.'
        },
        id: {
          meaning: 'Sabar: Ketabahan, keteguhan hati, dan pengendalian diri menghadapi ujian.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 2:153, orang beriman diperintahkan memohon pertolongan melalui sabar dan shalat.',
          languageNote: {
            wordClass: 'Kata Benda (Ism Masdar)',
            morphologySummary: 'Akar Sh-B-R (menahan diri dari keluh kesah).'
          }
        },
        fr: {
          meaning: 'Patience, persévérance inébranlable et maîtrise de soi.',
          isApproximate: true,
          inContextExplanation: 'Dans 2:153, le croyant puise force et réconfort dans la patience active et la prière.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Racine S-B-R.'
          }
        },
        ur: {
          meaning: 'صبر: خود پر قابو پانا، استقامت، اور مصیبت پر شکوہ نہ کرنا۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ البقرہ 2:153 میں مشکلات پر صبر اور نماز کے ذریعے اللہ کی مدد طلب کرنے کا حکم ہے۔',
          languageNote: {
            wordClass: 'اسم مصدر',
            morphologySummary: 'مادہ: ص ب ر (نفس کو روکنا)'
          }
        },
        tr: {
          meaning: 'Sabır: Direnç, tahammül, nefsi günahlardan alıkoyma ve azim.',
          isApproximate: true,
          inContextExplanation: 'Bakara 153\'te sabır ve namaz ile yardım istenmesi öğütlenir.',
          languageNote: {
            wordClass: 'İsim (Masdar)',
            morphologySummary: 'S-B-R kökü.'
          }
        },
        ar: {
          meaning: 'حبس النفس عن الجزع واللسان عن التشكي والجوارح عن المعصية.',
          isApproximate: false,
          inContextExplanation: 'في البقرة 153: حث المؤمنين على الاستعانة بالصبر على الطاعات والشدائد مقروناً بالصلاة.',
          languageNote: {
            wordClass: 'اسم مصدر',
            morphologySummary: 'الجذر (ص ب ر)، وأصله الحبس والربط.'
          }
        },
        de: {
          meaning: 'Geduld, standhafte Ausdauer und Selbstbeherrschung.',
          isApproximate: true,
          inContextExplanation: 'In 2:153 werden Gläubige aufgerufen, Beistand durch Geduld und Gebet zu suchen.',
          languageNote: {
            wordClass: 'Substantiv (Masdar)',
            morphologySummary: 'Wurzel S-B-R.'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'Active restraint and steadfast constancy across life\'s trials.',
          isApproximate: false,
          inContextExplanation: 'In 2:153, "بِٱلصَّبْرِ" is governed by the preposition Bā (Jar wa Majrur) denoting means (Isti\'ānah) attached to the imperative verb "ٱسْتَعِينُوا۟".',
          languageNote: {
            rootArabic: 'ص ب ر',
            rootTransliteration: 'ṣ-b-r',
            rootMeaning: 'Al-Habs (الحبس): restraining the soul from panic.',
            wordClass: 'Noun (Masdar)',
            formOrPattern: 'Fa\'l (فَعْل)',
            morphologySummary: 'Solid triliteral noun.'
          },
          ambiguityOrNuance: 'Classical scholars divide Sabr into three essential pillars: 1) Patience in enduring hardships without complaint, 2) Patience in remaining steadfast on acts of obedience (Tā\'ah), and 3) Patience in refraining from prohibited sins (Ma\'siyah).'
        },
        id: {
          meaning: 'Pengendalian diri aktif dalam ketaatan, menjauhi maksiat, dan menghadapi takdir.',
          inContextExplanation: 'Di QS 2:153, jar wa majrur muta\'alliq dengan fi\'il amr ista\'īnu.',
          languageNote: {
            wordClass: 'Ism Masdar Majrur',
            morphologySummary: 'Wazan Fa\'l (فَعْل).'
          }
        },
        fr: {
          meaning: 'Constance active face aux épreuves et persévérance dans l\'obéissance.',
          inContextExplanation: 'En 2:153, complément prépositionnel d\'instrument lié au verbe d\'injonction.',
          languageNote: {
            wordClass: 'Nom au génitif',
            morphologySummary: 'Schème Fa\'l.'
          }
        },
        ur: {
          meaning: 'نفس کو اطاعت پر جمانا، گناہ سے روکنا، اور آزمائش پر ثابت قدم رہنا۔',
          inContextExplanation: 'نحو: 2:153 میں جار و مجرور فعلِ امر (استعينوا) سے متعلق ہے۔',
          languageNote: {
            wordClass: 'اسم مصدر مجرور',
            morphologySummary: 'وزن: فَعْل'
          }
        },
        tr: {
          meaning: 'Nefsi taat üzerine tutma, haramlardan koruma ve imtihanlara direnme gücü.',
          inContextExplanation: 'Bakara 153\'te istiane emrinin vasıtası kılınmıştır.',
          languageNote: {
            wordClass: 'Mecrur Masdar',
            morphologySummary: 'Fa\'l vezni.'
          }
        },
        ar: {
          meaning: 'حبس النفس على الطاعة وعن المعصية وعلى أقدار الله المؤلمة.',
          inContextExplanation: 'في البقرة 153: (بِالصَّبْرِ) جار ومجرور متعلق بفعل الأمر (اسْتَعِينُوا)، وقُرن بالصلاة لأن الصبر وقود النفس والصلاة صلة بالرب.',
          languageNote: {
            wordClass: 'مصدر مجرور بالباء',
            formOrPattern: 'فَعْل',
            morphologySummary: 'ثلاثي صحيح مجرد.'
          }
        },
        de: {
          meaning: 'Konstante Standhaftigkeit im Gehorsam und in Prüfungen.',
          inContextExplanation: 'In 2:153 steht Sabr im Präpositionalgefüge als Mittel zum Sieg.',
          languageNote: {
            wordClass: 'Substantiv (Masdar)',
            morphologySummary: 'Schema Fa\'l.'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The fortitude of spiritual equilibrium under divine providence.',
          isApproximate: false,
          inContextExplanation: 'In 2:153, the concluding clause "إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ" specifies Maiyyah Khassah (special divine companionship comprising support, aid, and affection) exclusively designated for the patient.',
          languageNote: {
            rootArabic: 'ص ب ر',
            rootTransliteration: 'ṣ-b-r',
            rootMeaning: 'الحبس والمنع والشدة.',
            wordClass: 'اسم مصدر (وصف فاعل: صابرين)',
            formOrPattern: 'Wazn: فَعْل',
            grammarSyntax: 'إعراب: الباء حرف جر، والصبر اسم مجرور بالباء وعلامة جره الكسرة، والجار والمجرور متعلقان بـ(اسْتَعِينُوا).'
          },
          ambiguityOrNuance: 'Imam Ibn al-Qayyim in \'Uddat al-Sabirin notes that faith (Imān) consists of two halves: one half is patience (Sabr) and the other half is gratitude (Shukr).'
        },
        id: {
          meaning: 'Keseimbangan rohani tertinggi di bawah ketetapan takdir ilahi.',
          inContextExplanation: 'Konsep ma\'iyyah khassah menegaskan pertolongan khusus Allah bagi shabirin.',
          languageNote: {
            wordClass: 'Ism Masdar',
            grammarSyntax: 'جار ومجرور متعلق بفعل استعينوا.'
          }
        },
        fr: {
          meaning: 'Équanimité spirituelle souveraine et adhésion confiante au décret divin.',
          inContextExplanation: 'L\'affirmation finale confère la proximité divine secourable (Maiyyah Khassah).',
          languageNote: {
            wordClass: 'Nom',
            grammarSyntax: 'Préposition et nom au génitif.'
          }
        },
        ur: {
          meaning: 'رضا بالقضا اور ثباتِ قلب کی وہ معراج جو انسان کو معیتِ خاصہ کا مستحق بنا دے۔',
          inContextExplanation: 'بلاغت: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ" میں معیتِ خاصہ (نصرت و رحمت) کا مژدہ ہے۔',
          languageNote: {
            wordClass: 'اسم مصدر',
            grammarSyntax: 'إعراب: جار ومجرور متعلقان بالفعل (استعينوا).'
          }
        },
        tr: {
          meaning: 'İlahi takdir karşısında kalbi sükunet ve sadakatle koruma olgunluğu.',
          inContextExplanation: 'Ayetteki "Allah sabredenlerle beraberdir" müjdesi hususi yardım ve inayeti (Maiyyet-i Hassa) ifade eder.',
          languageNote: {
            wordClass: 'Mecrur İsim',
            grammarSyntax: 'Cer harfi ile mecrur.'
          }
        },
        ar: {
          meaning: 'كمال الرضا والتسليم والثبات، وهو شطر الإيمان الأكبر المقارن للشكر.',
          inContextExplanation: 'في البلاغة: ختم الآية بـ (إِنَّ اللَّهَ مَعَ الصَّابِرِينَ) يفيد المعية الخاصة، وهي معية النصرة والتأييد والمحبة، وهو أعظم ترغيب في التخلق بهذه الفضيلة.',
          languageNote: {
            wordClass: 'اسم مصدر',
            formOrPattern: 'فَعْل',
            grammarSyntax: 'جار ومجرور متعلقان بـ (اسْتَعِينُوا)، و(الصَّابِرِينَ) اسم مجرور بالياء لأنه جمع مذكر سالم.'
          }
        },
        de: {
          meaning: 'Vollkommenes spirituelles Gleichgewicht und Ergebenheit.',
          inContextExplanation: 'Der Versausgang verheißt den Standhaften den besonderen göttlichen Beistand (Maiyyah Khassah).',
          languageNote: {
            wordClass: 'Substantiv',
            grammarSyntax: 'Präpositionale Ergänzung zum Imperativ.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'sabr-q1',
        question: 'According to classical Islamic scholars like Ibn al-Qayyim, what are the three comprehensive categories of Sabr?',
        options: [
          'Patience in performing acts of obedience, patience in abstaining from sins, and patience under painful trials',
          'Patience with wealth, patience with health, and patience with youth',
          'Patience during the day, patience during the night, and patience at dawn',
          'Patience with friends, patience with enemies, and patience with strangers'
        ],
        correctIndex: 0,
        explanation: 'Classical scholars identify the three dimensions of Sabr: 1) Sabr on obedience (doing good even when difficult), 2) Sabr from disobedience (holding back from sinful desires), and 3) Sabr over painful decrees.',
        misconceptions: {
          1: 'Wealth and youth relate to gratitude and tests, not the tripartite theological classification of Sabr.',
          2: 'Time of day does not define the root types of patience.',
          3: 'Social interactions are sub-applications, not the foundational three categories.'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-sabr',
        title: 'Quranic Arabic Corpus - Root (ص ب ر)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=Sbr',
        citationText: 'Corpus Quran: Root (ص ب ر) occurs 103 times across noun and verb forms.'
      },
      {
        id: 'ibn-qayyim-uddat',
        title: '\'Uddat al-Sabirin wa Dhakhirat al-Shakirin',
        authorOrEditor: 'Imam Ibn Qayyim Al-Jawziyyah (d. 751 AH)',
        type: 'tafsir',
        citationText: 'Ibn Al-Qayyim: The linguistic analysis and theological depths of patience (Sabr) in the Quran.'
      }
    ]
  },
  {
    id: 'haqq',
    arabic: 'حَقّ',
    arabicSimple: 'حق',
    transliteration: 'Ḥaqq',
    transliterationNote: 'Truth, reality, justice, established fact, certainty, and rightful due.',
    rootArabic: 'ح ق ق',
    rootSimple: 'حقق',
    rootTransliteration: 'ḥ-q-q',
    rootGeneralMeaning: 'To be true, established, confirmed, inevitable, necessary, and just.',
    frequencyInQuran: 287,
    partOfSpeech: 'noun',
    partOfSpeechArabic: 'اسم (صفة مشبهة / مصدر)',
    category: 'core_theology',
    isVerified: true,
    verificationStatement: 'Verified against Tanzil Hafs Text, Quranic Arabic Corpus (Lemma ḥaqq), and Lane\'s Lexicon (Book 1, p. 605).',
    quranEdition: 'Medina Mushaf (Hafs \'an \'Asim)',
    primaryVerse: {
      surahNumber: 17,
      surahNameArabic: 'الإسراء',
      surahNameEnglish: 'The Night Journey',
      surahNameTransliteration: 'Al-Isra',
      ayahNumber: 81,
      arabicVerseText: 'وَقُلْ جَآءَ ٱلْحَقُّ وَزَهَقَ ٱلْبَـٰطِلُ ۚ إِنَّ ٱلْبَـٰطِلَ كَانَ زَهُوقًا',
      highlightedWord: 'ٱلْحَقُّ',
      translation: 'And say, "Truth has come, and falsehood has departed. Indeed, falsehood, [by nature], is bound to perish."',
      translationSource: 'Saheeh International (1997)',
      contextMeaning: 'The triumph of authentic divine truth, monotheism, and moral reality over transient illusions and idols.',
      audioReciter: 'Mahmoud Khalil Al-Husary (Murattal)',
      audioUrl: 'https://everyayah.com/data/Husary_128kbps/017081.mp3',
      audioSource: 'EveryAyah / Tanzil Public Dataset'
    },
    otherVerses: [
      {
        surahNumber: 22,
        surahNameArabic: 'الحج',
        surahNameEnglish: 'The Pilgrimage',
        surahNameTransliteration: 'Al-Hajj',
        ayahNumber: 6,
        arabicVerseText: 'ذَٰلِكَ بِأَنَّ ٱللَّهَ هُوَ ٱلْحَقُّ',
        highlightedWord: 'ٱلْحَقُّ',
        translation: 'That is because Allah is the Truth [the Reality]...',
        translationSource: 'Saheeh International',
        contextMeaning: 'Allah is the Absolute Reality whose existence, justice, and promises never fail or alter.'
      },
      {
        surahNumber: 51,
        surahNameArabic: 'الذاريات',
        surahNameEnglish: 'The Winnowing Winds',
        surahNameTransliteration: 'Adh-Dhariyat',
        ayahNumber: 19,
        arabicVerseText: 'وَفِىٓ أَمْوَٰلِهِمْ حَقٌّۭ لِّلسَّآئِلِ وَٱلْمَحْرُومِ',
        highlightedWord: 'حَقٌّۭ',
        translation: 'And in their wealth was a rightful share for the beggar and the deprived.',
        translationSource: 'Mustafa Khattab, The Clear Quran',
        contextMeaning: 'Legal and moral entitlement / duty (Zakat and charity owed to those in need).'
      }
    ],
    explanations: {
      beginner: {
        en: {
          meaning: 'Truth, reality, justice, and what is rightfully due.',
          isApproximate: true,
          inContextExplanation: 'In 17:81, Al-Haqq refers to the undeniable truth of Islam and worship of the One God prevailing over false idols.',
          languageNote: {
            rootArabic: 'ح ق ق',
            rootTransliteration: 'ḥ-q-q',
            rootMeaning: 'To be certain, firm, established.',
            wordClass: 'Noun (Masculine)',
            morphologySummary: 'Geminate root with doubled Qaf (مضعف).'
          },
          ambiguityOrNuance: 'Al-Haqq means both objective fact (truth vs lie) and moral obligation (right vs wrong).'
        },
        id: {
          meaning: 'Kebenaran, kenyataan yang pasti, hak, dan keadilan.',
          isApproximate: true,
          inContextExplanation: 'Dalam QS 17:81, Al-Haqq adalah kebenaran tauhid yang melenyapkan kebatilan.',
          languageNote: {
            wordClass: 'Kata Benda (Ism)',
            morphologySummary: 'Akar H-Q-Q (sesuatu yang kokoh dan pasti).'
          }
        },
        fr: {
          meaning: 'Vérité, réalité incontestable, justice et droit.',
          isApproximate: true,
          inContextExplanation: 'Dans 17:81, la Vérité divine triomphe et dissipe le mensonge éphémère.',
          languageNote: {
            wordClass: 'Nom',
            morphologySummary: 'Racine H-Q-Q.'
          }
        },
        ur: {
          meaning: 'حق، سچائی، انصاف، اور یقینی حقیقت۔',
          isApproximate: true,
          inContextExplanation: 'سورۃ الاسراء 17:81 میں حق کی آمد اور باطل کے مٹنے کا اعلان ہے۔',
          languageNote: {
            wordClass: 'اسم',
            morphologySummary: 'مادہ: ح ق ق (ثابت اور قائم ہونا)'
          }
        },
        tr: {
          meaning: 'Hak, gerçek, doğruluk, adalet ve sabit olan hakikat.',
          isApproximate: true,
          inContextExplanation: 'İsrâ 81\'de Hakkın gelişiyle batılın yok olup gittiği bildirilir.',
          languageNote: {
            wordClass: 'İsim',
            morphologySummary: 'H-K-K kökü.'
          }
        },
        ar: {
          meaning: 'الثابت الذي لا يزول ولا يتغير، الصدق والعدل والواجب.',
          isApproximate: false,
          inContextExplanation: 'في الإسراء 81: (جَاءَ الحَقُّ) أي دين الإسلام والتوحيد والقرآن، وزال الشرك والباطل.',
          languageNote: {
            wordClass: 'اسم (صفة مشبهة / مصدر)',
            morphologySummary: 'الجذر (ح ق ق) وهو مضعف ثلاثي.'
          }
        },
        de: {
          meaning: 'Wahrheit, Wirklichkeit, Gerechtigkeit und Recht.',
          isApproximate: true,
          inContextExplanation: 'In 17:81 siegt die göttliche Wahrheit über das vergängliche Falsche.',
          languageNote: {
            wordClass: 'Substantiv',
            morphologySummary: 'Wurzel H-Q-Q.'
          }
        }
      },
      intermediate: {
        en: {
          meaning: 'The unalterable, established ontological reality and moral justice.',
          isApproximate: false,
          inContextExplanation: 'In 17:81, "ٱلْحَقُّ" acts as the grammatical Fa\'il (subject) of the verb "جَآءَ" (has come), personified as a triumphant force dispelling falsehood (Al-Bāṭil).',
          languageNote: {
            rootArabic: 'ح ق ق',
            rootTransliteration: 'ḥ-q-q',
            rootMeaning: 'Subūt (الثبوت): firm establishment that withstands all doubt.',
            wordClass: 'Noun (Fa\'il of Jā\'a)',
            formOrPattern: 'Fa\'l (فَعْل)',
            morphologySummary: 'Geminate triliteral (ثلاثي مضعف).'
          },
          ambiguityOrNuance: 'Al-Haqq is one of the sublime Names of Allah (Al-Asmā\' al-Husnā), describing Him whose existence is necessary (Wajib al-Wujud) and whose speech is definitive truth.'
        },
        id: {
          meaning: 'Kenyataan ontologis yang kokoh dan keadilan moral yang tidak dapat dibantah.',
          inContextExplanation: 'Di QS 17:81, berkedudukan sebagai Fa\'il marfu\' dari fi\'il ja\'a.',
          languageNote: {
            wordClass: 'Ism Fa\'il Nahwi',
            morphologySummary: 'Muda\'af Tsulatsi (ح-ق-ق).'
          }
        },
        fr: {
          meaning: 'Réalité ontologique immuable et justice morale indiscutable.',
          inContextExplanation: 'En 17:81, sujet grammatical (Fa\'il) au cas nominatif.',
          languageNote: {
            wordClass: 'Sujet (Fa\'il)',
            morphologySummary: 'Racine géminée H-Q-Q.'
          }
        },
        ur: {
          meaning: 'وہ اٹل اور پائیدار سچائی جسے زوال نہ ہو۔',
          inContextExplanation: 'نحو: 17:81 میں فعلِ "جاء" کا فاعل ہے، جو حق کی فتح مندی کو ظاہر کرتا ہے۔',
          languageNote: {
            wordClass: 'فاعل مرفوع بالضمة',
            morphologySummary: 'مضعف ثلاثی (ح ق ق)'
          }
        },
        tr: {
          meaning: 'Varlığı kesin, sarsılmaz ontolojik hakikat ve adalet.',
          inContextExplanation: 'İsrâ 81\'de "câe" fiilinin merfu failidir.',
          languageNote: {
            wordClass: 'Fail İsim',
            morphologySummary: 'Mudaaf kök.'
          }
        },
        ar: {
          meaning: 'الموجود الثابت يقيناً المطابق للواقع، والموجب للواجبات.',
          inContextExplanation: 'في الإسراء 81: (الْحَقُّ) فاعل للفعل (جَاءَ) مرفوع بالضمة، وهو مقابل للباطل الزائل.',
          languageNote: {
            wordClass: 'فاعل مرفوع',
            formOrPattern: 'فَعْل',
            morphologySummary: 'ثلاثي مضعف العين واللام.'
          }
        },
        de: {
          meaning: 'Die unveränderliche, absolut feststehende Wirklichkeit.',
          inContextExplanation: 'In 17:81 ist Al-Haqq das grammatikalische Subjekt (Fa\'il).',
          languageNote: {
            wordClass: 'Substantiv (Subjekt)',
            morphologySummary: 'Schema Fa\'l.'
          }
        }
      },
      advanced: {
        en: {
          meaning: 'The Ultimate Metaphysical Reality (Al-Haqq Al-Mutlaq) and its epistemic coherence in revelation and cosmic order.',
          isApproximate: false,
          inContextExplanation: 'In 17:81, the dramatic contrast between "جَاءَ الْحَقُّ" and "زَهَقَ الْبَاطِلُ" employs Tibaq (antithesis). The verb "Zahaqa" literally means to breathe out one\'s last breath and perish irrecoverably, demonstrating that untruth possesses no inherent substance.',
          languageNote: {
            rootArabic: 'ح ق ق',
            rootTransliteration: 'ḥ-q-q',
            rootMeaning: 'الوجود الحقيقي الذي لا يقبل العدم ولا البطلان.',
            wordClass: 'اسم صفة مشبهة / مصدر',
            formOrPattern: 'Wazn: فَعْل',
            grammarSyntax: 'إعراب: فاعل للفعل (جَاءَ) مرفوع وعلامة رفعه الضمة الظاهرة.'
          },
          ambiguityOrNuance: 'In Usul al-Fiqh, Haqq is analyzed into: 1) Haqq Allah (pure divine right / public welfare), 2) Haqq al-\'Ibad (individual human rights and property), and 3) Joint rights where one aspect predominates.'
        },
        id: {
          meaning: 'Realitas metafisik mutlak dan koherensi epistemik kebenaran wahyu.',
          inContextExplanation: 'Balaghah thibaq (antitesis) antara Haqq yang abadi dan Batil yang fana.',
          languageNote: {
            wordClass: 'Ism Sifat Musyabbahah',
            grammarSyntax: 'فاعل مرفوع بالضمة.'
          }
        },
        fr: {
          meaning: 'Réalité métaphysique ultime et cohérence révélée.',
          inContextExplanation: 'Antithèse rhétorique (Tibaq) soulignant l\'inanité du faux devant la réalité de l\'Être divin.',
          languageNote: {
            wordClass: 'Nom substantif',
            grammarSyntax: 'Sujet verbal (Fa\'il).'
          }
        },
        ur: {
          meaning: 'حقیقتِ مطلقہ اور وحی کا وہ کامل نظام جس میں باطل کی ملاوٹ ممکن نہ ہو۔',
          inContextExplanation: 'بلاغت: "طباقِ ایجاب" (جاء الحق / زهق الباطل) حق کی ابدیت اور باطل کے بے بنیاد ہونے کو آشکار کرتا ہے۔',
          languageNote: {
            wordClass: 'اسم / فاعل',
            grammarSyntax: 'إعراب: فاعل مرفوع بالضمة الظاهرة.'
          }
        },
        tr: {
          meaning: 'Mutlak ontolojik hakikat ve ilahi adaletin bizzat kendisi.',
          inContextExplanation: 'Tıbâk sanatı ile hakkın sürekliliği ve bâtılın zevale mahkumiyeti vurgulanır.',
          languageNote: {
            wordClass: 'Sıfat-ı Müşebbehe',
            grammarSyntax: 'Fail merfu.'
          }
        },
        ar: {
          meaning: 'الحق المطلق سبحانه، وكلامه الحق، ودينه الحق، والوعد والوعيد والجنة والنار حق.',
          inContextExplanation: 'في البلاغة: المقابلة والطباق بين (جاء الحق) و(زهق الباطل). وفعل (زَهَقَ) أصله خروج الروح، مما يدل على أن الباطل ميت بطبعه لا قوام له أمام نور الحق.',
          languageNote: {
            wordClass: 'اسم صفة مشبهة',
            formOrPattern: 'فَعْل',
            grammarSyntax: 'فاعل مرفوع بالضمة الظاهرة.'
          }
        },
        de: {
          meaning: 'Die absolute ontologische Wirklichkeit und vollkommene Gerechtigkeit.',
          inContextExplanation: 'Rhetorischer Gegensatz (Tibaq) zwischen der ewigen Wahrheit und der Nichtigkeit des Falschen.',
          languageNote: {
            wordClass: 'Substantiv',
            grammarSyntax: 'Subjekt im Nominativ.'
          }
        }
      }
    },
    practiceQuestions: [
      {
        id: 'haqq-q1',
        question: 'In Surah Adh-Dhariyat (51:19), "And in their wealth was a Ḥaqq (حَقّ) for the petitioner and deprived", what does "Ḥaqq" mean in this economic context?',
        options: [
          'A theoretical philosophical puzzle',
          'A recognized moral and legal entitlement/share (charity and Zakat owed to the needy)',
          'A physical gold coin stored in a treasure vault',
          'An optional gift with no spiritual obligation'
        ],
        correctIndex: 1,
        explanation: 'In 51:19, Ḥaqq signifies an established rightful share and entitlement due to those in need, underscoring that charity is the rightful due of the poor, not just a condescending favor.',
        misconceptions: {
          0: 'Haqq here is financial and legal, not an abstract philosophical theory.',
          2: 'It refers to the share of wealth, not specific currency names.',
          3: 'The use of "Haqq" elevates charity to a divine right and duty rather than mere casual optional aid.'
        }
      }
    ],
    sources: [
      {
        id: 'corpus-haqq',
        title: 'Quranic Arabic Corpus - Root (ح ق ق)',
        authorOrEditor: 'Kais Dukes, University of Leeds',
        type: 'corpus',
        url: 'https://corpus.quran.com/qurandictonary.jsp?q=Hqq',
        citationText: 'Corpus Quran: Root (ح ق ق) occurs 287 times.'
      },
      {
        id: 'lane-haqq',
        title: 'Arabic-English Lexicon (Book 1, p. 605)',
        authorOrEditor: 'Edward William Lane',
        type: 'lexicon',
        url: 'https://ejtaal.net/aa/#hw4=233,ll=648',
        citationText: 'Lane\'s Lexicon: "حَقّ: It was, or became, right, just, incumbent, verified, authentic, real, true."'
      }
    ]
  }
];

import { ADDITIONAL_VERIFIED_WORDS } from './moreVocab';

export const ALL_VERIFIED_WORDS: QuranWord[] = [
  ...VERIFIED_WORDS,
  ...ADDITIONAL_VERIFIED_WORDS
];

export const getWordById = (id: string): QuranWord | undefined => {
  return ALL_VERIFIED_WORDS.find(w => w.id === id);
};

