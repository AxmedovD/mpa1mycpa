import { ref, watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme !== null) {
    return savedTheme === 'dark'
  }
  return usePreferredDark().value
}

const isDark = ref(getInitialTheme())

export function useTheme() {
  // Update theme class and localStorage when isDark changes
  watch(isDark, (value) => {
    document.documentElement.classList.toggle('dark', value)
    localStorage.setItem('theme', value ? 'dark' : 'light')
  }, { immediate: true })

  // Watch system theme changes if no preference is saved
  const preferredDark = usePreferredDark()
  watch(preferredDark, (value) => {
    if (localStorage.getItem('theme') === null) {
      isDark.value = value
    }
  })

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggleTheme
  }
}