import { ref, computed } from 'vue'
import { fetchStorageItems } from '../services/storage'
import { debounce } from '../utils/debounce'
import auth from '../stores/auth'

export function useStorageData() {
  const items = ref([])
  const meta = ref({})
  const loading = ref(true)
  const error = ref(null)
  const currentPage = ref(1)
  const perPage = ref(20)
  const filters = ref({})
  const cachedData = ref(new Map())
  const lastFetchTime = ref(new Map())
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  // Computed property for visible items with memoization
  const visibleItems = computed(() => {
    return items.value.map(item => ({
      ...item,
      formattedDate: new Date(item.created_at).toLocaleString(),
      formattedPrice: new Intl.NumberFormat('en-US').format(item.price)
    }))
  })

  // Check if data is cached and still valid
  const isCacheValid = (key) => {
    const timestamp = lastFetchTime.value.get(key)
    return timestamp && (Date.now() - timestamp < CACHE_DURATION)
  }

  // Get cache key based on current state
  const getCacheKey = () => {
    const baseKey = `${currentPage.value}-${perPage.value}-${JSON.stringify(filters.value)}`
    // Include user_id in cache key for non-superadmin
    if (!auth.isSuperAdmin && auth.user?.id) {
      return `${baseKey}-user-${auth.user.id}`
    }
    return baseKey
  }

  // Load items with caching
  async function loadItems(options = {}) {
    const { showLoader = true, forceFetch = false } = options
    const cacheKey = getCacheKey()

    // Return cached data if available and not forced to fetch
    if (!forceFetch && isCacheValid(cacheKey) && cachedData.value.has(cacheKey)) {
      items.value = cachedData.value.get(cacheKey).items
      meta.value = cachedData.value.get(cacheKey).meta
      return
    }

    if (showLoader) loading.value = true
    error.value = null
    
    try {
      // Ensure user_id filter for non-superadmin
      const requestFilters = { ...filters.value }
      if (!auth.isSuperAdmin && auth.user?.id) {
        requestFilters.user_id = auth.user.id.toString()
      }

      const response = await fetchStorageItems(currentPage.value, { 
        ...requestFilters,
        per_page: perPage.value 
      })

      // Update cache
      cachedData.value.set(cacheKey, {
        items: response.data,
        meta: response.meta
      })
      lastFetchTime.value.set(cacheKey, Date.now())

      // Clean up old cache entries
      const now = Date.now()
      for (const [key, timestamp] of lastFetchTime.value.entries()) {
        if (now - timestamp > CACHE_DURATION) {
          cachedData.value.delete(key)
          lastFetchTime.value.delete(key)
        }
      }

      items.value = response.data
      meta.value = response.meta
    } catch (err) {
      console.error('Error loading storage items:', err)
      error.value = err.message
      items.value = []
    } finally {
      loading.value = false
    }
  }

  // Debounced load function with increased delay
  const debouncedLoad = debounce(() => loadItems({ preserveScroll: true }), 500)

  function handleFilter(newFilters) {
    // Ensure user_id filter is preserved for non-superadmin
    if (!auth.isSuperAdmin && auth.user?.id) {
      newFilters.user_id = auth.user.id.toString()
    }
    filters.value = newFilters
    currentPage.value = 1
    debouncedLoad()
  }

  function handlePageChange(page) {
    if (page === currentPage.value) return
    currentPage.value = page
    loadItems({ preserveScroll: true })
  }

  function handlePerPageChange(value) {
    if (value === perPage.value) return
    perPage.value = value
    currentPage.value = 1
    loadItems({ preserveScroll: true })
  }

  return {
    items,
    meta,
    loading,
    error,
    visibleItems,
    handleFilter,
    handlePageChange,
    handlePerPageChange,
    loadItems
  }
}