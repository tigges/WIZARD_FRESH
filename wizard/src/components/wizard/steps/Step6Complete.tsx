import { useState } from 'react';

const FORMATS = [
  { id: 'mermaid', icon: 'Mm', name: 'Mermaid', desc: 'Live text + preview' },
  { id: 'processmap', icon: 'PM', name: 'Process-Map-V1', desc: 'Semantic process model' },
  { id: 'bpmn', icon: 'Bx', name: 'BPMN XML', desc: 'Standard process notation' },
  { id: 'workflow', icon: 'Wf', name: 'Workflow Designer', desc: 'Visual flow editor' },
  { id: 'html', icon: 'Ht', name: 'HTML', desc: 'Interactive standalone map' },
  { id: 'json', icon: 'JS', name: 'JSON', desc: 'Node-link graph' },
  { id: 'csv', icon: 'Cv', name: 'CSV', desc: 'Flat process table' },
  { id: 'pdf', icon: 'Pd', name: 'PDF', desc: 'Printable diagram' },
];

export function Step6Complete() {
  const [selected, setSelected] = useState('mermaid');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320 }}>
      {/* Left */}
      <div style={{ padding: '1.1rem 1.4rem', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: '.65rem', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          Import complete
        </div>

        {[
          { k: 'Document', v: 'CS_Training_Manual_v3.pdf', style: { fontSize: 9, fontWeight: 400, color: '#555' } },
          { k: 'Clusters', v: '8' },
          { k: 'Themes', v: '7' },
          { k: 'Processes', v: '66' },
          { k: 'Sub-processes', v: '12' },
          { k: 'Steps', v: '38' },
          { k: 'Connections', v: '11' },
          { k: 'Facts / policies', v: '8' },
          { k: 'Unassigned', v: '3', style: { color: '#ef4444' } },
        ].map((row) => (
          <div key={row.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ fontSize: 10, color: '#888' }}>{row.k}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', ...row.style }}>{row.v}</span>
          </div>
        ))}

        <div style={{ marginTop: '.7rem', paddingTop: '.6rem', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#bbb', marginBottom: 5 }}>Validation</div>
          {[
            { color: '#22c55e', text: 'No disconnected nodes', tc: '#166534' },
            { color: '#22c55e', text: 'All decisions have ≥2 exits', tc: '#166534' },
            { color: '#f59e0b', text: '3 optional fields missing', tc: '#92400e' },
          ].map((v) => (
            <div key={v.text} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 0', fontSize: 9 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: v.color }} />
              <span style={{ color: v.tc }}>{v.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ padding: '1.1rem 1.4rem' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>Export to</div>
        <div style={{ fontSize: 9, color: '#bbb', marginBottom: '.7rem' }}>Select format then open in editor</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {FORMATS.map((f) => {
            const isOn = selected === f.id;
            return (
              <div
                key={f.id}
                onClick={() => setSelected(f.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 8,
                  border: `1px solid ${isOn ? '#1a1a1a' : '#e5e5e5'}`,
                  cursor: 'pointer',
                  transition: 'all .15s',
                  userSelect: 'none',
                  background: isOn ? '#fafafa' : '#fff',
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 4, fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isOn ? '#1a1a1a' : '#f0f0f0', color: isOn ? '#fff' : '#555', transition: 'all .15s' }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: '#1a1a1a' }}>{f.name}</div>
                  <div style={{ fontSize: 8, color: '#bbb' }}>{f.desc}</div>
                </div>
                <div style={{ width: 13, height: 13, borderRadius: '50%', border: `1px solid ${isOn ? '#1a1a1a' : '#d0d0d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isOn ? '#1a1a1a' : '#fff', flexShrink: 0, marginLeft: 'auto', transition: 'all .15s' }}>
                  {isOn && (
                    <svg width="8" height="6" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
