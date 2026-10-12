import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppScreen, FlowHeader } from './AppScreen';
import { STEPS, predictRisk, storeLatestResult } from './assessmentData';

export default function AssessmentScreen() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = STEPS[index];
  const total = STEPS.length;
  const selected = answers[step.id];
  const isLast = index === total - 1;

  const choose = (optionId) => setAnswers((a) => ({ ...a, [step.id]: optionId }));

  const back = () => (index > 0 ? setIndex(index - 1) : navigate('/home'));

  const next = () => {
    if (!selected) return;
    if (!isLast) {
      setIndex(index + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const result = predictRisk(answers);
    storeLatestResult(result);
    navigate('/results', { state: { result } });
  };

  return (
    <AppScreen showNav={false}>
      <FlowHeader onBack={back}>
        <div className="qs-progress">
          <span className="qs-step">
            Step {index + 1} of {total}
          </span>
          <div
            className="qs-bar"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={index + 1}
            aria-label="Assessment progress"
          >
            <span style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>
      </FlowHeader>

      <main className="fl-main" key={step.id}>
        <h2 className="qs-section">{step.section}</h2>
        <p className="qs-intro">{step.intro}</p>

        <fieldset className="qs-fieldset">
          <legend className="qs-question">{step.question}</legend>
          <div className="qs-options">
            {step.options.map((opt) => {
              const isOn = selected === opt.id;
              return (
                <label key={opt.id} className={`qs-option${isOn ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name={step.id}
                    value={opt.id}
                    checked={isOn}
                    onChange={() => choose(opt.id)}
                    className="qs-radio-input"
                  />
                  <span className="qs-radio" aria-hidden="true" />
                  <span className="qs-option-text">
                    <span className="qs-option-label">{opt.label}</span>
                    {opt.detail && <span className="qs-option-detail">{opt.detail}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <aside className="qs-why">
          <span className="qs-why-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M12 7v6M12 17h.01" />
            </svg>
          </span>
          <div>
            <h3 className="qs-why-title">Why we ask this?</h3>
            <p className="qs-why-text">{step.why}</p>
          </div>
        </aside>

        <button type="button" className="fl-primary" onClick={next} disabled={!selected}>
          {isLast ? 'See my results' : 'Continue'}
        </button>
      </main>
    </AppScreen>
  );
}
