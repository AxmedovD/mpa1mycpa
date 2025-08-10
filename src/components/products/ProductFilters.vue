<script setup>
import { ref, watch } from 'vue'
import Button from '../common/Button.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  stores: {
    type: Array,
    default: () => []
  },
  initialFilters: {
    type: Object,
    default: () => ({
      search: '',
      name: '',
      sku: '',
      uzum_sku: '',
      ean13: '',
      category_id: 'all',
      store_id: 'all'
    })
  }
})

const emit = defineEmits(['filter'])

const filters = ref({ ...props.initialFilters })

// Watch for changes in initialFilters prop
watch(
  () => props.initialFilters,
  (newFilters) => {
    filters.value = { ...newFilters }
  }
)

const handleFilterChange = (field, value) => {
  filters.value[field] = value
}

const applyFilters = () => {
  emit('filter', { ...filters.value })
}

const resetFilters = () => {
  filters.value = {
    search: '',
    name: '',
    sku: '',
    uzum_sku: '',
    ean13: '',
    category_id: 'all',
    store_id: 'all'
  }
  emit('filter', { ...filters.value })
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    applyFilters()
  }
}
</script>

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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulot nomi</label>
          <input
            type="text"
            v-model="filters.name"
            placeholder="Mahsulot nomi..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Artikul</label>
          <input
            type="text"
            v-model="filters.sku"
            placeholder="Artikul boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uzum SKU</label>
          <input
            type="text"
            v-model="filters.uzum_sku"
            placeholder="Uzum SKU boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">EAN13</label>
          <input
            type="text"
            v-model="filters.ean13"
            placeholder="EAN13 boyicha qidirish..."
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          />
        </div>

        <!-- Category Select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategoriya</label>
          <select
            v-model="filters.category_id"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          >
            <option value="all">Barcha kategoriyalar</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Store Select -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'kon</label>
          <select
            v-model="filters.store_id"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            @keydown="handleKeyDown"
          >
            <option value="all">Barcha do'konlar</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
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