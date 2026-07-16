import { Search } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/utils/status'

export default function ProductFilters({ search, onSearch, category, onCategory, sort, onSort, categories = [] }) {
  const list = categories.length ? categories : PRODUCT_CATEGORIES.map((name) => ({ id: name, name }))

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="ค้นหาสินค้า เช่น RTX 4070, Ryzen 7..."
            className="input-field pl-9"
          />
        </div>
        <select value={sort} onChange={(e) => onSort(e.target.value)} className="input-field sm:w-52">
          <option value="newest">มาใหม่ล่าสุด</option>
          <option value="price_asc">ราคา: น้อยไปมาก</option>
          <option value="price_desc">ราคา: มากไปน้อย</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategory(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
            !category ? 'bg-circuit-500 text-base-950 border-circuit-500' : 'border-base-600 hover:border-circuit-500/60'
          }`}
        >
          ทั้งหมด
        </button>
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => onCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
              category === c.id ? 'bg-circuit-500 text-base-950 border-circuit-500' : 'border-base-600 hover:border-circuit-500/60'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
