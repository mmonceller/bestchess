import Icon from '../../../components/icons/Icon.jsx';
import StepLayout from '../components/StepLayout.jsx';
import { ContinueButton } from '../components/StepButtons.jsx';
import { GlossText } from '../components/Glossary.jsx';

/* A summary card: a short coach message followed by a list of icon cards. */
export default function RecapStep({ step, coach, onNext }) {
  return (
    <StepLayout coach={coach} message={step.text} actions={<ContinueButton onClick={onNext} />}>
      {step.title && <h3 className="recap-title">{step.title}</h3>}
      <div className={`recap-grid${step.numbered ? ' numbered' : ''}`}>
        {step.items.map((item, i) => (
          <div key={i} className="recap-card" style={{ '--i': i }}>
            <span className="recap-icon">
              {step.numbered ? <b>{i + 1}</b> : item.label ? <b>{item.label}</b> : <Icon name={item.icon} size={26} />}
            </span>
            <div>
              <b>{item.title}</b>
              <p><GlossText>{item.text}</GlossText></p>
            </div>
          </div>
        ))}
      </div>
    </StepLayout>
  );
}
