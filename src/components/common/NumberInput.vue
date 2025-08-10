<template>
  <input
    :value="displayValue"
    @input="handleInput"
    @blur="handleBlur"
    type="text"
    class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  // Format number with spaces for thousands
  return Number(props.modelValue).toLocaleString('en-US', {
    maximumFractionDigits: 0,
    useGrouping: true
  }).replace(/,/g, ' ')
})

const handleInput = (event) => {
  // Remove all non-digit characters
  const value = event.target.value.replace(/\D/g, '')
  if (value) {
    emit('update:modelValue', parseInt(value, 10))
  } else {
    emit('update:modelValue', '')
  }
}

const handleBlur = (event) => {
  // Format on blur
  if (props.modelValue) {
    event.target.value = displayValue.value
  }
}
</script>
