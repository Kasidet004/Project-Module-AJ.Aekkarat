import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, GitCompare, Check } from 'lucide-react'
import { formatCurrency } from '@/utils/format'
import { useCartStore } from '@/store/cartStore'
import { useCompareStore } from '@/store/compareStore'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleCompare = useCompareStore((s) => s.toggle)
  const isCompared = useCompareStore((s) => s.productIds.includes(product.id))
  const primaryImage = product.images?.find((i) => i.is_primary)?.image_url || product.images?.[0]?.image_url

  const outOfStock = product.stock_quantity <= 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card-surface group overflow-hidden flex flex-col"
    >
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-base-900 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
            NO IMAGE
          </div>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-danger/90 text-white text-[10px] font-bold px-2 py-1 rounded">
            สินค้าหมด
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleCompare(product.id)
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-colors ${
            isCompared ? 'bg-circuit-500 text-base-950' : 'bg-base-950/70 text-slate-300 hover:text-circuit-400'
          }`}
          title="เพิ่มเพื่อเปรียบเทียบ"
        >
          {isCompared ? <Check size={14} /> : <GitCompare size={14} />}
        </button>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <span className="label-eyebrow mb-1">{product.category?.name}</span>
        <Link to={`/products/${product.id}`} className="text-sm font-medium leading-snug mb-2 hover:text-circuit-400 line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-display font-bold text-circuit-400">{formatCurrency(product.price)}</span>
          <button
            onClick={() => addItem(product.id)}
            disabled={outOfStock}
            className="btn-primary !p-2 !rounded-lg disabled:!bg-base-700 disabled:!text-slate-500"
            title="เพิ่มลงตะกร้า"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
