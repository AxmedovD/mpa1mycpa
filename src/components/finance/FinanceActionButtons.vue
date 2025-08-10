<script setup>
const actions = [
  { id: 'expense', label: 'Add Expense', color: 'red' }
]
</script>

<template>
  <div class="flex gap-4">
    <button
      v-for="action in actions"
      :key="action.id"
      :class="[
        'px-4 py-2 text-white rounded-lg transition-colors',
        {
          'bg-red-600 hover:bg-red-700': action.color === 'red'
        }
      ]"
    >
      {{ action.label }}
    </button>
  </div>
</template>