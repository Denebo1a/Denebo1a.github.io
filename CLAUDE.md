# CLAUDE.md — DeneBlog 项目指南

## 项目概述

**DeneBlog** 是一个基于 VitePress 的个人博客，采用完全自定义主题（无 VitePress 默认主题），
部署在 GitHub Pages（`https://Denebo1a.github.io`）。

---

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | VitePress (SSG) | ^1.6.4 |
| UI 框架 | Vue 3 | ^3.5.31 |
| CSS 工具 | Tailwind CSS | ^3.4.17 |
| Markdown 排版 | @tailwindcss/typography | ^0.5.19 |
| CSS 后处理 | PostCSS + Autoprefixer | - |
| 组件库 | Element Plus | ^2.13.6 |
| 图标系统 | unplugin-icons + Iconify | ^23.0.1 |
| 图标包 | ph / ant-design / heroicons / material-symbols / hugeicons | - |
| 自动导入 | unplugin-vue-components | ^32.0.0 |
| 字体 | Inter + Noto Sans SC（Google Fonts CDN） | - |
| 代码格式化 | Prettier + prettier-plugin-tailwindcss | ^3.8.1 |
| 乐谱渲染 | @coderline/alphatab | ^1.8.2 |
| 构建 | Vite（VitePress 内置） | - |
| 部署 | GitHub Actions → GitHub Pages | - |

图标在组件中以 `i-` 前缀直接使用（如 `<i-ph-house />`），由 `IconsResolver` + `unplugin-icons` 自动解析，无需手动 import。

---

## 目录结构

```
Blog-CC/
├── docs/
│   ├── index.md                  # 首页入口，frontmatter: layout: home
│   ├── blog/
│   │   ├── index.md              # 博客列表页，frontmatter: layout: blog-index
│   │   ├── posts.data.ts         # 博文数据层：glob 扫描 posts/*.md，提取 frontmatter 并格式化日期
│   │   └── posts/                # 博客文章（.md，含 frontmatter）
│   ├── basstabs/
│   │   ├── index.md              # BASS TAB 列表页，frontmatter: layout: basstabs-index
│   │   ├── basstabs.data.ts      # BASS TAB 数据层：glob 扫描 posts/*.md，提取 frontmatter 并格式化日期
│   │   └── posts/                # BASS TAB 条目（.md，含 frontmatter.date / artist / genre / links）
│   ├── studio/
│   │   └── index.md              # Studio 页，frontmatter: layout: studio-view
│   ├── public/                   # 静态资源（avatar.png 等）
│   │   ├── alphatab/             # alphaTab 运行时静态镜像（mjs/core/worker/worklet）
│   │   ├── basstabs/
│   │   │   ├── covers/           # BASS TAB 卡片封面
│   │   │   ├── gpx/              # GPX / 曲谱资源
│   │   │   └── artists/          # 艺术家头像（推荐 .webp，按 artist slug 命名）
│   │   ├── font/                 # alphaTab 字体资源（Bravura.*）
│   │   └── soundfont/            # alphaTab 音源资源（sonivox.sf2 / sonivox.sf3）
│   └── .vitepress/
│       ├── config.mts            # VitePress 配置（SEO、Shiki 代码高亮、Vite 插件、optimizeDeps）
│       ├── shiki-langs/
│       │   ├── index.mts         # 自定义/冷门语言注册表（供 markdown.languages 使用）
│       │   ├── zeek.tmLanguage.json # vendored Zeek TextMate grammar
│       │   └── NOTICE.zeek-license.txt # 上游 grammar 来源与许可说明
│       └── theme/
│           ├── index.ts          # 主题入口（继承 VitePress DefaultTheme、注册 Layout、全局 CSS、Element Plus）
│           ├── Layout.vue        # 路由分发器（按 frontmatter.layout 切换视图，并挂载页面级 overlays）
│           ├── style.css         # 全局样式（Tailwind、CSS 变量主题系统、Element Plus 接管、围栏代码块固定主题）
│           ├── data/
│           │   └── latestUpdates.ts # 首页最新动态聚合层（当前混合博文/BASS TAB，过滤最近 30 天）
│           ├── composables/
│           │   ├── useTheme.ts
│           │   ├── useScrollPersistence.ts
│           │   └── useBassTabsIndex.ts # basstabs-index 页面共享状态与统一数据接口
│           ├── components/
│           │   ├── HomeView.vue
│           │   ├── BlogIndexView.vue
│           │   ├── BassTabsIndex.vue    # BASS TAB 列表容器（消费共享状态并渲染卡片网格）
│           │   ├── BassTabLayout.vue    # BASS TAB 详情页
│           │   ├── ArticleLayout.vue
│           │   ├── StudioView.vue
│           │   ├── SiteHeader.vue
│           │   ├── SiteFooter.vue
│           │   ├── SheetPlayer.vue
│           │   ├── basstabsIndex/
│           │   │   ├── BottomBar.vue                # basstabs-index 底部悬浮筛选条
│           │   │   ├── SideBar.vue                  # basstabs-index 左侧艺术家悬浮栏
│           │   │   ├── BasstabCard.vue             # BASS TAB 卡片组件
│           │   │   ├── OverflowMenu.vue            # 卡片溢出菜单（统一外链接口）
│           │   │   ├── bottomBar/
│           │   │   │   ├── GenreFilter.vue         # 流派筛选器
│           │   │   │   └── SearchBox.vue           # 搜索框 + 已选 artist chip
│           │   │   └── sideBar/
│           │   │       └── Artist.vue              # 艺术家按钮/头像（artist → slug → .webp 路径推导）
│           │   └── styles/
│           │       └── GlowCardBg.vue
│           └── utils/
│               ├── format.ts     # formatDate(raw) → { time, string }（中文格式）
│               └── copyText.ts   # 复制到剪贴板（Clipboard API + execCommand fallback）
├── tailwind.config.js            # Tailwind 配置（CSS 变量语义别名、Typography 接管）
├── postcss.config.js
└── .github/workflows/deploy.yml  # CI/CD：push main → npm ci → build → GitHub Pages
```

