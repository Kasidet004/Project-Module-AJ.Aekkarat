import { Inbox } from 'lucide-react'

export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-16 h-16 rounded-2xl bg-base-800 border border-base-600 flex items-center justify-center mb-4">
        <Icon className="text-circuit-400" size={28} />
      </div>
      <h3 className="font-display font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-slate-400 text-sm max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
