<template>
  <div v-if="show" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
            {{ isBulk ? 'Change Status for Multiple Offers' : 'Change Status for Offer' }}
          </h3>
          
          <div v-if="!isBulk" class="mb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Changing status for: <span class="font-medium text-gray-700 dark:text-gray-300">{{ offer?.name }}</span>
            </p>
          </div>
          
          <div v-else class="mb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Changing status for {{ offerIds.length }} {{ offerIds.length === 1 ? 'offer' : 'offers' }}
            </p>
          </div>
          
          <form @submit.prevent="submitForm">
            <div class="mb-4">
              <label for="status_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Status</label>
              <select
                id="status_id"
                v-model="formData.status_id"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>Select a status</option>
                <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
              </select>
            </div>
            
            <div class="mb-4">
              <label for="type_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Type</label>
              <select
                id="type_id"
                v-model="formData.type_id"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="" disabled>Select a type</option>
                <option v-for="type in types" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
          </form>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="submitForm" 
            :disabled="isSubmitting || (!formData.status_id && !formData.type_id)"
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
import { ref, computed, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  offer: {
    type: Object,
    default: null
  },
  offerIds: {
    type: Array,
    default: () => []
  },
  statuses: {
    type: Array,
    default: () => []
  },
  types: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'update', 'bulk-update'])

// Form data
const formData = ref({
  status_id: '',
  type_id: ''
})

// Submission state
const isSubmitting = ref(false)

// Computed property to check if this is a bulk update
const isBulk = computed(() => props.offerIds && props.offerIds.length > 0)

// Reset form when modal is opened
watch(() => props.show, (newVal) => {
  if (newVal) {
    // If editing a single offer, pre-fill with its current values
    if (props.offer) {
      formData.value = {
        status_id: props.offer.status_id || '',
        type_id: props.offer.type_id || ''
      }
    } else {
      // For bulk updates, start with empty form
      formData.value = {
        status_id: '',
        type_id: ''
      }
    }
  }
})

// Submit form
const submitForm = async () => {
  // Validate that at least one field is provided
  if (!formData.value.status_id && !formData.value.type_id) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    if (isBulk.value) {
      // Bulk update
      emit('bulk-update', {
        offers: props.offerIds.map(id => ({ id })),
        ...formData.value
      })
    } else {
      // Single offer update
      emit('update', {
        id: props.offer.id,
        ...formData.value
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
