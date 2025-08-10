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
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Do'konlar</label>
          <div class="relative store-dropdown">
            <div 
              class="w-full min-h-[42px] rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer"
              @click="showStoreDropdown = true"
            >
              <div class="flex flex-wrap gap-2">
                <template v-if="selectedStores.length">
                  <div 
                    v-for="store in selectedStores" 
                    :key="store.id"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900 text-sm"
                  >
                    <span>{{ store.name }}</span>
                    <button 
                      @click.stop="removeStore(store.id)"
                      class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                    >
                      ×
                    </button>
                  </div>
                </template>
                <div v-else class="text-gray-500 dark:text-gray-400 py-1 text-sm">
                  Do'konlarni tanlang...
                </div>
              </div>
            </div>

            <!-- Dropdown -->
            <div 
              v-if="showStoreDropdown" 
              class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg"
            >
              <div class="p-2">
                <input
                  type="text"
                  v-model="storeSearch"
                  placeholder="Do'konlarni qidirish..."
                  class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                  @click.stop
                />
              </div>
              <div class="max-h-60 overflow-y-auto">
                <div 
                  v-for="store in filteredStores" 
                  :key="store.id"
                  class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm flex items-center gap-2"
                  @click.stop="toggleStore(store)"
                >
                  <input 
                    type="checkbox" 
                    :checked="isStoreSelected(store.id)"
                    class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{{ store.name }}</span>
                </div>
                <div 
                  v-if="!filteredStores.length" 
                  class="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm"
                >
                  Do'kon topilmadi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FBS Toggle -->
      <div class="flex items-center space-x-2">
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            v-model="filters.is_fbs"
            class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">FBS</span>
        </label>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Button from '../common/Button.vue'
import { fetchStockSummary } from '../../services/warehouse'

const emit = defineEmits(['filter'])

const filters = reactive({
  sku: '',
  article: '',
  store_id: [],
  search: '',
  is_fbs: false
})

const stores = ref([])
const storeSearch = ref('')
const showStoreDropdown = ref(false)
const selectedStores = ref([])

// Fetch stores on mount
async function loadStores() {
  try {
    const response = await fetchStockSummary(1, { per_page: 1 })
    if (response.filters?.stores) {
      stores.value = response.filters.stores
      console.log('Loaded stores:', stores.value) // Debug log
    }
  } catch (error) {
    console.error('Error loading stores:', error)
  }
}

// Filter stores based on search
const filteredStores = computed(() => {
  if (!storeSearch.value) return stores.value
  const search = storeSearch.value.toLowerCase()
  return stores.value.filter(store => 
    store.name.toLowerCase().includes(search)
  )
})

// Store selection helpers
function isStoreSelected(id) {
  return filters.store_id.includes(id)
}

function toggleStore(store) {
  const index = filters.store_id.indexOf(store.id)
  if (index === -1) {
    filters.store_id.push(store.id)
    selectedStores.value.push(store)
  } else {
    filters.store_id.splice(index, 1)
    selectedStores.value = selectedStores.value.filter(s => s.id !== store.id)
  }
}

function removeStore(id) {
  const index = filters.store_id.indexOf(id)
  if (index !== -1) {
    filters.store_id.splice(index, 1)
    selectedStores.value = selectedStores.value.filter(s => s.id !== id)
  }
  showStoreDropdown.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const target = event.target
  if (!target.closest('.store-dropdown')) {
    showStoreDropdown.value = false
  }
}

onMounted(() => {
  loadStores()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    applyFilters()
  }
}

function resetFilters() {
  // Reset all filter values
  Object.keys(filters).forEach(key => {
    if (Array.isArray(filters[key])) {
      filters[key] = []
    } else {
      filters[key] = ''
    }
  })
  
  // Reset selected stores
  selectedStores.value = []
  
  // Close store dropdown if open
  showStoreDropdown.value = false
  
  // Reset store search
  storeSearch.value = ''
  
  // Apply the reset filters
  applyFilters()
}

function applyFilters() {
  // Create a clean filter object without empty values
  const filterData = {}
  
  Object.entries(filters).forEach(([key, value]) => {
    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) return
    // Skip empty strings
    if (typeof value === 'string' && !value.trim()) return
    // Include non-empty values
    filterData[key] = value
  })
  
  emit('filter', filterData)
}
</script>
