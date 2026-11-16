/*
 * Recommendation knowledge base — personalised nutrition, exercise and lifestyle advice.
 *
 * EDIT THE ADVICE HERE. Three parts:
 *   SOURCES          — where each piece of advice comes from (shown under each recommendation)
 *   RECOMMENDATIONS  — every piece of advice the app can show
 *   FEATURE_RULES    — which advice each model feature adds (keys match the model's input fields)
 *
 * getRecommendations({ score, input, shap }) takes the model's output:
 *   score — risk score 0–100 · input — the user's feature values · shap — [{ feature, value }]
 * and returns the user's own list, grouped by category and ordered by importance.
 * It does not need the trained model to be tested: a mock score and SHAP list work the same way.
 */

export const SOURCES = {
  S01: {
    short: 'International PCOS Guideline 2023',
    citation: 'H. J. Teede et al., "Recommendations from the 2023 International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome," Human Reproduction, vol. 38, no. 9, pp. 1655–1679, 2023.',
    url: 'https://doi.org/10.1093/humrep/dead156',
  },
  S02: {
    short: 'WHO Healthy diet fact sheet',
    citation: 'World Health Organization, "Healthy diet," Fact sheet, 2026.',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
  },
  S03: {
    short: 'WHO Physical activity guidelines 2020',
    citation: 'World Health Organization, WHO Guidelines on Physical Activity and Sedentary Behaviour. Geneva: WHO, 2020.',
    url: 'https://www.who.int/publications/i/item/9789240015128',
  },
  S04: {
    short: 'Patten et al. 2020 (exercise in PCOS)',
    citation: 'R. K. Patten et al., "Exercise interventions in polycystic ovary syndrome: a systematic review and meta-analysis," Frontiers in Physiology, vol. 11, art. no. 606, 2020.',
    url: 'https://doi.org/10.3389/fphys.2020.00606',
  },
  S05: {
    short: 'Pakistan Dietary Guidelines 2018',
    citation: 'Ministry of Planning, Development and Reform and FAO, Pakistan Dietary Guidelines for Better Nutrition. Islamabad, 2018.',
    url: 'https://faolex.fao.org/docs/pdf/pak191272.pdf',
  },
  S06: {
    short: 'Shang et al. 2020 (diet and insulin resistance)',
    citation: 'Y. Shang, H. Zhou, M. Hu, and H. Feng, "Effect of diet on insulin resistance in polycystic ovary syndrome," Journal of Clinical Endocrinology & Metabolism, 2020.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32621748/',
  },
  S07: {
    short: 'Juhász et al. 2024 (ranking diets for PCOS)',
    citation: 'A. E. Juhász et al., "Ranking the dietary interventions by their effectiveness in the management of polycystic ovary syndrome: a systematic review and network meta-analysis," Reproductive Health, 2024.',
    url: 'https://doi.org/10.1186/s12978-024-01758-5',
  },
  S08: {
    short: 'Manta et al. 2023 (GI and PCOS)',
    citation: 'A. Manta et al., "Glycemic index and glycemic load estimates in the dietary approach of polycystic ovary syndrome," Nutrients, vol. 15, no. 15, art. no. 3483, 2023.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10421037/',
  },
  S09: {
    short: 'Watson et al. 2015 (adult sleep)',
    citation: 'N. F. Watson et al., "Recommended amount of sleep for a healthy adult: a joint consensus statement of the American Academy of Sleep Medicine and Sleep Research Society," Sleep, vol. 38, no. 6, pp. 843–844, 2015.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4434546/',
  },
  S10: {
    short: 'Zhang et al. 2025 (fibre and low-GI in PCOS)',
    citation: 'L. Zhang et al., "Optimizing carbohydrate quality: a path to better health for women with PCOS," Frontiers in Nutrition, vol. 12, art. no. 1578459, 2025.',
    url: 'https://doi.org/10.3389/fnut.2025.1578459',
  },
  S11: {
    short: 'Zou et al. 2026 (exercise in PCOS)',
    citation: 'K. Zou et al., "The effect of exercise on reproductive and metabolic outcomes in women with polycystic ovary syndrome: a systematic review and meta-analysis," Journal of Obstetrics and Gynaecology Research, vol. 52, no. 9, art. no. e70477, 2026.',
    url: 'https://doi.org/10.1111/jog.70477',
  },
  S12: {
    short: 'Zhao et al. 2025 (HIIT vs moderate exercise)',
    citation: 'Y. Zhao et al., "High-intensity interval training versus moderate-intensity continuous training for polycystic ovary syndrome: a meta-analysis of randomized controlled trials," Frontiers in Endocrinology, vol. 16, art. no. 1672257, 2025.',
    url: 'https://doi.org/10.3389/fendo.2025.1672257',
  },
  S13: {
    short: 'Tan et al. 2025 (exercise types network meta-analysis)',
    citation: 'Y. Tan et al., "The effects of different exercises on insulin resistance and testosterone changes in women with polycystic ovarian syndrome: a network meta-analysis study," Healthcare, vol. 13, no. 17, art. no. 2132, 2025.',
    url: 'https://doi.org/10.3390/healthcare13172132',
  },
  S14: {
    short: 'Gautam et al. 2025 (lifestyle interventions in PCOS)',
    citation: 'R. Gautam et al., "The role of lifestyle interventions in PCOS management: a systematic review," Nutrients, vol. 17, no. 2, art. no. 310, 2025.',
    url: 'https://doi.org/10.3390/nu17020310',
  },
  S15: {
    short: 'Akbaş et al. 2026 (nutrition interventions in PCOS)',
    citation: 'E. Akbaş, M. Samancı, and Y. Ertaş Öztürk, "Nutrition interventions in women with polycystic ovary syndrome: a systematic review," European Journal of Nutrition, vol. 65, no. 5, art. no. 176, 2026.',
    url: 'https://doi.org/10.1007/s00394-026-04030-7',
  },
  S16: {
    short: 'WHO waist-hip ratio report',
    citation: 'World Health Organization, Waist Circumference and Waist–Hip Ratio: Report of a WHO Expert Consultation. Geneva: WHO, 2011.',
    url: 'https://www.who.int/publications/i/item/9789241501491',
  },
};