---

## 核心模块与依赖关系

```
config.mts
  └── markdown.theme = 'material-theme-palenight'（围栏代码块固定 Shiki 主题）
  └── markdown.languages = customLanguages（注册 Zeek 等冷门语言 grammar）
  └── Vite plugins: unplugin-vue-components + unplugin-icons（图标自动导入）
  └── transformPageData(): 注入 Twitter Cards / Open Graph SEO 标签

theme/index.ts
  ├── extends DefaultTheme，保留 VitePress 原生代码块能力（复制按钮、语言标签、代码组等）
  ├── 注册 Layout.vue 为全局布局
  ├── 引入 style.css（Tailwind + CSS 变量 + Element Plus 样式接管）
  └── SSR 安全地异步加载 Element Plus（仅客户端）

Layout.vue（路由分发器 + 页面级 overlay 挂载点）
  ├── frontmatter.layout === 'home'             → HomeView.vue
  ├── frontmatter.layout === 'blog-index'       → BlogIndexView.vue
  ├── frontmatter.layout === 'basstabs-index'   → BassTabsIndex.vue
  ├── frontmatter.layout === 'article'          → ArticleLayout.vue
  ├── frontmatter.layout === 'basstab-detail'   → BassTabLayout.vue
  ├── frontmatter.layout === 'studio-view'      → StudioView.vue
  ├── frontmatter.layout === 'basstabs-index' 时额外挂载 → SideBar.vue / BottomBar.vue
  └── 默认                                       → <Content />（VitePress 原生渲染）

posts.data.ts（博文数据层）
  └── createContentLoader('blog/posts/*.md') → 提取 { title, url, date, category, tags, summary, cover }
      ↑ 被 BlogIndexView.vue、ArticleLayout.vue、latestUpdates.ts 共同消费

basstabs.data.ts（BASS TAB 数据层）
  └── createContentLoader('basstabs/posts/*.md') → 提取 { title, url, date, artist, genre, cover, musicxmlUrl, bilibiliUrl, baiduDiskUrl, lanzouUrl }
      ↑ date 必填，用于首页最新动态排序与过滤
      ↑ 被 useBassTabsIndex.ts、BassTabLayout.vue、latestUpdates.ts 共同消费

useBassTabsIndex.ts（basstabs-index 页面共享状态层）
  ├── 模块级共享状态：searchQuery / selectedGenre / selectedArtist
  ├── 统一导出 genres / artists / filteredTabs
  ├── 提供 buildTabLinks(tab) 统一生成卡片/菜单外链数据
  └── 提供 toggleArtist / clearArtist / resetBassTabsIndexState 等页面行为

BassTabsIndex.vue（BASS TAB 列表容器）
  ├── 消费 useBassTabsIndex.ts 的 filteredTabs
  ├── 渲染 Empty / BasstabCard 网格
  └── 页面卸载时调用 resetBassTabsIndexState()，避免跨页面残留筛选状态

basstabsIndex/BottomBar.vue（底部悬浮筛选条）
  ├── 负责 fixed 定位与 footer 避让
  └── 组合 GenreFilter.vue + SearchBox.vue

basstabsIndex/SideBar.vue（左侧艺术家悬浮栏）
  ├── 消费 useBassTabsIndex.ts 的 artists
  └── 渲染 Artist.vue 列表作为 artist 入口

basstabsIndex/BasstabCard.vue
  ├── 接收统一的 tab 数据接口
  ├── 渲染封面 / 标题 / artist / genre
  └── 内部挂载 OverflowMenu.vue

basstabsIndex/OverflowMenu.vue
  └── 通过 useBassTabsIndex.ts 的 buildTabLinks(tab) 生成菜单项，统一处理 bilibili / 百度网盘 / 蓝奏云链接

basstabsIndex/sideBar/Artist.vue
  ├── 接收 artist 字符串
  ├── 根据 artist 名推导 slug
  ├── 头像路径固定为 /basstabs/artists/<slug>.webp
  └── 图片加载失败时回退为首字母按钮

latestUpdates.ts（首页聚合层）
  └── 当前合并 posts.data.ts / basstabs.data.ts
  └── 统一映射为 { type, typeLabel, title, url, date, cover, summary? }
  └── 过滤最近 30 天内容并按 date.time 倒序输出

HomeView.vue
  ├── 消费 latestUpdates.ts
  ├── 使用 Element Plus：el-timeline / el-timeline-item
  └── 左侧栏展示混合时间轴（博文 / BASS TAB）
```

