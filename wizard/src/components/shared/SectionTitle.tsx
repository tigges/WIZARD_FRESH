export function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ padding: '.6rem 1.4rem .3rem', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#1a1a1a' }}>{title}</div>
      <div style={{ fontSize: 9, color: '#bbb', marginTop: 1 }}>{sub}</div>
    </div>
  );
}
