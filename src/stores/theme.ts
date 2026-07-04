import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'necha_theme'

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute('data-theme', mode)
  document.documentElement.style.colorScheme = mode
  document.documentElement.style.removeProperty('background')
  document.body?.style.removeProperty('background')
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getInitialTheme())

  function setMode(next: ThemeMode) {
    mode.value = next
  }

  function toggle() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  watch(
    mode,
    (value) => {
      applyTheme(value)
      localStorage.setItem(STORAGE_KEY, value)
    },
    { immediate: true },
  )

  return { mode, setMode, toggle }
})

export function initTheme() {
  applyTheme(getInitialTheme())
}
