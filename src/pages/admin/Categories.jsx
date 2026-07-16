import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { categoryService } from '@/services/categoryService'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/common/Modal'

const schema = z.object({ name: z.string().min(2, 'กรุณากรอกชื่อหมวดหมู่') })

function CategoryForm({ category, onSaved }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: category?.name || '' } })

  const onSubmit = async (values) => {
    try {
      if (category) await categoryService.update(category.id, values)
      else await categoryService.create(values)
      toast.success('บันทึกหมวดหมู่สำเร็จ')
      onSaved()
    } catch (err) {
      toast.error(err.message || 'บันทึกไม่สำเร็จ')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 mb-1 block">ชื่อหมวดหมู่</label>
        <input {...register('name')} className="input-field" placeholder="เช่น GPU, CPU" />
        {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        บันทึก
      </button>
    </form>
  )
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    categoryService
      .list()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (category) => {
    if (!confirm(`ต้องการลบหมวดหมู่ "${category.name}" ใช่หรือไม่?`)) return
    try {
      await categoryService.remove(category.id)
      toast.success('ลบหมวดหมู่สำเร็จ')
      load()
    } catch (err) {
      toast.error('ไม่สามารถลบได้ อาจมีสินค้าผูกอยู่กับหมวดหมู่นี้')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">จัดการหมวดหมู่</h1>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> เพิ่มหมวดหมู่
        </button>
      </div>

      <DataTable
        columns={['ชื่อหมวดหมู่', '']}
        data={categories}
        isLoading={loading}
        emptyMessage="ยังไม่มีหมวดหมู่สินค้า"
        renderRow={(c) => (
          <tr key={c.id} className="hover:bg-base-800/40">
            <td className="px-4 py-3 font-medium">{c.name}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditing(c)
                    setModalOpen(true)
                  }}
                  className="p-1.5 rounded hover:bg-base-700 text-circuit-400"
                >
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(c)} className="p-1.5 rounded hover:bg-base-700 text-danger">
                  <Trash2 size={15} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}>
        <CategoryForm
          category={editing}
          onSaved={() => {
            setModalOpen(false)
            load()
          }}
        />
      </Modal>
    </div>
  )
}
