import { useState, useEffect } from 'react';
import { pageMapPages } from '../../../data/pageMapPages';
import type { PageMapTile } from '../../../types';

export function Step2PageMap() {
  const [pageIdx, setPageIdx] = useState(0);
  const page = pageMapPages[pageIdx];
  const total = pageMapPages.length;

  const go = (d: number) => {
    setPageIdx((i) => Math.max(0, Math.min(total - 1, i + d)));
  };

  return (
    <div>
      {/* Navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.6rem 1.4rem .4rem' }}>
        <button onClick={() => go(-1)} disabled={pageIdx === 0} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid #e5e5e5', background: '#fff', cursor: pageIdx === 0 ? 'default' : 'pointer', fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pageIdx === 0 ? 0.25 : 1 }}>←</button>
        <div style={{ fontSize: 10, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
          p.
          <input
            type="number"
            value={pageIdx + 1}
            min={1}
            max={total}
            onChange={(e) => {
              const v = parseInt(e.target.value) - 1;
              if (!isNaN(v)) setPageIdx(Math.max(0, Math.min(total - 1, v)));
            }}
            style={{ width: 28, textAlign: 'center', border: '1px solid #e5e5e5', borderRadius: 4, padding: 2, fontSize: 10, color: '#1a1a1a' }}
          />
          of {total}
        </div>
        <button onClick={() => go(1)} disabled={pageIdx === total - 1} style={{ width: 22, height: 22, borderRadius: 5, border: '1px solid #e5e5e5', background: '#fff', cursor: pageIdx === total - 1 ? 'default' : 'pointer', fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: pageIdx === total - 1 ? 0.25 : 1 }}>→</button>
      </div>

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '148px 1fr', gap: 10, padding: '0 1.4rem .6rem' }}>
        {/* Left: structure */}
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#bbb', marginBottom: '.4rem' }}>Page structure</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {page.blocks.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px', borderRadius: 5, border: '1px solid', borderColor: b.a ? '#ebebeb' : 'transparent', background: b.a ? '#f4f5f7' : 'transparent' }}>
                <div style={{ width: 13, height: 13, borderRadius: 2, fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: b.bg, color: b.ic }}>{b.i}</div>
                <span style={{ fontSize: 9, color: '#555', flex: 1 }}>{b.l}</span>
                <span style={{ fontSize: 8, color: '#bbb', fontFamily: 'monospace' }}>{b.n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: tiles */}
        <div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#bbb', marginBottom: '.4rem' }}>Import interpretation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {page.tiles.map((t, i) => (
              <TileCard key={i} tile={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Keywords footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', padding: '.4rem 1.4rem .6rem', borderTop: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: 8, color: '#bbb', fontWeight: 600, flexShrink: 0 }}>Keywords</span>
        {page.kw.map((k) => (
          <span key={k} style={{ fontSize: 8, padding: '1px 6px', borderRadius: 6, background: '#fff', border: '1px solid #e5e5e5', color: '#888' }}>{k}</span>
        ))}
      </div>
    </div>
  );
}

function TileCard({ tile }: { tile: PageMapTile }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(tile.cf), 60);
    return () => clearTimeout(timer);
  }, [tile.cf]);

  return (
    <div style={{ border: '1px solid #e5e5e5', borderRadius: 6, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 7px', borderBottom: '1px solid #f0f0f0', background: tile.tc }}>
        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', padding: '1px 5px', borderRadius: 3, flexShrink: 0, background: tile.tb, color: tile.tt }}>{tile.tl}</span>
        <span style={{ fontSize: 9, fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: tile.tt }}>{tile.ti}</span>
      </div>
      <div style={{ padding: '4px 7px 5px' }}>
        <div style={{ fontSize: 9, color: '#888', lineHeight: 1.45, marginBottom: 4 }}>{tile.td}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 7, color: '#bbb', width: 48, flexShrink: 0 }}>Confidence</span>
          <div style={{ flex: 1, height: 2, background: '#f0f0f0', borderRadius: 1 }}>
            <div style={{ height: '100%', borderRadius: 1, transition: 'width .5s cubic-bezier(.4,0,.2,1)', width: `${width}%`, background: tile.tt }} />
          </div>
          <span style={{ fontSize: 7, color: '#bbb', fontFamily: 'monospace', width: 22, textAlign: 'right' }}>{tile.cf}%</span>
        </div>
      </div>
    </div>
  );
}
