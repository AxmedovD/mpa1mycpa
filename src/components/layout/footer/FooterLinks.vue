<script setup>
const links = [
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' },
  { name: 'Contact', href: '#' }
]
</script>

<template>
  <div class="flex flex-wrap gap-4 justify-center md:justify-end">
    <a 
      v-for="link in links" 
      :key="link.name"
      :href="link.href" 
      class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 whitespace-nowrap"
    >
      {{ link.name }}
    </a>
  </div>
</template>