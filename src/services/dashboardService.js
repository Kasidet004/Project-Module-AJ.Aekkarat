import { supabase } from '@/lib/supabase'

export const dashboardService = {
  async getSummary() {
    const [{ count: userCount }, { count: productCount }, { count: orderCount }, { data: orders }] =
      await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount, status').neq('status', 'cancelled'),
      ])

    const totalSales = (orders || []).reduce((sum, o) => sum + Number(o.total_amount || 0), 0)

    return {
      userCount: userCount || 0,
      productCount: productCount || 0,
      orderCount: orderCount || 0,
      totalSales,
    }
  },

  async getMonthlySales() {
    const { data, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .neq('status', 'cancelled')
    if (error) throw error

    const byMonth = {}
    for (const order of data) {
      const month = new Date(order.created_at).toLocaleDateString('th-TH', {
        month: 'short',
        year: '2-digit',
      })
      byMonth[month] = (byMonth[month] || 0) + Number(order.total_amount)
    }
    return Object.entries(byMonth).map(([month, total]) => ({ month, total }))
  },

  async getTopSellingProducts(limit = 5) {
    const { data, error } = await supabase
      .from('order_items')
      .select('quantity, product:products(name)')
    if (error) throw error

    const byProduct = {}
    for (const item of data) {
      const name = item.product?.name || 'ไม่ทราบชื่อ'
      byProduct[name] = (byProduct[name] || 0) + item.quantity
    }
    return Object.entries(byProduct)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit)
  },

  async getSalesByCategory() {
    const { data, error } = await supabase
      .from('order_items')
      .select('quantity, unit_price, product:products(category:categories(name))')
    if (error) throw error

    const byCategory = {}
    for (const item of data) {
      const cat = item.product?.category?.name || 'อื่นๆ'
      byCategory[cat] = (byCategory[cat] || 0) + item.quantity * Number(item.unit_price)
    }
    return Object.entries(byCategory).map(([name, value]) => ({ name, value }))
  },
}
