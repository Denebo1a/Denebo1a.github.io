# Blog-CC 前端迁云与部署解耦说明

## 结论

在 **继续保持 VitePress SSG** 的前提下，Blog-CC 从 GitHub Pages 迁到云服务器，通常属于 **部署层迁移**，而不是前端重构。

大多数情况下：

- 不需要更换 VitePress
- 不需要重写现有 Vue 组件
- 不需要改变 Markdown 内容组织方式
- 主要工作集中在部署、域名、静态资源、反向代理与环境配置

## 当前适合的迁移思路

推荐把迁移拆成两层：

1. **前端静态站迁移**
   - 继续本地或 CI 构建 VitePress
   - 将 `docs/.vitepress/dist` 部署到云服务器 / CDN / 对象存储
   - 使用 Nginx / Caddy / CDN 提供静态访问

2. **外围动态能力独立部署**
   - Artalk 评论服务
   - 访问统计
   - 对象存储/CDN
   - 后续可能的 API 或检索服务

这样可以避免“为了加后端能力而重构整个前端”。

## 已落地的统一配置入口

当前仓库已增加四类集中配置：

- `VITEPRESS_SITE_HOSTNAME`：站点绝对域名，用于 canonical / OG / Twitter Cards 等绝对 URL 生成
- `VITEPRESS_ASSET_BASE`：静态资源基址，可为空、可为站内前缀、也可为完整 CDN / OSS URL
- `VITEPRESS_ARTALK_SERVER`：Artalk 服务端地址
- `VITEPRESS_BUSUANZI_SCRIPT_URL`：不蒜子统计脚本地址

以及前端组合式入口：

- `docs/.vitepress/theme/composables/useSiteConfig.ts`

它负责统一处理：

- 资源 URL 拼接
- 资源目录 URL 拼接
- 站点 hostname 读取
- Artalk 服务地址读取
- 不蒜子脚本地址读取

当前已确认的外部服务选型：

- **评论系统：Artalk**
- **访问统计：不蒜子**

后续真正接入时，仍建议把评论服务地址、统计脚本入口等配置继续收口到统一入口，而不是直接散落在组件中。

## 迁云时通常不需要修改的部分

以下内容通常可以保持不变：

- VitePress SSG 架构
- `docs/` 下的 Markdown 内容
- 自定义主题总体结构
- `Layout.vue` 的页面分发思路
- 文章页、乐谱页等大部分业务组件
- Tailwind + CSS 变量主题系统

只要部署后仍是“构建静态文件并托管”，前端实现一般无需大改。

## 迁云时最需要排查的耦合点

### 1. 站点域名写死

当前 `docs/.vitepress/config.mts` 已改为通过 `VITEPRESS_SITE_HOSTNAME` 配置站点绝对域名。

这会影响：

- canonical URL
- Open Graph / Twitter 图片地址
- 页面绝对链接生成

如果迁到自定义域名或服务器域名，只需要更新该配置值。

### 2. base 路径假设

如果未来部署位置从 GitHub Pages 子路径切到根域名，或反过来切到某个子路径，需要检查 VitePress `base` 配置是否与部署路径一致。

影响范围：

- 路由生成
- JS/CSS 静态资源前缀
- 图片和 public 目录资源访问路径

这通常是配置调整，不是前端重写。

### 3. 静态资源路径是否写死为站内路径

项目当前有多类后续可能迁到对象存储/CDN 的资源：

- `docs/public/basstabs/`
- `docs/public/alphatab/`
- `docs/public/soundfont/`
- 封面图、头像、GPX、乐谱相关资源

目前已开始通过 `VITEPRESS_ASSET_BASE` + `useSiteConfig.ts` 统一处理部分关键资源引用。

### 4. 第三方/后端服务地址写死

未来接入这些能力时：

- Artalk
- 访问统计
- 搜索/API

建议不要把服务地址散落在组件中，而应集中配置，便于从：

- GitHub Pages + 跨域服务

切换到：

- 云服务器同域反代
- 独立子域名服务

### 5. GitHub Pages 特有假设

未来迁云前，应避免前端实现依赖这些假设：

- 站点一定部署在 GitHub Pages
- 资源一定和站点同域同路径
- 发布链路一定是 GitHub Actions → GitHub Pages

这些假设一旦写进代码，迁移成本会从“部署迁移”上升为“代码整理 + 部署迁移”。

## 对当前项目的重点文件检查建议

### `docs/.vitepress/config.mts`

重点检查：

- `VITEPRESS_SITE_HOSTNAME` 是否正确传入
- SEO 绝对地址拼接是否依赖当前域名
- `base` 是否与未来部署路径解耦
- fallback cover 路径是否适配未来资源域名策略

### `docs/.vitepress/theme/composables/useSiteConfig.ts`

这是当前统一资源配置入口。后续新增：

- 评论头像
- 页面插图
- 统计脚本
- 其他可迁移资源

都应优先走这里，而不是在组件内直接拼接路径。

### `docs/.vitepress/theme/components/BassTabLayout.vue`

当前已接入封面图资源解析。后续如接入评论、统计、外部资源，优先检查：

- 页面唯一标识如何生成
- 外部服务初始化位置是否适合按需加载
- 资源路径是否便于迁到对象存储

### `docs/.vitepress/theme/components/ArticleLayout.vue`

如果未来文章页接入评论或统计，优先检查：

- 路由变化时的重新初始化逻辑
- pageKey / tracking key 是否稳定
- 外部服务配置是否集中管理

### `docs/.vitepress/theme/components/basstabsIndex/sideBar/Artist.vue`

当前头像路径推导已改为走统一资源解析入口。

### `docs/.vitepress/theme/components/SheetPlayer.vue`

当前已将：

- `/font/`
- `/soundfont/sonivox.sf3`

接入统一资源解析入口；后续若要把播放器相关资源迁到 CDN / OSS，需要重点验证 worker/worklet/font/soundfont 的协同加载是否正常。

### `docs/public/alphatab/` 与 `docs/public/soundfont/`

这两类资源需要重点验证：

- 是否依赖固定相对路径
- 如果切到 CDN / OSS 后，worker、worklet、soundfont 是否还能正确加载
- 缓存策略是否适合大文件和低频更新资源

## 迁云时真正的成本主要来自哪里

前端迁云本身通常不是高成本；主要成本来自以下外围能力整合：

- 域名切换
- HTTPS
- Nginx/Caddy 反向代理
- Artalk 评论服务
- 访问统计
- 对象存储/CDN
- CORS 或同域路径策略
- 缓存策略
- 监控与日志

也就是说，**主要成本是运维与架构整合，不是 VitePress 前端代码本身**。

## 推荐的渐进路线

### 阶段 1：继续保留 GitHub Pages 前端

同时开始拆分：

- 评论系统独立服务化
- 访问统计独立接入
- 大资源逐步迁移到对象存储/CDN

### 阶段 2：清理前端中的部署耦合

优先做：

- 域名配置化
- 资源基址配置化
- 第三方服务地址集中配置
- 避免写死 GitHub Pages 假设

### 阶段 3：再决定是否迁前端到云服务器

如果只是把静态站部署位置从 GitHub Pages 改为：

- 云服务器 Nginx
- CDN
- 对象存储静态托管

通常只需要调整部署与资源配置，前端实现改动较小。

## 当前建议

对 Blog-CC 来说，更值得马上做的是：

1. 为评论、统计、资源存储设计独立接入方式
2. 清理代码里与 GitHub Pages 强绑定的假设
3. 把迁移难点限制在部署层，而不是前端实现层

如果这三点先做到，后续迁云时，通常只会变成一次相对可控的部署迁移。
