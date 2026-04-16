<div align="center">
     <h2>DeneBlog - 一个基于Vitepress构建的自定义主题布局博客</h2>
     <div align="center">
    </div>
</div>

Vitepress 是一款基于 Vite + Vue 3 的静态站点生成器，您或许已经在很多地方见到过它了，许多项目的技术文档都是用 Vitepress 实现的。
在构建个人博客上，Vitepress 和一些主流的技术栈选型（如 Wordpress）相比，有着十分鲜明的特点（包括但不限于）：
- 只能构建纯静态网站：这会带来极大的局限性，但是，若博客专注于内容展示、放弃其他功能，这便会转化为体量小、加载块的性能优势；
- 低门槛的定制化开发：支持将 Vue 组件嵌入到 markdown 文档中，支持使用 Vue 开发自定义主题模板（Vitepress提供一些易用的用于开发的组合式函数接口）；
- 零维护成本：可以将所有源码/数据托管在 Github 上，利用 Github Actions 实现自动化 CI/CD ，再利用 Github Pages / Netifly / Vercel 零成本部署；
- markdown驱动的内容路由：站点路由与目录 & markdown 文档平行映射，结构一目了然，修改md文档并推送即可更新网站内容。
- 出色的 markdown 渲染支持与扩展。

或许对于我来说，最重要的是可以一分钱不花吧（骗你的，Claude 和 Codex 的 token 花费快超过轻量云服务器的月租费了TT）

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
