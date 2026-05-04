import { defineConfig } from 'vitepress'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { customLanguages } from './shiki-langs/index.mts'
import { generateSidebar } from 'vitepress-sidebar'

const HOSTNAME = "https://Denebo1a.github.io"

export default defineConfig({
  title: 'DeneBlog',
  description: 'Denebora的数字花园',

  // 显式要求 VitePress 提取 Markdown 标题供客户端使用
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'material-theme-palenight',
    },
    languages: customLanguages,
    headers: {
      // 提取 h2 和 h3 标题
      level: [2, 3]
    }
  },
  //
  transformPageData(pageData) {
    // 获取当前文章的相对路径，并转换为线上 URL
    const canonicalUrl = `${HOSTNAME}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '.html')

    // 提取文章信息（如果单篇文章没有填，回退到站点默认值）
    const title = pageData.title || 'DeneBlog'
    const description = pageData.description || 'Denebora的数字花园'

    // 处理封面图：如果在 frontmatter 中指定了 cover，就拼成绝对路径，否则用默认图
    const imageUrl = pageData.frontmatter.cover
      ? `${HOSTNAME}${pageData.frontmatter.cover}`
      : `${HOSTNAME}/default-cover.jpg`

    // 初始化 head 数组（防止未定义）
    pageData.frontmatter.head ??= []

    // 注入 Twitter Cards 和 Open Graph 标签
    pageData.frontmatter.head.push(
      // summary_large_image 会显示大图卡片
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: '@SChibashi82908' }],
      ['meta', { name: 'twitter:creator', content: '@SChibashi82908' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image', content: imageUrl }],

      // Open Graph (OG) 标签，Telegram, Discord, Facebook 都可以读取
      ['meta', { property: 'og:type', content: 'article' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: imageUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }]
    )
  },
  // 配置默认文档布局的侧边栏
  themeConfig: {
    siteTitle: "← 离开裏世界",
    nav: [
      {
        text: '入口',
        link: '/pandora/Welcome/01-intro',
        activeMatch: '/pandora/Welcome/',
      },
      {
        text: '女装日记',
        link: '/pandora/HimitsuDiary/01-start-guide/01-intro',
        activeMatch: '/pandora/HimitsuDiary/',
      },
      {
        text: '速写本',
        link: 'pandora/Sketchbook/intro',
        activeMatch: '/pandora/Sketchbook/',
      },
    ],
    sidebar: generateSidebar([
      {
        documentRootPath: 'docs', 
        scanStartPath: 'pandora/Welcome', 
        resolvePath: '/pandora/Welcome/', 
        useTitleFromFileHeading: true, 
        useFolderTitleFromIndexFile: true, 
        collapsed: true, 
        sortMenusByName: false, 
        sortMenusOrderNumericallyFromLink: true,
      },
      {
        documentRootPath: 'docs', 
        scanStartPath: 'pandora/HimitsuDiary', 
        resolvePath: '/pandora/HimitsuDiary/', 
        useTitleFromFileHeading: true, 
        useFolderTitleFromIndexFile: true, 
        collapsed: true, 
        sortMenusByName: false, 
        sortMenusOrderNumericallyFromLink: true,
      },
      {
        documentRootPath: 'docs', 
        scanStartPath: 'pandora/Sketchbook', 
        resolvePath: '/pandora/Sketchbook/', 
        useTitleFromFileHeading: true, 
        useFolderTitleFromIndexFile: true, 
        collapsed: true, 
        sortMenusByName: false, 
        sortMenusOrderNumericallyFromLink: true,
      }
    ])
  },
  vite: {
    optimizeDeps: {
      exclude: ['@coderline/alphatab'],
    },
    plugins: [
      Components({
        resolvers: [
          // 告诉解析器碰到以 'i-' 开头的组件，去 unplugin-icons 里找
          IconsResolver({
            prefix: 'i',
          }),
        ],
      }),
      // 注册图标插件本身
      Icons({
        compiler: 'vue3',
        autoInstall: true,
      })
    ]
  }
})