主题切换通过 `<html data-theme="xxx">` 属性驱动，**不使用** Tailwind 的 `dark:` 前缀。

`style.css` 中为每套主题定义 CSS 变量，`tailwind.config.js` 将 Tailwind 工具类映射到这些变量：

| Tailwind 类 | CSS 变量 | 含义 |
|------------|---------|------|
| `bg-base` | `--color-bg-base` | 页面底色 |
| `bg-card` | `--color-bg-card` | 卡片/内容区底色 |
| `bg-alt` | `--color-bg-alt` | 次级背景（侧边栏、输入框）|
| `text-main` | `--color-text-main` | 主要文字色 |
| `text-muted` | `--color-text-muted` | 次要文字色 |
| `border-color` | `--color-border` | 边框色 |
| `bg-brand` | `--color-brand` | 品牌主色 |
| `bg-brand-light` | `--color-brand-light` | 品牌浅色（hover 背景）|
| `shadow-card` | `--shadow-card` | 常规卡片阴影 |
| `shadow-brand` | `--shadow-brand` | 悬浮品牌色阴影 |

---

## 文章 Frontmatter 规范

```yaml
---
layout: article
title: 文章标题
date: 2025-04-01
category: 分类名
tags: [tag1, tag2]
summary: 一段简短摘要（用于博客列表卡片）
cover: /covers/my-cover.jpg   # 可选，相对于 public/ 的路径
---
```

### BASS TAB Frontmatter 关键字段

```yaml
---
layout: basstab-detail
title: 曲目标题
date: 2025-04-01   # 必填：首页最新动态依赖该字段做最近 30 天过滤与混排
artist: 艺术家
genre: 风格
cover: /resources/basstabs/covers/example.png
---
```

---

## alphaTab 集成说明

### 当前采用的最终方案

- 保留运行时依赖：`@coderline/alphatab`
- 不再依赖 `@coderline/alphatab-vite` 参与 VitePress 构建流程
- `docs/.vitepress/config.mts` 中通过 `optimizeDeps.exclude: ['@coderline/alphatab']` 避免 dev 阶段 dep optimizer 误处理 alphaTab
- `SheetPlayer.vue` 不直接从 npm 包运行时入口推导 worker，而是从 `docs/public/alphatab/` 下的站内静态 ESM 文件动态导入
- `docs/public/alphatab/alphaTab.mjs` 与其同目录下的 `alphaTab.core.mjs / alphaTab.worker.mjs / alphaTab.worklet.mjs` 一起发布到 GitHub Pages，确保 `import.meta.url` 能正确解析 worker/worklet 相对路径
- 字体与音源均走站内静态资源：`/font/`、`/soundfont/sonivox.sf3`

