import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

type Section = 'home' | 'blog' | 'basstabs' | 'studio' | 'unknown'

type BreadcrumbItem = {
  name: string
  path: string | null
}

const ROOT_CRUMB: BreadcrumbItem = {
  name: 'DeneBlog',
  path: '/',
}

const hasText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const createCrumb = (name: unknown, path: string | null = null): BreadcrumbItem | null => {
  if (!hasText(name)) return null

  return {
    name: name.trim(),
    path,
  }
}

export const useBreadcrumbs = () => {
  const route = useRoute()
  const { page, frontmatter } = useData()

  const section = computed<Section>(() => {
    if (route.path === '/') {
      return 'home'
    }

    if (route.path.startsWith('/blog/')) {
      return 'blog'
    }

    if (route.path.startsWith('/basstabs/')) {
      return 'basstabs'
    }

    if (route.path.startsWith('/studio/')) {
      return 'studio'
    }

    return 'unknown'
  })

  const terminalTitle = computed(() => {
    if (hasText(frontmatter.value.title)) {
      return frontmatter.value.title
    }

    if (hasText(page.value.title)) {
      return page.value.title
    }

    return ''
  })

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const items: Array<BreadcrumbItem | null> = [ROOT_CRUMB]

    if (section.value === 'blog') {
      items.push(createCrumb('博客', '/blog/'))

      if (route.path !== '/blog/') {
        items.push(createCrumb(frontmatter.value.category))
        items.push(createCrumb(terminalTitle.value))
      }
    } else if (section.value === 'basstabs') {
      items.push(createCrumb('乐谱', '/basstabs/'))

      if (
        route.path !== '/basstabs/' &&
        frontmatter.value.layout === 'basstab-detail'
      ) {
        items.push(createCrumb('BASS TAB'))
        items.push(createCrumb(frontmatter.value.genre))
        items.push(createCrumb(frontmatter.value.artist))
        items.push(createCrumb(terminalTitle.value))
      }
    }

    return items.filter((item): item is BreadcrumbItem => item !== null)
  })

  const currentPageLabel = computed(() => {
    if (section.value === 'home' && route.path === '/') {
      return '分享技术，记录生活~'
    } else if (section.value === 'blog' && route.path === '/blog/') {
      return '博客总览'
    } else if (section.value === 'resources' && route.path === '/resources/') {
      return '资源总览'
    } else if (section.value === 'studio' && route.path === '/studio/') {
      return '正在施工中......'
    }
    const lastCrumb = breadcrumbs.value[breadcrumbs.value.length - 1]
    return lastCrumb?.name ?? ''
  })

  return {
    breadcrumbs,
    currentPageLabel,
    section,
  }
}
