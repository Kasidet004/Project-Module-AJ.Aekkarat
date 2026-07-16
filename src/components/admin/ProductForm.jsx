import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService } from '@/services/productService'
import { storageService } from '@/services/storageService'

const schema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่อสินค้า'),
  category_id: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
  price: z.coerce.number().positive('ราคาต้องมากกว่า 0'),
  stock_quantity: z.coerce.number().int().min(0, 'จำนวนคงเหลือต้องไม่ติดลบ'),
  description: z.string().optional(),
  specsText: z.string().optional(),
})

export default function ProductForm({ product, categories, onSaved }) {
  const [imageFile, setImageFile] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: product
      ? {
          name: product.name,
          category_id: product.category_id,
          price: product.price,
          stock_quantity: product.stock_quantity,
          description: product.description,
          specsText: product.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '',
        }
      : { price: 0, stock_quantity: 0 },
  })

  const parseSpecs = (text) => {
    if (!text) return {}
    return Object.fromEntries(
      text
        .split('\n')
        .map((line) => line.split(':').map((s) => s.trim()))
        .filter(([k, v]) => k && v)
    )
  }

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        category_id: values.category_id,
        price: values.price,
        stock_quantity: values.stock_quantity,
        description: values.description,
        specs: parseSpecs(values.specsText),
      }

      let saved
      if (product) {
        saved = await productService.update(product.id, payload)
      } else {
        saved = await productService.create(payload)
      }

      if (imageFile) {
        const url = await storageService.upload(imageFile, 'product-images', saved.id)
        await productService.addImage({ productId: saved.id, imageUrl: url, isPrimary: true })
      }

      toast.success(product ? 'แก้ไขสินค้าสำเร็จ' : 'เพิ่มสินค้าสำเร็จ')
      onSaved()
    } catch (err) {
      toast.error(err.message || 'บันทึกไม่สำเร็จ')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 mb-1 block">ชื่อสินค้า</label>
        <input {...register('name')} className="input-field" />
        {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">หมวดหมู่</label>
          <select {...register('category_id')} className="input-field">
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-danger text-xs mt-1">{errors.category_id.message}</p>}
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">ราคา (บาท)</label>
          <input type="number" step="0.01" {...register('price')} className="input-field" />
          {errors.price && <p className="text-danger text-xs mt-1">{errors.price.message}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">จำนวนคงเหลือ</label>
        <input type="number" {...register('stock_quantity')} className="input-field" />
        {errors.stock_quantity && <p className="text-danger text-xs mt-1">{errors.stock_quantity.message}</p>}
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">รายละเอียดสินค้า</label>
        <textarea {...register('description')} rows={3} className="input-field" />
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">
          สเปกสินค้า <span className="text-slate-600">(รูปแบบ key: value บรรทัดละ 1 รายการ)</span>
        </label>
        <textarea
          {...register('specsText')}
          rows={4}
          className="input-field font-mono text-xs"
          placeholder={'socket: AM5\ncores: 8\nboost_clock: 5.4 GHz'}
        />
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">รูปภาพสินค้า</label>
        <label className="flex items-center gap-2 card-surface border-dashed border-2 border-base-600 p-3 cursor-pointer hover:border-circuit-500/60">
          <Upload size={16} className="text-slate-400" />
          <span className="text-xs text-slate-400">{imageFile ? imageFile.name : 'เลือกไฟล์รูปภาพ'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0])} />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกสินค้า'}
      </button>
    </form>
  )
}
