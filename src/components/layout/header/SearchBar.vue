<script setup>
const emit = defineEmits(['search'])

const handleSearch = (e) => {
  emit('search', e.target.value)
}
</script>

<template>
  <div class="relative w-full">
    <input 
      type="text"
      placeholder="Search..."
      @input="handleSearch"
      class="w-full px-4 py-2 pl-10 pr-4 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 border-transparent focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-gray-200"
    />
    <span class="absolute left-3 top-2.5 text-gray-400">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>
  </div>
</template>