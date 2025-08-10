<template>
  <div v-if="show" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Edit Offer</h3>
          
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div class="mb-4">
              <label for="desc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                id="desc"
                v-model="formData.desc"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              ></textarea>
            </div>
            
            <div class="mb-4">
              <label for="user_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
              <select
                id="user_id"
                v-model="formData.user_id"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>Select a user</option>
                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="img" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
              <input
                id="img"
                v-model="formData.img"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div class="mb-4 flex space-x-4">
              <div class="flex-1">
                <label for="is_exist_landing" class="flex items-center">
                  <input
                    id="is_exist_landing"
                    v-model="formData.is_exist_landing"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Landing Page</span>
                </label>
              </div>
              
              <div class="flex-1">
                <label for="is_exist_creative" class="flex items-center">
                  <input
                    id="is_exist_creative"
                    v-model="formData.is_exist_creative"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Has Creative</span>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="submitForm" 
            :disabled="isSubmitting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
          <button 
            @click="$emit('close')" 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  offer: {
    type: Object,
    default: null
  },
  users: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'update'])

// Form data
const formData = ref({
  name: '',
  desc: '',
  user_id: '',
  img: '',
  is_exist_landing: false,
  is_exist_creative: false
})

// Submission state
const isSubmitting = ref(false)

// Reset form when modal is opened
watch(() => props.show, (newVal) => {
  if (newVal && props.offer) {
    formData.value = {
      name: props.offer.name || '',
      desc: props.offer.desc || '',
      user_id: props.offer.user?.id || '',
      img: props.offer.img || '',
      is_exist_landing: Boolean(props.offer.is_exist_landing),
      is_exist_creative: Boolean(props.offer.is_exist_creative)
    }
  }
})

// Submit form
const submitForm = async () => {
  if (!formData.value.name || !formData.value.user_id) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    emit('update', {
      id: props.offer.id,
      ...formData.value
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
