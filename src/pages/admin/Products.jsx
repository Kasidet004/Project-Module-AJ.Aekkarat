import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/common/Modal'
import ProductForm from '@/components/admin/ProductForm'
import Pagination from '@/components/common/Pagination'
import { formatCurrency } from '@/utils/format'

export default function AdminProducts() {
  const [result, setResult] = useState({ items: [], total: 0, pageSize: 12 })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    productService
      .list({ page })
      .then(setResult)
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => {
    categoryService.list().then(setCategories)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (product) => {
    if (!confirm(`ต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`)) return
    try {
      await productService.remove(product.id)
      toast.success('ลบสินค้าสำเร็จ')
      load()
    } catch (err) {
      toast.error(err.message || 'ลบสินค้าไม่สำเร็จ')
    }
  }

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (product) => {
    setEditing(product)
    setModalOpen(true)
  }
  const handleSaved = () => {
    setModalOpen(false)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">จัดการสินค้า</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> เพิ่มสินค้า
        </button>
      </div>

      <DataTable
        columns={['สินค้า', 'หมวดหมู่', 'ราคา', 'คงเหลือ', '']}
        data={result.items}
        isLoading={loading}
        emptyMessage="ยังไม่มีสินค้าในระบบ"
        renderRow={(p) => (
          <tr key={p.id} className="hover:bg-base-800/40">
            <td className="px-4 py-3 font-medium max-w-xs truncate">{p.name}</td>
            <td className="px-4 py-3 text-slate-400">{p.category?.name}</td>
            <td className="px-4 py-3">{formatCurrency(p.price)}</td>
            <td className="px-4 py-3">
              <span className={p.stock_quantity > 0 ? 'text-ok' : 'text-danger'}>{p.stock_quantity}</span>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-base-700 text-circuit-400">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(p)} className="p-1.5 rounded hover:bg-base-700 text-danger">
                  <Trash2 size={15} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <Pagination page={page} pageSize={result.pageSize} total={result.total} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'} wide>
        <ProductForm product={editing} categories={categories} onSaved={handleSaved} />
      </Modal>
    </div>
  )
}
