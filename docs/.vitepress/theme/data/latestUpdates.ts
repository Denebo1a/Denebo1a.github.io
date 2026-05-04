import { data as allPosts } from '../../../blog/posts.data'
import { data as allBassTabs } from '../../../basstabs/basstabs.data'

const RECENT_WINDOW_DAYS = 30
const RECENT_WINDOW_MS = RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000
const MAX_UPDATES = 8

export type LatestUpdateItem = {
  type: 'blog' | 'basstab'
  typeLabel: '博文' | 'BASS TAB'
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  cover?: string
  summary?: string
}

const cutoffTime = Date.now() - RECENT_WINDOW_MS

const latestBlogUpdates: LatestUpdateItem[] = allPosts.map((post) => ({
  type: 'blog',
  typeLabel: '博文',
  title: post.title,
  url: post.url,
  date: post.date,
  cover: post.cover,
  summary: post.summary,
}))

const latestBassTabUpdates: LatestUpdateItem[] = allBassTabs.map((tab) => ({
  type: 'basstab',
  typeLabel: 'BASS TAB',
  title: tab.title,
  url: tab.url,
  date: tab.date,
  cover: tab.cover,
}))

export const latestUpdates = [
  ...latestBlogUpdates,
  ...latestBassTabUpdates,
]
  .filter((item) => item.date.time >= cutoffTime)
  .sort((a, b) => b.date.time - a.date.time)
  .slice(0, MAX_UPDATES)
