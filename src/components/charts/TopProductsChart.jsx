import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#22D3C7', '#8B5CF6', '#5EEAD4', '#A78BFA', '#0EA5A0']

export default function TopProductsChart({ data }) {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-semibold mb-4">สินค้าขายดี Top 5</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid stroke="#1D2438" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#64748B"
            fontSize={12}
            width={120}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={{ background: '#151B2B', border: '1px solid #2A3350', borderRadius: 8 }} />
          <Bar dataKey="quantity" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
