import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 12

export const productService = {
  /**
   * List products with search, category filter, sort, and pagination.
   * @param {{ search?: string, categoryId?: string, sort?: 'price_asc'|'price_desc'|'newest', page?: number }} params
   */
  async list({ search = '', categoryId = null, sort = 'newest', page = 1 } = {}) {
    let query = supabase
      .from('products')
      .select('*, category:categories(id, name), images:product_images(id, image_url, is_primary)', {
        count: 'exact',
      })

    if (search) query = query.ilike('name', `%${search}%`)
    if (categoryId) query = query.eq('category_id', categoryId)

    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error, count } = await query
    if (error) throw error
    return { items: data, total: count, pageSize: PAGE_SIZE }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name), images:product_images(id, image_url, is_primary)')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async getByIds(ids) {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(id, name), images:product_images(id, image_url, is_primary)')
      .in('id', ids)
    if (error) throw error
    return data
  },

  /** Recommend a set of products whose combined price fits within a budget. */
  async suggestByBudget({ budget, categoryIds = [] }) {
    let query = supabase.from('products').select('*, category:categories(id, name)').lte('price', budget)
    if (categoryIds.length) query = query.in('category_id', categoryIds)
    query = query.order('price', { ascending: false })
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(product) {
    const { data, error } = await supabase.from('products').insert(product).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },

  async addImage({ productId, imageUrl, isPrimary = false }) {
    const { data, error } = await supabase
      .from('product_images')
      .insert({ product_id: productId, image_url: imageUrl, is_primary: isPrimary })
      .select()
      .single()
    if (error) throw error
    return data
  },
}
