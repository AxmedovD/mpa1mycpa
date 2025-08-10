<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
    <div class="space-y-6">
      <!-- General Search -->
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ummumiy qidirish</label>
          <input
            type="text"
            v-model="filters.search"
            placeholder="Mahsulotlarni qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>
      </div>

      <!-- Specific Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Artikul</label>
          <input
            type="text"
            v-model="filters.article"
            placeholder="Artikul boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
          <input
            type="text"
            v-model="filters.sku"
            placeholder="SKU boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
          <input
            type="text"
            v-model="filters.store"
            placeholder="Do'kon nomi boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>

        <!-- Date Range -->
        <div class="col-span-full md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sana oralig'i</label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                v-model="filters.fromDate"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="date"
                v-model="filters.toDate"
                class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <Button @click="resetFilters" variant="secondary">Filterni tozalash</Button>
        <Button @click="applyFilters" variant="primary">Filterni qo'shish</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Button from '../common/Button.vue'

const emit = defineEmits(['filter'])

const filters = reactive({
  sku: '',
  article: '',
  store: '',
  search: '',
  fromDate: '',
  toDate: ''
})

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    applyFilters()
  }
}

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = ''
  })
  emit('filter', { ...filters })
}

const applyFilters = () => {
  emit('filter', { ...filters })
}
</script>
