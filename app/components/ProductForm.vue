<template>
  <UCard :ui="{header: 'flex flex-col md:flex-row gap-2'}" class="max-w-3xl mx-auto my-8 shadow-lg">
    <template #header>
      <h2 class="text-xl font-bold">Create Product</h2>
              <CategoryModal/>
              <SchoolModal/>

    </template>
    <UForm
      :state="state"
      class="space-y-8"
      @submit.prevent="onSubmit"
    >
      <!-- Product Details -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Product Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Name">
            <UInput v-model="state.name" name="name" placeholder="Enter product name" required />
          </UFormField>
          <UFormField label="Slug">
            <UInput v-model="state.slug" name="slug" placeholder="Enter product slug" required />
          </UFormField>
          <UFormField label="Category">
            <USelect
            v-model="state.category_id!"
            :items="categories.map(c => ({ label: c.name, value: c.id }))"
            placeholder="Select category"
            required
             />
        </UFormField>
 <UFormField label="Has Logo Option">
            <UCheckbox v-model="state.has_logo_option!" name="has_logo_option" />
          </UFormField>
          <UFormField  label="School">
            <USelect
            v-model="state.school_id!"
            :items="schools.map(s => ({ label: s.name, value: s.id }))"
            placeholder="Select school"
            :default-value="4"
            
             required
            />
</UFormField>
          <UFormField label="Gender">
            <USelect v-model="state.gender!" :items="['Unisex','Boys','Girls','Men','Women']" required />
          </UFormField>
          <UFormField label="Is Active">
            <UCheckbox v-model="state.is_active!" name="is_active" />
          </UFormField>
        </div>
        <UFormField label="Description" class="mt-4">
          <UTextarea v-model="state.description" name="description" placeholder="Enter product description" required />
        </UFormField>
      </div>

      <USeparator />

      <!-- Pricing Options -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Pricing</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormField label="Price">
            <UInput v-model.number="state.price" name="price" type="number" placeholder="Enter product price" required />
          </UFormField>
          <UFormField v-if="state.has_logo_option" label="Price with Logo">
            <UInput v-model.number="state.price_with_logo" name="price_with_logo" type="number" placeholder="Enter price with logo" required />
          </UFormField>
         
        </div>
      </div>

      <USeparator />

      <!-- Images -->
      <div>
        <h3 class="text-lg font-semibold mb-2">Product Images</h3>
        <UFormField>
          <input ref="imageInput" type="file" multiple class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" @change="handleImageChange" >
          <div class="flex flex-wrap gap-2 mt-2">
            <div v-for="(image, index) in imagePreviews" :key="index" class="relative w-24 h-24">
              <img :src="image.previewUrl" alt="Image Preview" class="w-full h-full object-cover rounded border" >
              <UButton 
                size="xs"
                color="error"
                variant="outline"
                square
                class="absolute top-0 right-0   rounded-full" 
                icon="i-lucide-x"
                @click="removeImage(index)" />
              
            </div>
          </div>
        </UFormField>
      </div>

      <USeparator />

      <!-- Variants -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold">Variants</h3>
          <UButton v-if="state.has_variants" icon="i-lucide-plus" color="primary" @click="openVariantModal()">Add Variant</UButton>
        </div>
        <UFormField label="Has Variants">
          <UCheckbox v-model="state.has_variants!" name="has_variants" />
        </UFormField>
        <div v-if="state.has_variants && state.variants.length" class="mt-4 space-y-2">
          <div v-for="(variant, idx) in state.variants" :key="idx" class="flex items-center gap-4 p-2 rounded border bg-elevated">
            <span class="font-medium">Variant:{{ variant.label || variant.size || 'Variant ' + (idx + 1) }}</span>
            <span class="text-xs text-gray-500">SKU: {{ variant.sku }}</span>
            <span class="text-xs text-gray-500">Price: {{ variant.price }}</span>
            <UButton icon="i-lucide-edit" size="xs" color="primary" variant="soft" @click="editVariant(idx)" />
            <UButton icon="i-lucide-trash-2" size="xs" color="error" variant="soft" @click="removeVariant(idx)" />
          </div>
        </div>
      </div>
      <!-- Progress Alert Bar -->
    <UAlert
      v-if="submitProgress > 0"
      :title="submitStatus"
      :icon="submitProgress < 100 ? 'i-lucide-loader' : 'i-lucide-check-circle'"
      :color="submitProgress < 100 ? 'primary' : 'success'"
      class="mb-4"
      :description="`Progress: ${submitProgress}%`"
    />

      <UButton type="submit" loading-auto color="primary" class="w-full mt-6">Submit Product</UButton>
    </UForm>

    <!-- Variant Modal -->
    <UModal v-model:open="variantModalOpen" title="Add/Edit Variant" :ui="{ body : 'max-w-lg' }">
      <template #body>
        <UForm :state="variantForm" class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4" @submit.prevent="saveVariant">
          
          <UFormField label="Size">
            <UInput v-model="variantForm.size" placeholder="Size" />
          </UFormField>
          <UFormField label="Price">
            <UInput v-model.number="variantForm.price" type="number" placeholder="Price" />
          </UFormField>
          <UFormField label="Price with Logo">
            <UInput v-model.number="variantForm.price_with_logo" type="number" placeholder="Price with Logo" />
          </UFormField>
          <UFormField label="Color">
            <UInput v-model="variantForm.color!" placeholder="Color" />
          </UFormField>
          <UFormField label="Is Default">
            <UCheckbox v-model="variantForm.is_default!" />
          </UFormField>
          <UFormField label="Label">
            <UInput v-model="variantForm.label" placeholder="Label" />
          </UFormField>
          <UFormField label="SKU">
            <UInput v-model="variantForm.sku" placeholder="SKU" />
          </UFormField>
          <UFormField label="Stock Quantity">
            <UInput v-model.number="variantForm.stock_quantity" type="number" placeholder="Stock Quantity" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton type="button" color="info" variant="soft" @click="closeVariantModal">Cancel</UButton>
            <UButton type="submit" color="primary">{{ editingVariantIdx === null ? 'Add' : 'Update' }}</UButton>
          </div>
        </UForm>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useToast } from '#imports'
