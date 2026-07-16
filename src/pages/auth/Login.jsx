import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านอย่างน้อย 6 ตัวอักษร'),
})

export default function Login() {
  const { signIn } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      const profile = await signIn(values)
      toast.success('เข้าสู่ระบบสำเร็จ')
      const from = location.state?.from?.pathname
      navigate(from || (profile?.role === 'admin' ? '/admin' : '/'))
    } catch (err) {
      toast.error(err.message || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-circuit-grid bg-grid">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm card-surface p-8"
      >
        <div className="flex items-center gap-2 justify-center mb-6">
          <Cpu className="text-circuit-400" size={28} />
          <span className="font-display font-bold text-xl">
            PC<span className="text-circuit-400">Hub</span>
          </span>
        </div>
        <h1 className="text-center font-display font-semibold text-lg mb-6">เข้าสู่ระบบ</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">อีเมล</label>
            <input {...register('email')} className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">รหัสผ่าน</label>
            <input type="password" {...register('password')} className="input-field" placeholder="••••••••" />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-circuit-400 hover:underline">
              ลืมรหัสผ่าน?
            </Link>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="text-circuit-400 hover:underline">
            สมัครสมาชิก
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
