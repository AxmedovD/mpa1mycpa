<template>
  <SearchSelect
    ref="searchSelect"
    v-bind="$attrs"
    :search-endpoint="endpoint"
    @select="$emit('select', $event)"
  />
</template>

<script setup>
import { ref } from 'vue'
import SearchSelect from './SearchSelect.vue'

const props = defineProps({
  endpoint: {
    type: String,
    required: true
  }
})

const searchSelect = ref(null)

// Expose the reset method
const reset = () => {
  searchSelect.value?.reset()
}

defineExpose({ reset })
</script>
