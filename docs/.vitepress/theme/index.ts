import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import './style.css'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

export default {
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app, router, siteData }) {
    // 增加环境判断：只在客户端（浏览器环境）加载 Element Plus
    if (!import.meta.env.SSR) {
      // 动态异步引入 JS 模块和语言包
      const ElementPlus = await import('element-plus')
      const zhCn = await import('element-plus/es/locale/lang/zh-cn')

      // 注册组件（使用 .default 获取模块的默认导出）
      app.use(ElementPlus.default || ElementPlus, {
        locale: zhCn.default || zhCn
      })
    }
  }
} satisfies Theme
