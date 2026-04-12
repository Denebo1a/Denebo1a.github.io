// docs/blog/posts.data.ts
import { createContentLoader } from 'vitepress'
import { formatDate } from '../.vitepress/theme/utils/format'

export default createContentLoader('blog/posts/*.md', {
  transform(raw) {
    // 对扫描到的文章进行排序和格式化
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        date: frontmatter.date,
        category: frontmatter.category,
        tags: frontmatter.tags || [],
        summary: frontmatter.summary,
        cover: frontmatter.cover
      }))
      .sort((a, b) => b.date.time - a.date.time) // 按日期降序
  }
})