### 为什么这样做

原先在 `config.mts` 中启用 `alphaTab()` 插件时，GitHub Actions 构建会报错：

```text
[vite-plugin-alphatab-url] Cannot read properties of undefined (reading 'client')
```

移除插件后虽然 build 成功，但线上 `alphaTab.worker.mjs` 会请求到错误的打包路径（如 `/assets/chunks/alphaTab.worker.mjs`），导致 worker 挂起、播放器长期停留在初始化状态、`soundfont` 也不会开始加载。

将 alphaTab 运行时文件镜像到 `docs/public/alphatab/` 后，worker/worklet 路径由浏览器基于真实静态文件 URL 解析，适配 GitHub Pages，避免了 VitePress + alphaTab worker 插件兼容性问题。

### 新增/保留文件

- `docs/public/alphatab/alphaTab.mjs`
- `docs/public/alphatab/alphaTab.core.mjs`
- `docs/public/alphatab/alphaTab.worker.mjs`
- `docs/public/alphatab/alphaTab.worklet.mjs`
- `docs/public/font/*`
- `docs/public/soundfont/sonivox.sf2`
- `docs/public/soundfont/sonivox.sf3`

### 维护注意事项

- 升级 `@coderline/alphatab` 版本后，需要同步更新 `docs/public/alphatab/` 下的四个运行时文件
- 如需排查播放器初始化问题，优先检查线上是否能访问：
  - `/alphatab/alphaTab.mjs`
  - `/alphatab/alphaTab.worker.mjs`
  - `/alphatab/alphaTab.worklet.mjs`
  - `/soundfont/sonivox.sf3`
- 如果乐谱能渲染但播放按钮长期 disabled，通常优先排查 worker/worklet 或 soundfont 请求，而不是 Markdown 文件本身

---

## CI/CD

- 触发条件：push 到 `main` 分支，或 GitHub Actions 手动触发
- Node 版本：24，使用 `npm ci`（锁版本）
- 构建命令：`npm run docs:build`（输出到 `docs/.vitepress/dist`）
- 部署目标：GitHub Pages（使用 `actions/deploy-pages@v4`）

---

## 已知问题与优化建议

### 1. Breadcrumb.vue — 重复的死代码分支
`Breadcrumb.vue:24` 的 `else if (route.path.startsWith("/blog/"))` 条件与上一个 `if` 完全相同，永远不会执行。此外，`/basstabs/`、`/studio/` 等路由的面包屑能力仍需继续完善。

### 2. Element Plus — 全量引入，无 Tree Shaking
`theme/index.ts` 中使用 `import ElementPlus from 'element-plus'` 全量加载，会显著增大客户端 bundle。应改用按需导入（配合 `unplugin-vue-components` 的 `ElementPlusResolver`）。

### 3. hugeicons 图标包未使用
`@iconify-json/hugeicons` 已安装但在代码中搜索不到任何使用，可直接移除以减小 `node_modules` 体积。

### 4. basstabs 艺术家头像依赖命名约定
`basstabsIndex/sideBar/Artist.vue` 当前通过 `artist → slug → /basstabs/artists/<slug>.webp` 推导头像路径。若 artist 名与文件名无法稳定映射，后续应考虑增加显式映射表或为 artist 提供结构化元数据。

### 5. Google Fonts CDN
`style.css` 从 `fonts.googleapis.com` 加载字体，在中国大陆访问速度慢。可考虑将字体文件本地化到 `docs/public/fonts/` 并用 `@font-face` 引入。

### 6. 封面图默认值引用不存在的文件
`config.mts` 中 fallback 封面图路径为 `/default-cover.jpg`，但 `docs/public/` 中无此文件，会导致社交分享预览图 404。

### 7. latestUpdates.ts 当前只聚合 blog + basstabs
首页最新动态聚合层现在只合并 `posts.data.ts` 和 `basstabs.data.ts`。如果后续恢复更多内容分区，需要同步扩展 `latestUpdates.ts` 的数据源与 `LatestUpdateItem.type`。
