import { create } from 'zustand'
import toast from 'react-hot-toast'

const MAX_COMPARE = 4

export const useCompareStore = create((set, get) => ({
  productIds: [],

  toggle(productId) {
    const { productIds } = get()
    if (productIds.includes(productId)) {
      set({ productIds: productIds.filter((id) => id !== productId) })
      return
    }
    if (productIds.length >= MAX_COMPARE) {
      toast.error(`เปรียบเทียบได้สูงสุด ${MAX_COMPARE} รายการ`)
      return
    }
    set({ productIds: [...productIds, productId] })
  },

  clear() {
    set({ productIds: [] })
  },

  isSelected(productId) {
    return get().productIds.includes(productId)
  },
}))
