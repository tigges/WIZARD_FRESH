import { useEffect, useRef, useCallback } from 'react';
import { useClusterStore } from '../../../store/clusterStore';
import { useCanvasStore } from '../../../store/canvasStore';
import { diagrams } from '../../../data/diagrams';
import { SectionTitle } from '../../shared/SectionTitle';
import type { Diagram, DiagramNode } from '../../../types';

function nCenter(n: DiagramNode) {
  if (n.type === 'start' || n.type === 'end') return { x: n.x + 14, y: n.y + 14 };
  if (!n.w) return { x: n.x + 26, y: n.y + 24 };
  return { x: n.x + n.w / 2, y: n.y + (n.h || 52) / 2 };
}

function nEdge(n: DiagramNode, side: 'l' | 'r' | 't' | 'b') {
  const c = nCenter(n);
  if (n.type === 'start' || n.type === 'end') {
    if (side === 'r') return { x: n.x + 28, y: c.y };
    if (side === 'l') return { x: n.x, y: c.y };
    if (side === 'b') return { x: c.x, y: n.y + 28 };
    return { x: c.x, y: n.y };
  }
  if (!n.w) {
    if (side === 'r') return { x: n.x + 52, y: c.y };
    if (side === 'l') return { x: n.x, y: c.y };
    if (side === 'b') return { x: c.x, y: n.y + 48 };
    return { x: c.x, y: n.y };
  }
  const h = n.h || 52;
  if (side === 'r') return { x: n.x + n.w, y: c.y };
  if (side === 'l') return { x: n.x, y: c.y };
  if (side === 'b') return { x: c.x, y: n.y + h };
  return { x: c.x, y: n.y };
}

