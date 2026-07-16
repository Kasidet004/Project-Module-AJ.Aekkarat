import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingCart, GitCompare, Minus, Plus, PackageCheck, PackageX } from 'lucide-react'
import { productService } from '@/services/productService'
import { useCartStore } from '@/store/cartStore'
import { useCompareStore } from '@/store/compareStore'
import { formatCurrency } from '@/utils/format'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)

  const addItem = useCartStore((s) => s.addItem)
  const toggleCompare = useCompareStore((s) => s.toggle)
  const isCompared = useCompareStore((s) => s.productIds.includes(id))

  useEffect(() => {
    setLoading(true)
    productService
      .getById(id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square" />
        <div className="space-y-3">
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
          <div className="skeleton h-24 w-full" />
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = product.images?.length ? product.images : [{ image_url: null }]
  const inStock = product.stock_quantity > 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div>
        <div className="aspect-square rounded-xl overflow-hidden bg-base-900 border border-base-700 mb-3">
          {images[activeImage]?.image_url ? (
            <img src={images[activeImage].image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-sm">
              NO IMAGE
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  activeImage === i ? 'border-circuit-500' : 'border-base-700'
                }`}
              >
                {img.image_url && <img src={img.image_url} className="w-full h-full object-cover" alt="" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className="label-eyebrow">{product.category?.name}</span>
        <h1 className="text-2xl font-display font-bold mt-2 mb-3">{product.name}</h1>
        <p className="text-3xl font-display font-bold text-circuit-400 mb-4">{formatCurrency(product.price)}</p>

        <div
          className={`inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full mb-6 ${
            inStock ? 'bg-ok/10 text-ok' : 'bg-danger/10 text-danger'
          }`}
        >
          {inStock ? <PackageCheck size={14} /> : <PackageX size={14} />}
          {inStock ? `คงเหลือ ${product.stock_quantity} ชิ้น` : 'สินค้าหมด'}
        </div>

        <p className="text-slate-300 leading-relaxed mb-6">{product.description}</p>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="card-surface p-4 mb-6">
            <h3 className="label-eyebrow mb-3">สเปกสินค้า</h3>
            <dl className="space-y-2 text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-base-700 pb-2 last:border-0">
                  <dt className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-base-600 rounded-lg">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:text-circuit-400">
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-mono">{qty}</span>
            <button
              onClick={() => setQty(Math.min(product.stock_quantity, qty + 1))}
              className="p-2.5 hover:text-circuit-400"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={() => addItem(product.id, qty)}
            disabled={!inStock}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} /> เพิ่มลงตะกร้า
          </button>
          <button
            onClick={() => toggleCompare(product.id)}
            className={`btn-secondary !p-3 ${isCompared ? '!border-circuit-500 !text-circuit-400' : ''}`}
            title="เปรียบเทียบ"
          >
            <GitCompare size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
