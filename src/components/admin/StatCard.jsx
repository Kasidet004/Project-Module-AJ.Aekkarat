export default function StatCard({ icon: Icon, label, value, accent = 'circuit' }) {
  const accentClass = accent === 'volt' ? 'text-volt-400 bg-volt-400/10' : 'text-circuit-400 bg-circuit-400/10'

  return (
    <div className="card-surface p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-mono uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-display font-bold mt-0.5">{value}</p>
      </div>
    </div>
  )
}
