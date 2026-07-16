import { supabase } from '@/lib/supabase'

export const storageService = {
  /**
   * @param {File} file
   * @param {'product-images'|'payment-slips'} bucket
   * @param {string} folder
   */
  async upload(file, bucket, folder = '') {
    const ext = file.name.split('.').pop()
    const path = `${folder ? `${folder}/` : ''}${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  async remove(bucket, path) {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
  },
}
