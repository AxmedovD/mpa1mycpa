<script setup>
const currentYear = new Date().getFullYear()
</script>

<template>
  <p class="text-sm text-center md:text-left text-gray-500 dark:text-gray-400">
    © {{ currentYear }} Warehouse Management System
  </p>
</template>