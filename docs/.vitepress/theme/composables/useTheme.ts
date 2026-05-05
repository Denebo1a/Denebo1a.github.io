import { ref } from 'vue'
import oceanIcon from '~icons/ph/drop-half-bottom-bold'
import forestIcon from '~icons/ph/tree-evergreen-bold'
import irisIcon from '~icons/ph/bird-bold'
import NoirIcon from '~icons/ph/paint-brush-bold'
import darkIcon from '~icons/ph/moon-stars-bold'

const STORAGE_KEY = 'blog-theme'
const DEFAULT_THEME = 'default'

type ThemeId = 'default' | 'forest' | 'iris' | 'noir' | 'dark'
type ThemeIconClassResolver = (currentTheme: ThemeId) => string

type ThemeOption = {
  id: ThemeId
  name: string
  color: string
  icon: unknown
  menuIconClass?: ThemeIconClassResolver
}

const themes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Ocean',
    color: '#006fee',
    icon: oceanIcon,
  },
  {
    id: 'forest',
    name: 'Forest',
    color: '#0a8f7a',
    icon: forestIcon,
  },
  {
    id: 'iris',
    name: 'Iris',
    color: '#7047eb',
    icon: irisIcon,
  },
  {
    id: 'noir',
    name: 'Noir',
    color: '#18181B',
    icon: NoirIcon,
    menuIconClass: (currentTheme) => (currentTheme === 'dark' ? 'text-white' : ''),
  },
  {
    id: 'dark',
    name: 'Dark',
    color: '#f8fafc',
    icon: darkIcon,
  },
] as const

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

  const root = document.documentElement

  if (themeId === DEFAULT_THEME) {
    root.removeAttribute('data-theme')
    root.classList.remove('dark')
    return
  }

  root.setAttribute('data-theme', themeId)

  if (themeId === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
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
