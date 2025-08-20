<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Landing</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Creative</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="offer in offers" :key="offer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="viewOfferDetails(offer, $event)">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedOffers"
                  :value="offer.id"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">#{{ offer.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="relative h-12 w-12 group">
                <img 
                  v-if="offer.image_url" 
                  :src="offer.image_url" 
                  :alt="offer.name"
                  class="h-12 w-12 object-cover rounded-md"
                  @error="handleImageError"
                />
                <div v-else class="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <!-- Enlarged image on hover -->
                <div v-if="offer.image_url" class="hidden group-hover:block absolute z-50 left-0 -top-24 transform shadow-xl rounded-md overflow-hidden">
                  <img 
                    :src="offer.image_url" 
                    :alt="offer.name" 
                    class="h-32 w-32 object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white max-w-[300px] break-words">{{ offer.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ offer.user?.username || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :style="{ 
                  backgroundColor: offer.status?.color ? `${offer.status.color}20` : '#e5e7eb', 
                  color: offer.status?.color || '#374151'
                }"
              >
                {{ offer.status?.name || 'Unknown' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :style="{ 
                  backgroundColor: offer.type?.color ? `${offer.type.color}20` : '#e5e7eb', 
                  color: offer.type?.color || '#374151'
                }"
              >
                {{ offer.type?.name || '-' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                :class="offer.is_exist_landing 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ offer.is_exist_landing ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span 
                :class="offer.is_exist_creative 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'" 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ offer.is_exist_creative ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(offer.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="$emit('edit', offer)" 
                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
              >
                Edit
              </button>
              <button 
                @click="$emit('change-status', offer)" 
                class="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300"
              >
                Status
              </button>
            </td>
          </tr>
          
          <!-- Empty state -->
          <tr v-if="offers.length === 0">
            <td colspan="10" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              No offers found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Bulk actions moved to FixedActions component -->
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  offers: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'change-status', 'update:selected'])
const router = useRouter()

// Selected offers for bulk actions
const selectedOffers = ref([])

// Computed property to check if all offers are selected
const allSelected = computed(() => {
  return props.offers.length > 0 && selectedOffers.value.length === props.offers.length
})

// Toggle select all offers
const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedOffers.value = []
  } else {
    selectedOffers.value = props.offers.map(offer => offer.id)
  }
  emit('update:selected', selectedOffers.value)
}

// Watch for changes in selected offers
watch(selectedOffers, (newSelected) => {
  emit('update:selected', newSelected)
}, { deep: true })

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  })
}

// Reset selected offers when offers change
watch(() => props.offers, () => {
  selectedOffers.value = []
  emit('update:selected', [])
})

// Navigate to offer details page
const viewOfferDetails = (offer, event) => {
  // Don't navigate if clicking on a checkbox, button, or image
  if (event.target.tagName === 'INPUT' || 
      event.target.tagName === 'BUTTON' || 
      event.target.closest('button') || 
      event.target.tagName === 'IMG' || 
      event.target.closest('.group')) {
    return
  }
  
  // Navigate to offer details page
  router.push(`/offers/${offer.id}`)
}

// Handle image loading errors
const handleImageError = (event) => {
  // Use a simple SVG data URL as placeholder instead of external URL
  event.target.src = 'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23cccccc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"%3e%3crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3e%3c/rect%3e%3ccircle cx="8.5" cy="8.5" r="1.5"%3e%3c/circle%3e%3cpolyline points="21 15 16 10 5 21"%3e%3c/polyline%3e%3c/svg%3e'
}

// Convert local URLs to production URLs
const getProductionImageUrl = (url) => {
  if (!url) return ''
  
  // Replace local development URL with production URL
  return url.replace('http://127.0.0.1:8000', 'https://my.mgoods.uz')
           .replace('http://localhost:8000', 'https://my.mgoods.uz')
           .replace('https://api.mgoods.uz', 'https://my.mgoods.uz')
}
</script>
