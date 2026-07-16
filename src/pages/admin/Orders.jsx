import { useEffect, useState, useCallback } from 'react'
import { CheckCircle2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { orderService } from '@/services/orderService'
import DataTable from '@/components/admin/DataTable'
import { formatCurrency, formatDate } from '@/utils/format'
import { ORDER_STATUS, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/utils/status'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    orderService
      .listAll({ status: statusFilter || null })
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [statusFilter])

  useEffect(() => {
    load()
  }, [load])

  const handleApprove = async (order) => {
    const payment = order.payment?.[0]
    if (!payment) return toast.error('ยังไม่พบสลิปการโอนเงิน')
    try {
      await orderService.approvePayment(payment.id, order.id)
      toast.success('อนุมัติการชำระเงินสำเร็จ')
      load()
    } catch (err) {
      toast.error(err.message || 'อนุมัติไม่สำเร็จ')
    }
  }

  const handleStatusChange = async (order, status) => {
    try {
      await orderService.updateStatus(order.id, status)
      toast.success('อัปเดตสถานะสำเร็จ')
      load()
    } catch (err) {
      toast.error(err.message || 'อัปเดตสถานะไม่สำเร็จ')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-display font-bold">จัดการคำสั่งซื้อ</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-56">
          <option value="">ทุกสถานะ</option>
          {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={['เลขที่คำสั่งซื้อ', 'ลูกค้า', 'วันที่', 'ยอดรวม', 'สถานะ', 'จัดการ']}
        data={orders}
        isLoading={loading}
        emptyMessage="ไม่พบคำสั่งซื้อ"
        renderRow={(order) => {
          const payment = order.payment?.[0]
          return (
            <tr key={order.id} className="hover:bg-base-800/40">
              <td className="px-4 py-3 font-mono text-circuit-400">#{order.id.slice(0, 8)}</td>
              <td className="px-4 py-3">{order.user?.full_name || order.user?.email}</td>
              <td className="px-4 py-3 text-slate-400">{formatDate(order.created_at)}</td>
              <td className="px-4 py-3 font-medium">{formatCurrency(order.total_amount)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${ORDER_STATUS_COLOR[order.status]}`}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {payment?.slip_url && (
                    <a href={payment.slip_url} target="_blank" rel="noreferrer" className="p-1.5 rounded hover:bg-base-700 text-slate-300" title="ดูสลิป">
                      <ExternalLink size={15} />
                    </a>
                  )}
                  {order.status === ORDER_STATUS.PAYMENT_VERIFICATION && (
                    <button onClick={() => handleApprove(order)} className="p-1.5 rounded hover:bg-base-700 text-ok" title="อนุมัติการชำระเงิน">
                      <CheckCircle2 size={15} />
                    </button>
                  )}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="input-field !py-1 !px-2 text-xs w-36"
                  >
                    {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
          )
        }}
      />
    </div>
  )
}
