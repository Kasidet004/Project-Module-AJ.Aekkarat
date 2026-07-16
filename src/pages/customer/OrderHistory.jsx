import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { orderService } from '@/services/orderService'
import { formatCurrency, formatDate } from '@/utils/format'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/utils/status'
import EmptyState from '@/components/common/EmptyState'
import { TableRowSkeleton } from '@/components/common/Skeletons'

export default function OrderHistory() {
  const { session } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    orderService
      .listByUser(session.user.id)
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [session])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold mb-6">คำสั่งซื้อของฉัน</h1>

      {!loading && orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="ยังไม่มีคำสั่งซื้อ" description="เริ่มเลือกซื้อสินค้าชิ้นแรกของคุณ" />
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-base-600 text-left">
                <th className="px-4 py-3 label-eyebrow">เลขที่คำสั่งซื้อ</th>
                <th className="px-4 py-3 label-eyebrow">วันที่</th>
                <th className="px-4 py-3 label-eyebrow">ยอดรวม</th>
                <th className="px-4 py-3 label-eyebrow">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-700">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} columns={4} />)
                : orders.map((order) => (
                    <tr key={order.id} className="hover:bg-base-800/40">
                      <td className="px-4 py-3">
                        <Link to={`/account/orders/${order.id}`} className="text-circuit-400 hover:underline font-mono">
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(order.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${ORDER_STATUS_COLOR[order.status]}`}>
                          {ORDER_STATUS_LABEL[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
