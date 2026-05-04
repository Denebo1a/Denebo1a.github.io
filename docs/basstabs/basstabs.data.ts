import { createContentLoader } from 'vitepress'
import { formatDate } from '../.vitepress/theme/utils/format'

export default createContentLoader('basstabs/posts/*.md', {
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title as string,
        url,
        date: formatDate(frontmatter.date as string),
        artist: frontmatter.artist as string,
        genre: frontmatter.genre as string,
        cover: frontmatter.cover as string | undefined,
        musicxmlUrl: frontmatter.musicxmlUrl as string | undefined,
        bilibiliUrl: frontmatter.bilibiliUrl as string | undefined,
        baiduDiskUrl: frontmatter.baiduDiskUrl as string | undefined,
        lanzouUrl: frontmatter.lanzouUrl as string | undefined,
      }))
      .sort((a, b) => b.date.time - a.date.time)
  }
})
