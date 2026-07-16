import { Check, Clock, XCircle } from 'lucide-react'
import { ORDER_STATUS, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from '@/utils/status'

export default function OrderTimeline({ status }) {
  if (status === ORDER_STATUS.CANCELLED) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg bg-danger/10 border border-danger/30 text-danger">
        <XCircle size={20} />
        <span className="font-medium">คำสั่งซื้อนี้ถูกยกเลิก</span>
      </div>
    )
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(status)

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-0">
      {ORDER_STATUS_FLOW.map((step, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        const isLast = i === ORDER_STATUS_FLOW.length - 1

        return (
          <div key={step} className="flex md:flex-1 items-start md:items-center gap-3 md:gap-0">
            <div className="flex md:flex-col items-center gap-3 md:gap-2 md:flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 ${
                  done
                    ? 'bg-circuit-500 border-circuit-500 text-base-950'
                    : active
                    ? 'border-circuit-400 text-circuit-400 animate-pulse'
                    : 'border-base-600 text-slate-500'
                }`}
              >
                {done ? <Check size={16} /> : <Clock size={14} />}
              </div>
              <span className={`text-xs text-center ${active ? 'text-circuit-400 font-medium' : 'text-slate-400'}`}>
                {ORDER_STATUS_LABEL[step]}
              </span>
            </div>
            {!isLast && (
              <div className={`hidden md:block h-0.5 flex-1 -mt-6 ${done ? 'bg-circuit-500' : 'bg-base-600'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
