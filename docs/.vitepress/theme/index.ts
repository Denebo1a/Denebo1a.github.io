import { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    // 进阶：这里可以注册全局的 Vue 组件，比如你的 BassTabCard
    // app.component('BassTabCard', BassTabCard)
    app.use(ElementPlus, {
      locale: zhCn
    })
  }
} satisfies Theme