import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderService } from '@/services/orderService'
import OrderTimeline from '@/components/product/OrderTimeline'
import { formatCurrency, formatDate } from '@/utils/format'

export default function OrderTracking() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService
      .getById(id)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 skeleton h-64" />
  if (!order) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold mb-1">คำสั่งซื้อ #{order.id.slice(0, 8)}</h1>
      <p className="text-slate-400 text-sm mb-8">สั่งซื้อเมื่อ {formatDate(order.created_at)}</p>

      <div className="card-surface p-6 mb-8">
        <OrderTimeline status={order.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-surface p-5">
          <h3 className="label-eyebrow mb-3">ที่อยู่จัดส่ง</h3>
          <p className="text-sm leading-relaxed">
            {order.shipping_address?.fullName}
            <br />
            {order.shipping_address?.address}
            <br />
            {order.shipping_address?.province} {order.shipping_address?.postalCode}
            <br />
            โทร. {order.shipping_address?.phone}
          </p>
        </div>

        <div className="card-surface p-5">
          <h3 className="label-eyebrow mb-3">รายการสินค้า</h3>
          <ul className="space-y-2 text-sm mb-4">
            {order.items?.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.product?.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.unit_price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-display font-bold border-t border-base-600 pt-3">
            <span>รวมทั้งหมด</span>
            <span className="text-circuit-400">{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
