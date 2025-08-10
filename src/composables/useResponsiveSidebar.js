import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsiveSidebar() {
  const isSidebarOpen = ref(true)
  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
    if (isMobile.value) {
      isSidebarOpen.value = false
    }
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  return {
    isSidebarOpen,
    isMobile
  }
}