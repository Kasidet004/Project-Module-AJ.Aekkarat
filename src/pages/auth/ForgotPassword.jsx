import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { authService } from '@/services/authService'

const schema = z.object({ email: z.string().email('อีเมลไม่ถูกต้อง') })

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async ({ email }) => {
    try {
      await authService.sendPasswordReset(email)
      setSent(true)
    } catch (err) {
      toast.error(err.message || 'ส่งอีเมลไม่สำเร็จ')
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-circuit-grid bg-grid">
      <div className="w-full max-w-sm card-surface p-8">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto text-circuit-400 mb-3" size={36} />
            <h1 className="font-display font-semibold text-lg mb-2">ตรวจสอบอีเมลของคุณ</h1>
            <p className="text-sm text-slate-400">เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว</p>
          </div>
        ) : (
          <>
            <h1 className="font-display font-semibold text-lg mb-2">ลืมรหัสผ่าน</h1>
            <p className="text-sm text-slate-400 mb-6">กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ให้</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input {...register('email')} className="input-field" placeholder="you@example.com" />
                {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
              </button>
            </form>
          </>
        )}
        <p className="text-center text-sm text-slate-400 mt-6">
          <Link to="/login" className="text-circuit-400 hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  )
}
