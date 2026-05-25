<script setup>
import { onMounted, watch, nextTick, onUnmounted } from "vue";
import { useRoute } from "vitepress";
// 1. 引入 Artalk 及其样式
import Artalk from "artalk";
import "artalk/dist/Artalk.css";
import Divider from "../items/Divider.vue";
import { useSiteConfig } from "../../composables/useSiteConfig";

const route = useRoute();
const { artalkServer } = useSiteConfig();
let artalkInstance = null;

// 初始化或更新 Artalk 的核心逻辑
const initArtalk = () => {
  // 如果实例已经存在，说明是 SPA 内部跳转，只需要更新路径参数即可
  if (artalkInstance) {
    artalkInstance.update({
      pageKey: route.path,
      pageTitle: document.title,
    });
    return;
  }

  // 首次进入文章页，创建实例
  artalkInstance = Artalk.init({
    el: "#artalk-container",
    pageKey: route.path,
    pageTitle: document.title,
    server: artalkServer.value,
    site: "DeneBlog",

    // 自动检测并跟随当前的暗黑模式状态
    darkMode: document.documentElement.classList.contains("dark"),
  });
};

// 挂载时初始化
onMounted(() => {
  initArtalk();
});

// 监听 SPA 路由变化（就像之前配置 medium-zoom 一样）
watch(
  () => route.path,
  () => {
    nextTick(() => {
      initArtalk();
    });
  },
);

// 组件卸载时销毁实例，释放内存
onUnmounted(() => {
  if (artalkInstance) {
    artalkInstance.destroy();
  }
});
</script>

<template>
  <div
    class="flex w-full flex-col rounded-[1rem] border border-color bg-card p-3"
  >
    <div class="flex w-full items-center text-sm font-bold">
      <div class="flex items-center gap-1">
        <i-material-symbols-comment-rounded class="text-brand" />
        <span class="text-main">评论</span>
      </div>
      <Divider :vertical="true" :solid="true" margin="mx-2 my-0" />

      <span class="text-muted"
        ><span class="artalk-comment-count">加载中...</span></span
      >
    </div>

    <div class="mt-3" id="artalk-container"></div>
  </div>
</template>
