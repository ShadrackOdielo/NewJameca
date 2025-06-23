export function useProducts(){
  const supabase = useSupabaseClient()
  const toast = useToast()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getProducts(): Promise<unknown[]> {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*),
        industry:industry_id(*)
      `)
      .order('created_at', { ascending: false })

    loading.value = false

    if (err) {
      error.value = err.message
      toast.add({ title: 'Error', description: err.message, color: 'error' })
      return []
    }
    return data 
  }
  // Add more functions as needed, e.g., createProduct, updateProduct, deleteProduct
  // Example: function to create a new product

  return { getProducts, loading, error }
}