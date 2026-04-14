import { createContentLoader } from 'vitepress'

export default createContentLoader('resources/basstabs/posts/*.md', {
  transform(raw) {
    return raw.map(({ url, frontmatter }) => ({
      title: frontmatter.title as string,
      url,
      artist: frontmatter.artist as string,
      genre: frontmatter.genre as string,
      cover: frontmatter.cover as string | undefined,
      musicxmlUrl: frontmatter.musicxmlUrl as string | undefined,
      bilibiliUrl: frontmatter.bilibiliUrl as string | undefined,
      baiduDiskUrl: frontmatter.baiduDiskUrl as string | undefined,
      lanzouUrl: frontmatter.lanzouUrl as string | undefined,
    }))
  }
})
