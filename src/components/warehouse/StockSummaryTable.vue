<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th @click="handleSort('product_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Mahsulot nomi
              <SortIcon :active="sort_by === 'product_name'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('store_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Do'kon
              <SortIcon :active="sort_by === 'store_name'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('article')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Artikul
              <SortIcon :active="sort_by === 'article'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('sku')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              SKU
              <SortIcon :active="sort_by === 'sku'" :direction="sort_direction" />
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
          <th @click="handleSort('income')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Kirim
              <SortIcon :active="sort_by === 'income'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('enter')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Enter
              <SortIcon :active="sort_by === 'enter'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('outcome')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Chiqim
              <SortIcon :active="sort_by === 'outcome'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('loss')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Loss
              <SortIcon :active="sort_by === 'loss'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('send')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/20">
            <div class="flex items-center">
              Yuborilgan
              <SortIcon :active="sort_by === 'send'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('returned')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/20">
            <div class="flex items-center">
              Qaytib kelgan
              <SortIcon :active="sort_by === 'returned'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('faultex')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/20">
            <div class="flex items-center">
              Brak/Obmen
              <SortIcon :active="sort_by === 'faultex'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('total_in')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20">
            <div class="flex items-center">
              Kirimlar
              <SortIcon :active="sort_by === 'total_in'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('total_out')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20">
            <div class="flex items-center">
              Chiqimlar
              <SortIcon :active="sort_by === 'total_out'" :direction="sort_direction" />
            </div>
          </th>
          <th @click="handleSort('actual_stock')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20">
            <div class="flex items-center">
              Qoldiq
              <SortIcon :active="sort_by === 'actual_stock'" :direction="sort_direction" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <template v-if="loading">
          <StockSummarySkeleton v-for="n in skeletonRows" :key="n" />
        </template>
        <template v-else>
        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
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
            <div class="text-sm text-gray-900 dark:text-white">{{ item.income }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.enter }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.outcome }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.loss }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.send }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.returned }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.faultex }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.total_in }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.total_out }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20">
            <div class="text-sm text-gray-900 dark:text-white">{{ item.actual_stock }}</div>
          </td>
        </tr>
          <tr v-if="!items.length">
            <td colspan="14" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Ma'lumot topilmadi
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr class="bg-gray-100 dark:bg-gray-800 font-bold">
          <td class="px-6 py-4 whitespace-nowrap text-left">Jami:</td>
          <td class="px-6 py-4 whitespace-nowrap"></td>
          <td class="px-6 py-4 whitespace-nowrap"></td>
          <td class="px-6 py-4 whitespace-nowrap"></td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700 text-left">{{ summaryTotals.income }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700 text-left">{{ summaryTotals.enter }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700 text-left">{{ summaryTotals.outcome }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-gray-50 dark:bg-gray-700 text-left">{{ summaryTotals.loss }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20 text-left">{{ summaryTotals.send }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20 text-left">{{ summaryTotals.returned }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-blue-50 dark:bg-blue-900/20 text-left">{{ summaryTotals.faultex }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20 text-left">{{ summaryTotals.total_in }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20 text-left">{{ summaryTotals.total_out }}</td>
          <td class="px-6 py-4 whitespace-nowrap bg-green-50 dark:bg-green-900/20 text-left">{{ summaryTotals.actual_stock }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import SortIcon from '../common/SortIcon.vue'
import StockSummarySkeleton from './StockSummarySkeleton.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  skeletonRows: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['sort'])

const sort_by = ref('')
const sort_direction = ref('')

function handleSort(field) {
  if (sort_by.value === field) {
    sort_direction.value = sort_direction.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort_by.value = field
    sort_direction.value = 'asc'
  }
  
  emit('sort', {
    key: sort_by.value,
    direction: sort_direction.value
  })
}
// Compute totals for all numeric columns, across all items
const summaryTotals = computed(() => {
  // If you only have paginated items, replace 'items' with 'allItems' if available
  const items = props.items || []
  return {
    income: items.reduce((acc, item) => acc + (Number(item.income) || 0), 0),
    enter: items.reduce((acc, item) => acc + (Number(item.enter) || 0), 0),
    outcome: items.reduce((acc, item) => acc + (Number(item.outcome) || 0), 0),
    loss: items.reduce((acc, item) => acc + (Number(item.loss) || 0), 0),
    send: items.reduce((acc, item) => acc + (Number(item.send) || 0), 0),
    returned: items.reduce((acc, item) => acc + (Number(item.returned) || 0), 0),
    faultex: items.reduce((acc, item) => acc + (Number(item.faultex) || 0), 0),
    total_in: items.reduce((acc, item) => acc + (Number(item.total_in) || 0), 0),
    total_out: items.reduce((acc, item) => acc + (Number(item.total_out) || 0), 0),
    actual_stock: items.reduce((acc, item) => acc + (Number(item.actual_stock) || 0), 0),
  }
})

</script>