/*
 * category: 'nutrition' | 'exercise' | 'lifestyle' | 'safety'
 * text = what the user reads (one action, simple words) · how = a practical way to do it
 * sources = keys of SOURCES · ref = section in the source (for the report / reviewer)
 */
export const RECOMMENDATIONS = [
  // ---------------------------------------------------------------- nutrition
  { id: 'N-01', category: 'nutrition', title: 'No single PCOS diet',
    text: 'There is no one special diet for PCOS. A balanced diet from all food groups is what helps.',
    how: 'Have roti or rice, vegetables, fruit, daal or meat, and milk or yogurt across the day.',
    sources: ['S01', 'S05', 'S15'], ref: 'S01 3.3.1–3.3.2; S15: no single ideal diet' },
  { id: 'N-02', category: 'nutrition', title: 'More vegetables and fruit',
    text: 'Eat at least 5 handfuls of vegetables and fruit every day.',
    how: 'Add salad or sabzi to lunch and dinner, and keep fruit for snacks.',
    sources: ['S02'], ref: 'At least 400 g a day' },
  { id: 'N-03', category: 'nutrition', title: 'Choose whole grains',
    text: 'Pick whole-wheat roti, daliya or brown rice more often than white flour and white rice.',
    how: 'Use chakki atta, and swap maida bread and naan for whole-wheat options.',
    sources: ['S02'], ref: 'Carbohydrates mainly from whole grains' },
  { id: 'N-04', category: 'nutrition', title: 'Cut down on sugar',
    text: 'Keep added sugar low. Sweet chai, mithai and soft drinks add a lot of it.',
    how: 'Lower the sugar in your chai a little each week, and keep mithai for special days.',
    sources: ['S02'], ref: 'Free sugars under 10% of energy' },
  { id: 'N-05', category: 'nutrition', title: 'Less fried and fast food',
    text: 'Have fried and fast food less often. Home-cooked meals are usually the better choice.',
    how: 'Bake, grill, boil or steam instead of deep frying; cut back on samosa, pakora and burgers.',
    sources: ['S02', 'S05'], ref: 'S02 practical tips; S05 dietary messages' },
  { id: 'N-06', category: 'nutrition', title: 'Better cooking fats',
    text: 'Use less ghee and butter, and cook with small amounts of vegetable oil instead.',
    how: 'Measure oil with a spoon rather than pouring it.',
    sources: ['S02'], ref: 'Fats' },
  { id: 'N-07', category: 'nutrition', title: 'Less salt',
    text: 'Keep salt under one teaspoon a day, including salt used in cooking.',
    how: 'Add less salt while cooking and cut back on pickles and salty snacks.',
    sources: ['S02'], ref: 'Salt under 5 g a day' },
  { id: 'N-08', category: 'nutrition', title: 'Daal, chana and fibre',
    text: 'Eat pulses like daal, chana and lobia often. They are filling and high in fibre.',
    how: 'Have pulses at least once a day, and add vegetables to your daal.',
    sources: ['S02', 'S10'], ref: 'S02 fibre at least 25 g a day; S10 high-fibre diets lowered HOMA-IR in PCOS' },
  { id: 'N-09', category: 'nutrition', title: 'Whole fruit over juice',
    text: 'Eat whole fruit instead of drinking fruit juice.',
    how: 'Even fresh juice is high in sugar, so keep it for once in a while.',
    sources: ['S02'], ref: 'Practical tips' },
  { id: 'N-10', category: 'nutrition', title: 'Try a DASH-style pattern',
    text: 'Eating more vegetables, fruit, whole grains, pulses and low-fat dairy, with less salt and sugar, may help with insulin resistance.',
    how: 'Choose low-fat milk and yogurt, and build meals around sabzi and daal.',
    caution: 'This is one helpful option, not a cure. No diet is proven best for PCOS.',
    sources: ['S06', 'S07', 'S14', 'S01'], ref: 'S06, S07 abstracts; S14 conclusion; S01 3.3.1' },
  { id: 'N-11', category: 'nutrition', title: 'Steadier carbs',
    text: 'Pair carbs with protein or fibre, and choose slower carbs like whole grains and pulses, to keep blood sugar steadier.',
    how: 'Eat roti with daal or sabzi, not on its own; check foods in the Food Checker.',
    caution: 'This is one helpful option, not a cure.',
    sources: ['S10', 'S08', 'S01'], ref: 'S10 low-GI lowered HOMA-IR (small effect); S08 conclusion; S01 3.3.1' },
  { id: 'N-12', category: 'nutrition', title: 'Small, steady weight change',
    text: 'If you carry extra weight, losing even a small amount can improve your health.',
    how: 'Aim for slow, steady change and do not skip meals. A dietitian can set a target that suits you.',
    sources: ['S01'], ref: 'S01 3.1.2, 3.1.6' },
  { id: 'N-13', category: 'nutrition', title: 'Healthy eating, not dieting',
    text: 'Your weight is not the issue here. Focus on healthy, regular meals rather than losing weight.',
    how: 'Eat three balanced meals and avoid skipping breakfast.',
    sources: ['S01'], ref: 'S01 3.1.9' },
  { id: 'N-14', category: 'nutrition', title: 'Avoid crash diets',
    text: 'Avoid very strict or crash diets. They are hard to keep up and can harm your health.',
    how: 'Make one or two small changes at a time. Very low-carb (keto) diets are hard to keep up and are not advised long term.',
    sources: ['S01', 'S14'], ref: 'S01 3.3.3, 2.5.1; S14 on ketogenic diets' },
  { id: 'N-15', category: 'nutrition', title: 'Healthier family meals',
    text: 'Keep the foods you love and make lighter versions of them with your family.',
    how: 'Cook family meals with less oil, sugar and salt instead of cooking separately.',
    sources: ['S01'], ref: 'S01 3.3.3–3.3.4' },

  // ---------------------------------------------------------------- exercise
  { id: 'E-01', category: 'exercise', title: 'Start small',
    text: 'Any movement helps. Start with 10 minutes at a time and build up to 30 minutes on most days.',
    how: 'Three 10-minute walks after meals count as 30 minutes.',
    sources: ['S01'], ref: 'S01 3.4.3, 3.4.5' },
  { id: 'E-02', category: 'exercise', title: 'Weekly activity goal',
    text: 'Aim for 150–300 minutes of moderate activity, like brisk walking, each week.',
    how: 'For example, a 30-minute brisk walk on 5 days.',
    sources: ['S01', 'S03', 'S11'], ref: 'S01 3.4.3; S11: 150+ min/week gave larger testosterone drops' },
  { id: 'E-03', category: 'exercise', title: 'More activity for weight change',
    text: 'To help with weight, aim for at least 250 minutes of moderate activity a week.',
    how: 'Build up slowly from where you are now.',
    sources: ['S01'], ref: 'S01 3.4.3' },
  { id: 'E-04', category: 'exercise', title: 'Strength training twice a week',
    text: 'Do muscle-strengthening exercises on 2 days a week, with a rest day in between.',
    how: 'Squats, wall push-ups, lunges or resistance bands at home.',
    caution: 'Learn the correct form first.',
    sources: ['S01', 'S03'], ref: 'S01 3.4.3' },
  { id: 'E-05', category: 'exercise', title: 'Short on time? Try harder sessions',
    text: 'Short bursts of harder exercise (interval training) give benefits similar to longer moderate exercise, in less time. Both work.',
    how: 'For example, 1 minute of fast stair climbing or skipping, then 1–2 minutes of slow walking, repeated for 20 minutes.',
    caution: 'Build up gradually. Check with a doctor first if you have a heart, joint or other health problem.',
    sources: ['S12', 'S11', 'S04', 'S01'], ref: 'S12: HIIT not better than moderate, less time; S11: types similar; S04; S01 3.4.1' },
  { id: 'E-06', category: 'exercise', title: 'Everyday activity counts',
    text: 'Housework, walking to the shops and taking the stairs all count as activity.',
    how: 'If going out is hard, try a home workout video or walk indoors.',
    sources: ['S01'], ref: 'S01 3.4.4, 3.4.6' },
  { id: 'E-07', category: 'exercise', title: 'Pick what you enjoy',
    text: 'No single type of exercise is best for PCOS. Choose something you enjoy and can keep doing.',
    how: 'Walking, cycling, dancing or a sport all work.',
    sources: ['S01'], ref: 'S01 3.4.1–3.4.2' },
  { id: 'E-09', category: 'exercise', title: 'Yoga counts too',
    text: 'Yoga is a good, gentle option. Some studies found it helped insulin resistance and testosterone in PCOS.',
    how: 'Try a 20–30 minute beginner yoga video on 3 days a week.',
    caution: 'Evidence comes from a few small studies.',
    sources: ['S13', 'S01'], ref: 'S13 network meta-analysis (yoga ranked first, small trials); S01 3.4.1' },
  { id: 'E-08', category: 'exercise', title: 'Track your steps',
    text: 'Use your phone to track your steps and raise your daily goal a little each week.',
    how: 'Start from your current average and add about 500 steps a week.',
    sources: ['S01'], ref: 'S01 3.4.7' },

  // ---------------------------------------------------------------- lifestyle
  { id: 'L-01', category: 'lifestyle', title: 'Sit less',
    text: 'Break up long periods of sitting and screen time with a few minutes of movement.',
    how: 'Stand up and walk around every hour.',
    sources: ['S01', 'S03'], ref: 'S01 3.4.3' },
  { id: 'L-02', category: 'lifestyle', title: 'Set small, clear goals',
    text: 'Set one small, clear goal at a time, like "walk 20 minutes after dinner on 4 days this week".',
    how: 'Check your goal at the end of each week.',
    sources: ['S01'], ref: 'S01 3.2.1–3.2.2' },
  { id: 'L-03', category: 'lifestyle', title: 'Healthy habits help at any weight',
    text: 'Healthy eating and activity improve your health even if your weight does not change.',
    sources: ['S01'], ref: 'S01 3.1.5' },
  { id: 'L-04', category: 'lifestyle', title: 'Involve your family',
    text: 'Making changes together with your family makes them easier to keep.',
    how: 'Plan meals or evening walks together.',
    sources: ['S01'], ref: 'S01 3.3.4, 3.4.6' },
  { id: 'L-05', category: 'lifestyle', title: 'Keep a regular sleep routine',
    text: 'Aim for at least 7 hours of sleep, going to bed and waking up at similar times.',
    how: 'Put your phone away 30 minutes before bed.',
    sources: ['S09'], ref: '7 or more hours for adults' },
  { id: 'L-06', category: 'lifestyle', title: 'Track your progress',
    text: 'Retake the assessment every few months and log your cycle to see how things change.',
    sources: ['S01'], ref: 'S01 3.2.1 (self-monitoring)' },
  { id: 'L-07', category: 'lifestyle', title: 'Waist size matters',
    text: 'Reducing your waist size improves your health, even if the scale does not move much.',
    how: 'Combine less fried food, better cooking fats and regular activity.',
    sources: ['S01', 'S16'], ref: 'S01 3.1.6; S16 waist-hip ratio 0.85+ (women)' },

  // ---------------------------------------------------------------- safety
  { id: 'S-01', category: 'safety', title: 'See a doctor',
    text: 'Your result shows a higher risk. Please see a gynaecologist or endocrinologist for a proper check-up.',
    sources: ['S01'], ref: 'Diagnosis needs a clinical assessment' },
  { id: 'S-02', category: 'safety', title: 'Very irregular periods',
    text: 'Cycles longer than 35 days or skipped periods should be checked by a doctor.',
    sources: ['S01'], ref: 'S01 1.1 (irregular cycles)' },
  { id: 'S-03', category: 'safety', title: 'Sleep problems',
    text: 'If you snore loudly, wake up tired or feel sleepy in the day, tell your doctor. Sleep apnoea is more common with PCOS.',
    sources: ['S01'], ref: 'S01 1.10' },
  { id: 'S-04', category: 'safety', title: 'Talk to a dietitian',
    text: 'A dietitian or nutritionist can help you make an eating plan that fits you.',
    sources: ['S01'], ref: 'S01 3.3.4' },
  { id: 'S-05', category: 'lifestyle', title: 'Mood and eating worries',
    text: 'Low mood, anxiety and worries about food are common with PCOS. If you feel this way often, talk to a doctor.',
    sources: ['S01'], ref: 'S01 2.2.1, 2.5.1' },
  { id: 'S-06', category: 'safety', title: 'You are pregnant',
    text: 'Please follow your doctor\'s advice on diet and exercise during pregnancy. Weight-loss and intense exercise tips are not shown.',
    sources: ['S01'], ref: 'S01: PCOS is a high-risk condition in pregnancy' },
];

