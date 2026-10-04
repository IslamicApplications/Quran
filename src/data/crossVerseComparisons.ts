import { CrossVerseComparison } from '../types';

export const CROSS_VERSE_COMPARISONS: CrossVerseComparison[] = [
  {
    id: 'comp-kitab',
    wordArabic: 'كِتَاب',
    transliteration: 'Kitāb',
    rootArabic: 'ك ت ب',
    theme: 'Semantic Range of "Kitāb" Across Different Verses',
    summary: 'While modern readers equate "Kitāb" with a physical printed book, the Quran employs this root across five distinct semantic categories: revealed scripture, the celestial master tablet, the personal deed registry, written contracts, and binding legal decrees.',
    verses: [
      {
        surahNumber: 2,
        ayahNumber: 2,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        verseArabic: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ',
        highlighted: 'ٱلْكِتَـٰبُ',
        translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.',
        translationAttribution: 'Saheeh International',
        meaningInThisVerse: 'The Holy Quran / Revealed Scripture',
        scholarlyReasoning: 'Here Al-Kitāb with the definite article refers to the revealed text of the Quran compiled and recited.',
        tafsirSource: 'Tafsir Ibn Kathir & Al-Tabari'
      },
      {
        surahNumber: 17,
        ayahNumber: 14,
        surahNameArabic: 'الإسراء',
        surahNameEnglish: 'The Night Journey',
        verseArabic: 'ٱقْرَأْ كِتَـٰبَكَ كَفَىٰ بِنَفْسِكَ ٱلْيَوْمَ عَلَيْكَ حَسِيبًا',
        highlighted: 'كِتَـٰبَكَ',
        translation: '[It will be said], "Read your record. Sufficient is yourself against you this Day as accountant."',
        translationAttribution: 'Saheeh International',
        meaningInThisVerse: 'Personal Registry / Ledger of Deeds',
        scholarlyReasoning: 'Addressed to the resurrected human soul on Judgment Day, referring to the angels\' record of their lifetime actions.',
        tafsirSource: 'Tafsir Al-Jalalayn & Al-Qurtubi'
      },
      {
        surahNumber: 13,
        ayahNumber: 39,
        surahNameArabic: 'الرعد',
        surahNameEnglish: 'The Thunder',
        verseArabic: 'يَمْحُوا۟ ٱللَّهُ مَا يَشَآءُ وَيُثْبِتُ ۖ وَعِندَهُۥٓ أُمُّ ٱلْكِتَـٰبِ',
        highlighted: 'أُمُّ ٱلْكِتَـٰبِ',
        translation: 'Allah eliminates what He wills or confirms, and with Him is the Mother of the Book.',
        translationAttribution: 'Saheeh International',
        meaningInThisVerse: 'The Preserved Celestial Tablet (Al-Lawḥ Al-Maḥfūẓ)',
        scholarlyReasoning: 'Umm al-Kitab here denotes the primordial source and unalterable divine register of all decrees.',
        tafsirSource: 'Tafsir Al-Sa\'di'
      },
      {
        surahNumber: 2,
        ayahNumber: 183,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        verseArabic: 'يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ',
        highlighted: 'كُتِبَ',
        translation: 'O you who have believed, decreed upon you is fasting...',
        translationAttribution: 'Saheeh International',
        meaningInThisVerse: 'Binding Divine Obligation / Mandate',
        scholarlyReasoning: 'The passive verb "Kutiba" denotes an ordained, obligatory legal commandment (Fard/Wujūb).',
        tafsirSource: 'Tafsir Al-Baghawi'
      }
    ]
  },
  {
    id: 'comp-fitnah',
    wordArabic: 'فِتْنَة',
    transliteration: 'Fitnah',
    rootArabic: 'ف ت ن',
    theme: 'Nuances of "Fitnah": From Smelting Gold to Persecution, Trials, and Civil Strife',
    summary: 'The root F-T-N originally described placing gold or silver into fire to melt away impurities. In the Quran, Fitnah ranges from the test of worldly blessings to severe religious persecution and divine spiritual examinations.',
    verses: [
      {
        surahNumber: 2,
        ayahNumber: 193,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        verseArabic: 'وَقَـٰتِلُوهُمْ حَتَّىٰ لَا تَكُونَ فِتْنَةٌۭ وَيَكُونَ ٱلدِّينُ لِلَّهِ',
        highlighted: 'فِتْنَةٌۭ',
        translation: 'Fight them until there is no [more] persecution and [until] religion is for Allah.',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'Religious Persecution & Forced Apostasy / Idolatry',
        scholarlyReasoning: 'In the context of the early Muslims facing torture in Makkah, Fitnah here signifies persecuting believers away from their faith or polytheism (Shirk).',
        tafsirSource: 'Tafsir Ibn Kathir & Al-Tabari'
      },
      {
        surahNumber: 64,
        ayahNumber: 15,
        surahNameArabic: 'التغابن',
        surahNameEnglish: 'The Mutual Disillusion',
        verseArabic: 'إِنَّمَآ أَمْوَٰلُكُمْ وَأَوْلَـٰدُكُمْ فِتْنَةٌۭ ۚ وَٱللَّهُ عِندَهُۥٓ أَجْرٌ عَظِيمٌۭ',
        highlighted: 'فِتْنَةٌۭ',
        translation: 'Your wealth and your children are but a trial, and Allah has with Him a great reward.',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'A Moral Test of Loyalty and Stewardship',
        scholarlyReasoning: 'Wealth and family are blessings that test whether a believer remains grateful and adheres to divine law or becomes distracted from righteousness.',
        tafsirSource: 'Tafsir Al-Sa\'di'
      },
      {
        surahNumber: 85,
        ayahNumber: 10,
        surahNameArabic: 'البروج',
        surahNameEnglish: 'The Constellations',
        verseArabic: 'إِنَّ ٱلَّذِينَ فَتَنُوا۟ ٱلْمُؤْمِنِينَ وَٱلْمُؤْمِنَـٰتِ ثُمَّ لَمْ يَتُوبُوا۟ فَلَهُمْ عَذَابُ جَهَنَّمَ',
        highlighted: 'فَتَنُوا۟',
        translation: 'Indeed, those who have tortured the believing men and believing women and then have not repented will have the punishment of Hell...',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'Physical Torture / Burning in Fire (People of the Ditch)',
        scholarlyReasoning: 'Direct linguistic connection to the physical root: casting believers into the fiery trench.',
        tafsirSource: 'Tafsir Al-Qurtubi'
      }
    ]
  },
  {
    id: 'comp-ummah',
    wordArabic: 'أُمَّة',
    transliteration: 'Ummah',
    rootArabic: 'أ م م',
    theme: 'Semantic Facets of "Ummah": Community, Solitary Paradigm, Time Span, and Tribe',
    summary: 'The word Ummah extends far beyond modern concepts of nationhood or ethnicity. In the Quran, it describes a global faith collective, an exemplary lone individual, a defined historical era, or a specific animal genus.',
    verses: [
      {
        surahNumber: 2,
        ayahNumber: 143,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        verseArabic: 'وَكَذَٰلِكَ جَعَلْنَـٰكُمْ أُمَّةًۭ وَسَطًۭا لِّتَكُونُوا۟ شُهَدَآءَ عَلَى ٱلنَّاسِ',
        highlighted: 'أُمَّةًۭ',
        translation: 'And thus We have made you a just community that you will be witnesses over the people...',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'The Just Global Islamic Community',
        scholarlyReasoning: 'Refers to the collective body of believers called to balance, moral moderation (Wasat), and ethical leadership.',
        tafsirSource: 'Tafsir Ibn Kathir'
      },
      {
        surahNumber: 16,
        ayahNumber: 120,
        surahNameArabic: 'النحل',
        surahNameEnglish: 'The Bee',
        verseArabic: 'إِنَّ إِبْرَٰهِيمَ كَانَ أُمَّةًۭ قَانِتًۭا لِّلَّهِ حَنِيفًۭا',
        highlighted: 'أُمَّةًۭ',
        translation: 'Indeed, Abraham was a [comprehensive] leader [Ummah], devoutly obedient to Allah, inclining toward truth...',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'A Single Individual Embodying an Entire Nation of Virtues',
        scholarlyReasoning: 'Prophet Ibrahim (peace be upon him) is described as an Ummah because he stood alone upon monotheism when all humanity around him was idol-worshipping, gathering every virtue of an entire nation in one soul.',
        tafsirSource: 'Ibn Abbas / Tafsir Al-Tabari'
      },
      {
        surahNumber: 11,
        ayahNumber: 8,
        surahNameArabic: 'هود',
        surahNameEnglish: 'Hud',
        verseArabic: 'وَلَئِنْ أَخَّرْنَا عَنْهُمُ ٱلْعَذَابَ إِلَىٰٓ أُمَّةٍۢ مَّعْدُودَةٍۢ',
        highlighted: 'أُمَّةٍۢ',
        translation: 'And if We hold back from them the punishment until a determined period [Ummah]...',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'A Fixed Span / Duration of Time',
        scholarlyReasoning: 'Here Ummah denotes a designated chronological period or era.',
        tafsirSource: 'Tafsir Al-Jalalayn & Lane\'s Lexicon'
      },
      {
        surahNumber: 6,
        ayahNumber: 38,
        surahNameArabic: 'الأنعام',
        surahNameEnglish: 'The Cattle',
        verseArabic: 'وَمَا مِن دَآبَّةٍۢ فِى ٱلْأَرْضِ وَلَا طَـٰٓئِرٍۢ يَطِيرُ بِجَنَاحَيْهِ إِلَّآ أُمَمٌ أَمْثَالُكُم',
        highlighted: 'أُمَمٌ',
        translation: 'And there is no creature on [or within] the earth or bird that flies with its wings except that they are communities [Umam] like you.',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'Animal Species & Biological Communities',
        scholarlyReasoning: 'Demonstrates ecological consciousness in the Quran: animal and bird species live in organized social systems analogous to human communities.',
        tafsirSource: 'Tafsir Al-Sa\'di'
      }
    ]
  },
  {
    id: 'comp-salah',
    wordArabic: 'صَلَاة',
    transliteration: 'Ṣalāh',
    rootArabic: 'ص ل و',
    theme: 'Meanings of "Ṣalāh": Ritual Worship, Divine Mercy, Angelic Forgiveness, and Supplication',
    summary: 'Ṣalāh in Islamic jurisprudence is the five daily ritual prayers. In Quranic Arabic, however, the root encompasses connection (Silah), divine benediction, angelic istighfar, and personal supplication (Du\'a).',
    verses: [
      {
        surahNumber: 2,
        ayahNumber: 45,
        surahNameArabic: 'البقرة',
        surahNameEnglish: 'The Cow',
        verseArabic: 'وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى ٱلْخَـٰشِعِينَ',
        highlighted: 'وَٱلصَّلَوٰةِ',
        translation: 'And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive [to Allah].',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'The Prescribed Canonical Ritual Prayer',
        scholarlyReasoning: 'The formal pillar of worship consisting of standing, bowing, prostration, and remembrance.',
        tafsirSource: 'Tafsir Ibn Kathir'
      },
      {
        surahNumber: 33,
        ayahNumber: 56,
        surahNameArabic: 'الأحزاب',
        surahNameEnglish: 'The Combined Forces',
        verseArabic: 'إِنَّ ٱللَّهَ وَمَلَـٰٓئِكَتَهُۥ يُصَلُّونَ عَلَى ٱلنَّبِىِّ ۚ يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ صَلُّوا۟ عَلَيْهِ وَسَلِّمُوا۟ تَسْلِيمًا',
        highlighted: 'يُصَلُّونَ',
        translation: 'Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to forgive him]. O you who have believed, ask [Allah to confer] blessing upon him and ask [Allah to grant him] peace.',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'Divine Praise/Mercy from Allah, Angelic Supplication, and Believers\' Invocation of Blessings',
        scholarlyReasoning: 'Scholars clarify: Ṣalāh from Allah is mercy and exaltation in the highest gathering; from angels it is seeking forgiveness (Istighfar); and from humans it is supplication and reverence.',
        tafsirSource: 'Abul-\'Aliyah / Sahih al-Bukhari & Tafsir Ibn Kathir'
      },
      {
        surahNumber: 9,
        ayahNumber: 103,
        surahNameArabic: 'التوبة',
        surahNameEnglish: 'The Repentance',
        verseArabic: 'خُذْ مِنْ أَمْوَٰلِهِمْ صَدَقَةًۭ تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَوٰتَكَ سَكَنٌۭ لَّهُمْ',
        highlighted: 'وَصَلِّ عَلَيْهِمْ',
        translation: 'Take, [O Muhammad], from their wealth a charity by which you purify them and cause them increase, and invoke [Allah\'s blessings] upon them. Indeed, your invocations are reassurance for them.',
        translationSource: 'Saheeh International',
        meaningInThisVerse: 'Personal Supplication (Du\'a) for Serenity and Blessing',
        scholarlyReasoning: 'Here "Ṣalli \'alayhim" literally means: make du\'a for them, bringing peace and tranquility to their hearts upon giving charity.',
        tafsirSource: 'Tafsir Al-Sa\'di & Al-Tabari'
      }
    ]
  }
];
