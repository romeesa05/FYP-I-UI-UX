/*
 * Cycle & symptom journal — storage and cycle maths.
 * Entries are kept on this device (localStorage) until a back-end is connected.
 * entry: { period: boolean, symptoms: string[] }   keyed by 'YYYY-MM-DD'
 */

export const SYMPTOMS = ['Cramps', 'Bloating', 'Fatigue', 'Acne', 'Headache', 'Mood swings', 'Cravings', 'Spotting'];

const KEY = 'pcos-cycle-journal';
const DAY = 86400000;
const DEFAULT_CYCLE = 28;

/* ---------- dates ---------- */
export const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromKey = (k) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const today = () => {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
};
const daysBetween = (a, b) => Math.round((b - a) / DAY);

/* ---------- sample data (shown until the first real entry) ---------- */
function sampleEntries() {
  const t = today();
  const e = {};
  for (const start of [-43, -15]) {
    for (let i = 0; i < 5; i++) e[toKey(addDays(t, start + i))] = { period: true, symptoms: [] };
  }
  e[toKey(addDays(t, -14))] = { period: true, symptoms: ['Cramps', 'Fatigue'] };
  e[toKey(addDays(t, -6))] = { period: false, symptoms: ['Acne'] };
  e[toKey(addDays(t, -2))] = { period: false, symptoms: ['Bloating'] };
  return e;
}

export function loadJournal() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { sample: false, entries: JSON.parse(raw) };
  } catch {
    /* fall through to sample */
  }
  return { sample: true, entries: sampleEntries() };
}

export function saveJournal(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    /* storage blocked — keeps working for this visit */
  }
}

/* ---------- cycle maths ---------- */
export function analyse(entries) {
  const periodDays = Object.keys(entries)
    .filter((k) => entries[k]?.period)
    .sort();
  const set = new Set(periodDays);
  const starts = periodDays.filter((k) => !set.has(toKey(addDays(fromKey(k), -1)))).map(fromKey);

  const gaps = starts.slice(1).map((s, i) => daysBetween(starts[i], s)).filter((g) => g >= 21 && g <= 45);
  const cycleLength = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : DEFAULT_CYCLE;

  const predictedStart = starts.length ? addDays(starts[starts.length - 1], cycleLength) : null;

  const predicted = new Set();
  const fertile = new Set();
  const ovulation = new Set();
  const cycleStarts = predictedStart ? [...starts, predictedStart] : starts;

  if (predictedStart) {
    for (let i = 0; i < 5; i++) {
      const k = toKey(addDays(predictedStart, i));
      if (!set.has(k)) predicted.add(k);
    }
  }
  cycleStarts.forEach((s) => {
    const ov = addDays(s, cycleLength - 14);
    ovulation.add(toKey(ov));
    for (let i = -5; i <= 1; i++) if (i !== 0) fertile.add(toKey(addDays(ov, i)));
  });

  const cycleDay = (date) => {
    const last = [...starts].reverse().find((s) => s <= date);
    return last ? daysBetween(last, date) + 1 : null;
  };

  return { starts, cycleLength, predictedStart, predicted, fertile, ovulation, periodSet: set, cycleDay };
}
