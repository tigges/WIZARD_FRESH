import { useWizardStore } from '../../store/wizardStore';
import { PillsBar } from '../shared/PillsBar';
import { WizardFooter } from './WizardFooter';
import { Step1Upload } from './steps/Step1Upload';
import { Step2PageMap } from './steps/Step2PageMap';
import { Step3Settings } from './steps/Step3Settings';
import { Step4Review } from './steps/Step4Review';
import { Step5Preview } from './steps/Step5Preview';
import { Step6Complete } from './steps/Step6Complete';

const TITLES = [
  'Select your document',
  'Page map',
  'Settings',
  'Review & edit structure',
  'Preview',
  'Import complete',
];
const SUBS = [
  'PDF, DOCX or TXT — up to 50 MB',
  'Page by page — structure left, interpretation right',
  'Configure import model and output options',
  'Inspect clusters, reorder and edit before importing',
  'Review process diagrams — read only',
  'Your document has been imported successfully',
];
const STEP_LABELS = ['Upload', 'Page map', 'Settings', 'Review', 'Preview', 'Complete'];

export function WizardShell() {
  const step = useWizardStore((s) => s.currentStep);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(0,0,0,.38)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 12,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 860,
          background: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 12px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.08)',
          border: '1px solid #d0d0d0',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '.9rem 1.4rem .75rem',
            borderBottom: '1px solid #e5e5e5',
            background: '#fafafa',
          }}
        >
          {/* Stepper dots */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '.7rem' }}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const isDone = n < step;
              const isActive = n === step;
              return (
                <div key={n} style={{ display: 'contents' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        fontSize: 9,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all .2s',
                        background: isDone || isActive ? '#1a1a1a' : '#f0f0f0',
                        color: isDone || isActive ? '#fff' : '#bbb',
                        border: !isDone && !isActive ? '1px solid #e8e8e8' : 'none',
                        boxShadow: isActive ? '0 0 0 3px #ddd' : 'none',
                      }}
                    >
                      {isDone ? '✓' : n}
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        color: isActive ? '#1a1a1a' : '#bbb',
                        fontWeight: isActive ? 600 : 400,
                        marginLeft: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < 5 && (
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: '#e8e8e8',
                        margin: '0 4px',
                        minWidth: 3,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
            {TITLES[step - 1]}
          </div>
          <div style={{ fontSize: 10, color: '#bbb', marginTop: 2 }}>
            {SUBS[step - 1]}
          </div>
        </div>

        {/* Pills bar (steps 2-5) */}
        {step >= 2 && step <= 5 && <PillsBar />}

        {/* Body */}
        <div style={{ minHeight: 320 }}>
          {step === 1 && <Step1Upload />}
          {step === 2 && <Step2PageMap />}
          {step === 3 && <Step3Settings />}
          {step === 4 && <Step4Review />}
          {step === 5 && <Step5Preview />}
          {step === 6 && <Step6Complete />}
        </div>

        <WizardFooter />
      </div>
    </div>
  );
}
