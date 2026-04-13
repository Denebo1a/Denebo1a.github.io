import { createContentLoader } from 'vitepress'
import { formatDate } from '../../.vitepress/theme/utils/format'

export default createContentLoader('resources/others/posts/*.md', {
  transform(raw) {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title as string,
        url,
        date: formatDate(frontmatter.date),
        category: frontmatter.category as string,
        tags: (frontmatter.tags || []) as string[],
        summary: frontmatter.summary as string | undefined,
        cover: frontmatter.cover as string | undefined,
      }))
      .sort((a, b) => b.date.time - a.date.time)
  }
})
