<script setup>
const emit = defineEmits(['update:store'])

const stores = [
  { id: 'all', name: 'All Stores' },
  { id: 'uzum', name: 'Uzum' },
  { id: 'wildberries', name: 'Wildberries' }
]

const handleChange = (event) => {
  emit('update:store', event.target.value)
}
</script>

<template>
  <select
    @change="handleChange"
    class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
  >
    <option v-for="store in stores" :key="store.id" :value="store.id">
      {{ store.name }}
    </option>
  </select>
</template>