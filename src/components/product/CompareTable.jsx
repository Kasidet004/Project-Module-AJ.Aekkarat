import { formatCurrency } from '@/utils/format'
import { X } from 'lucide-react'

export default function CompareTable({ products, onRemove }) {
  if (!products.length) return null

  // Union of all spec keys across compared products
  const specKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs || {})))
  )

  const rowDiffers = (key) => {
    const values = products.map((p) => JSON.stringify(p.specs?.[key] ?? null))
    return new Set(values).size > 1
  }

  return (
    <div className="overflow-x-auto card-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-600">
            <th className="text-left p-4 label-eyebrow w-40">รายการ</th>
            {products.map((p) => (
              <th key={p.id} className="p-4 min-w-[200px]">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-left">
                    <p className="font-medium leading-snug">{p.name}</p>
                    <p className="text-circuit-400 font-display mt-1">{formatCurrency(p.price)}</p>
                  </div>
                  <button onClick={() => onRemove(p.id)} className="text-slate-500 hover:text-danger">
                    <X size={16} />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specKeys.map((key) => (
            <tr key={key} className="border-b border-base-700 last:border-0">
              <td className="p-4 text-slate-400 capitalize">{key.replace(/_/g, ' ')}</td>
              {products.map((p) => (
                <td
                  key={p.id}
                  className={`p-4 ${rowDiffers(key) ? 'bg-volt-500/10 text-volt-400 font-medium' : ''}`}
                >
                  {p.specs?.[key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
