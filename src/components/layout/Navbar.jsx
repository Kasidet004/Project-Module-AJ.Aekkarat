import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, GitCompare } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useCompareStore } from '@/store/compareStore'

const links = [
  { to: '/products', label: 'สินค้าทั้งหมด' },
  { to: '/budget-search', label: 'ค้นหาตามงบ' },
  { to: '/compare', label: 'เปรียบเทียบ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { session, profile, signOut, isAdmin } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount)
  const compareCount = useCompareStore((s) => s.productIds.length)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-base-950/85 backdrop-blur-md border-b border-base-700">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <Cpu className="text-circuit-400" size={26} />
          <span>
            PC<span className="text-circuit-400">Hub</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors hover:text-circuit-400 ${isActive ? 'text-circuit-400' : 'text-slate-300'}`
              }
            >
              {l.label === 'เปรียบเทียบ' && compareCount > 0 ? `${l.label} (${compareCount})` : l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/compare" className="relative p-2 hover:text-circuit-400 transition-colors">
            <GitCompare size={20} />
          </Link>
          <Link to="/cart" className="relative p-2 hover:text-circuit-400 transition-colors">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-circuit-500 text-base-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="btn-secondary flex items-center gap-1.5 !py-2 text-xs">
                  <LayoutDashboard size={14} /> Admin
                </Link>
              )}
              <Link to="/account/orders" className="p-2 hover:text-circuit-400 transition-colors">
                <User size={20} />
              </Link>
              <button onClick={handleSignOut} className="p-2 hover:text-danger transition-colors" title="ออกจากระบบ">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !py-2 text-sm">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-base-700 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3 text-sm">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-slate-300">
                  {l.label}
                </NavLink>
              ))}
              <Link to="/cart" onClick={() => setOpen(false)}>
                ตะกร้าสินค้า ({itemCount})
              </Link>
              {session ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="text-circuit-400">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/account/orders" onClick={() => setOpen(false)}>
                    คำสั่งซื้อของฉัน
                  </Link>
                  <button onClick={handleSignOut} className="text-left text-danger">
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="text-circuit-400">
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
