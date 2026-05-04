<script setup>
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import { useData, useRoute } from "vitepress";
import SiteHeader from "./components/SiteHeader.vue";
import HomeView from "./components/HomeView.vue";
import BlogIndexView from "./components/BlogIndexView.vue";
import BassTabsIndex from "./components/BassTabsIndex.vue";
import StudioView from "./components/StudioView.vue";
import ArticleLayout from "./components/ArticleLayout.vue";
import BassTabLayout from "./components/BassTabLayout.vue";
import Breadcrumb from "./components/overlays/Breadcrumb.vue";
import BackgroundCover from "./components/BackgroundCover.vue";
import SiteFooter from "./components/SiteFooter.vue";
import ToolBar from "./components/overlays/ToolBar.vue";
import BottomBar from "./components/basstabsIndex/BottomBar.vue";
import SideBar from "./components/basstabsIndex/SideBar.vue";
import ContextMenu from "./components/overlays/ContextMenu.vue";
import { useTheme } from "./composables/useTheme";
import { useScrollPersistence } from "./composables/useScrollPersistence";

import DefaultTheme from "vitepress/theme";

const { frontmatter } = useData();
const route = useRoute();
const { initTheme } = useTheme();
const {
  bindScrollRoot,
  unbindScrollRoot,
  saveScrollPosition,
  restoreScrollPosition,
  syncProgress,
  getScrollTop,
} = useScrollPersistence();

const isArticleLayout = () => frontmatter.value.layout === "article";

const getScrollRoot = () => document.getElementById("site-main-scroll");

const scrollToHash = () => {
  const hash = window.location.hash;
  if (!hash) return false;

  const id = decodeURIComponent(hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  return true;
};

const restorePageState = async () => {
  const scrollRoot = getScrollRoot();
  if (!scrollRoot) return;

  if (scrollToHash()) {
    syncProgress(route.path);
    return;
  }

  if (!isArticleLayout()) {
    scrollRoot.scrollTo({ top: 0, behavior: "auto" });
    syncProgress();
    return;
  }

  const restored = await restoreScrollPosition(route.path);
  if (!restored) {
    scrollRoot.scrollTo({ top: 0, behavior: "auto" });
  }
  syncProgress(route.path);
};

const handleHashChange = () => {
  nextTick(async () => {
    await restorePageState();
  });
};

onMounted(async () => {
  initTheme();
  bindScrollRoot(getScrollRoot());
  await restorePageState();
  window.addEventListener("hashchange", handleHashChange);
});

onBeforeUnmount(() => {
  saveScrollPosition(route.path, getScrollTop());
  unbindScrollRoot();
  window.removeEventListener("hashchange", handleHashChange);
});

watch(
  () => route.path,
  async (nextPath, previousPath) => {
    if (previousPath) {
      saveScrollPosition(previousPath, getScrollTop());
    }

    await nextTick();
    bindScrollRoot(getScrollRoot());
    await restorePageState();

    if (isArticleLayout()) {
      syncProgress(nextPath);
    }
  },
);
</script>

<template>
  <DefaultTheme.Layout v-if="frontmatter.layout === 'doc'" />
  <template v-else>
    <BackgroundCover />
    <ContextMenu />
    <div
      class="relative z-0 flex h-screen flex-col overflow-hidden bg-transparent font-sans"
    >
      <SiteHeader />

      <main
        id="site-main-scroll"
        class="custom-scrollbar w-full flex-1 overflow-y-auto"
      >
        <div class="flex min-h-full flex-col">
          <div class="relative flex-1 px-20 py-10">
            <Transition name="page-fade" mode="out-in">
              <div :key="route.path">
                <HomeView v-if="frontmatter.layout === 'home'" />
                <BlogIndexView
                  v-else-if="frontmatter.layout === 'blog-index'"
                />
                <BassTabsIndex
                  v-else-if="frontmatter.layout === 'basstabs-index'"
                />
                <ArticleLayout v-else-if="frontmatter.layout === 'article'" />
                <BassTabLayout
                  v-else-if="frontmatter.layout === 'basstab-detail'"
                />
                <StudioView v-else-if="frontmatter.layout === 'studio-view'" />
              </div>
            </Transition>
            <SideBar v-if="frontmatter.layout === 'basstabs-index'" />
            <BottomBar v-if="frontmatter.layout === 'basstabs-index'" />
            <ToolBar />
          </div>
          <Breadcrumb />
          <SiteFooter id="site-footer" />
        </div>
      </main>
    </div>
  </template>
</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

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
  scrollbar-gutter: stable;
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
