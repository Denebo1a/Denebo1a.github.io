import { computed, ref } from 'vue'
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

const searchQuery = ref('')
const selectedGenre = ref(DEFAULT_GENRE)
const selectedArtist = ref('')

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

const setSearchQuery = (value: string) => {
  searchQuery.value = value
}

const setSelectedGenre = (value: string) => {
  selectedGenre.value = value
}

const setSelectedArtist = (value: string) => {
  selectedArtist.value = value
}

const toggleArtist = (artist: string) => {
  selectedArtist.value = selectedArtist.value === artist ? '' : artist
}

const clearArtist = () => {
  selectedArtist.value = ''
}

const resetBassTabsIndexState = () => {
  searchQuery.value = ''
  selectedGenre.value = DEFAULT_GENRE
  selectedArtist.value = ''
}

export const useBassTabsIndex = () => ({
  searchQuery,
  selectedGenre,
  selectedArtist,
  genres,
  artists,
  filteredTabs,
  buildTabLinks,
  setSearchQuery,
  setSelectedGenre,
  setSelectedArtist,
  toggleArtist,
  clearArtist,
  resetBassTabsIndexState,
})