/* SRS BR-02: Low below 30%, Moderate 30–69%, High 70% and above */
export const RISK_BANDS = { moderate: 30, high: 70 };

export function riskBand(score) {
  if (score >= RISK_BANDS.high) return 'High';
  if (score >= RISK_BANDS.moderate) return 'Moderate';
  return 'Low';
}

/* Friendly names for the model's features (used in the "why you see this" line) */
export const FEATURE_LABELS = {
  age_yrs: 'Age', weight_kg: 'Weight', height_cm: 'Height', bmi: 'BMI',
  cycle_length: 'Cycle length', marriage_years: 'Years of marriage', abortions: 'Abortions',
  hip_inch: 'Hip size', waist_inch: 'Waist size', waist_hip_ratio: 'Waist-hip ratio',
  pregnant: 'Pregnancy', weight_gain: 'Weight gain', hair_growth: 'Extra hair growth',
  skin_darkening: 'Skin darkening', hair_loss: 'Hair loss', pimples: 'Pimples',
  fast_food: 'Fast food', regular_exercise: 'Regular exercise', cycle_irregular: 'Irregular cycle',
  sleep_quality: 'Sleep',
};

const ANDROGEN_SIGNS = ['N-03', 'N-11', 'N-08', 'E-09'];

/*
 * One rule per model feature: (value, input) => advice ids, in the order shown.
 * Yes/No features are 1/0, as in the model's input.
 */
