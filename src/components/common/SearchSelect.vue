<template>
  <div class="search-select-container relative">
    <input
      type="text"
      :value="searchQuery"
      @input="handleInput"
      @focus="handleFocus"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
    />
    
    <!-- Loading indicator -->
    <div v-if="loading" class="absolute right-3 top-2.5">
      <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
    </div>

    <!-- Dropdown -->
    <div
      v-show="showDropdown && options.length > 0"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-white-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <ul class="py-1 max-h-60 overflow-auto">
        <li
          v-for="option in options"
          :key="option.id"
          @click="handleSelect(option)"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <div class="flex items-center gap-3">  
            <!-- Image display with hover effect -->
            <div v-if="option.image" class="flex-shrink-0 relative group">
              <img 
                :src="option.image" 
                :alt="option.name" 
                class="h-16 w-16 object-cover rounded-md"
                @error="handleImageError"
              />
              <!-- Enlarged image on hover - Only shows when hovering over the image -->
              <div class="hidden group-hover:block absolute z-50 left-0 -top-12 transform shadow-xl rounded-md overflow-hidden">
                <img 
                  :src="option.image" 
                  :alt="option.name" 
                  class="h-32 w-32 object-cover"
                  @error="handleImageError"
                />
              </div>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <span class="text-gray-900 dark:text-black">{{ option.name }}</span>
                <div class="flex gap-2">
                  <span v-if="option.sku" class="text-sm text-red-600 dark:text-red-600">{{ option.sku }}</span>
                  <span v-if="option.uzum_sku_title || option.uzum_sku" class="text-sm text-blue-600 dark:text-blue-600">
                    {{ option.uzum_sku_title || option.uzum_sku }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="hasMore" class="border-t border-gray-200">
        <button 
          @click.stop="loadMore"
          class="w-full px-3 py-2 text-center text-blue-600 hover:bg-gray-50 cursor-pointer flex items-center justify-center"
          :disabled="loadingMore"
        >
          <div v-if="loadingMore" class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          {{ loadingMore ? 'Loading...' : 'Show More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { debounce } from 'lodash-es'
import { API_URL } from '../../config/api'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Qidirish...'
  },
  searchEndpoint: {
    type: String,
    required: true
  },
  additionalParams: {
    type: Object,
    default: () => ({})
  },
  displayValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const loading = ref(false)
const loadingMore = ref(false)
const options = ref([])
const showDropdown = ref(false)
const searchQuery = ref(props.displayValue || '')
const currentPage = ref(1)
const hasMore = ref(false)

// Function to fetch initial or search items
const fetchItems = async (query = '', page = 1) => {
  try {
    if (page === 1) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    const params = {
      ...props.additionalParams
    }
    
    if (query) {
      params.search = query
    }

    const response = await axios.get(`${props.searchEndpoint}`, {
      headers,
      params
    })

    const data = response.data

    if (page === 1) {
      // For initial load, show only first 5 items
      options.value = query ? data : data.slice(0, 5)
    } else {
      options.value = [...options.value, ...data]
    }

    // Show "Show More" if there are more items than currently shown
    hasMore.value = query ? data.length > options.value.length : data.length > 5
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// Debounced search function
const debouncedSearch = debounce(async (query) => {
  currentPage.value = 1
  await fetchItems(query)
}, 300)

const handleInput = (e) => {
  const query = e.target.value
  searchQuery.value = query
  showDropdown.value = true
  debouncedSearch(query)
}

const handleFocus = async () => {
  showDropdown.value = true
  if (options.value.length === 0) {
    // Fetch initial items when focused and no items are loaded
    await fetchItems()
  }
}

const handleSelect = (option) => {
  searchQuery.value = option.name
  showDropdown.value = false
  emit('update:modelValue', option.id)
  emit('select', option)
}

const loadMore = async (e) => {
  if (loadingMore.value) return
  
  // Prevent click event from closing the dropdown
  e.preventDefault()
  e.stopPropagation()
  
  const allData = await axios.get(`${props.searchEndpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    params: props.additionalParams
  }).then(res => res.data)
  
  // Show next 5 items
  const currentLength = options.value.length
  options.value = allData.slice(0, currentLength + 5)
  hasMore.value = allData.length > options.value.length
  currentPage.value += 1
}

const closeDropdown = (event) => {
  if (!event.target.closest('.search-select-container')) {
    showDropdown.value = false
  }
}

const reset = () => {
  searchQuery.value = ''
  options.value = []
  showDropdown.value = false
  loading.value = false
  loadingMore.value = false
  currentPage.value = 1
  hasMore.value = false
  emit('update:modelValue', '')
}

defineExpose({ reset })

// Watch for external displayValue changes
watch(() => props.displayValue, (newValue) => {
  searchQuery.value = newValue
})

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/100'
}
</script>
