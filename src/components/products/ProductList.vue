<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ProductsTable from './ProductsTable.vue'
import ProductFilters from './ProductFilters.vue'
import Pagination from '../common/Pagination.vue'
import { fetchProducts } from '../../services/products'
import { debounce } from '../../utils/debounce'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const products = ref([])
const meta = ref({})
const categories = ref([])
const stores = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const perPage = ref(20)
const cachedData = ref({
  categories: [],
  stores: []
})

// Initialize state from URL query parameters
const initState = () => {
  const query = route.query
  return {
    filters: {
      search: query.search || '',
      name: query.name || '',
      sku: query.sku || '',
      uzum_sku_title: query.uzum_sku_title || '',
      ean13: query.ean13 || '',
      category_id: query.category_id || 'all',
      store_id: query.store_id || 'all'
    },
    sort: {
      column: query.sort_by || 'id',
      order: query.sort_order || 'desc'
    }
  }
}

const state = ref(initState())
const filters = computed(() => state.value.filters)
const sortColumn = computed(() => state.value.sort.column)
const sortOrder = computed(() => state.value.sort.order)

// Update URL when state changes
const updateUrl = () => {
  const query = {}
  
  // Add filter parameters
  Object.entries(state.value.filters).forEach(([key, value]) => {
    if (value && value !== '' && value !== 'all') {
      query[key] = value
    }
  })
  
  // Add sort parameters
  if (state.value.sort.column !== 'id' || state.value.sort.order !== 'desc') {
    query.sort_by = state.value.sort.column
    query.sort_order = state.value.sort.order
  }
  
  // Update URL without reloading the page
  router.replace({ query })
}

// Handle filter changes
const handleFilter = (newFilters) => {
  state.value.filters = newFilters
  updateUrl()
  currentPage.value = 1
  loadProducts()
}

// Handle sort changes
const handleSort = (column) => {
  const sort = state.value.sort
  if (sort.column === column) {
    sort.order = sort.order === 'asc' ? 'desc' : 'asc'
  } else {
    sort.column = column
    sort.order = 'asc'
  }
  updateUrl()
  loadProducts()
}

// Load reference data separately
const loadReferenceData = async () => {
  if (cachedData.value.categories.length === 0 || cachedData.value.stores.length === 0) {
    try {
      const response = await fetchProducts(1, { per_page: 1 })
      cachedData.value.categories = response.categories
      cachedData.value.stores = response.stores
      categories.value = response.categories
      stores.value = response.stores
    } catch (err) {
      console.error('Error loading reference data:', err)
    }
  } else {
    categories.value = cachedData.value.categories
    stores.value = cachedData.value.stores
  }
}

// Load products and reference data
const loadProducts = async (options = {}) => {
  const { preserveScroll = false, showLoader = true } = options
  
  if (showLoader && !preserveScroll) {
    loading.value = true
  }
  
  try {
    // Load reference data if needed
    await loadReferenceData()
    
    // Load products with sort parameters
    const response = await fetchProducts(currentPage.value, {
      per_page: perPage.value,
      ...state.value.filters,
      sort_by: state.value.sort.column,
      sort_order: state.value.sort.order
    })
    
    products.value = response.data
    meta.value = response.meta
    error.value = null
  } catch (err) {
    console.error('Error loading products:', err)
    error.value = 'Failed to load products'
  } finally {
    loading.value = false
  }
}

// Handle page changes
const handlePageChange = (page) => {
  currentPage.value = page
  loadProducts({ preserveScroll: true })
}

// Handle per page changes
const handlePerPageChange = (value) => {
  perPage.value = value
  currentPage.value = 1
  loadProducts()
}

// Debounced filter handler with increased delay
const debouncedLoadProducts = debounce(() => {
  currentPage.value = 1 // Reset to first page when filtering
  loadProducts({ preserveScroll: true })
}, 500) // Increased debounce delay

// Watch for URL query changes (when using browser back/forward)
watch(
  () => route.query,
  () => {
    state.value = initState()
    loadProducts()
  }
)

// Expose loadProducts for parent component
defineExpose({
  loadProducts,
  categories,
  stores
})

onMounted(async () => {
  await loadProducts()
})
</script>

<template>
  <div>
    <ProductFilters 
      :categories="categories"
      :stores="stores"
      :initial-filters="filters"
      @filter="handleFilter" 
    />
    
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-4">
        {{ error }}
      </div>

      <div v-else-if="products.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Mahsulotlar topilmadi.
      </div>

      <template v-else>
        <ProductsTable 
          v-if="!loading && !error"
          :products="products"
          :categories="categories"
          :stores="stores"
          :sort-column="sortColumn"
          :sort-order="sortOrder"
          @sort="handleSort"
        />
        <Pagination 
          :meta="meta"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
        />
      </template>
    </div>
  </div>
</template>