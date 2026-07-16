import { create } from 'zustand'
import { cartService } from '@/services/cartService'
import toast from 'react-hot-toast'

export const useCartStore = create((set, get) => ({
  cartId: null,
  items: [],
  isLoading: false,

  get itemCount() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0)
  },
  get subtotal() {
    return get().items.reduce((sum, i) => sum + i.quantity * Number(i.product?.price || 0), 0)
  },

  async load(userId) {
    if (!userId) return
    set({ isLoading: true })
    try {
      const cart = await cartService.getOrCreateCart(userId)
      const items = await cartService.getItems(cart.id)
      set({ cartId: cart.id, items, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      toast.error('โหลดตะกร้าสินค้าไม่สำเร็จ')
    }
  },

  async addItem(productId, quantity = 1) {
    const { cartId } = get()
    if (!cartId) {
      toast.error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า')
      return
    }
    await cartService.addItem({ cartId, productId, quantity })
    const items = await cartService.getItems(cartId)
    set({ items })
    toast.success('เพิ่มสินค้าลงตะกร้าแล้ว')
  },

  async updateQuantity(cartItemId, quantity) {
    if (quantity < 1) return get().removeItem(cartItemId)
    await cartService.updateQuantity(cartItemId, quantity)
    set({ items: get().items.map((i) => (i.id === cartItemId ? { ...i, quantity } : i)) })
  },

  async removeItem(cartItemId) {
    await cartService.removeItem(cartItemId)
    set({ items: get().items.filter((i) => i.id !== cartItemId) })
    toast.success('ลบสินค้าออกจากตะกร้าแล้ว')
  },

  async clear() {
    const { cartId } = get()
    if (!cartId) return
    await cartService.clear(cartId)
    set({ items: [] })
  },

  reset() {
    set({ cartId: null, items: [] })
  },
}))
