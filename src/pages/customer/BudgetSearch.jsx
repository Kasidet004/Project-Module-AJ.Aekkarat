import { useState } from 'react'
import { Wallet, Search } from 'lucide-react'
import { productService } from '@/services/productService'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/common/Skeletons'
import EmptyState from '@/components/common/EmptyState'
import { formatCurrency } from '@/utils/format'

export default function BudgetSearch() {
  const [budget, setBudget] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    const value = Number(budget)
    if (!value || value <= 0) return
    setLoading(true)
    try {
      const items = await productService.suggestByBudget({ budget: value })
      setResults(items)
    } finally {
      setLoading(false)
    }
  }

  const totalUsed = results?.reduce((sum, p) => sum + Number(p.price), 0) || 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <Wallet className="mx-auto text-circuit-400 mb-3" size={32} />
        <h1 className="text-2xl font-display font-bold mb-2">ค้นหาสินค้าตามงบประมาณ</h1>
        <p className="text-slate-400 text-sm">กำหนดงบที่คุณมี ระบบจะแนะนำสินค้าที่พอดีกับงบของคุณ</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 mb-10">
        <input
          type="number"
          min="1"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="ระบุงบประมาณ เช่น 30000"
          className="input-field"
        />
        <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Search size={16} /> ค้นหา
        </button>
      </form>

      {loading && <ProductGridSkeleton />}

      {!loading && results && (
        <>
          <div className="card-surface p-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-slate-400">พบ {results.length} รายการภายในงบ {formatCurrency(budget)}</span>
            <span className="font-display font-semibold text-circuit-400">
              รวม {formatCurrency(totalUsed)}
            </span>
          </div>

          {results.length === 0 ? (
            <EmptyState title="ไม่พบสินค้าในงบนี้" description="ลองเพิ่มงบประมาณ แล้วค้นหาอีกครั้ง" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
