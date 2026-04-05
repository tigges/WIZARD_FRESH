import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useWizardStore } from '../../../store/wizardStore';
import { SectionTitle } from '../../shared/SectionTitle';
import { sampleFiles } from '../../../data/samples';
import { samples } from '../../../data/samples';
import type { FileMeta, InputMode } from '../../../types';

export function Step1Upload() {
  const { inputMode, setInputMode, setRawText, setSourceFile, setSampleId } = useWizardStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showFiles, setShowFiles] = useState(true);
  const [pasteText, setPasteText] = useState('');

  const onDrop = useCallback(() => {
    setShowFiles(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
    },
    multiple: false,
  });

  const pick = (idx: number) => setSelectedIdx(idx);

  const loadSample = (sampleId: string) => {
    const sample = samples.find((s) => s.id === sampleId);
    if (sample) {
      setSampleId(sampleId);
      setSourceFile(sample.file);
      setRawText(sample.text);
      setInputMode('sample');
    }
  };

  const modes: { key: InputMode; label: string }[] = [
    { key: 'file', label: 'Upload file' },
    { key: 'paste', label: 'Paste text' },
    { key: 'sample', label: 'Load sample' },
  ];

  return (
    <div>
      <SectionTitle title="Files" sub="Select document to import" />
      <div style={{ padding: '1.1rem 1.4rem' }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setInputMode(m.key)}
              style={{
                fontSize: 9,
                padding: '3px 10px',
                borderRadius: 6,
                border: '1px solid',
                borderColor: inputMode === m.key ? '#1a1a1a' : '#e5e5e5',
                background: inputMode === m.key ? '#1a1a1a' : '#fff',
                color: inputMode === m.key ? '#fff' : '#888',
                cursor: 'pointer',
                fontWeight: 500,
                fontFamily: 'inherit',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* File upload mode */}
        {inputMode === 'file' && (
          <>
            <div
              {...getRootProps()}
              style={{
                border: '1.5px dashed #d0d0d0',
                borderRadius: 12,
                padding: '2.2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all .2s',
                background: '#fafafa',
              }}
            >
              <input {...getInputProps()} />
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" style={{ display: 'block', margin: '0 auto 10px' }}>
                <rect x="4" y="2" width="20" height="28" rx="3" />
                <path d="M20 2l8 8h-8V2z" />
                <path d="M18 20v8M14 24l4-4 4 4" />
              </svg>
              <h3 style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>
                Drop file here or click to browse
              </h3>
              <p style={{ fontSize: 10, color: '#bbb' }}>PDF · DOCX · TXT · HTML — up to 50 MB</p>
            </div>

            {showFiles && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: '.85rem' }}>
                {sampleFiles.map((f: FileMeta, i: number) => (
                  <div
                    key={f.name}
                    onClick={() => pick(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 9px',
                      background: selectedIdx === i ? '#fff' : '#fafafa',
                      borderRadius: 8,
                      cursor: 'pointer',
                      border: `1px solid ${selectedIdx === i ? '#1a1a1a' : 'transparent'}`,
                      transition: 'border-color .15s',
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 5,
                        fontSize: 9,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: f.typeBg,
                        color: f.typeColor,
                      }}
                    >
                      {f.type}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: '#1a1a1a' }}>{f.name}</div>
                      <div style={{ fontSize: 9, color: '#bbb' }}>
                        {f.pages} pages · {f.size}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        border: `1px solid ${selectedIdx === i ? '#1a1a1a' : '#d0d0d0'}`,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: selectedIdx === i ? '#1a1a1a' : '#fff',
                      }}
                    >
                      {selectedIdx === i && (
                        <svg width="8" height="6" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Paste text mode */}
        {inputMode === 'paste' && (
          <div>
            <textarea
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                setRawText(e.target.value);
              }}
              placeholder="Paste or type document content here..."
              style={{
                width: '100%',
                minHeight: 180,
                padding: '10px 12px',
                borderRadius: 12,
                border: '1.5px solid #e5e5e5',
                background: '#fafafa',
                fontSize: 11,
                fontFamily: 'inherit',
                color: '#1a1a1a',
                resize: 'vertical',
                outline: 'none',
              }}
            />
            <p style={{ fontSize: 9, color: '#bbb', marginTop: 4 }}>
              Supports plain text, markdown, or HTML
            </p>
          </div>
        )}

        {/* Sample loader mode */}
        {inputMode === 'sample' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {samples.map((s) => (
              <div
                key={s.id}
                onClick={() => loadSample(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 9px',
                  background: '#fafafa',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: '1px solid transparent',
                  transition: 'border-color .15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 5,
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: s.file.typeBg,
                    color: s.file.typeColor,
                  }}
                >
                  {s.file.type}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#1a1a1a' }}>{s.label}</div>
                  <div style={{ fontSize: 9, color: '#bbb' }}>{s.file.name}</div>
                </div>
                <div style={{ fontSize: 9, color: '#bbb' }}>→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
