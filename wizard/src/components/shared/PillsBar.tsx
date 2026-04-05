import { pills } from '../../data/pills';

export function PillsBar() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: '.5rem 1.4rem',
        borderBottom: '1px solid #e5e5e5',
        flexWrap: 'wrap',
      }}
    >
      {pills.map((p) => (
        <span
          key={p.t}
          style={{
            fontSize: 9,
            padding: '2px 8px',
            borderRadius: 6,
            background: p.bg,
            color: p.tc,
            border: `1px solid ${p.bc}`,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {p.label} <span style={{ opacity: 0.6 }}>{p.count}</span>
        </span>
      ))}
    </div>
  );
}
