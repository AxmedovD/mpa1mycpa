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
  <div class="flex items-center">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="handleChange"
      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
    />
    <label class="ml-2 block text-sm text-gray-700 dark:text-gray-300">{{ label }}</label>
  </div>
</template>