<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../../utils/formatters'
import SortButton from '../common/SortButton.vue'
import CopyableText from '../common/CopyableText.vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  sortColumn: {
    type: String,
    required: true
  },
  sortOrder: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  stores: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['sort'])

const headers = [
  { key: 'name', label: 'Mahsulot nomi', sortable: true },
  { key: 'article', label: 'Article', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'uzum_sku', label: 'Uzum SKU', sortable: true },
  { key: 'buy_price', label: 'Xarid narxi', sortable: true },
  { key: 'sell_price', label: 'Sotuv narxi', sortable: true },
  { key: 'category', label: 'Kategoriya', sortable: true },
  { key: 'store', label: "Do'kon", sortable: true }
]

const getCategoryName = (categoryId) => {
  const category = props.categories.find(c => c.id === categoryId)
  return category?.name || '-'
}

const getStoreName = (storeId) => {
  const store = props.stores.find(s => s.id === storeId)
  return store?.name || '-'
}

const handleSort = (column) => {
  if (column.sortable) {
    emit('sort', column.key)
  }
}

const getSortIcon = (column) => {
  if (!column.sortable) return null
  if (props.sortColumn !== column.key) return 'none'
  return props.sortOrder
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Rasm
          </th>
          <th 
            v-for="header in headers" 
            :key="header.key"
            scope="col" 
            class="px-6 py-3 text-left"
          >
            <div class="flex items-center space-x-1">
              <button
                v-if="header.sortable"
                @click="handleSort(header)"
                class="group inline-flex items-center space-x-1 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span>{{ header.label }}</span>
                <SortButton :state="getSortIcon(header)" />
              </button>
              <span v-else>{{ header.label }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr 
          v-for="product in products" 
          :key="product.id" 
          class="hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td class="px-6 py-4 whitespace-nowrap align-middle">
          <RouterLink :to="`/products/${product.id}`" class="inline-block">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="h-12 w-12 object-cover rounded"
              @error="$event.target.src = 'https://via.placeholder.com/48'"
            />
          </RouterLink>
         </td>
          <!-- Name column clickable -->
          <td class="px-6 py-4 align-middle">
            <RouterLink :to="`/products/${product.id}`" class="block">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                <CopyableText :text="product.name" @click.stop />
              </div>
            </RouterLink>
          </td>
          <td class="px-6 py-4 align-middle">
              <CopyableText :text="product.article" @click.stop />
          </td>
          <td class="px-6 py-4 align-middle">
            <CopyableText :text="product.sku" @click.stop />
          </td>
          <td class="px-6 py-4 align-middle">
            <div class="flex flex-col space-y-1">
              <CopyableText v-if="product.uzum_sku" :text="product.uzum_sku" />
              <CopyableText 
                v-if="product.uzum_sku_title" 
                :text="product.uzum_sku_title" 
                class="text-xs text-gray-500 dark:text-gray-400"
              />
            </div>
          </td>
          <td class="px-6 py-4 align-middle">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatCurrency(product.buy_price, product.currency) }}
            </div>
          </td>
          <td class="px-6 py-4 align-middle">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatCurrency(product.sell_price, product.currency) }}
            </div>
          </td>
          <td class="px-6 py-4 align-middle">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ getCategoryName(product.category_id) }}
            </div>
          </td>
          <td class="px-6 py-4 align-middle">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ getStoreName(product.store_id) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>