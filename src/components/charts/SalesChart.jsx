import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/format'

export default function SalesChart({ data }) {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-semibold mb-4">ยอดขายรายเดือน</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3C7" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22D3C7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1D2438" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#64748B"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ background: '#151B2B', border: '1px solid #2A3350', borderRadius: 8 }}
            formatter={(value) => [formatCurrency(value), 'ยอดขาย']}
          />
          <Area type="monotone" dataKey="total" stroke="#22D3C7" strokeWidth={2} fill="url(#salesGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
