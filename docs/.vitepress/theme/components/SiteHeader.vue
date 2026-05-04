<script setup>
import { computed } from "vue";
import Index from "./header/Index.vue";
import Title from "./header/Title.vue";
import SettingsButton from "./header/SettingsButton.vue";
import { useBreadcrumbs } from "../composables/useBreadcrumbs";
import { useScrollPersistence } from "../composables/useScrollPersistence";

import HomeIcon from "~icons/ph/house";
import ArticleIcon from "~icons/ph/article";
import BassTabsIcon from "~icons/ph/music-notes";
import StudioIcon from "~icons/ph/atom";

const { currentPageLabel, section } = useBreadcrumbs();
const { progress } = useScrollPersistence();

const navItems = [
  {
    url: "/",
    title: "首页",
    icon: HomeIcon,
    section: "home",
  },
  {
    url: "/blog/",
    title: "博客",
    icon: ArticleIcon,
    section: "blog",
  },
  {
    url: "/basstabs/",
    title: "乐谱",
    icon: BassTabsIcon,
    section: "basstabs",
  },
  {
    url: "/studio/",
    title: "Studio",
    icon: StudioIcon,
    section: "studio",
  },
];

const sectionTitleMap = {
  home: "首页",
  blog: "博客",
  basstabs: "乐谱",
  studio: "Studio",
};

const isScrolled = computed(() => progress.value > 0);

const shouldShowContextLabel = computed(() => {
  if (!isScrolled.value) return false;
  if (!currentPageLabel.value) return false;

  const sectionTitle = sectionTitleMap[section.value] ?? "";
  return currentPageLabel.value !== sectionTitle;
});

const isActive = (targetSection) => section.value === targetSection;
</script>

<template>
  <header
    class="relative sticky top-0 z-50 flex h-14 w-full items-center justify-between px-4 py-2 transition-all duration-300"
    :class="
      isScrolled
        ? 'shadow-sm backdrop-blur-md'
        : 'bg-transparent shadow-none backdrop-blur-none'
    "
    :style="
      isScrolled
        ? {
            backgroundColor: 'var(--color-bg-card)',
          }
        : { backgroundColor: 'transparent' }
    "
  >
    <Title :isHeaderTransparent="!shouldShowContextLabel" />

    <div class="hidden min-w-0 flex-1 items-center justify-center px-8 md:flex">
      <div
        class="flex min-w-0 items-center duration-300 ease-out will-change-[gap]"
        style="transition-property: gap"
        :class="shouldShowContextLabel ? 'gap-4' : 'gap-0'"
      >
        <!-- 左侧：页面标题标签 -->
        <div
          class="grid duration-300 ease-out will-change-[grid-template-columns,opacity]"
          style="transition-property: grid-template-columns, opacity"
          :class="
            shouldShowContextLabel
              ? 'grid-cols-[1fr] opacity-100'
              : 'grid-cols-[0fr] opacity-0'
          "
        >
          <div class="min-w-0 overflow-hidden">
            <span
              class="text-medium block whitespace-nowrap font-bold text-main duration-300 ease-out will-change-transform"
              style="transition-property: transform"
              :class="
                shouldShowContextLabel ? 'translate-x-0' : '-translate-x-4'
              "
            >
              {{ currentPageLabel }}
            </span>
          </div>
        </div>

        <!-- 右侧：导航栏容器 -->
        <nav class="flex shrink-0 items-center gap-3 text-sm font-semibold">
          <Index
            v-for="item in navItems"
            :key="item.url"
            :url="item.url"
            :ActiveStatus="isActive(item.section)"
            :icon="item.icon"
            :title="item.title"
            :compact="isScrolled"
          />
        </nav>
      </div>
    </div>

    <div class="flex shrink-0 items-center justify-end gap-4">
      <SettingsButton />
    </div>
  </header>
</template>
