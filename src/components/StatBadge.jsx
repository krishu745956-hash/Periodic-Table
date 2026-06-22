export default function StatBadge({ label, value, color = 'ink' }) {
  if (value == null || value === '—' || value === '') return null

  return (
    <div className="flex flex-col gap-0.5 border-l-2 pl-2" style={{ borderColor: color }}>
      <span className="text-xs font-mono text-ink-muted uppercase tracking-wider">{label}</span>
      <span className="font-body text-ink">{value}</span>
    </div>
  )
}