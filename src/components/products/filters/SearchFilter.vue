<script setup>
const emit = defineEmits(['search'])

const handleSearch = (event) => {
  emit('search', event.target.value)
}
</script>

<template>
  <div class="relative">
    <input
      type="text"
      placeholder="Search products..."
      @input="handleSearch"
      class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
    />
    <span class="absolute left-3 top-2.5 text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>
  </div>
</template>