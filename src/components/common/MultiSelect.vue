<template>
  <div class="relative">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>
    
    <div 
      class="relative min-w-[200px] border rounded-md shadow-sm cursor-pointer bg-white dark:bg-gray-700"
      @click="toggleDropdown"
      ref="selectRef"
    >
      <!-- Selected items display -->
      <div class="flex flex-wrap gap-1 p-2 min-h-[38px]">
        <template v-if="modelValue.length">
          <span 
            v-for="id in modelValue" 
            :key="id"
            class="inline-flex items-center px-2 py-0.5 rounded text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {{ getOptionLabel(id) }}
            <button
              type="button"
              class="ml-1 inline-flex"
              @click.stop="removeValue(id)"
            >
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
        </template>
        <span v-else class="text-gray-500 dark:text-gray-400">
          Tanlash...
        </span>
      </div>

      <!-- Dropdown arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- Dropdown menu -->
    <div 
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full bg-white dark:bg-white-700 shadow-lg rounded-md py-1 text-base overflow-auto max-h-60"
    >
      <!-- Search input -->
      <div v-if="searchable" class="px-3 py-2">
        <input
          type="text"
          class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-white-700 dark:focus:ring-blue-500 sm:text-sm sm:leading-6"
          placeholder="Search..."
          v-model="searchQuery"
          @click.stop
        > 
      </div>

      <!-- Options list -->
      <div class="mt-1">
        <template v-for="option in filteredOptions" :key="option.id">
          <button
            type="button"
            class="relative w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white-600"
            :class="{ 'bg-gray-50 dark:bg-white-600': isSelected(option.id) }"
            @click.stop="toggleOption(option.id)"
          >
            {{ option.name }}
          </button>
        </template>
        <div v-if="!filteredOptions.length" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
          No options found
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  searchable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectRef = ref(null)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(option => 
    option.name.toLowerCase().includes(query)
  )
})

const getOptionLabel = (id) => {
  const option = props.options.find(opt => opt.id === id)
  return option ? option.name : ''
}

const isSelected = (id) => {
  return props.modelValue.includes(id)
}

const toggleOption = (id) => {
  let newValue
  if (props.multiple) {
    newValue = isSelected(id)
      ? props.modelValue.filter(v => v !== id)
      : [...props.modelValue, id]
  } else {
    newValue = isSelected(id) ? [] : [id]
    isOpen.value = false
  }
  emit('update:modelValue', newValue)
}

const removeValue = (id) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== id))
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// Reset search when dropdown closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = ''
  }
})
</script>
