<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left column: Image and basic info -->
      <div>
        <div class="mb-6">
          <img 
            :src="offer.image_url" 
            :alt="offer.name" 
            class="w-full h-64 object-cover rounded-lg shadow-sm"
            @error="handleImageError"
          />
        </div>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">User</h3>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ offer.user?.username || 'N/A' }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Group ID</h3>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ offer.group_id || 'N/A' }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Method ID</h3>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ offer.shipping_method_id || 'N/A' }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Tariff ID</h3>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ offer.tariff_id || 'N/A' }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
            <p class="text-base font-medium text-gray-900 dark:text-white">{{ offer.desc || 'No description available' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Right column: Flags and additional info -->
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Properties</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Landing Page Exists</span>
              <div class="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  :id="`landing-toggle-${offer.id}`" 
                  :checked="offer.is_exist_landing" 
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  @change="$emit('update-landing', $event.target.checked)"
                />
                <label 
                  :for="`landing-toggle-${offer.id}`" 
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Creative Exists</span>
              <div class="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  :id="`creative-toggle-${offer.id}`" 
                  :checked="offer.is_exist_creative" 
                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  @change="$emit('update-creative', $event.target.checked)"
                />
                <label 
                  :for="`creative-toggle-${offer.id}`" 
                  class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Dates</h3>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h3>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(offer.created_at) }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h3>
              <p class="text-base font-medium text-gray-900 dark:text-white">{{ formatDate(offer.updated_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  offer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-landing', 'update-creative'])

// Handle image loading error
const handleImageError = (e) => {
  e.target.src = '/img/no-image.png' // Fallback image
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #4ade80;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #4ade80;
}
</style>
