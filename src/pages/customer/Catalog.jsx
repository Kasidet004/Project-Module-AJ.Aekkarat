import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import ProductCard from '@/components/product/ProductCard'
import ProductFilters from '@/components/product/ProductFilters'
import Pagination from '@/components/common/Pagination'
import EmptyState from '@/components/common/EmptyState'
import { ProductGridSkeleton } from '@/components/common/Skeletons'

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [result, setResult] = useState({ items: [], total: 0, pageSize: 12 })
  const [loading, setLoading] = useState(true)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || null
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => {})
  }, [])

  const updateParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams)
      if (value) next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  useEffect(() => {
    setLoading(true)
    productService
      .list({ search, categoryId: category, sort, page })
      .then(setResult)
      .finally(() => setLoading(false))
  }, [search, category, sort, page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold mb-6">สินค้าทั้งหมด</h1>

      <ProductFilters
        search={search}
        onSearch={(v) => updateParam('search', v)}
        category={category}
        onCategory={(v) => updateParam('category', v)}
        sort={sort}
        onSort={(v) => updateParam('sort', v)}
        categories={categories}
      />

      {loading ? (
        <ProductGridSkeleton />
      ) : result.items.length === 0 ? (
        <EmptyState icon={PackageSearch} title="ไม่พบสินค้า" description="ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ใหม่" />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {result.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={result.pageSize}
            total={result.total}
            onChange={(p) => updateParam('page', String(p))}
          />
        </>
      )}
    </div>
  )
}