import { productsInsertSchema, productVariantsInsertSchema } from '~/types/schemas'
import type { z } from 'zod'

const toast = useToast()
const imageInput = ref<HTMLInputElement | null>(null)
const imagePreviews = ref<{ file: File; previewUrl: string }[]>([])

const submitProgress = ref(0)
const submitStatus = ref('')

function generateVariantSku(productSlug: string, variant: Variant) {
  // Use uppercase, remove spaces, and add a short random string for uniqueness
  const size = (variant.size || '').toString().replace(/\s+/g, '').toUpperCase();
  const color = (variant.color || '').toString().replace(/\s+/g, '').toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return [productSlug, size, color, rand].filter(Boolean).join('-');
}
type Product = z.infer<typeof productsInsertSchema>
type Variant = z.infer<typeof productVariantsInsertSchema>

const state = reactive<Product & { variants: Variant[] }>(
  {
    name: '',
    slug: '',
    description: '',
    price: 0,
    price_with_logo: 0,
    school_id: 0,
    gender: 'Unisex',
    has_logo_option: false,
    has_variants: false,
    is_active: true,
    category_id: 0,
    variants: [],
  }
)

watch(() => state.name, (newName) => {
  state.slug = newName
    ? newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    : ''
})



// --- Rollback helpers ---
async function rollbackUploads(uploadedFilePaths: string[]) {
  for (const path of uploadedFilePaths) {
    await supabase.storage.from('images').remove([path])
  }
}
async function rollbackProduct(productId: number) {
  await supabase.from('product_images').delete().eq('product_id', productId)
  await supabase.from('product_variants').delete().eq('product_id', productId)
  await supabase.from('products').delete().eq('id', productId)
}

// Variant Modal Logic
const variantModalOpen = ref(false)
const editingVariantIdx = ref<number|null>(null)
const variantForm = reactive<Variant>({
  size: '',
  price: 0,
  price_with_logo: 0,
  color: '',
  is_default: false,
  label: '',
  sku: '',
  stock_quantity: 0,
  product_id: undefined,
  id: undefined,
})

// --- SKU Computed ---
watch(
  [() => state.slug, () => variantForm.size, () => variantForm.color],
  () => {
    variantForm.sku = generateVariantSku(state.slug, variantForm)
  }
)
function openVariantModal(idx?: number) {
  if (typeof idx === 'number') {
    Object.assign(variantForm, state.variants[idx])
    editingVariantIdx.value = idx
  } else {
    Object.assign(variantForm, {
      size: '',
      price: 0,
      price_with_logo: 0,
      color: '',
      is_default: false,
      label: '',
      sku: '',
      stock_quantity: 0,
      product_id: undefined,
      id: undefined,
    })
    editingVariantIdx.value = null
  }
  variantModalOpen.value = true
}

function closeVariantModal() {
  variantModalOpen.value = false
}

function saveVariant() {
    // Ensure SKU is generated if not provided
      if (!variantForm.sku || !variantForm.sku.trim()) {
    variantForm.sku = generateVariantSku(state.slug, variantForm);
  }
  const result = productVariantsInsertSchema.safeParse(variantForm)
  if (!result.success) {
    toast.add({ title: 'Variant Error', description: result.error.errors.map(e => e.message).join(', '), color: 'error' })
    return
  }
  if (editingVariantIdx.value !== null) {
    state.variants[editingVariantIdx.value] = { ...variantForm }
  } else {
    state.variants.push({ ...variantForm })
  }
  closeVariantModal()
}

function editVariant(idx: number) {
  openVariantModal(idx)
}

function removeVariant(idx: number) {
  state.variants.splice(idx, 1)
}

function handleImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    const files = Array.from(target.files)
    for (const file of files) {
      const previewUrl = URL.createObjectURL(file)
      imagePreviews.value.push({ file, previewUrl })
    }
  }
}

