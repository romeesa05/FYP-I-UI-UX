import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { CATEGORIES, FOODS, findFood } from './nutritionData';
import FoodArt from './FoodArt';

const VERDICT = {
  good: 'Good choice',
  moderate: 'In moderation',
  limit: 'Limit',
};

function NutrientGrid({ food }) {
  const n = food.nutrients;
  const rows = [
    ['Calories', `${n.kcal} kcal`],
    ['Carbs', `${n.carbs} g`],
    ['Fiber', `${n.fiber} g`],
    ['Sugar', `${n.sugar} g`],
    ['Protein', `${n.protein} g`],
    ['Fat', `${n.fat} g`],
  ];
  return (
    <div className="nt-nutrients">
      <dl className="nt-grid">
        {rows.map(([k, v]) => (
          <div key={k} className="nt-cell">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="nt-gi">
        Glycemic index: <strong>{food.gi}</strong>
      </p>
      <p className="nt-food-note">{food.note}</p>
    </div>
  );
}

function FoodCard({ food }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="nt-card">
      <div className="nt-card-main">
        <span className="nt-art">
          <FoodArt id={food.id} />
        </span>
        <div className="nt-card-body">
          <div className="nt-name-row">
            <h3 className="nt-name">{food.name}</h3>
            <span className={`nt-verdict is-${food.verdict}`}>{VERDICT[food.verdict]}</span>
          </div>
          <p className="nt-serving">
            <span>{food.serving}</span>
            <span className="nt-kcal">{food.nutrients.kcal} kcal</span>
          </p>
          <ul className="nt-tags">
            {food.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <button type="button" className="nt-view" onClick={() => setOpen(!open)} aria-expanded={open}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {open ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
            </svg>
            {open ? 'Hide Nutrients' : 'View Nutrients'}
          </button>
        </div>
      </div>
      {open && <NutrientGrid food={food} />}
    </article>
  );
}

function AlternativeCard({ food }) {
  return (
    <aside className="nt-alt" aria-label={`Better alternative: ${food.name}`}>
      <h3 className="nt-alt-title">
        <span className="nt-alt-check" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
        Better Alternative
      </h3>
      <div className="nt-alt-row">
        <span className="nt-art nt-art--sm">
          <FoodArt id={food.id} size={58} />
        </span>
        <div>
          <p className="nt-alt-name">{food.name}</p>
          <p className="nt-serving">
            <span>{food.serving}</span>
            <span className="nt-kcal">{food.nutrients.protein} g protein</span>
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function NutritionScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [goodOnly, setGoodOnly] = useState(false);

  const foods = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOODS.filter(
      (f) =>
        (category === 'All' || f.categories.includes(category)) &&
        (!goodOnly || f.verdict === 'good') &&
        (!q || f.name.toLowerCase().includes(q) || f.tags.some((t) => t.toLowerCase().includes(q))),
    );
  }, [query, category, goodOnly]);

  return (
    <AppScreen>
      <FlowHeader title="Nutrition & Food Checker" onBack={() => navigate('/home')} />

      <main className="fl-main nt-main">
        <div className="nt-search-row">
          <label className="nt-search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a food"
              aria-label="Search a food"
            />
          </label>
          <button type="button" className="nt-scan">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8 12h8" />
            </svg>
            Scan a label
          </button>
        </div>

        <div className="nt-chips" role="group" aria-label="Meal type">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`nt-chip${category === c ? ' is-active' : ''}`}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            className={`nt-filter${goodOnly ? ' is-active' : ''}`}
            aria-pressed={goodOnly}
            aria-label="Show good choices only"
            title="Show good choices only"
            onClick={() => setGoodOnly(!goodOnly)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>
        </div>

        <div className="nt-list">
          {foods.length === 0 && (
            <div className="nt-empty">
              <p className="nt-empty-title">No foods match “{query}”</p>
              <p className="nt-empty-text">Try another name, or clear the filters to see everything.</p>
            </div>
          )}
          {foods.map((f) => (
            <div key={f.id} className="nt-group">
              <FoodCard food={f} />
              {f.alt && <AlternativeCard food={findFood(f.alt)} />}
            </div>
          ))}
        </div>

        <p className="nt-footnote">Values are approximate per serving. For a personal plan, talk to a dietitian.</p>
      </main>
    </AppScreen>
  );
}
