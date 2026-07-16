import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/utils/format'

const COLORS = ['#22D3C7', '#8B5CF6', '#5EEAD4', '#A78BFA', '#0EA5A0', '#FBBF24', '#FB7185']

export default function CategoryPieChart({ data }) {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-semibold mb-4">ยอดขายตามหมวดหมู่</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#0A0E14" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#151B2B', border: '1px solid #2A3350', borderRadius: 8 }}
            formatter={(value) => formatCurrency(value)}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
