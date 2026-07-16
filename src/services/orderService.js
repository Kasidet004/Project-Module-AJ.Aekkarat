import { supabase } from '@/lib/supabase'
import { ORDER_STATUS } from '@/utils/status'

export const orderService = {
  /**
   * Create an order + order_items in one transaction-like call via RPC would be ideal;
   * here we perform sequential inserts and roll back manually on failure.
   */
  async createOrder({ userId, cartItems, shippingAddress, totalAmount }) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        shipping_address: shippingAddress,
        total_amount: totalAmount,
        status: ORDER_STATUS.PENDING_PAYMENT,
      })
      .select()
      .single()
    if (orderError) throw orderError

    const items = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(items)
    if (itemsError) {
      await supabase.from('orders').delete().eq('id', order.id)
      throw itemsError
    }

    return order
  },

  async attachPaymentSlip({ orderId, slipUrl }) {
    const { data, error } = await supabase
      .from('payments')
      .insert({ order_id: orderId, slip_url: slipUrl, status: 'pending' })
      .select()
      .single()
    if (error) throw error

    await supabase
      .from('orders')
      .update({ status: ORDER_STATUS.PAYMENT_VERIFICATION })
      .eq('id', orderId)

    return data
  },

  async getById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(name, images:product_images(image_url, is_primary))), payment:payments(*)')
      .eq('id', orderId)
      .single()
    if (error) throw error
    return data
  },

  async listByUser(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*, product:products(name))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // --- Admin ---
  async listAll({ status = null } = {}) {
    let query = supabase
      .from('orders')
      .select('*, user:profiles(full_name, email), payment:payments(*)')
      .order('created_at', { ascending: false })
    if (status) query = query.eq('status', status)
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async updateStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async approvePayment(paymentId, orderId) {
    const { error: pErr } = await supabase
      .from('payments')
      .update({ status: 'approved' })
      .eq('id', paymentId)
    if (pErr) throw pErr

    const { error: oErr } = await supabase
      .from('orders')
      .update({ status: ORDER_STATUS.PROCESSING })
      .eq('id', orderId)
    if (oErr) throw oErr
  },
}
