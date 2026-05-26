# CLAUDE.md — DeneBlog 项目指南

## 项目概述

**DeneBlog** 是一个基于 VitePress 的个人博客，采用完全自定义主题（无 VitePress 默认主题），
当前部署在 Ubuntu 云服务器（`https://denebora.top`），通过 Docker + nginx 提供服务。

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
| 部署 | GitHub Actions → 阿里云 ACR → Ubuntu Docker + nginx | - |

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
├── server/
│   ├── .env                      # 云服务器运行时环境变量（SITE_URL / TZ / FRONTEND_IMAGE）
│   ├── docker-compose.yml        # 云服务器聚合编排入口（nginx / frontend / artalk / redis / bsz）
│   ├── frontend/
│   │   └── nginx.conf            # 前端静态站点 nginx 配置（含 .mjs/.wasm MIME 修正）
│   ├── nginx/
│   │   └── conf.d/
│   │       └── proxy.conf        # 网关 nginx：80→443 跳转、HTTPS 终止、/artalk 与 /busuanzi 反代
│   ├── artalk/
│   └── busuanzi/
├── Dockerfile.frontend           # 前端镜像构建：Node 构建 + nginx 静态发布
├── tailwind.config.js            # Tailwind 配置（CSS 变量语义别名、Typography 接管）
├── postcss.config.js
└── .github/workflows/deploy.yml  # CI/CD：push main → build frontend image → push 到阿里云 ACR
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
- `docs/public/alphatab/alphaTab.mjs` 与其同目录下的 `alphaTab.core.mjs / alphaTab.worker.mjs / alphaTab.worklet.mjs` 一起发布到站内静态目录，由 frontend nginx 直接提供
- 字体与音源均走站内静态资源：`/font/`、`/soundfont/sonivox.sf3`
- `server/frontend/nginx.conf` 需要显式为 `.mjs` 返回 `application/javascript`、为 `.wasm` 返回 `application/wasm`，否则浏览器会因 MIME 不匹配拒绝加载 alphaTab 模块

### 为什么这样做

原先在 `config.mts` 中启用 `alphaTab()` 插件时，GitHub Actions 构建会报错：

```text
[vite-plugin-alphatab-url] Cannot read properties of undefined (reading 'client')
```

移除插件后虽然 build 成功，但线上 `alphaTab.worker.mjs` 会请求到错误的打包路径（如 `/assets/chunks/alphaTab.worker.mjs`），导致 worker 挂起、播放器长期停留在初始化状态、`soundfont` 也不会开始加载。

将 alphaTab 运行时文件镜像到 `docs/public/alphatab/` 后，worker/worklet 路径由浏览器基于真实静态文件 URL 解析，避免了 VitePress + alphaTab worker 插件兼容性问题；迁移到云服务器后，frontend nginx 仍需正确返回 `.mjs` 模块 MIME，才能正常动态导入 `alphaTab.mjs`。

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
- Workflow：`.github/workflows/deploy.yml`
- 构建环境：`ubuntu-latest` + Docker Buildx
- 构建镜像：`Dockerfile.frontend`
- 构建参数来自根目录 `.env.production`：
  - `VITEPRESS_SITE_HOSTNAME`
  - `VITEPRESS_ASSET_BASE`
  - `VITEPRESS_ARTALK_SERVER`
  - `VITEPRESS_BUSUANZI_SCRIPT_URL`
  - `FRONTEND_IMAGE`
- 镜像仓库：阿里云 ACR（Actions Secrets: `ACR_REGISTRY` / `ACR_USERNAME` / `ACR_PASSWORD`）
- 当前策略：仅构建并推送前端镜像，使用 `latest` 标签；云服务器侧通过 `server/.env` 中的 `FRONTEND_IMAGE` 拉取并运行

### 当前云服务器部署结构

- 站点公网域名：`https://denebora.top`
- `server/docker-compose.yml` 为统一入口，服务包括：
  - `nginx`：外层网关，负责 HTTPS 终止与反向代理
  - `frontend`：前端静态站点容器
  - `artalk`：评论服务
  - `redis`：不蒜子依赖
  - `bsz`：不蒜子后端
- `server/.env` 负责运行时配置：
  - `SITE_URL`
  - `TZ`
  - `FRONTEND_IMAGE`
- `server/nginx/conf.d/proxy.conf` 当前职责：
  - `80` → 301 跳转到 `443`
  - `443` → 提供 HTTPS
  - `/` → `frontend:80`
  - `/artalk/` → `artalk:23366/`
  - `/busuanzi/busuanzi.js` → `frontend:80`
  - `/busuanzi/api` → `bsz:8080/api`
- `server/frontend/nginx.conf` 当前职责：
  - 提供 VitePress 静态产物
  - 为 `.mjs` 返回 `application/javascript`
  - 为 `.wasm` 返回 `application/wasm`

### 配置约束与迁移经验

- 本项目继续保持 **VitePress SSG**，本次迁移属于部署层迁移，不应默认重构前端实现。
- 站点绝对域名通过 `VITEPRESS_SITE_HOSTNAME` 配置；静态资源基址通过 `VITEPRESS_ASSET_BASE` 配置；Artalk 服务地址通过 `VITEPRESS_ARTALK_SERVER` 配置；不蒜子脚本地址通过 `VITEPRESS_BUSUANZI_SCRIPT_URL` 配置。新增可迁移资源或外部服务时，优先走 `docs/.vitepress/theme/composables/useSiteConfig.ts`。
- 当前外部服务选型：**评论系统使用 Artalk**，**访问统计使用不蒜子**。后续接入时，应继续保持服务地址与脚本入口集中配置，避免散落在页面组件中。
- 前端运行时代码中不得写死 `http://` 服务地址；评论、统计、alphaTab 等资源统一走同域相对路径，避免 mixed-content。
- 不蒜子必须区分：
  - `/busuanzi/busuanzi.js` 是前端静态脚本
  - `/busuanzi/api` 是后端接口
  不能把整个 `/busuanzi/` 无差别反代到后端，否则脚本会返回 HTML/错误页并导致浏览器报错。
- 重点排查可能影响迁移的路径耦合：SEO 绝对链接、`base` 路径、封面/头像/alphatab/soundfont 等静态资源引用。
- 迁移后的主要成本通常在**反代、域名、HTTPS、镜像发布、动态服务整合**，而不是 VitePress 主题或 Markdown 内容本身。

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
