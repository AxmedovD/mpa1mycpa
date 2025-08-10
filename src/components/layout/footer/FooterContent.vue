<script setup>
import FooterCopyright from './FooterCopyright.vue'
import FooterLinks from './FooterLinks.vue'
</script>

<template>
  <div class="w-full h-full flex items-center">
    <div class="w-full px-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        <FooterCopyright />
        <FooterLinks />
      </div>
    </div>
  </div>
</template>