<script setup>
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { useData, useRoute } from "vitepress";
import SiteHeader from "./components/SiteHeader.vue";
import HomeView from "./components/HomeView.vue";
import BlogIndexView from "./components/BlogIndexView.vue";
import ResourcesIndexView from "./components/ResourcesIndexView.vue";
import ArticleLayout from "./components/ArticleLayout.vue";
import BassTabLayout from "./components/BassTabLayout.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

import DefaultTheme from "vitepress/theme";

const { frontmatter } = useData();
const route = useRoute();

const scrollToHash = () => {
  const hash = window.location.hash;
  if (!hash) return;

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const handleHashChange = () => {
  nextTick(scrollToHash);
};

onMounted(() => {
  handleHashChange();
  window.addEventListener("hashchange", handleHashChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("hashchange", handleHashChange);
});

watch(
  () => route.path,
  () => {
    handleHashChange();
  },
);
</script>

<template>
  <DefaultTheme.Layout v-if="frontmatter.layout === 'doc'" />
  <div
    v-else
    class="flex h-screen flex-col overflow-hidden bg-base font-sans text-main transition-colors duration-300 selection:bg-brand selection:text-white"
  >
    <SiteHeader />
    <Breadcrumb />

    <main
      id="site-main-scroll"
      class="custom-scrollbar w-full flex-1 overflow-y-auto pt-5"
    >
      <HomeView v-if="frontmatter.layout === 'home'" />
      <BlogIndexView v-else-if="frontmatter.layout === 'blog-index'" />
      <ResourcesIndexView
        v-else-if="frontmatter.layout === 'resources-index'"
      />
      <ArticleLayout v-else-if="frontmatter.layout === 'article'" />
      <BassTabLayout v-else-if="frontmatter.layout === 'basstab-detail'" />
    </main>
  </div>
</template>

<style>
/* 定义 custom-scrollbar 的样式 */

/* 针对 Webkit 浏览器 (Chrome, Edge, Safari) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* 纤细的滚动条 */
}

.custom-scrollbar::-webkit-scrollbar-button {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* 轨道透明 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  /* 使用半透明灰色，圆角设计 */
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 9999px; /* 对应 tailwind 的 rounded-full */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8); /* 悬停时加深 */
}

/* 针对 Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
}

/* 如果你的项目支持深色模式 (dark mode)，可以自动适配 */
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.2);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
.dark .custom-scrollbar {
  scrollbar-color: rgba(156, 163, 175, 0.2) transparent;
}
</style>
