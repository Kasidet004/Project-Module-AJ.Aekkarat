import { Link } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/utils/format'
import EmptyState from '@/components/common/EmptyState'

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingCart}
          title="ตะกร้าสินค้าของคุณว่างเปล่า"
          description="เลือกซื้ออุปกรณ์คอมพิวเตอร์ที่ใช่สำหรับคุณ"
          action={
            <Link to="/products" className="btn-primary">
              เลือกซื้อสินค้า
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold mb-6">ตะกร้าสินค้า</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => {
            const image = item.product?.images?.find((i) => i.is_primary)?.image_url || item.product?.images?.[0]?.image_url
            return (
              <div key={item.id} className="card-surface p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-base-900 overflow-hidden shrink-0">
                  {image && <img src={image} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{item.product?.name}</p>
                  <p className="text-circuit-400 font-display font-semibold mt-1">
                    {formatCurrency(item.product?.price)}
                  </p>
                </div>
                <div className="flex items-center border border-base-600 rounded-lg">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:text-circuit-400">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:text-circuit-400">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-danger p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            )
          })}
        </div>

        <div className="card-surface p-5 h-fit">
          <h3 className="label-eyebrow mb-4">สรุปคำสั่งซื้อ</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">ยอดรวมสินค้า</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-slate-400">ค่าจัดส่ง</span>
            <span className="text-ok">ฟรี</span>
          </div>
          <div className="flex justify-between font-display font-bold text-lg border-t border-base-600 pt-4 mb-6">
            <span>รวมทั้งหมด</span>
            <span className="text-circuit-400">{formatCurrency(subtotal)}</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-center block">
            ดำเนินการชำระเงิน
          </Link>
        </div>
      </div>
    </div>
  )
}
