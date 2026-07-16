import { Link } from 'react-router-dom'
import { Cpu } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Cpu className="text-circuit-400 mb-4" size={48} />
      <h1 className="font-display font-bold text-4xl mb-2">404</h1>
      <p className="text-slate-400 mb-6">ไม่พบหน้าที่คุณกำลังค้นหา</p>
      <Link to="/" className="btn-primary">
        กลับหน้าแรก
      </Link>
    </div>
  )
}
