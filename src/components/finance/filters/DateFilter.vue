<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  fromDate: {
    type: String,
    default: ''
  },
  toDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:fromDate', 'update:toDate'])

const handleFromChange = (event) => {
  emit('update:fromDate', event.target.value)
}

const handleToChange = (event) => {
  emit('update:toDate', event.target.value)
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label }}</label>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
        <input
          type="date"
          :value="fromDate"
          @input="handleFromChange"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
        <input
          type="date"
          :value="toDate"
          @input="handleToChange"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  </div>
</template>