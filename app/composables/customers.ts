export function useCustomers() {
  const supabase = useSupabaseClient()
  const toast = useToast()
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getCustomers(): Promise<unknown[]> {
    loading.value = true
    error.value = null
    const { data, error: err } = await supabase
      .from('customers')
      .select(`
        *,
        address:address_id(*),
        orders:orders(*),
        contacts:contacts(*)
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

  return { getCustomers, loading, error }
}