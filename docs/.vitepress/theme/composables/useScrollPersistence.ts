import { computed, nextTick, ref } from 'vue'

const STORAGE_KEY = 'blog-reading-position'
const MAX_ENTRIES = 50

type StoredScrollState = Record<string, number>

const progress = ref(0)
let scrollRoot: HTMLElement | null = null

const isClient = () => typeof window !== 'undefined'

const readStoredState = (): StoredScrollState => {
  if (!isClient()) return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeStoredState = (state: StoredScrollState) => {
  if (!isClient()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const pruneState = (state: StoredScrollState) => {
  const entries = Object.entries(state)
  if (entries.length <= MAX_ENTRIES) return state

  return Object.fromEntries(entries.slice(entries.length - MAX_ENTRIES))
}

const getScrollProgress = (target: HTMLElement | null) => {
  if (!target) return 0

  const maxScrollTop = target.scrollHeight - target.clientHeight
  if (maxScrollTop <= 0) return 0
  return Math.round(Math.min(100, Math.max(0, (target.scrollTop / maxScrollTop) * 100)))
}

const saveScrollPosition = (path: string, scrollTop: number) => {
  if (!path || scrollTop < 0) return

  const state = readStoredState()
  state[path] = scrollTop
  writeStoredState(pruneState(state))
}

const getSavedScrollPosition = (path: string) => {
  if (!path) return null

  const state = readStoredState()
  const saved = state[path]
  return typeof saved === 'number' ? saved : null
}

const updateProgress = () => {
  progress.value = getScrollProgress(scrollRoot)
}

const bindScrollRoot = (target: HTMLElement | null) => {
  if (scrollRoot === target) {
    updateProgress()
    return
  }

  scrollRoot?.removeEventListener('scroll', updateProgress)
  scrollRoot = target

  if (!scrollRoot) {
    progress.value = 0
    return
  }

  scrollRoot.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
}

const unbindScrollRoot = () => {
  scrollRoot?.removeEventListener('scroll', updateProgress)
  scrollRoot = null
  progress.value = 0
}

const restoreScrollPosition = async (path: string) => {
  if (!scrollRoot) return false

  const savedPosition = getSavedScrollPosition(path)
  if (savedPosition === null) {
    updateProgress()
    return false
  }

  await nextTick()
  scrollRoot.scrollTo({ top: savedPosition, behavior: 'auto' })
  updateProgress()
  return true
}

const syncProgress = (path?: string) => {
  updateProgress()

  if (path && scrollRoot) {
    saveScrollPosition(path, scrollRoot.scrollTop)
  }
}

const scrollToTop = () => {
  scrollRoot?.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const getScrollTop = () => scrollRoot?.scrollTop ?? 0

export const useScrollPersistence = () => ({
  progress: computed(() => progress.value),
  bindScrollRoot,
  unbindScrollRoot,
  saveScrollPosition,
  restoreScrollPosition,
  syncProgress,
  scrollToTop,
  getScrollTop,
})