export const FEATURE_RULES = {
  bmi: (v) => {
    if (v >= 30) return ['N-12', 'S-04', 'N-04', 'N-08', 'E-03', 'N-05'];
    if (v >= 25) return ['N-12', 'N-04', 'N-08', 'E-03', 'N-05'];
    if (v < 18.5) return ['N-13', 'S-04', 'E-04'];
    return ['N-13', 'E-04'];
  },
  weight_gain: (v, input) => {
    if (v !== 1) return [];
    return input.bmi >= 25 ? ['N-12', 'N-04', 'N-08', 'E-03'] : ['N-04', 'N-08', 'E-02'];
  },
  waist_hip_ratio: (v) => (v >= 0.85 ? ['L-07', 'N-05', 'N-06', 'E-02'] : []),
  fast_food: (v) => (v === 1 ? ['N-05', 'N-06', 'N-07'] : []),
  regular_exercise: (v) => (v === 1 ? ['E-04', 'E-05', 'E-07'] : ['E-01', 'E-06', 'E-09', 'L-01', 'E-08']),
  hair_growth: (v) => (v === 1 ? ANDROGEN_SIGNS : []),
  pimples: (v) => (v === 1 ? ANDROGEN_SIGNS : []),
  hair_loss: (v) => (v === 1 ? ANDROGEN_SIGNS : []),
  skin_darkening: (v) => (v === 1 ? ['N-03', 'N-10', 'N-11', 'N-04', 'E-09'] : []), // sign of insulin resistance
  cycle_irregular: (v) => (v === 1 ? ['S-02', 'N-11', 'N-04', 'L-06'] : []),
  sleep_quality: (v) => (v === 'poor' ? ['L-05', 'S-03'] : v === 'fair' ? ['L-05'] : []), // optional extra question
};

