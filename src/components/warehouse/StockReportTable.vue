<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th @click="handleSort('product_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Mahsulot nomi
              <SortIcon :active="sortBy === 'product_name'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('store_name')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Do'kon
              <SortIcon :active="sortBy === 'store_name'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('article')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Artikul
              <SortIcon :active="sortBy === 'article'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('sku')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              SKU
              <SortIcon :active="sortBy === 'sku'" :direction="sortDirection" />
            </div>
          </th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700" colspan="4">Ombor</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20" colspan="3">Yuborishlar</th>
          <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20" colspan="3">Ummumiy</th>
          <th @click="handleSort('created_at')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              Yaratilgan
              <SortIcon :active="sortBy === 'created_at'" :direction="sortDirection" />
            </div>
          </th>
        </tr>
        <tr>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3"></th>
          <th class="px-6 py-3"></th>
          <th @click="handleSort('income')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Kirim
              <SortIcon :active="sortBy === 'income'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('enter')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Enter
              <SortIcon :active="sortBy === 'enter'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('outcome')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Chiqim
              <SortIcon :active="sortBy === 'outcome'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('loss')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <div class="flex items-center">
              Loss
              <SortIcon :active="sortBy === 'loss'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('send')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/20">
            <div class="flex items-center">
              Yuborilgan
              <SortIcon :active="sortBy === 'send'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('returned')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/20">
            <div class="flex items-center">
              Qaytib kelgan
              <SortIcon :active="sortBy === 'returned'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('faultex')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/20">
            <div class="flex items-center">
              Brak/Obmen
              <SortIcon :active="sortBy === 'faultex'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('total_in')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20">
            <div class="flex items-center">
              Kirimlar
              <SortIcon :active="sortBy === 'total_in'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('total_out')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20">
            <div class="flex items-center">
              Chiqimlar
              <SortIcon :active="sortBy === 'total_out'" :direction="sortDirection" />
            </div>
          </th>
          <th @click="handleSort('actual_stock')" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/20">
            <div class="flex items-center">
              Qoldiq
              <SortIcon :active="sortBy === 'actual_stock'" :direction="sortDirection" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <template v-if="loading">
          <StockReportSkeleton v-for="n in 10" :key="n" />
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
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ item.created_at }}</div>
            </td>
        </tr>
          <tr v-if="!items.length">
            <td colspan="18" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Ma'lumot topilmadi
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import SortIcon from '../common/SortIcon.vue'
import StockReportSkeleton from './StockReportSkeleton.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  sortBy: String,
  sortDirection: String
})
const emit = defineEmits(['sort'])

function handleSort(field) {
  let direction = 'asc'
  if (props.sortBy === field) {
    direction = props.sortDirection === 'asc' ? 'desc' : 'asc'
  }
  emit('sort', { key: field, direction })
}


</script>
