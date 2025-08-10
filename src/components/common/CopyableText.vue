<template>
  <div class="group relative inline-flex items-center">
    <div :class="[
      'text-sm',
      copied ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
    ]">
      {{ text || '-' }}
    </div>
    <button
      v-if="text"
      @click.stop="copyToClipboard"
      class="ml-2 p-1 invisible group-hover:visible focus:visible"
      :class="[
        copied ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
      ]"
    >
      <svg
        v-if="!copied"
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        />
      </svg>
      <svg
        v-else
        class="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  }
})

const copied = ref(false)

const copyToClipboard = async () => {
  if (!props.text) return
  
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}
</script>
