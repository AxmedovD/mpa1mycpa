<template>
  <div 
    v-if="visible" 
    class="fixed bottom-4 inset-x-0 mx-auto max-w-screen-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg py-3 px-4 z-40 rounded-lg"
    style="width: calc(100% - 32px);"
  >
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        <slot name="info">{{ selectedCount }} {{ selectedCount === 1 ? 'item' : 'items' }} selected</slot>
      </div>
      <div class="flex space-x-3">
        <slot name="actions">
          <!-- Default actions -->
          <button 
            v-if="showStatusAction"
            @click="$emit('change-status')" 
            class="bg-amber-600 hover:bg-amber-700 text-white font-medium py-1.5 px-3 rounded-md text-sm"
          >
            Change Status
          </button>
          <button 
            v-if="showCancelAction"
            @click="$emit('cancel')" 
            class="bg-gray-500 hover:bg-gray-600 text-white font-medium py-1.5 px-3 rounded-md text-sm"
          >
            Cancel
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  selectedCount: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: false
  },
  showStatusAction: {
    type: Boolean,
    default: true
  },
  showCancelAction: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['change-status', 'cancel']);
</script>
