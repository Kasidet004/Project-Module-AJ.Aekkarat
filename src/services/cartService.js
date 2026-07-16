import { supabase } from '@/lib/supabase'

export const cartService = {
  async getOrCreateCart(userId) {
    const { data: existing, error: fetchError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (fetchError) throw fetchError
    if (existing) return existing

    const { data, error } = await supabase.from('carts').insert({ user_id: userId }).select().single()
    if (error) throw error
    return data
  },

  async getItems(cartId) {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(id, name, price, stock_quantity, images:product_images(image_url, is_primary))')
      .eq('cart_id', cartId)
    if (error) throw error
    return data
  },

  async addItem({ cartId, productId, quantity = 1 }) {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .maybeSingle()

    if (existing) {
      return this.updateQuantity(existing.id, existing.quantity + quantity)
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert({ cart_id: cartId, product_id: productId, quantity })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateQuantity(cartItemId, quantity) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async removeItem(cartItemId) {
    const { error } = await supabase.from('cart_items').delete().eq('id', cartItemId)
    if (error) throw error
  },

  async clear(cartId) {
    const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId)
    if (error) throw error
  },
}
