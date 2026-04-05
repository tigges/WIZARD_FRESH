interface Props {
  title: string;
  sub?: string;
  style?: React.CSSProperties;
}

export function SectionTitle({ title, sub, style }: Props) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#1a1a1a',
        padding: '.65rem 1.4rem .35rem',
        borderBottom: '1px solid #f0f0f0',
        letterSpacing: '-.01em',
        ...style,
      }}
    >
      {title}
      {sub && (
        <span style={{ fontWeight: 400, color: '#bbb', fontSize: 10, marginLeft: 6 }}>
          {sub}
        </span>
      )}
    </div>
  );
}
