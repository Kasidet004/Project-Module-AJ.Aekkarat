import { useEffect, useState } from 'react'
import { GitCompare } from 'lucide-react'
import { useCompareStore } from '@/store/compareStore'
import { productService } from '@/services/productService'
import CompareTable from '@/components/product/CompareTable'
import EmptyState from '@/components/common/EmptyState'
import { Link } from 'react-router-dom'

export default function Compare() {
  const { productIds, clear } = useCompareStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!productIds.length) {
      setProducts([])
      return
    }
    setLoading(true)
    productService
      .getByIds(productIds)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [productIds])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">เปรียบเทียบสินค้า</h1>
        {products.length > 0 && (
          <button onClick={clear} className="text-sm text-danger hover:underline">
            ล้างรายการทั้งหมด
          </button>
        )}
      </div>

      {loading ? (
        <div className="skeleton h-64 w-full" />
      ) : products.length === 0 ? (
        <EmptyState
          icon={GitCompare}
          title="ยังไม่มีสินค้าที่เลือกเปรียบเทียบ"
          description="เลือกสินค้าสูงสุด 4 ชิ้นจากหน้าสินค้าทั้งหมดเพื่อเปรียบเทียบสเปก"
          action={
            <Link to="/products" className="btn-primary">
              เลือกซื้อสินค้า
            </Link>
          }
        />
      ) : (
        <CompareTable products={products} onRemove={(id) => useCompareStore.getState().toggle(id)} />
      )}
    </div>
  )
}
