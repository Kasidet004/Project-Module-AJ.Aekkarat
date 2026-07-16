import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded-lg border border-base-600 disabled:opacity-30 hover:border-circuit-500/60"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-slate-600">…</span>}
          <button
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-mono ${
              p === page ? 'bg-circuit-500 text-base-950 font-bold' : 'border border-base-600 hover:border-circuit-500/60'
            }`}
          >
            {p}
          </button>
        </span>
      ))}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-base-600 disabled:opacity-30 hover:border-circuit-500/60"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
