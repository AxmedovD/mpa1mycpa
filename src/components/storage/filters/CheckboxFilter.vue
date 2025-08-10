<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event) => {
  emit('update:modelValue', event.target.checked)
}
</script>

<template>
  <div class="flex flex-col items-start">
    <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">{{ label }}</label>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
  </div>
</template>