import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import MdImage from './components/markdown/MdImage.vue'
import './style.css'
import './styles/theme-vars.css'
import './styles/element-plus.css'
import './styles/base.css'
import './styles/vp-doc.css'
import './styles/vp-code.css'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    const initZoom = () => {
      mediumZoom('.vp-doc img:not(.no-zoom), .prose img:not(.no-zoom)', {
        background: 'transparent', 
        margin: 24
      })
    }

    // 首次挂载时初始化
    onMounted(() => {
      initZoom()
    })

    // 监听路由变化，每次切换页面后重新绑定图片
    watch(
      () => route.path,
      () => {
        nextTick(() => {
          initZoom()
        })
      }
    )
  },
  Layout,
  async enhanceApp({ app, router, siteData }) {
    app.component('MdImage', MdImage)

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
