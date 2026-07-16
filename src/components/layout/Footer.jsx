import { Cpu } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-base-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-slate-400">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-white mb-2">
            <Cpu className="text-circuit-400" size={22} />
            PC<span className="text-circuit-400">Hub</span>
          </div>
          <p>ร้านอุปกรณ์คอมพิวเตอร์และเกมมิ่งเกียร์ครบวงจร สเปกจริง ราคาโปร่งใส</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">หมวดหมู่สินค้า</h4>
          <ul className="space-y-2">
            <li>CPU</li>
            <li>Mainboard</li>
            <li>GPU</li>
            <li>RAM / SSD</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">บริการลูกค้า</h4>
          <ul className="space-y-2">
            <li>ติดตามคำสั่งซื้อ</li>
            <li>นโยบายการคืนสินค้า</li>
            <li>ติดต่อเรา</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">เกี่ยวกับเรา</h4>
          <p>เปิดให้บริการทุกวัน 09:00–20:00 น.</p>
        </div>
      </div>
      <div className="text-center text-xs text-slate-600 pb-6">© {new Date().getFullYear()} PC Hub. All rights reserved.</div>
    </footer>
  )
}
