import { useState } from 'react';

const MODELS = [
  { id: 'raw', label: 'Raw', icon: 'Rw', bg: '#f0f0f0', color: '#555' },
  { id: 'wizard', label: 'Wizard', icon: 'Wz', bg: '#e0f2fe', color: '#0369a1' },
  { id: 'gemini', label: 'Gemini', icon: 'G', bg: '#e0f2fe', color: '#0369a1' },
  { id: 'claude', label: 'Claude', icon: 'A\\', bg: '#fef3c7', color: '#92400e' },
];

const TOGGLES = [
  { title: 'Actor lanes', sub: 'Group steps by role', default: true },
  { title: 'Decision nodes', sub: 'Branch points and conditions', default: true },
  { title: 'System references', sub: 'NR1, Zendesk, PSP', default: true },
  { title: 'Confidence labels', sub: 'Show % on each node', default: false },
  { title: 'Cross-cluster connections', sub: 'Show inter-cluster edges', default: true },
];

export function Step3Settings() {
  const [activeModel, setActiveModel] = useState('gemini');
  const [toggles, setToggles] = useState(TOGGLES.map((t) => t.default));

  return (
    <div style={{ padding: '.7rem 1.4rem' }}>
      <div style={{ fontSize: 10, color: '#888', marginBottom: 4, fontWeight: 500 }}>Import model</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: '.9rem' }}>
        {MODELS.map((m) => {
          const isOn = activeModel === m.id;
          return (
            <div
              key={m.id}
              onClick={() => setActiveModel(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 10px',
                borderRadius: 8,
                border: `1px solid ${isOn ? '#1a1a1a' : '#e5e5e5'}`,
                background: isOn ? '#1a1a1a' : '#fff',
                color: isOn ? '#fff' : '#555',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 500,
                userSelect: 'none',
                transition: 'all .15s',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 8,
                  fontWeight: 700,
                  flexShrink: 0,
                  background: isOn ? 'rgba(255,255,255,.15)' : m.bg,
                  color: isOn ? '#fff' : m.color,
                }}
              >
                {m.icon}
              </div>
              {m.label}
            </div>
          );
        })}
        <div
          onClick={() => alert('Add model integration — coming soon')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            borderRadius: 8,
            border: '1px dashed #e5e5e5',
            background: '#fff',
            color: '#bbb',
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          + Add new
        </div>
      </div>

      <div style={{ fontSize: 10, color: '#888', marginBottom: 4, fontWeight: 500 }}>Output type</div>
      <select style={{ width: '100%', padding: '6px 9px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fafafa', color: '#1a1a1a', fontSize: 11, fontFamily: 'inherit', marginBottom: '.75rem' }}>
        <option>User journey flow diagram</option>
        <option>Swimlane process map</option>
        <option>Decision tree</option>
      </select>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {TOGGLES.map((t, i) => (
          <div key={t.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < TOGGLES.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#1a1a1a' }}>{t.title}</div>
              <div style={{ fontSize: 9, color: '#bbb', marginTop: 1 }}>{t.sub}</div>
            </div>
            <label style={{ position: 'relative', width: 30, height: 17, flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={toggles[i]}
                onChange={() => {
                  const next = [...toggles];
                  next[i] = !next[i];
                  setToggles(next);
                }}
                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: toggles[i] ? '#1a1a1a' : '#e5e5e5',
                  borderRadius: 9,
                  cursor: 'pointer',
                  transition: 'background .2s',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: 12,
                  height: 12,
                  top: 2.5,
                  left: toggles[i] ? 15.5 : 2.5,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left .2s',
                }}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
