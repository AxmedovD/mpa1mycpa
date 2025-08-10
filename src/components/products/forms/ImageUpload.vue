<script setup>
import { ref } from 'vue'

const emit = defineEmits(['image-selected'])
const fileInput = ref(null)
const previewUrl = ref(null)
const error = ref('')

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
const maxSize = 2 * 1024 * 1024 // 2MB

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  error.value = ''
  
  if (!file) return
  
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Please select a valid image file (JPEG, PNG, or GIF)'
    return
  }
  
  if (file.size > maxSize) {
    error.value = 'Image size must be less than 2MB'
    return
  }
  
  // Create preview URL
  previewUrl.value = URL.createObjectURL(file)
  emit('image-selected', file)
}

const clearImage = () => {
  if (fileInput.value) fileInput.value.value = ''
  previewUrl.value = null
  emit('image-selected', null)
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mahsulotning rasmi</label>
    
    <div 
      class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg"
      :class="{ 'border-red-300 dark:border-red-600': error }"
    >
      <div class="space-y-1 text-center">
        <div v-if="previewUrl" class="mb-4">
          <img :src="previewUrl" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded" />
          <button 
            @click="clearImage"
            class="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Olib tashlash
          </button>
        </div>
        
        <div v-else class="flex text-sm text-gray-600 dark:text-gray-400">
          <label
            class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>Rasm qo'shish</span>
            <input
              ref="fileInput"
              type="file"
              class="sr-only"
              accept="image/*"
              @change="handleFileSelect"
            />
          </label>
          <p class="pl-1">yoki rasmlarni joylashtirish</p>
        </div>
        
        <p class="text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG, GIF up to 2MB
        </p>
        
        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>