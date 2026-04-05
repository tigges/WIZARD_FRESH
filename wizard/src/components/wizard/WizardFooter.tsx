import { useWizardStore } from '../../store/wizardStore';

export function WizardFooter() {
  const { currentStep, next, back } = useWizardStore();

  const rightLabel =
    currentStep === 6
      ? 'Open in editor →'
      : currentStep === 5
        ? 'Run import →'
        : 'Continue →';

  return (
    <div
      style={{
        padding: '.65rem 1.4rem',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: '#fafafa',
      }}
    >
      <button
        onClick={back}
        style={{
          padding: '5px 14px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 500,
          cursor: 'pointer',
          border: '1px solid #bbb',
          background: '#fff',
          color: '#555',
          fontFamily: 'inherit',
          visibility: currentStep > 1 ? 'visible' : 'hidden',
        }}
      >
        ← Back
      </button>
      <span style={{ fontSize: 9, color: '#bbb' }}>
        Step {currentStep} of 6
      </span>
      <button
        onClick={currentStep === 6 ? () => alert('Opening editor…') : next}
        style={{
          padding: '5px 14px',
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 500,
          cursor: 'pointer',
          border: '1px solid #1a1a1a',
          background: '#1a1a1a',
          color: '#fff',
          fontFamily: 'inherit',
          marginLeft: 'auto',
        }}
      >
        {rightLabel}
      </button>
    </div>
  );
}
