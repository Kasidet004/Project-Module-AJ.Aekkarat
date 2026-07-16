import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu, MemoryStick, MonitorSmartphone, HardDrive, Zap, Box, CircuitBoard, ArrowRight } from 'lucide-react'
import { productService } from '@/services/productService'
import ProductCard from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/common/Skeletons'
import { PRODUCT_CATEGORIES } from '@/utils/status'

const CATEGORY_ICONS = {
  CPU: Cpu,
  Mainboard: CircuitBoard,
  RAM: MemoryStick,
  GPU: MonitorSmartphone,
  SSD: HardDrive,
  PSU: Zap,
  Case: Box,
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [featuredRes, bestSellersRes] = await Promise.all([
          productService.list({ sort: 'newest', page: 1 }),
          productService.list({ sort: 'price_desc', page: 1 }),
        ])
        setFeatured(featuredRes.items.slice(0, 4))
        setBestSellers(bestSellersRes.items.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-base-700 bg-circuit-grid bg-grid">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <span className="label-eyebrow">Build Your Rig</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4 leading-tight">
              ประกอบคอมในฝัน <br />
              <span className="text-gradient">ด้วยสเปกที่ใช่ ราคาที่คุ้ม</span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-md">
              เลือกซื้อ CPU, การ์ดจอ, เมนบอร์ด และอุปกรณ์คอมพิวเตอร์ครบวงจร พร้อมเครื่องมือเปรียบเทียบสเปกและค้นหาตามงบประมาณ
            </p>
            <div className="flex gap-3">
              <Link to="/products" className="btn-primary flex items-center gap-2">
                เลือกซื้อสินค้า <ArrowRight size={16} />
              </Link>
              <Link to="/budget-search" className="btn-secondary">
                ค้นหาตามงบประมาณ
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-circuit-500/20 to-volt-500/20 border border-base-600 flex items-center justify-center">
              <Cpu size={140} className="text-circuit-400 drop-shadow-[0_0_30px_rgba(34,211,199,0.5)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-xl font-display font-semibold mb-6">หมวดหมู่สินค้า</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Box
            return (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="card-surface p-4 flex flex-col items-center gap-2 hover:border-circuit-500/60 hover:shadow-glow transition-all"
              >
                <Icon className="text-circuit-400" size={24} />
                <span className="text-xs font-mono">{cat}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold">สินค้าแนะนำ</h2>
          <Link to="/products" className="text-sm text-circuit-400 hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Best sellers */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold">สินค้าขายดี</h2>
        </div>
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
