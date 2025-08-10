<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th 
            @click="handleSort('product_name')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div class="flex items-center">
              Mahsulot nomi
              <SortIcon :active="sort_by === 'product_name'" :direction="sort_order" />
            </div>
          </th>
          <th 
            @click="handleSort('store_name')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div class="flex items-center">
              Do'kon
              <SortIcon :active="sort_by === 'store_name'" :direction="sort_order" />
            </div>
          </th>
          <th 
            @click="handleSort('article')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div class="flex items-center">
              Artikul
              <SortIcon :active="sort_by === 'article'" :direction="sort_order" />
            </div>
          </th>
          <th 
            @click="handleSort('sku')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div class="flex items-center">
              SKU
              <SortIcon :active="sort_by === 'sku'" :direction="sort_order" />
            </div>
          </th>
          <th colspan="4" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700">Ombor</th>
          <th colspan="3" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">Yuborishlar</th>
          <th colspan="3" class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20">Ummumiy</th>
        </tr>
        <tr>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700">Kirim</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700">Chiqim</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700">Enter</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700">Loss</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">Yuborilgan</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">Qaytib kelgan</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">Brak/Obmen</th>
          <th 
            @click="handleSort('total_in')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20"
          >
            <div class="flex items-center">
              Kirimlar
              <SortIcon :active="sort_by === 'total_in'" :direction="sort_order" />
            </div>
          </th>
          <th 
            @click="handleSort('total_out')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20"
          >
            <div class="flex items-center">
              Chiqimlar
              <SortIcon :active="sort_by === 'total_out'" :direction="sort_order" />
            </div>
          </th>
          <th 
            @click="handleSort('current')" 
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20"
          >
            <div class="flex items-center">
              Qoldiq
              <SortIcon :active="sort_by === 'current'" :direction="sort_order" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-for="item in items" :key="item.product_id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900 dark:text-white">{{ item.product_name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.store_name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.article }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.sku }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.storage.income }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.storage.outcome }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.storage.enter }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.storage.loss }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.actions.send }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.actions.returned }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.movements.actions.defect }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.totals.in }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.totals.out }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.totals.current }}</div>
          </td>
        </tr>
        <tr v-if="!items.length">
          <td colspan="14" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Ma'lumot topilmadi
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SortIcon from '../common/SortIcon.vue'

const route = useRoute()

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['sort'])

const sort_by = ref('current_stock')
const sort_order = ref('desc')

// Initialize sort state from URL
onMounted(() => {
  const query = route.query
  sort_by.value = query.sort_by || 'current_stock'
  sort_order.value = query.sort_order || 'desc'
})

// Watch for URL changes
watch(() => route.query, (query) => {
  sort_by.value = query.sort_by || 'current_stock'
  sort_order.value = query.sort_order || 'desc'
}, { deep: true })

const handleSort = (field) => {
  if (sort_by.value === field) {
    // Toggle sort order if clicking the same field
    sort_order.value = sort_order.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field and start with ascending order
    sort_by.value = field
    sort_order.value = 'asc'  // Start with ascending when clicking new column
  }
  
  // Always send current_stock as the sort field for Qoldiq column
  const sortField = field === 'current' ? 'current_stock' : field
  emit('sort', { sortBy: sortField, sortOrder: sort_order.value })
}
</script>
