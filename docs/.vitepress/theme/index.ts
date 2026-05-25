import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import MdImage from './components/markdown/MdImage.vue'
import './style.css'

const BUSUANZI_SCRIPT_SELECTOR = 'script[data-busuanzi-script="self-hosted"]'
const BUSUANZI_API_URL = '/busuanzi/api'
const BUSUANZI_SCRIPT_FALLBACK = '/busuanzi/busuanzi.js'

function mountBusuanziScript(scriptUrl: string) {
  const busuanziScript = document.createElement('script')
  busuanziScript.async = true
  busuanziScript.src = scriptUrl
  busuanziScript.setAttribute('data-api', BUSUANZI_API_URL)
  busuanziScript.setAttribute('data-busuanzi-script', 'self-hosted')
  document.head.appendChild(busuanziScript)
}

export default {
  extends: DefaultTheme,
  Layout,
  async enhanceApp({ app, router, siteData }) {
    app.component('MdImage', MdImage)

    // 增加环境判断：只在客户端（浏览器环境）加载 Element Plus
    if (typeof window !== 'undefined') {
      const scriptUrl = String(siteData.themeConfig?.busuanziScriptUrl || BUSUANZI_SCRIPT_FALLBACK)

      if (!document.querySelector(BUSUANZI_SCRIPT_SELECTOR)) {
        mountBusuanziScript(scriptUrl)
      }

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
