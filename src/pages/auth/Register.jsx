import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Cpu } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'

const schema = z
  .object({
    fullName: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    password: z.string().min(6, 'รหัสผ่านอย่างน้อย 6 ตัวอักษร'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

export default function Register() {
  const { signUp } = useAuthStore()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await signUp({ email: values.email, password: values.password, fullName: values.fullName })
      toast.success('สมัครสมาชิกสำเร็จ กรุณายืนยันอีเมลของคุณ')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'สมัครสมาชิกไม่สำเร็จ')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-circuit-grid bg-grid">
      <div className="w-full max-w-sm card-surface p-8">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Cpu className="text-circuit-400" size={28} />
          <span className="font-display font-bold text-xl">
            PC<span className="text-circuit-400">Hub</span>
          </span>
        </div>
        <h1 className="text-center font-display font-semibold text-lg mb-6">สมัครสมาชิก</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ชื่อ-นามสกุล</label>
            <input {...register('fullName')} className="input-field" placeholder="สมชาย ใจดี" />
            {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">อีเมล</label>
            <input {...register('email')} className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">รหัสผ่าน</label>
            <input type="password" {...register('password')} className="input-field" />
            {errors.password && <p className="text-danger text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ยืนยันรหัสผ่าน</label>
            <input type="password" {...register('confirmPassword')} className="input-field" />
            {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-circuit-400 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  )
}
