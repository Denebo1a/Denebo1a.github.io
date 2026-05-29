import { computed, ref, watchEffect } from 'vue'
import { data as allTabs } from '../../../basstabs/basstabs.data'

export type BassTabItem = {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  artist: string
  genre: string
  cover?: string
  musicxmlUrl?: string
  bilibiliUrl?: string
  baiduDiskUrl?: string
  lanzouUrl?: string
}

export type BassTabLinkItem = {
  label: string
  icon: 'bilibili' | 'baidu' | 'lanzou'
  url: string
}

const DEFAULT_GENRE = '全部'
const PAGE_SIZE = 30

const searchQuery = ref('')
const selectedGenre = ref(DEFAULT_GENRE)
const selectedArtist = ref('')
const currentPage = ref(1)

const genres = ['全部', '虚拟歌手', '偶像音乐企划', '邦摇',] as const

const buildTabLinks = (tab: BassTabItem): BassTabLinkItem[] => {
  const links: BassTabLinkItem[] = []

  if (tab.bilibiliUrl) {
    links.push({ label: 'B站走带视频', icon: 'bilibili', url: tab.bilibiliUrl })
  }

  if (tab.baiduDiskUrl) {
    links.push({ label: '百度网盘', icon: 'baidu', url: tab.baiduDiskUrl })
  }

  if (tab.lanzouUrl) {
    links.push({ label: '蓝奏云', icon: 'lanzou', url: tab.lanzouUrl })
  }

  return links
}

const artists = computed(() => {
  const set = new Set((allTabs as BassTabItem[]).map((tab) => tab.artist).filter(Boolean))
  return Array.from(set)
})

const filteredTabs = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return (allTabs as BassTabItem[]).filter((tab) => {
    const matchesSearch =
      !query ||
      tab.title?.toLowerCase().includes(query) ||
      tab.artist?.toLowerCase().includes(query)

    const matchesGenre =
      selectedGenre.value === DEFAULT_GENRE || tab.genre === selectedGenre.value

    const matchesArtist = !selectedArtist.value || tab.artist === selectedArtist.value

    return matchesSearch && matchesGenre && matchesArtist
  })
})

const totalTabs = computed(() => filteredTabs.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(totalTabs.value / PAGE_SIZE)))

const paginatedTabs = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  return filteredTabs.value.slice(startIndex, startIndex + PAGE_SIZE)
})

const filterViewKey = computed(() =>
  JSON.stringify({
    search: searchQuery.value,
    genre: selectedGenre.value,
    artist: selectedArtist.value,
    tabs: filteredTabs.value.map((tab) => tab.url),
  }),
)

const tabsViewKey = computed(() =>
  JSON.stringify({
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    view: filterViewKey.value,
    tabs: paginatedTabs.value.map((tab) => tab.url),
  }),
)

const resetPagination = () => {
  currentPage.value = 1
}

const setCurrentPage = (value: number) => {
  const nextPage = Math.min(Math.max(1, value), totalPages.value)
  currentPage.value = nextPage
}

const setSearchQuery = (value: string) => {
  searchQuery.value = value
  resetPagination()
}

const setSelectedGenre = (value: string) => {
  selectedGenre.value = value
  resetPagination()
}

const setSelectedArtist = (value: string) => {
  selectedArtist.value = value
  resetPagination()
}

const toggleArtist = (artist: string) => {
  selectedArtist.value = selectedArtist.value === artist ? '' : artist
  resetPagination()
}

const clearArtist = () => {
  selectedArtist.value = ''
  resetPagination()
}

const resetBassTabsIndexState = () => {
  searchQuery.value = ''
  selectedGenre.value = DEFAULT_GENRE
  selectedArtist.value = ''
  resetPagination()
}

watchEffect(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

export const useBassTabsIndex = () => ({
  searchQuery,
  selectedGenre,
  selectedArtist,
  currentPage,
  pageSize: PAGE_SIZE,
  genres,
  artists,
  filteredTabs,
  totalTabs,
  totalPages,
  paginatedTabs,
  filterViewKey,
  tabsViewKey,
  buildTabLinks,
  setSearchQuery,
  setSelectedGenre,
  setSelectedArtist,
  setCurrentPage,
  resetPagination,
  toggleArtist,
  clearArtist,
  resetBassTabsIndexState,
})
