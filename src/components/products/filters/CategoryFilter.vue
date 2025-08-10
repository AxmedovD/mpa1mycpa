<script setup>
const emit = defineEmits(['update:category'])

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'accessories', name: 'Accessories' }
]

const handleChange = (event) => {
  emit('update:category', event.target.value)
}
</script>

<template>
  <select
    @change="handleChange"
    class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-3 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
  >
    <option v-for="category in categories" :key="category.id" :value="category.id">
      {{ category.name }}
    </option>
  </select>
</template>