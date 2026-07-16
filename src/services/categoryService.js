import { supabase } from '@/lib/supabase'

export const categoryService = {
  async list() {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw error
    return data
  },

  async create(category) {
    const { data, error } = await supabase.from('categories').insert(category).select().single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async remove(id) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}
