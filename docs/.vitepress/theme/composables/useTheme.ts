import { ref } from 'vue'
import oceanIcon from '~icons/ph/drop-half-bottom-bold'
import forestIcon from '~icons/ph/tree-evergreen-bold'
import autumnIcon from '~icons/ph/leaf-bold'
import darkIcon from '~icons/ph/moon-stars-bold'

const STORAGE_KEY = 'blog-theme'
const DEFAULT_THEME = 'default'

const themes = [
  {
    id: 'default',
    name: 'Ocean',
    color: '#0284c7',
    icon: oceanIcon,
  },
  {
    id: 'forest',
    name: 'Forest',
    color: '#0f766e',
    icon: forestIcon,
  },
  {
    id: 'autumn',
    name: 'Autumn',
    color: '#ea580c',
    icon: autumnIcon,
  },
  {
    id: 'dark',
    name: 'Dark',
    color: '#f8fafc',
    icon: darkIcon,
  },
] as const

type ThemeId = (typeof themes)[number]['id']

const currentTheme = ref<ThemeId>(DEFAULT_THEME)
const themeIds = new Set<string>(themes.map((theme) => theme.id))
let initialized = false

const isClient = () =>
  typeof window !== 'undefined' && typeof document !== 'undefined'

const normalizeTheme = (themeId?: string | null): ThemeId => {
  if (themeId && themeIds.has(themeId)) {
    return themeId as ThemeId
  }

  return DEFAULT_THEME
}

const applyThemeToDocument = (themeId: ThemeId) => {
  if (!isClient()) return

  if (themeId === DEFAULT_THEME) {
    document.documentElement.removeAttribute('data-theme')
    return
  }

  document.documentElement.setAttribute('data-theme', themeId)
}

const persistTheme = (themeId: ThemeId) => {
  if (!isClient()) return
  window.localStorage.setItem(STORAGE_KEY, themeId)
}

const setTheme = (themeId: string) => {
  const nextTheme = normalizeTheme(themeId)
  currentTheme.value = nextTheme
  applyThemeToDocument(nextTheme)
  persistTheme(nextTheme)
}

const initTheme = () => {
  if (!isClient() || initialized) return

  initialized = true
  const savedTheme = normalizeTheme(window.localStorage.getItem(STORAGE_KEY))
  currentTheme.value = savedTheme
  applyThemeToDocument(savedTheme)
}

const cycleTheme = () => {
  const currentIndex = themes.findIndex((theme) => theme.id === currentTheme.value)
  const nextTheme = themes[(currentIndex + 1) % themes.length] ?? themes[0]
  setTheme(nextTheme.id)
}

export const useTheme = () => ({
  themes,
  currentTheme,
  setTheme,
  cycleTheme,
  initTheme,
})
