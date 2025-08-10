<script setup>
const emit = defineEmits(['update:value'])

const handleInput = (event) => {
  emit('update:value', event.target.value)
}
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
    <input
      type="text"
      placeholder="Search..."
      @input="handleInput"
      class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</template>