/* Raw measurements share the rule of the value calculated from them */
const RULE_ALIAS = { weight_kg: 'bmi', height_cm: 'bmi', waist_inch: 'waist_hip_ratio', hip_inch: 'waist_hip_ratio' };

/* Model features with no lifestyle advice: they cannot be changed, or there is no evidence-based advice */
export const NO_ADVICE = ['age_yrs', 'cycle_length', 'marriage_years', 'abortions'];

const BASE = ['N-01', 'N-02', 'E-02', 'L-02', 'L-03'];                         // everyone
const GENERAL_TIPS = ['N-14', 'N-15', 'N-09', 'N-06', 'N-07', 'L-04', 'S-05']; // "more tips"
const WEIGHT_LOSS = ['N-12', 'E-03'];
const VIGOROUS = ['E-05'];

const BY_ID = Object.fromEntries(RECOMMENDATIONS.map((r) => [r.id, r]));

/*
 * returns { band, safety, nutrition, exercise, lifestyle }: each list holds
 * { ...recommendation, reason, sourceNames } in the order to show.
 */
export function getRecommendations({ score, input = {}, shap = [] }) {
  const picked = new Map(); // id -> { rank, reason }
  const add = (ids, rank, reason) => {
    ids.forEach((id, i) => {
      if (!BY_ID[id]) return;
      const r = rank + i / 100;
      if (!picked.has(id) || picked.get(id).rank > r) picked.set(id, { rank: r, reason });
    });
  };
  const ruleFor = (feature) => {
    const key = RULE_ALIAS[feature] ?? feature;
    return FEATURE_RULES[key] ? FEATURE_RULES[key](input[key], input) : [];
  };

  const band = riskBand(score);
  const pregnant = input.pregnant === 1;
  if (band === 'High') add(['S-01'], 0, 'Your risk score is in the higher range.');
  if (pregnant) add(['S-06'], 0.1, 'You told us you are pregnant.');
  if (input.regular_exercise === 0) add(['E-01'], 0.5, 'You are not exercising regularly yet, so start small.');

  // 1. Features that raised the score, biggest push first (SHAP)
  [...shap]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .forEach((s, i) => {
      const label = FEATURE_LABELS[s.feature] ?? s.feature;
      if (s.value > 0) add(ruleFor(s.feature), 1 + i, `${label} raised your score.`);
    });

  // 2. Everything else the user told us, even if the model did not rank it highly
  Object.keys(FEATURE_RULES).forEach((key) => {
    const label = FEATURE_LABELS[key];
    const inSentence = /^[A-Z]{2}/.test(label) ? label : label[0].toLowerCase() + label.slice(1); // "BMI" stays, "Regular exercise" -> "regular exercise"
    if (input[key] !== undefined) add(ruleFor(key), 30, `Based on your answer about ${inSentence}.`);
  });

  // 3. Advice for everyone, then general tips
  add(BASE, 40, 'Good for everyone with PCOS.');
  add(GENERAL_TIPS, 60, 'General tip.');

  // Safety filters
  if (!(input.bmi >= 25) || pregnant) WEIGHT_LOSS.forEach((id) => picked.delete(id));
  if (input.regular_exercise === 0 || pregnant) VIGOROUS.forEach((id) => picked.delete(id));

  const groups = { safety: [], nutrition: [], exercise: [], lifestyle: [] };
  [...picked.entries()]
    .sort((a, b) => a[1].rank - b[1].rank)
    .forEach(([id, { reason }]) => {
      const rec = BY_ID[id];
      groups[rec.category].push({ ...rec, reason, sourceNames: rec.sources.map((s) => SOURCES[s].short) });
    });
  return { band, ...groups };
}