function removeImage(idx: number) {
  imagePreviews.value.splice(idx, 1)
}

const supabase = useSupabaseClient();

async function onSubmit() {
  submitProgress.value = 5
  submitStatus.value = 'Validating product data...'


  const uploadedFilePaths: string[] = []
  let productId: number | null = null

  // Validate main product data
  const result = productsInsertSchema.safeParse(state)
  if (!result.success) {
    toast.add({ title: 'Validation Error', description: result.error.errors.map(e => e.message).join(', '), color: 'error' })
    submitProgress.value = 0
    submitStatus.value = ''
    return
  }
  submitProgress.value = 15
  submitStatus.value = 'Validating variants...'


  // Validate variants if present
  if (state.has_variants) {
    for (const variant of state.variants) {
      const vResult = productVariantsInsertSchema.safeParse(variant)
      if (!vResult.success) {
        toast.add({ title: 'Variant Error', description: vResult.error.errors.map(e => e.message).join(', '), color: 'error' })
        submitProgress.value = 0
        submitStatus.value = ''
        return
      }
    }
  }

  submitProgress.value = 30
  submitStatus.value = 'Uploading images...'


  // 1. Upload images to Supabase Storage
  const imageUrls: string[] = []
  for (const [idx, img] of imagePreviews.value.entries()) {
    submitStatus.value = `Uploading image ${idx + 1} of ${imagePreviews.value.length}...`
    const filePath = `products/${Date.now()}-${img.file.name}`
    const { error } = await supabase.storage.from('images').upload(filePath, img.file)
    if (error) {
      await rollbackUploads(uploadedFilePaths)
      toast.add({ title: 'Image Upload Error', description: error.message, color: 'error' })
      submitProgress.value = 0
      submitStatus.value = ''
      return
    }
    uploadedFilePaths.push(filePath)
    const publicUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl
    imageUrls.push(publicUrl)
    submitProgress.value = 30 + Math.round(20 * ((idx + 1) / imagePreviews.value.length))
  }

  submitProgress.value = 55
  submitStatus.value = 'Saving product...'


  // 2. Insert product
  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert({
      ...state,
      variants: undefined,
    })
    .select('id')
    .single()

  if (productError || !productData) {
    await rollbackUploads(uploadedFilePaths)
    toast.add({ title: 'Product Error', description: productError?.message || 'Insert failed', color: 'error' })
    submitProgress.value = 0
    submitStatus.value = ''
    return
  }

  productId = productData.id

  submitProgress.value = 70
  submitStatus.value = 'Saving product images...'


  // 3. Insert product images
  for (const [idx, url] of imageUrls.entries()) {
    submitStatus.value = `Saving image ${idx + 1} of ${imageUrls.length}...`
    const { error: imgError } = await supabase
      .from('product_images')
      .insert({
        image_url: url,
        product_id: productId,
        is_primary: idx === 0,
      })
    if (imgError) {
      await rollbackProduct(productId)
      await rollbackUploads(uploadedFilePaths)
      toast.add({ title: 'Image DB Error', description: imgError.message, color: 'error' })
      submitProgress.value = 0
      submitStatus.value = ''
      return
    }
    submitProgress.value = 70 + Math.round(10 * ((idx + 1) / imageUrls.length))
  }

  submitProgress.value = 85
  submitStatus.value = 'Saving variants...'


  // 4. Insert variants
  if (state.has_variants && state.variants.length > 0) {
    for (const [idx, variant] of state.variants.entries()) {
      submitStatus.value = `Saving variant ${idx + 1} of ${state.variants.length}...`
      const { error: variantError } = await supabase
        .from('product_variants')
        .insert({
          ...variant,
          product_id: productId,
        })
      if (variantError) {
        await rollbackProduct(productId)
        await rollbackUploads(uploadedFilePaths)
        toast.add({ title: 'Variant DB Error', description: variantError.message, color: 'error' })
        submitProgress.value = 0
        submitStatus.value = ''
        return
      }
      submitProgress.value = 85 + Math.round(10 * ((idx + 1) / state.variants.length))
    }
  }

  submitProgress.value = 100
  submitStatus.value = 'Product created successfully!'

  toast.add({ title: 'Success', description: 'Product created successfully!', color: 'success' })
  setTimeout(() => {
    submitProgress.value = 0
    submitStatus.value = ''
  }, 2000)
}
const categories = ref<{ id: number; name: string }[]>([])
const schools = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
  const { data, error } = await supabase.from('categories').select('id, name')
  if (!error && data) {
    categories.value = data
  } else {
    toast.add({ title: 'Error', description: error?.message || 'Could not load categories', color: 'error' })
  }
   // Fetch schools
  const { data: schoolData, error: schoolError } = await supabase.from('schools').select('id, name')
  if (!schoolError && schoolData) {
    schools.value = schoolData
  } else {
    toast.add({ title: 'Error', description: schoolError?.message || 'Could not load schools', color: 'error' })
  }
})
</script>