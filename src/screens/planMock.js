/*
 * TEMPORARY data for the "Your Plan" screen until the trained model is connected.
 *
 * The knowledge base (recommendationsData.js) takes the model's output: { score, input, shap }.
 *   SAMPLE_USERS    — ready-made model outputs for demos
 *   fromQuizResult  — turns the current 5-question placeholder quiz result into that same shape
 * When the real model is live, pass its output to getRecommendations() and delete this file.
 */

export const SAMPLE_USERS = [
  {
    id: 'sample-1',
    label: 'Ayesha',
    note: 'Higher risk, healthy weight, irregular cycle, acne',
    data: {
      score: 78,
      input: { bmi: 21.5, pregnant: 0, weight_gain: 0, waist_hip_ratio: 0.8, hair_growth: 1, pimples: 1, skin_darkening: 1, hair_loss: 0, fast_food: 0, regular_exercise: 0, cycle_irregular: 1 },
      shap: [
        { feature: 'cycle_irregular', value: 0.25 },
        { feature: 'skin_darkening', value: 0.15 },
        { feature: 'hair_growth', value: 0.1 },
        { feature: 'regular_exercise', value: 0.05 },
        { feature: 'bmi', value: -0.08 },
      ],
    },
  },
  {
    id: 'sample-2',
    label: 'Sana',
    note: 'Moderate risk, obese, weight gain, fast food',
    data: {
      score: 52,
      input: { bmi: 31.2, weight_kg: 80, pregnant: 0, weight_gain: 1, waist_hip_ratio: 0.9, hair_growth: 0, pimples: 0, skin_darkening: 0, hair_loss: 0, fast_food: 1, regular_exercise: 0, cycle_irregular: 0 },
      shap: [
        { feature: 'weight_kg', value: 0.2 },
        { feature: 'weight_gain', value: 0.15 },
        { feature: 'fast_food', value: 0.08 },
        { feature: 'waist_hip_ratio', value: 0.05 },
      ],
    },
  },
  {
    id: 'sample-3',
    label: 'Hira',
    note: 'Low risk, healthy weight, active',
    data: {
      score: 18,
      input: { bmi: 22, pregnant: 0, weight_gain: 0, waist_hip_ratio: 0.78, hair_growth: 0, pimples: 0, skin_darkening: 0, hair_loss: 0, fast_food: 0, regular_exercise: 1, cycle_irregular: 0 },
      shap: [
        { feature: 'regular_exercise', value: -0.12 },
        { feature: 'bmi', value: -0.05 },
      ],
    },
  },
  {
    id: 'sample-4',
    label: 'Maryam',
    note: 'Pregnant, overweight, weight gain',
    data: {
      score: 45,
      input: { bmi: 27, pregnant: 1, weight_gain: 1, waist_hip_ratio: 0.82, hair_growth: 0, pimples: 0, skin_darkening: 0, hair_loss: 0, fast_food: 0, regular_exercise: 1, cycle_irregular: 0 },
      shap: [
        { feature: 'bmi', value: 0.12 },
        { feature: 'weight_gain', value: 0.09 },
      ],
    },
  },
];

const BMI_VALUE = { under: 17.5, healthy: 22, over: 27.5, obese: 32 };
const QUIZ_TO_MODEL = { bmi: 'bmi', androgen: 'hair_growth', cycle: 'cycle_irregular', activity: 'regular_exercise', sleep: 'sleep_quality' };

/* Placeholder quiz result ({ score, contributions, answers }) -> model output shape */
export function fromQuizResult(result) {
  const a = result.answers ?? {};
  const androgen = ['mild', 'noticeable'].includes(a.androgen) ? 1 : 0;
  return {
    score: result.score,
    input: {
      bmi: BMI_VALUE[a.bmi],
      hair_growth: androgen,
      pimples: androgen,
      cycle_irregular: ['somewhat', 'highly'].includes(a.cycle) ? 1 : 0,
      regular_exercise: a.activity === 'low' ? 0 : 1,
      sleep_quality: a.sleep,
      pregnant: 0,
    },
    shap: (result.contributions ?? []).map((c) => ({ feature: QUIZ_TO_MODEL[c.feature], value: c.value })),
  };
}
