import { data as allPosts } from '../../../blog/posts.data'
import { data as allBassTabs } from '../../../basstabs/basstabs.data'

const DAY_MS = 24 * 60 * 60 * 1000
const siteStartDate = '2026-04-01'

const siteRunningDays = Math.max(
  0,
  Math.floor((Date.now() - new Date(siteStartDate).getTime()) / DAY_MS)
)

export type SiteMeta = {
  siteStartDate: string
  postCount: number
  bassTabCount: number
  totalContentCount: number
  siteRunningDays: number
}

export const siteMeta: SiteMeta = {
  siteStartDate,
  postCount: allPosts.length,
  bassTabCount: allBassTabs.length,
  totalContentCount: allPosts.length + allBassTabs.length,
  siteRunningDays,
}
