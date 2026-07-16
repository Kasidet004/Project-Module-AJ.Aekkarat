import { useEffect, useState } from 'react'
import { Users, Package, ClipboardList, Wallet } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'
import SalesChart from '@/components/charts/SalesChart'
import TopProductsChart from '@/components/charts/TopProductsChart'
import CategoryPieChart from '@/components/charts/CategoryPieChart'
import { dashboardService } from '@/services/dashboardService'
import { formatCurrency } from '@/utils/format'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [monthlySales, setMonthlySales] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [salesByCategory, setSalesByCategory] = useState([])

  useEffect(() => {
    dashboardService.getSummary().then(setSummary)
    dashboardService.getMonthlySales().then(setMonthlySales)
    dashboardService.getTopSellingProducts().then(setTopProducts)
    dashboardService.getSalesByCategory().then(setSalesByCategory)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Dashboard ภาพรวม</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="ผู้ใช้ทั้งหมด" value={summary?.userCount ?? '—'} />
        <StatCard icon={Package} label="สินค้า" value={summary?.productCount ?? '—'} accent="volt" />
        <StatCard icon={ClipboardList} label="คำสั่งซื้อ" value={summary?.orderCount ?? '—'} />
        <StatCard
          icon={Wallet}
          label="ยอดขายรวม"
          value={summary ? formatCurrency(summary.totalSales) : '—'}
          accent="volt"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <SalesChart data={monthlySales} />
        <TopProductsChart data={topProducts} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <CategoryPieChart data={salesByCategory} />
      </div>
    </div>
  )
}
