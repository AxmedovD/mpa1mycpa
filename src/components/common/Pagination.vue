<script setup>
const props = defineProps({
  meta: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['page-change', 'per-page-change'])

const perPageOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 200, label: '200' }
]

const getPageNumbers = () => {
  const current = props.meta.current_page
  const last = props.meta.last_page || Math.ceil(props.meta.filtered_total / props.meta.per_page)
  const delta = 2
  const range = []
  
  if (last === 0) return range
  
  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < last - 1) {
    range.push('...')
  }
  
  if (last > 0) range.unshift(1)
  if (last > 1) range.push(last)
  
  return range
}

const handlePerPageChange = (value) => {
  if (value <= (props.meta.filtered_total * 3)) {
    emit('per-page-change', Number(value))
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
    <div class="flex-1 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">Show</span>
          <div class="flex items-center gap-2">
            <button
              v-for="option in perPageOptions"
              :key="option.value"
              @click="handlePerPageChange(option.value)"
              class="px-3 py-1 text-sm rounded-md transition-colors"
              :class="[
                meta.per_page === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
                option.value > (meta.filtered_total * 3) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              :disabled="option.value > (meta.filtered_total * 3)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
        Showing {{ meta.this_page }} of {{ meta.filtered_total }} items
      </div>

      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px self-center sm:self-auto" aria-label="Pagination">
        <button
          :disabled="meta.current_page === 1"
          @click="$emit('page-change', meta.current_page - 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <span class="sr-only">Previous</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <template v-for="page in getPageNumbers()" :key="page">
          <button
            v-if="page === '...'"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
            disabled
          >
            ...
          </button>
          <button
            v-else
            @click="$emit('page-change', page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              meta.current_page === page
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900/50 dark:border-indigo-400 dark:text-indigo-400'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <button
          :disabled="meta.current_page === meta.last_page || meta.last_page === 0"
          @click="$emit('page-change', meta.current_page + 1)"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <span class="sr-only">Next</span>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>