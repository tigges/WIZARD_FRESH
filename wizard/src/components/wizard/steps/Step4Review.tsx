import { useClusterStore } from '../../../store/clusterStore';
import { useProcessStore } from '../../../store/processStore';
import { SectionTitle } from '../../shared/SectionTitle';
import type { Cluster } from '../../../types';

const ALPHAS = 'ABCDEFGH';
const TYPE_OPTS = ['subprocess', 'process', 'action', 'decision', 'start', 'end', 'fact', 'context', 'actor'];

function hexAlpha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function Step4Review() {
  const { clusters, activeCluster, setActive, reorder } = useClusterStore();
  const { processes, expanded, toggle, remove, updateLabel, updateType, updateStepType } = useProcessStore();

  const filtered = activeCluster === 'all' ? processes : processes.filter((p) => p.cluster === activeCluster);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.setData('text/plain', String(idx));
  };

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIdx !== toIdx) reorder(fromIdx, toIdx);
  };

  return (
    <div>
      {/* Cluster bar */}
      <div style={{ padding: '.55rem 1.4rem .45rem', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#bbb', marginBottom: '.4rem', display: 'flex', alignItems: 'center', gap: 5 }}>
          Clusters <span style={{ fontWeight: 400, color: '#ddd', letterSpacing: 0 }}>— drag to reorder</span>
        </div>
        <div style={{ display: 'flex', gap: 5, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {clusters.map((c, i) => {
            const alpha = ALPHAS[i] || String(i + 1);
            const isActive = activeCluster === c.id;
            const isDimmed = activeCluster !== 'all' && !isActive;
            return (
              <div
                key={c.id}
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => setActive(c.id)}
                style={{
                  flexShrink: 0,
                  width: 138,
                  borderRadius: 8,
                  border: '1px solid #e5e5e5',
                  borderLeft: `3px solid ${c.color}`,
                  padding: '7px 8px',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  background: isActive ? '#fafafa' : '#fff',
                  opacity: isDimmed ? 0.25 : 1,
                  boxShadow: isActive ? '0 0 0 1.5px #1a1a1a inset' : 'none',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 3 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: '#fff', width: 15, height: 15, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: c.color }}>{alpha}</div>
                  <div style={{ fontSize: 10, color: '#bbb', cursor: 'grab', lineHeight: 1 }}>⠿</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color: '#1a1a1a', marginBottom: 2, lineHeight: 1.3 }}>
                  {c.name.split('\n').map((line, li) => (
                    <span key={li}>{line}{li === 0 && c.name.includes('\n') && <br />}</span>
                  ))}
                </div>
                <div style={{ fontSize: 7, color: '#bbb', marginBottom: 3, fontFamily: 'monospace' }}>{c.count} processes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {c.themes.map((th) => (
                    <span key={th.label} style={{ fontSize: 7, padding: '1px 4px', borderRadius: 4, border: '1px solid', fontWeight: 500, background: th.bg, borderColor: th.bc, color: th.tc }}>{th.label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meta pills row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '.4rem 1.4rem', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap' }}>
        {[
          { n: 66, l: 'Processes', bg: '#FAEEDA', bc: '#EF9F27', tc: '#633806' },
          { n: 12, l: 'Sub-processes', bg: '#FAECE7', bc: '#F0997B', tc: '#712B13' },
          { n: 38, l: 'Steps', bg: '#EAF3DE', bc: '#97C459', tc: '#27500A' },
          { n: 11, l: 'Connections', bg: '#F5F3FF', bc: '#DDD6FE', tc: '#5B21B6' },
          { n: 8, l: 'Facts / policies', bg: '#E1F5EE', bc: '#5DCAA5', tc: '#085041' },
          { n: 3, l: 'Unassigned', bg: '#fef2f2', bc: '#fecaca', tc: '#ef4444' },
        ].map((p) => (
          <span key={p.l} style={{ fontSize: 8, padding: '2px 7px', borderRadius: 7, border: '1px solid', fontWeight: 500, whiteSpace: 'nowrap', background: p.bg, borderColor: p.bc, color: p.tc }}>
            <span style={{ fontWeight: 700, marginRight: 2 }}>{p.n}</span>{p.l}
          </span>
        ))}
      </div>

      <SectionTitle title="Processes" sub="Click row number to expand steps" />

      {/* Process list */}
      <div style={{ padding: '.5rem .8rem .6rem', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 240, overflowY: 'auto' }}>
        {(() => {
          const shown: Record<string, boolean> = {};
          return filtered.map((ph) => {
            const cl = clusters.find((c: Cluster) => c.id === ph.cluster) || clusters[0];
            const ci = clusters.indexOf(cl);
            const alpha = ALPHAS[ci] || '?';
            const isExp = expanded[ph.id];
            const header = !shown[cl.id] ? (() => { shown[cl.id] = true; return (
              <div key={`gh-${cl.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 4px 2px', marginTop: 5 }}>
                <div style={{ fontSize: 7, fontWeight: 700, color: '#fff', width: 14, height: 14, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: cl.color }}>{alpha}</div>
                <span style={{ fontSize: 7, padding: '1px 6px', borderRadius: 4, border: '1px solid', fontWeight: 500, background: cl.tc, borderColor: cl.bc, color: cl.color }}>{cl.name.replace('\n', ' ')}</span>
                <span style={{ fontSize: 7, color: '#bbb', marginLeft: 'auto', fontFamily: 'monospace' }}>{cl.count} processes</span>
              </div>
            ); })() : null;

            return (
              <div key={ph.id}>
                {header}
                <div style={{ marginBottom: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '22px 14px 1fr 82px 16px', alignItems: 'center', gap: 5, padding: '6px 7px', borderRadius: 8, border: `1px solid ${isExp ? cl.color : '#e5e5e5'}`, background: isExp ? cl.tc : '#fafafa', cursor: 'pointer', transition: 'border-color .15s' }}>
                    <div onClick={(e) => { e.stopPropagation(); toggle(ph.id); }} style={{ width: 19, height: 19, borderRadius: '50%', color: '#fff', fontSize: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', background: cl.color }}>{ph.id}</div>
                    <svg width="13" height="13" viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="2" fill="none" stroke={cl.color} strokeWidth="1.5" /></svg>
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateLabel(ph.id, (e.target as HTMLDivElement).innerText)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLDivElement).blur(); } }}
                        style={{ fontSize: 10, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', outline: 'none' }}
                      >
                        {ph.label}
                      </div>
                      {ph.conn && <div style={{ fontSize: 7, color: '#bbb', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ph.conn}</div>}
                    </div>
                    <select
                      value={ph.type}
                      onChange={(e) => updateType(ph.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: 7, padding: '2px 3px', borderRadius: 4, border: '1px solid', fontFamily: 'inherit', cursor: 'pointer', width: '100%', background: cl.tc, borderColor: cl.bc, color: cl.color }}
                    >
                      {TYPE_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <div onClick={(e) => { e.stopPropagation(); remove(ph.id); }} style={{ width: 15, height: 15, borderRadius: 3, border: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#bbb', fontSize: 8, flexShrink: 0 }}>×</div>
                  </div>

                  {/* Expanded steps */}
                  {isExp && (
                    <div style={{ paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
                      {ph.steps.map((s) => {
                        const icon = s.icon === 'decision'
                          ? <svg width="12" height="12" viewBox="0 0 14 14"><polygon points="7,1 13,7 7,13 1,7" fill={cl.color} /></svg>
                          : <svg width="12" height="12" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="2" fill={cl.color} opacity=".7" /></svg>;
                        return (
                          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '20px 13px 1fr 82px 16px', alignItems: 'center', gap: 5, padding: '4px 7px', borderRadius: 4, border: '1px solid transparent', background: hexAlpha(cl.color, 0.03) }}>
                            <span style={{ fontSize: 8, color: '#bbb', fontFamily: 'monospace', textAlign: 'right' }}>{s.id}</span>
                            {icon}
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: 9, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</div>
                              {s.conn && <div style={{ fontSize: 7, color: '#bbb' }}>{s.conn}</div>}
                            </div>
                            <select
                              value={s.type}
                              onChange={(e) => updateStepType(ph.id, s.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ fontSize: 7, padding: '2px 3px', borderRadius: 4, border: '1px solid', fontFamily: 'inherit', cursor: 'pointer', width: '100%', background: cl.tc, borderColor: cl.bc, color: cl.color }}
                            >
                              {TYPE_OPTS.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <div style={{ width: 15, height: 15, borderRadius: 3, border: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#bbb', fontSize: 7, flexShrink: 0 }}>×</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