function renderSvg(diag: Diagram): string {
  const nmap: Record<string, DiagramNode> = {};
  diag.nodes.forEach((n) => { nmap[n.id] = n; });

  const defs = '<defs><marker id="mh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>';

  const edges = diag.edges.map((e) => {
    const fn = nmap[e.f], tn = nmap[e.t];
    if (!fn || !tn) return '';
    const from = nEdge(fn, 'r'), to = nEdge(tn, 'l');
    const dy = Math.abs(from.y - to.y);
    let path: string, lx: number, ly: number;
    if (dy < 10) {
      path = `M${from.x} ${from.y} L${to.x - 2} ${to.y}`;
      lx = (from.x + to.x) / 2; ly = from.y - 7;
    } else {
      const mx = (from.x + to.x) / 2;
      path = `M${from.x} ${from.y} L${mx} ${from.y} L${mx} ${to.y} L${to.x - 2} ${to.y}`;
      lx = mx; ly = (from.y + to.y) / 2 - 5;
    }
    const lbl = e.lbl ? `<text x="${lx}" y="${ly}" text-anchor="middle" font-size="8.5" fill="#666" font-family="sans-serif" font-weight="500">${e.lbl}</text>` : '';
    return `<path d="${path}" fill="none" stroke="#b0b0b0" stroke-width="1.2" marker-end="url(#mh)"/>${lbl}`;
  }).join('');

  const nodes = diag.nodes.map((n) => {
    if (n.type === 'start') return `<circle cx="${n.x + 14}" cy="${n.y + 14}" r="14" fill="#22c55e"/><text x="${n.x + 14}" y="${n.y + 19}" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif" font-weight="700">Start</text>`;
    if (n.type === 'end') return `<circle cx="${n.x + 14}" cy="${n.y + 14}" r="14" fill="#ef4444"/><text x="${n.x + 14}" y="${n.y + 19}" text-anchor="middle" font-size="9" fill="#fff" font-family="sans-serif" font-weight="700">End</text>`;
    if (!n.w) {
      const cx = n.x + 26, cy = n.y + 24;
      const pts = `${cx},${cy - 24} ${cx + 30},${cy} ${cx},${cy + 24} ${cx - 30},${cy}`;
      const words = (n.label || '').split(' ');
      const ty = n.sub ? cy - 6 : cy + 3;
      const lt = words.map((w, i) => `<tspan x="${cx}" dy="${i === 0 ? '0' : '1.1em'}">${w}</tspan>`).join('');
      return `<polygon points="${pts}" fill="#FFFDE7" stroke="#C9960A" stroke-width="1.5"/><text x="${cx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="#7A5200" font-family="sans-serif" font-weight="600">${lt}</text>${n.sub ? `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="7.5" fill="#7A5200" font-family="sans-serif" opacity=".6">${n.sub}</text>` : ''}`;
    }
    const w = n.w, h = n.h || 52;
    const tx = n.x + w / 2, ty1 = n.y + (n.sub ? h / 2 - 8 : h / 2);
    return `<rect x="${n.x}" y="${n.y}" width="${w}" height="${h}" rx="7" fill="#EBF2FF" stroke="#3B7DE8" stroke-width="1.5"/><text x="${tx}" y="${ty1}" text-anchor="middle" dominant-baseline="central" font-size="9.5" fill="#1A3A7A" font-family="sans-serif" font-weight="600">${n.label}</text>${n.sub ? `<text x="${tx}" y="${n.y + h / 2 + 9}" text-anchor="middle" dominant-baseline="central" font-size="8" fill="#1A3A7A" font-family="sans-serif" opacity=".6">${n.sub}</text>` : ''}`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${diag.w}" height="${diag.h}">${defs}${edges}${nodes}</svg>`;
}

export function Step5Preview() {
  const { clusters } = useClusterStore();
  const { activeCluster, tool, setCluster, setTool } = useCanvasStore();
  const diag = diagrams[activeCluster] || diagrams['with'];
  const cl = clusters.find((c) => c.id === activeCluster) || clusters[1];

  const scaleRef = useRef(1);
  const panRef = useRef({ x: 30, y: 30 });
  const ciRef = useRef<HTMLDivElement>(null);
  const mmRef = useRef<HTMLDivElement>(null);
  const mmvRef = useRef<HTMLDivElement>(null);
  const zoomLblRef = useRef<HTMLSpanElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  const applyTx = useCallback(() => {
    if (ciRef.current) ciRef.current.style.transform = `translate(${panRef.current.x}px,${panRef.current.y}px) scale(${scaleRef.current})`;
    if (zoomLblRef.current) zoomLblRef.current.textContent = `${Math.round(scaleRef.current * 100)}%`;
    // minimap
    if (mmRef.current && ciRef.current && mmvRef.current) {
      const ms = Math.min(108 / (diag.w || 900), 68 / (diag.h || 280));
      mmRef.current.innerHTML = ciRef.current.innerHTML;
      mmRef.current.style.transform = `scale(${ms})`;
      mmRef.current.style.width = `${diag.w}px`;
      mmRef.current.style.height = `${diag.h}px`;
      const vpW = vpRef.current?.offsetWidth || 780;
      const vpH = vpRef.current?.offsetHeight || 400;
      const visX = Math.max(0, -panRef.current.x / scaleRef.current);
      const visY = Math.max(0, -panRef.current.y / scaleRef.current);
      mmvRef.current.style.left = `${visX * ms}px`;
      mmvRef.current.style.top = `${visY * ms}px`;
      mmvRef.current.style.width = `${(vpW / scaleRef.current) * ms}px`;
      mmvRef.current.style.height = `${(vpH / scaleRef.current) * ms}px`;
    }
  }, [diag]);

  const doZoom = useCallback((d: number) => {
    scaleRef.current = Math.max(0.25, Math.min(3, scaleRef.current + d));
    applyTx();
  }, [applyTx]);

  useEffect(() => {
    scaleRef.current = 1;
    panRef.current = { x: 30, y: 30 };
    if (ciRef.current) ciRef.current.innerHTML = renderSvg(diag);
    applyTx();
  }, [activeCluster, diag, applyTx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'v' || e.key === 'V') setTool('select');
      if (e.key === 'h' || e.key === 'H') setTool('hand');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setTool]);

  useEffect(() => {
    const vp = vpRef.current;
    if (!vp) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); doZoom(e.deltaY > 0 ? -0.08 : 0.08); };
    const onDown = (e: MouseEvent) => { if (tool !== 'hand') return; isPanningRef.current = true; lastMouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onMove = (e: MouseEvent) => { if (!isPanningRef.current) return; panRef.current.x += e.clientX - lastMouseRef.current.x; panRef.current.y += e.clientY - lastMouseRef.current.y; lastMouseRef.current = { x: e.clientX, y: e.clientY }; applyTx(); };
    const onUp = () => { isPanningRef.current = false; };
    vp.addEventListener('wheel', onWheel, { passive: false });
    vp.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { vp.removeEventListener('wheel', onWheel); vp.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [tool, applyTx, doZoom]);

  return (
    <div>
      <SectionTitle title="Clusters" sub="Select to filter flow map" />
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '.5rem 1.4rem .35rem', borderBottom: '1px solid #f0f0f0' }}>
        {clusters.map((c) => (
          <span
            key={c.id}
            onClick={() => setCluster(c.id)}
            style={{
              fontSize: 9, padding: '3px 9px', borderRadius: 10, border: '1px solid', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none', transition: 'all .15s',
              background: c.tc, borderColor: c.bc, color: c.color,
              boxShadow: c.id === activeCluster ? '0 0 0 1.5px #1a1a1a' : 'none',
              opacity: c.id === activeCluster ? 1 : 0.6,
            }}
          >
            {c.name.replace('\n', ' ')}
          </span>
        ))}
      </div>

      <SectionTitle title="Processes / Steps flow map" sub="Read only — zoom · pan · H/V keys" style={{ borderTop: '1px solid #f0f0f0' }} />

      <div style={{ position: 'relative', background: '#edf0f9' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '.32rem .9rem', borderBottom: '1px solid #d8dcea', background: '#f4f6fc' }}>
          <button onClick={() => setTool('select')} style={{ width: 26, height: 26, borderRadius: 5, border: tool === 'select' ? '1px solid #1a1a1a' : '1px solid transparent', background: tool === 'select' ? '#1a1a1a' : 'transparent', color: tool === 'select' ? '#fff' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Select (V)">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l4 8.5 1.4-3.2L11.5 6 2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="currentColor" fillOpacity=".15" /></svg>
          </button>
          <button onClick={() => setTool('hand')} style={{ width: 26, height: 26, borderRadius: 5, border: tool === 'hand' ? '1px solid #1a1a1a' : '1px solid transparent', background: tool === 'hand' ? '#1a1a1a' : 'transparent', color: tool === 'hand' ? '#fff' : '#555', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Pan (H)">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M5 1.5v5M7.5 2.5v4M10 4v3.5M2.5 5.5v2c0 2.2 1.6 4 4.5 4s4.5-1.8 4.5-4V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div style={{ width: 1, height: 15, background: '#d8dcea', margin: '0 4px' }} />
          <button onClick={() => doZoom(-0.15)} style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid transparent', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 5.5h4M8.5 8.5l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
          <span ref={zoomLblRef} onClick={() => { scaleRef.current = 1; panRef.current = { x: 30, y: 30 }; applyTx(); }} style={{ fontSize: 10, color: '#888', minWidth: 38, textAlign: 'center', fontFamily: 'monospace', cursor: 'pointer', padding: '2px 4px', borderRadius: 4 }}>100%</span>
          <button onClick={() => doZoom(0.15)} style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid transparent', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M3.5 5.5h4M5.5 3.5v4M8.5 8.5l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
          <button onClick={() => { scaleRef.current = 0.82; panRef.current = { x: 20, y: 20 }; applyTx(); }} style={{ width: 26, height: 26, borderRadius: 5, border: '1px solid transparent', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 4V1.5H4M9 1.5h2.5V4M11.5 9v2.5H9M4 11.5H1.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
          <div style={{ width: 1, height: 15, background: '#d8dcea', margin: '0 4px' }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: '#555' }}>{cl.name.replace('\n', ' ')}</span>&nbsp;
          <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, border: '1px solid', fontWeight: 500, whiteSpace: 'nowrap', color: cl.color, borderColor: cl.bc, background: cl.tc }}>{cl.count} processes</span>
          <span style={{ fontSize: 8, color: '#b0b5cc', marginLeft: 'auto' }}>Scroll to zoom · H pan · V select</span>
        </div>

        {/* Viewport */}
        <div ref={vpRef} style={{ overflow: 'hidden', height: 400, position: 'relative', cursor: tool === 'hand' ? 'grab' : 'default' }}>
          <div ref={ciRef} style={{ position: 'absolute', top: 0, left: 0, transformOrigin: '0 0', willChange: 'transform' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 10 }}>
            <div onClick={() => doZoom(0.2)} style={{ width: 24, height: 24, borderRadius: 5, border: '1px solid #ccd0de', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#555', boxShadow: '0 1px 3px rgba(0,0,0,.09)' }}>+</div>
            <div onClick={() => doZoom(-0.2)} style={{ width: 24, height: 24, borderRadius: 5, border: '1px solid #ccd0de', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#555', boxShadow: '0 1px 3px rgba(0,0,0,.09)' }}>−</div>
          </div>
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 108, height: 68, border: '1px solid #ccd0de', borderRadius: 6, background: '#fff', overflow: 'hidden', zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,.1)' }}>
            <div ref={mmRef} style={{ position: 'absolute', transformOrigin: '0 0', pointerEvents: 'none' }} />
            <div ref={mmvRef} style={{ position: 'absolute', border: '1.5px solid #1a1a1a', borderRadius: 2, background: 'rgba(26,26,26,.07)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '.35rem 1.4rem', borderTop: '1px solid #e0e3ee', background: '#f4f6fc', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 8, color: '#888', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', marginRight: 4 }}>Legend</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, color: '#888' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />Start</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, color: '#888' }}><div style={{ width: 12, height: 9, borderRadius: 2, background: '#EBF2FF', border: '1.5px solid #3B7DE8' }} />Action / step</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, color: '#888' }}><div style={{ width: 12, height: 12, transform: 'rotate(45deg)', borderRadius: 1, background: '#FFFDE7', border: '1.5px solid #C9960A' }} />Decision</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, color: '#888' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />End</div>
          <span style={{ fontSize: 8, color: '#b0b5cc', marginLeft: 'auto' }}>Read only — edit in step 4</span>
        </div>
      </div>
    </div>
  );
}
