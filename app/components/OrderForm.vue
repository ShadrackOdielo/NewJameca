<template>
  <UCard class="max-w-2xl mx-auto my-8 shadow-lg">
    <template #header>
      <h2 class="text-xl font-bold">Create Order</h2>
    </template>
    <UForm :state="order" class="space-y-6" @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Customer Name">
          <UInput v-model="order.customer_name" placeholder="Enter customer name" required />
        </UFormField>
        <UFormField label="Customer Phone">
          <UInput v-model="order.customer_phone" placeholder="Enter phone number" required />
        </UFormField>
      </div>
      <UFormField label="Order Items">
        <div class="space-y-2">
          <div v-for="(item, idx) in order.items" :key="idx" class="flex gap-2 items-center">
            <USelect
              v-model="item.product_id!"
              :items="products.map(p => ({ label: p.name, value: p.id }))"
              placeholder="Select product"
              @update:modelValue="() => updateVariants(idx)"
              required
              class="w-40"
            />
            <USelect
              v-model="item.variant_id!"
              :items="item.variants"
              placeholder="Select variant"
              required
              class="w-40"
            />
            <UInput v-model.number="item.quantity" type="number" min="1" placeholder="Qty" class="w-20" required />
            <UButton icon="i-lucide-trash-2" color="error" variant="soft" size="xs" @click="removeItem(idx)" />
          </div>
        </div>
        <UButton icon="i-lucide-plus" color="primary" variant="soft" class="mt-2" @click="addItem">Add Item</UButton>
      </UFormField>
      <UButton type="submit" color="primary" class="w-full">Submit Order</UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ordersInsertSchema, orderItemsInsertSchema } from '~/types/schemas'

const supabase = useSupabaseClient()
const toast = useToast()

// Types
type ProductVariant = {
  id: number
  label: string
  sku: string
}
type Product = {
  id: number
  name: string
  variants: ProductVariant[]
}
type VariantSelectOption = { label: string; value: number }
type OrderItem = {
  product_id: number | null
  variant_id: number | null
  quantity: number
  variants: VariantSelectOption[]
}
type OrderFormState = {
  customer_name: string
  customer_phone: string
  items: OrderItem[]
}

const products = ref<Product[]>([])

const order = reactive<OrderFormState>({
  customer_name: '',
  customer_phone: '',
  items: [
    { product_id: null, variant_id: null, quantity: 1, variants: [] }
  ]
})

onMounted(async () => {
  // Fetch products and their variants
  const { data } = await supabase
    .from('products')
    .select('id, name, variants:product_variants(id, label, sku)')
  products.value = (data  || []).map((p): Product => ({
    id: p.id,
    name: p.name,
    variants: (p.variants || []).map((v): ProductVariant => ({
      id: v.id,
      label: v.label || v.sku,
      sku: v.sku
    }))
  }))
  // Initialize variants for first item
  updateVariants(0)
})

function addItem() {
  order.items.push({ product_id: null, variant_id: null, quantity: 1, variants: [] })
}
function removeItem(idx: number) {
  order.items.splice(idx, 1)
}
function updateVariants(idx: number) {
  const item = order.items[idx]!
  const product = products.value.find(p => p.id === item.product_id)
  item.variants = product ? product.variants.map((v): VariantSelectOption => ({ label: v.label, value: v.id })) : []
  item.variant_id = null
}
async function onSubmit() {
  // Validate order fields
  const orderValidation = ordersInsertSchema.safeParse({
    customer_name: order.customer_name,
    customer_phone: order.customer_phone
  })
  if (!orderValidation.success) {
    toast.add({ title: 'Error', description: 'Please fill all customer fields.', color: 'error' })
    return
  }
  if (!order.items.length || order.items.some(i => !i.product_id || !i.variant_id || !i.quantity)) {
    toast.add({ title: 'Error', description: 'Please fill all order item fields.', color: 'error' })
    return
  }
  // Insert order
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone
    })
    .select('id')
    .single()
  if (orderError || !orderData) {
    toast.add({ title: 'Error', description: orderError?.message || 'Order creation failed', color: 'error' })
    return
  }
  // Insert order items
  for (const item of order.items) {
    // Optionally, fetch price from variant/product if needed
    const variant = products.value
      .find(p => p.id === item.product_id)
      ?.variants.find(v => v.id === item.variant_id)
    const price = variant ? Number(variant.sku.replace(/[^\d.]/g, '')) || 0 : 0 // Replace with actual price logic
    const itemValidation = orderItemsInsertSchema.safeParse({
      order_id: orderData.id,
      product_id: item.product_id,
      product_variant_id: item.variant_id,
      quantity: item.quantity,
      price
    })
    if (!itemValidation.success) {
      toast.add({ title: 'Error', description: 'Invalid order item.', color: 'error' })
      return
    }
    await supabase.from('order_items').insert(itemValidation.data)
  }
  toast.add({ title: 'Success', description: 'Order created successfully!', color: 'success' })
  // Optionally reset form
  order.customer_name = ''
  order.customer_phone = ''
  order.items = [{ product_id: null, variant_id: null, quantity: 1, variants: [] }]
  updateVariants(0)
}
</script>