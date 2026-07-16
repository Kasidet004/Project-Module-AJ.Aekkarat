import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Tags, ClipboardList, Cpu, ArrowLeftCircle } from 'lucide-react'

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'สินค้า', icon: Package },
  { to: '/admin/categories', label: 'หมวดหมู่', icon: Tags },
  { to: '/admin/orders', label: 'คำสั่งซื้อ', icon: ClipboardList },
]

export default function AdminSidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-base-700 bg-base-900/60 min-h-screen p-4 hidden md:flex md:flex-col">
      <div className="flex items-center gap-2 font-display font-bold text-lg px-2 mb-8">
        <Cpu className="text-circuit-400" size={24} />
        PC<span className="text-circuit-400">Hub</span>
        <span className="label-eyebrow ml-1">Admin</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-circuit-500/15 text-circuit-400' : 'text-slate-300 hover:bg-base-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <NavLink to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-circuit-400">
        <ArrowLeftCircle size={16} /> กลับหน้าร้านค้า
      </NavLink>
    </aside>
  )
}
