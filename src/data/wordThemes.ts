import type { QuranWord } from '../types';

/**
 * Theme of any Quranic word, for filtering a surah's word list by the same themes as the detailed lessons.
 * A word takes its lemma's theme if listed, otherwise its root's; words of neither (particles, everyday
 * nouns and verbs) belong to no theme. Keys are corpus lemmas and roots (as in public/data/morphology),
 * matched after NFC.
 */
export type WordTheme = Extract<
  QuranWord['category'],
  'divine_names' | 'core_theology' | 'guidance_knowledge' | 'character_ethics' | 'worship_devotion'
>;

const words = (theme: WordTheme, list: string) => list.split(' ').map((w) => [w.normalize('NFC'), theme] as const);

// Names and attributes of Allah, and the words whose root has a wider everyday sense
const LEMMAS = new Map<string, WordTheme>([
  ...words(
    'divine_names',
    'اللَّه إِلٰه اللَّهُمَّ رَبّ رَحْمٰن رَحِيم أَرْحَم عَلِيم عَلّام حَكِيم عَزِيز غَفُور غَفّار غافِر قَدِير مُقْتَدِر سَمِيع بَصِير خَبِير مَلِك مَلِيك مالِك قُدُّوس صَمَد حَمِيد غَنِيّ حَلِيم تَوّاب وَدُود عَلِيّ مُتَعال عَظِيم قَوِيّ لَطِيف واسِع وَكِيل حَيّ قَيُّوم بارِئ خالِق خَلّاق مُصَوِّر وَهّاب رازِق رَزّاق فَتّاح رَءُوف جَبّار مُتَكَبِّر سَلام قاهِر قَهّار شَكُور حَفِيظ رَقِيب مُجِيب مَجِيد مَوْلَى نَصِير حَسِيب تَبارَكَ سُبْحان'
  ),
  ...words(
    'core_theology',
    'عالَم يَوْم آخِر قِيامَة ساعَة جَنَّة نار حِساب جِنّ جانّ مَلَك مَلَكُوت مُنافِق مُنافِقَة نِفاق نافَقُ'
  ),
  ...words(
    'guidance_knowledge',
    'آيَة بَيِّنَة بَيَّنَ بَيان تِبْيان مُبِين نُور ظُلُمَة حِكْمَة فُرْقان حَدِيث قَصَص مَثَل بُشْرَى بَشِير بُشِّرَ مُبَشِّر مُبَشِّرَة صِراط مُسْتَقِيم سَبِيل بَلاغ مُحَمَّد أَحْمَد'
  ),
  ...words('character_ethics', 'اسْتَكْبَرَ مُسْتَكْبِر يَتَكَبَّرُ كِبْر اسْتِكْبار رَحِمَ رَحْمَة مَرْحَمَة رُحْم'),
  ...words(
    'worship_devotion',
    'كَبِّرْ تَكْبِير أَنفَقَ نَفَقَة مُنفِق إِنفاق صَدَقَة تَصَدَّقَ مُتَصَدِّق مُتَصَدِّقَة حَمْد حَجّ حِجّ حَجَّ حاجّ مَسْجِد قِبْلَة غَفَرَ اسْتَغْفَرَ مُسْتَغْفِر اسْتِغْفار مَغْفِرَة غُفْران'
  )
]);

const ROOTS = new Map<string, WordTheme>([
  ...words(
    'core_theology',
    'أمن كفر شرك حقق بطل كذب غيب بعث حشر عذب جزي خلد جحم ثوب خلق موت حيي ريب يقن شفع عرش قدر شطن دين وحد قضي نشر أجل نعم رزق'
  ),
  ...words(
    'guidance_knowledge',
    'هدي ضلل كتب نزل رسل نبأ وحي قرأ علم حكم عقل فقه فكر نذر تلو وعظ رشد غوي برهن شرع فهم دبر بصر'
  ),
  ...words(
    'character_ethics',
    'صبر صدق ظلم حسن سوأ خير شرر صلح فسد قلب نفس وقي خوف خشي حبب عدل قسط برر فحش أثم ذنب خطأ فسق طغي بغي حسد غضب رضو شكر هوي غرر وفي عهد خلص عفو حزن سرف جهل حلم ودد يتم كرم ذلل رحم صدد خون كتم'
  ),
  ...words('worship_devotion', 'عبد صلو سجد ركع زكو صوم سبح دعو توب حمد قنت خشع سلم وكل طوع طهر نسك ضرع جهد ذكر عون')
]);

export const themeOfWord = (lemma: string, root?: string): WordTheme | undefined =>
  LEMMAS.get(lemma.normalize('NFC')) ?? (root ? ROOTS.get(root.normalize('NFC')) : undefined);
