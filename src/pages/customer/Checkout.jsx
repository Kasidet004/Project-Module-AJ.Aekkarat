import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { QrCode, Upload, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { orderService } from '@/services/orderService'
import { storageService } from '@/services/storageService'
import { formatCurrency } from '@/utils/format'

const schema = z.object({
  fullName: z.string().min(2, 'กรุณากรอกชื่อผู้รับ'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),
  address: z.string().min(10, 'กรุณากรอกที่อยู่ให้ครบถ้วน'),
  province: z.string().min(2, 'กรุณากรอกจังหวัด'),
  postalCode: z.string().min(5, 'กรุณากรอกรหัสไปรษณีย์'),
})

const STEPS = ['ที่อยู่จัดส่ง', 'ชำระเงิน']

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [order, setOrder] = useState(null)
  const [slipFile, setSlipFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { items, subtotal, clear } = useCartStore()
  const { session } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const proceedToPayment = async (values) => {
    try {
      const created = await orderService.createOrder({
        userId: session.user.id,
        cartItems: items,
        shippingAddress: values,
        totalAmount: subtotal,
      })
      setOrder(created)
      setStep(1)
    } catch (err) {
      toast.error(err.message || 'สร้างคำสั่งซื้อไม่สำเร็จ')
    }
  }

  const handleUploadSlip = async () => {
    if (!slipFile || !order) return
    setUploading(true)
    try {
      const url = await storageService.upload(slipFile, 'payment-slips', order.id)
      await orderService.attachPaymentSlip({ orderId: order.id, slipUrl: url })
      await clear()
      toast.success('อัปโหลดสลิปสำเร็จ รอการตรวจสอบ')
      navigate(`/account/orders/${order.id}`)
    } catch (err) {
      toast.error(err.message || 'อัปโหลดสลิปไม่สำเร็จ')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-display font-bold mb-2">ชำระเงิน</h1>
      <div className="flex gap-4 mb-8 text-sm">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 ${i <= step ? 'text-circuit-400' : 'text-slate-500'}`}>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono border ${
                i <= step ? 'border-circuit-500 bg-circuit-500/10' : 'border-base-600'
              }`}
            >
              {i + 1}
            </span>
            {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <form onSubmit={handleSubmit(proceedToPayment)} className="card-surface p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ชื่อผู้รับ</label>
            <input {...register('fullName')} className="input-field" />
            {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">เบอร์โทรศัพท์</label>
            <input {...register('phone')} className="input-field" />
            {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ที่อยู่จัดส่ง</label>
            <textarea {...register('address')} rows={3} className="input-field" />
            {errors.address && <p className="text-danger text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">จังหวัด</label>
              <input {...register('province')} className="input-field" />
              {errors.province && <p className="text-danger text-xs mt-1">{errors.province.message}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">รหัสไปรษณีย์</label>
              <input {...register('postalCode')} className="input-field" />
              {errors.postalCode && <p className="text-danger text-xs mt-1">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div className="border-t border-base-600 pt-4 flex justify-between font-display font-bold">
            <span>ยอดที่ต้องชำระ</span>
            <span className="text-circuit-400">{formatCurrency(subtotal)}</span>
          </div>

          <button type="submit" className="btn-primary w-full">
            ยืนยันที่อยู่และดำเนินการชำระเงิน
          </button>
        </form>
      )}

      {step === 1 && order && (
        <div className="card-surface p-6 text-center">
          <h3 className="font-display font-semibold mb-1">สแกน QR เพื่อชำระเงิน</h3>
          <p className="text-slate-400 text-sm mb-6">คำสั่งซื้อ #{order.id.slice(0, 8)}</p>

          <div className="w-56 h-56 mx-auto bg-white rounded-xl flex items-center justify-center mb-6">
            <QrCode size={180} className="text-base-950" />
          </div>

          <p className="font-display font-bold text-2xl text-circuit-400 mb-8">{formatCurrency(subtotal)}</p>

          <label className="block card-surface border-dashed border-2 border-base-600 p-6 cursor-pointer hover:border-circuit-500/60 transition-colors mb-4">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setSlipFile(e.target.files?.[0])} />
            {slipFile ? (
              <span className="flex items-center justify-center gap-2 text-ok">
                <CheckCircle2 size={18} /> {slipFile.name}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 text-slate-400">
                <Upload size={18} /> อัปโหลดสลิปการโอนเงิน
              </span>
            )}
          </label>

          <button onClick={handleUploadSlip} disabled={!slipFile || uploading} className="btn-primary w-full">
            {uploading ? 'กำลังอัปโหลด...' : 'ยืนยันการชำระเงิน'}
          </button>
        </div>
      )}
    </div>
  )
}
