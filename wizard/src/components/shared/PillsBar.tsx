import { useState } from 'react';
import { pills } from '../../data/pills';

export function PillsBar() {
  const [active, setActive] = useState<string>('all');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        padding: '.45rem 1.4rem',
        borderBottom: '1px solid #f0f0f0',
        flexWrap: 'wrap',
        background: '#fff',
      }}
    >
      {pills.map((p) => {
        const isOff = active !== 'all' && active !== p.t;
        return (
          <span
            key={p.t}
            onClick={() => setActive(p.t === active ? 'all' : p.t === 'all' ? 'all' : p.t)}
            style={{
              fontSize: 8,
              padding: '2px 7px',
              borderRadius: 7,
              border: '1px solid',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              transition: 'opacity .15s',
              opacity: isOff ? 0.3 : 1,
              background: p.bg,
              borderColor: p.bc,
              color: p.tc,
            }}
          >
            <span style={{ fontWeight: 700, marginRight: 2 }}>{p.count}</span>
            {p.label}
          </span>
        );
      })}
    </div>
  );
}
