<script setup lang="ts">
import { h, resolveComponent, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { ProductWithDetails } from '~/types/product.types'
import type { Column } from '@tanstack/vue-table'

const UBadge = resolveComponent('UBadge')
const table = useTemplateRef('table')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')
// const supabase = useSupabaseClient()

const data = ref<ProductWithDetails[]>(await useProducts().getProducts())

const columns: TableColumn<ProductWithDetails>[] = [
 
 {
  accessorKey: 'id',
  header: ({ column }) => getHeader(column, 'ID'),
  cell: ({ row }) => h(UBadge, { variant: 'secondary' }, () => row.getValue('id')),
 },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Name'),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => getHeader(column, 'Price'),
    cell: ({ row }) => {
      // check if there are variants, if so, show the lowest price
      if (row.original.has_variants && row.original.variants.length) {
        const lowestPrice = Math.min(...row.original.variants.map(v => v.price || 0))
        const formatted = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'KES'
        }).format(lowestPrice)
        return h('div', { class: 'text-right font-medium' }, formatted)
      } 
      // Otherwise, show the product price
      if (!row.getValue('price')) return h('span', { class: 'text-gray-500' }, 'N/A')
      // Format the price

      const amount = Number.parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'KES'
      }).format(amount)
      return h('div', { class: 'text-right font-medium' }, formatted)
     }
  },
  
 
  {
    accessorKey: 'variants',
    header: 'Variants',
    cell: ({ row }) => h('span', {}, row.original.variants?.length || 0),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => getHeader(column, 'Stock'),
    // get stock by adding all variants stock
    cell: ({ row }) => {
      const stock = row.original.variants.reduce((acc, variant) => acc + (variant.stock_quantity || 0), 0)
      return h('span', {}, stock.toString())
    }

  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => getHeader(column, 'Created At'),
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'))
      return h('span', {}, date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }))
    }
  },
 
 
  {
    accessorKey: 'actions',
    header: 'Actions',
   cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
  h(UButton, {
    icon: 'i-lucide-edit',
    color: 'primary',
    variant: 'soft',
    size: 'sm',
    label: 'Edit',
    onClick: () => handleEdit(row.original)
  }),
  h(UButton, {
    icon: 'i-lucide-trash-2',
    color: 'error',
    variant: 'soft',
    size: 'sm',
    label: 'Delete',
    onClick: () => handleDelete(row.original)
  })
])
    
  }

]
 function getHeader(column: Column<ProductWithDetails>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start'
      },
      'aria-label': 'Actions dropdown',
      items: [
        {
          label: 'Asc',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }
        },
        {
          label: 'Desc',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }
        }
      ]
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-elevated',
        'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
      })
  )
} 

const globalFilter = ref('')
const pagination = ref({
  pageIndex: 0,
  pageSize: 50
})
const columnVisibility = ref({
})
const sorting = ref([
  {
    id: 'id',
    desc: false
  }
])
const toast = useToast()
const editingProduct = ref(null as ProductWithDetails | null)
const showEditModal = ref(false)

async function handleEdit(product: ProductWithDetails) {
  editingProduct.value = product
  toast.add({
    title: 'Editing Product',
    description: `Editing product `,
    color: 'info'
  })
  showEditModal.value = true
  // Or navigate: $router.push(`/products/${product.id}/edit`)
}

async function handleDelete(product : ProductWithDetails) {
  if (!confirm(`Delete product "${product.name}"?`)) return
  // fake delete operation
  const toast = useToast()
  toast.add({
    title: 'Deleting Product',
    description: `Deleting product "${product.name}"...`,
    color: 'warning'
  })
  
  // const { error } = await supabase.from('products').delete().eq('id', product.id)
  // if  () {
  //   toast.add({ title: 'Error', description: message, color: 'error' })
  // } else {
  //   toast.add({ title: 'Deleted', description: 'Product deleted', color: 'success' })
  //   // Refresh data
  //   data.value = await useProducts().getProducts()
  // }
}

async function refreshProducts() {
  data.value = await useProducts().getProducts()
}
</script>

<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex w-full justify-between px-4 py-3.5 border-b border-accented">
      <UInput v-model="globalFilter" class="max-w-sm" placeholder="Filter..." />
      <div class="flex justify-end px-4 py-3.5 border-b  border-accented">
      <UDropdownMenu
        :items="
          table?.tableApi
            ?.getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: upperFirst(column.id),
              type: 'checkbox' as const,
              checked: column.getIsVisible(),
              onUpdateChecked(checked: boolean) {
                table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
              },
              onSelect(e?: Event) {
                e?.preventDefault()
              }
            }))
        "
        :content="{ align: 'end' }"
      >
        <UButton
          label="Columns"
          color="neutral"
          variant="outline"
          trailing-icon="i-lucide-chevron-down"
        />
      </UDropdownMenu>
    </div>

    </div>

    <UTable 
    ref="table"
    v-model:pagination="pagination" 
    v-model:global-filter="globalFilter" 
    v-model:column-visibility="columnVisibility"
    v-model:sorting="sorting"
    :data="data" 
    :columns="columns" 
    :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="flex-1">
    
     <template #name-cell="{ row }">
      <div class="flex items-center gap-3">
        <UAvatar
          :src="row.original.images[0]?.image_url "
          size="lg"
          :alt="`${row.original.name} avatar`"
        />
        <div>
          <p class="font-medium text-highlighted">
            {{ row.original.name }}
          </p>
          <p>
            {{ row.original.category.name || 'Uncategorized' }},
            {{ row.original.gender || '' }}
          </p>
        </div>
      </div>
    </template>
    <template #variants-cell="{ row }">
  <UPopover mode="hover">
    <UButton :label="row.original.variants.length  || '0'" color="neutral" variant="outline" />

    <template #content>
<div v-if="row.original.has_variants && row.original.variants.length" class="mt-4 space-y-2">
          <div v-for="(variant, idx) in row.original.variants" :key="idx" class="flex items-center gap-4 p-2 rounded border bg-elevated">
            <span class="font-medium">Variant:{{ variant.label || variant.size || 'Variant ' + (idx + 1) }}</span>
            <span class="text-xs text-gray-500">SKU: {{ variant.sku }}</span>
            <span class="text-xs text-gray-500">Price: {{ variant.price }}</span>
            <UButton icon="i-lucide-edit" size="xs" color="primary" variant="soft"  />
            <UButton icon="i-lucide-trash-2" size="xs" color="error" variant="soft" />
          </div>
        </div>    </template>
  </UPopover>
</template>
  <template #description-cell="{ row }">
    <UPopover mode="hover">
      <UButton
        :label="row.original.description ? row.original.description.slice(0, 20) + '...' : 'No description'"
        color="neutral"
        variant="ghost"
      />
      <template #content>
        <div class="p-4">
          <p>{{ row.original.description || 'No description available' }}</p>
        </div>
      </template>
    </UPopover>
  </template>
    </UTable>
     <div class="flex justify-center border-t border-default pt-4">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
    <ProductUpdateModal
  :open="showEditModal"
  :product="editingProduct"
  @close="showEditModal = false"
  @updated="refreshProducts"
/>
  </div>
</template>
