import { computed, ref, watchEffect } from 'vue'
import { data as allPosts } from '../../../blog/posts.data'
import { formatMonthLabel } from '../utils/format'

export type BlogPostItem = {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  category: string
  tags: string[]
  summary?: string
  cover?: string
}

const DEFAULT_CATEGORY = '全部'
const DEFAULT_LAYOUT = 'grid'
const DEFAULT_SORT = 'date'
const PAGE_SIZE = 12

type BlogPostMonthGroup = {
  monthKey: string
  monthLabel: string
  posts: BlogPostItem[]
}

const searchQueryInput = ref('')
const searchQuery = ref('')
const tagQuery = ref<string[]>([])
const dateRange = ref<string[]>([])
const selectedCategory = ref(DEFAULT_CATEGORY)
const selectedLayout = ref(DEFAULT_LAYOUT)
const selectedSort = ref(DEFAULT_SORT)
const currentPage = ref(1)

const categories = computed(() => {
  const categoryCounts = (allPosts as BlogPostItem[]).reduce<Record<string, number>>((acc, post) => {
    const cat = post.category
    if (cat) {
      acc[cat] = (acc[cat] || 0) + 1
    }
    return acc
  }, {})

  return [
    { category: DEFAULT_CATEGORY, count: (allPosts as BlogPostItem[]).length },
    ...Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    })),
  ]
})

const tags = computed(() => {
  const set = new Set((allPosts as BlogPostItem[]).flatMap((post) => post.tags || []))
  return Array.from(set)
})

const filteredPosts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  const result = (allPosts as BlogPostItem[]).filter((post) => {
    const matchesSearch =
      !query ||
      post.title?.toLowerCase().includes(query) ||
      post.summary?.toLowerCase().includes(query)

    const matchesTags = tagQuery.value.every((queryTag) =>
      post.tags?.some((postTag) => postTag.toLowerCase().includes(queryTag.toLowerCase())),
    )

    const matchesCategory =
      selectedCategory.value === DEFAULT_CATEGORY || post.category === selectedCategory.value

    let matchesDate = true
    const postTime = post.date.time

    if (dateRange.value[0]) {
      const startTime = new Date(dateRange.value[0]).getTime()
      if (postTime < startTime) matchesDate = false
    }

    if (dateRange.value[1]) {
      const endTime = new Date(dateRange.value[1]).getTime() + 86399999
      if (postTime > endTime) matchesDate = false
    }

    return matchesSearch && matchesTags && matchesCategory && matchesDate
  })

  return result.sort((a, b) => {
    return selectedSort.value === 'date-asc' ? a.date.time - b.date.time : b.date.time - a.date.time
  })
})

const totalPosts = computed(() => filteredPosts.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(totalPosts.value / PAGE_SIZE)))

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  return filteredPosts.value.slice(startIndex, startIndex + PAGE_SIZE)
})

const paginatedMonthGroups = computed<BlogPostMonthGroup[]>(() => {
  return paginatedPosts.value.reduce<BlogPostMonthGroup[]>((groups, post) => {
    const { monthKey, monthLabel } = formatMonthLabel(post.date.time)
    const lastGroup = groups[groups.length - 1]

    if (lastGroup?.monthKey === monthKey) {
      lastGroup.posts.push(post)
      return groups
    }

    groups.push({
      monthKey,
      monthLabel,
      posts: [post],
    })

    return groups
  }, [])
})

const filterViewKey = computed(() =>
  JSON.stringify({
    sort: selectedSort.value,
    category: selectedCategory.value,
    search: searchQuery.value,
    tags: tagQuery.value,
    dateRange: dateRange.value,
    posts: filteredPosts.value.map((post) => post.url),
  }),
)

const postsViewKey = computed(() =>
  JSON.stringify({
    layout: selectedLayout.value,
    currentPage: currentPage.value,
    pageSize: PAGE_SIZE,
    view: filterViewKey.value,
    posts: paginatedPosts.value.map((post) => post.url),
  }),
)

const resetPagination = () => {
  currentPage.value = 1
}

const applySearchQuery = () => {
  searchQuery.value = searchQueryInput.value
  resetPagination()
}

const setSearchQueryInput = (value: string) => {
  searchQueryInput.value = value
}

const setTagQuery = (value: string[]) => {
  tagQuery.value = [...value]
  resetPagination()
}

const setDateRange = (value: string[]) => {
  dateRange.value = [...value]
  resetPagination()
}

const setSelectedCategory = (value: string) => {
  selectedCategory.value = value
  resetPagination()
}

const setSelectedLayout = (value: string) => {
  selectedLayout.value = value
}

const setSelectedSort = (value: string) => {
  selectedSort.value = value
  resetPagination()
}

const setCurrentPage = (value: number) => {
  const nextPage = Math.min(Math.max(1, value), totalPages.value)
  currentPage.value = nextPage
}

const appendTagQuery = (tag: string) => {
  if (tagQuery.value.includes(tag)) {
    return
  }

  setTagQuery([...tagQuery.value, tag])
}

const handleTagClick = (tag: string) => {
  appendTagQuery(tag)
}

const resetBlogIndexState = () => {
  searchQueryInput.value = ''
  searchQuery.value = ''
  tagQuery.value = []
  dateRange.value = []
  resetPagination()
}

watchEffect(() => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

export const useBlogIndex = () => ({
  searchQueryInput,
  searchQuery,
  tagQuery,
  dateRange,
  selectedCategory,
  selectedLayout,
  selectedSort,
  currentPage,
  pageSize: PAGE_SIZE,
  categories,
  tags,
  filteredPosts,
  totalPosts,
  totalPages,
  paginatedPosts,
  paginatedMonthGroups,
  filterViewKey,
  postsViewKey,
  applySearchQuery,
  setSearchQueryInput,
  setTagQuery,
  appendTagQuery,
  setDateRange,
  setSelectedCategory,
  setSelectedLayout,
  setSelectedSort,
  setCurrentPage,
  resetPagination,
  handleTagClick,
  resetBlogIndexState,
})
