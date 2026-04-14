<script setup>
import { useData } from "vitepress";
import SiteHeader from "./components/SiteHeader.vue";
import HomeView from "./components/HomeView.vue";
import BlogIndexView from "./components/BlogIndexView.vue";
import ResourcesIndexView from "./components/ResourcesIndexView.vue";
import ArticleLayout from "./components/ArticleLayout.vue";
import BassTabLayout from "./components/BassTabLayout.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

const { frontmatter } = useData();
</script>

<template>
  <div
    class="flex h-screen flex-col overflow-hidden bg-base font-sans text-main transition-colors duration-300 selection:bg-brand selection:text-white"
  >
    <SiteHeader />
    <Breadcrumb />

    <main class="custom-scrollbar w-full flex-1 overflow-y-auto pt-5">
      <HomeView v-if="frontmatter.layout === 'home'" />
      <BlogIndexView v-else-if="frontmatter.layout === 'blog-index'" />
      <ResourcesIndexView
        v-else-if="frontmatter.layout === 'resources-index'"
      />
      <ArticleLayout v-else-if="frontmatter.layout === 'article'" />
      <BassTabLayout v-else-if="frontmatter.layout === 'basstab-detail'" />

      <div
        v-else
        class="mx-auto max-w-4xl rounded-[2rem] bg-card p-8 shadow-card transition-colors duration-300 md:p-12"
      >
        <Content class="prose prose-lg max-w-none" />
      </div>
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
