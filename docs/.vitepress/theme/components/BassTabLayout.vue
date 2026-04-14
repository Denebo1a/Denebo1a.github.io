<script setup lang="ts">
import { useData } from "vitepress";
import SheetPlayer from "./SheetPlayer.vue";

const { frontmatter, page } = useData();

// 只有 url 非空才显示对应链接
const links = [
  {
    key: "bilibiliUrl",
    label: "B站视频",
    icon: "bilibili",
  },
  {
    key: "baiduDiskUrl",
    label: "百度网盘",
    icon: "baidu",
  },
  {
    key: "lanzouUrl",
    label: "蓝奏云",
    icon: "lanzou",
  },
];

const activeLinks = links.filter((l) => frontmatter.value[l.key]);
</script>

<template>
  <div class="relative w-full px-6 py-4">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <!-- 左侧：播放器 + 正文 -->
      <div class="lg:col-span-8">
        <!-- 曲名标题（移动端显示在播放器上方） -->
        <div class="mb-4 lg:hidden">
          <h1 class="text-2xl font-extrabold text-main">
            {{ frontmatter.title }}
          </h1>
          <p class="mt-1 text-sm font-medium text-muted">
            {{ frontmatter.artist }}
          </p>
        </div>

        <!-- 走带播放器 -->
        <SheetPlayer :src="frontmatter.gpxUrl || ''" />
      </div>

      <!-- 右侧侧边栏（元数据 + 下载链接） -->
      <aside class="space-y-4 self-start lg:col-span-2">
        <!-- 封面图 -->
        <div
          v-if="frontmatter.cover"
          class="overflow-hidden rounded-2xl border border-color shadow-card"
        >
          <img
            :src="frontmatter.cover"
            :alt="frontmatter.title"
            class="w-full object-cover"
          />
        </div>

        <!-- 曲目信息 -->
        <div class="rounded-2xl border border-color bg-card p-5 shadow-card">
          <!-- 桌面端标题（移动端已在上方显示） -->
          <div class="hidden lg:block">
            <h1 class="text-[1rem] font-extrabold leading-snug text-main">
              {{ frontmatter.title }}
            </h1>
            <p class="mt-1 text-sm font-medium text-muted">
              {{ frontmatter.artist }}
            </p>
          </div>
        </div>

        <!-- 下载/外链 -->
        <div
          v-if="activeLinks.length > 0"
          class="rounded-2xl border border-color bg-card p-5 shadow-card"
        >
          <h3
            class="mb-3 flex items-center gap-2 border-b border-color pb-3 text-sm font-bold text-main"
          >
            <i-ph-link-bold class="h-4 w-4 text-brand" />
            相关链接
          </h3>
          <div class="flex flex-col gap-2">
            <a
              v-for="link in activeLinks"
              :key="link.key"
              :href="frontmatter[link.key]"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-3 rounded-xl border border-color px-4 py-2.5 text-sm font-semibold text-main transition-all hover:border-brand hover:bg-brand-light hover:text-brand"
            >
              <i-ant-design-bilibili-outlined
                v-if="link.icon === 'bilibili'"
                class="h-5 w-5 text-brand"
              />
              <i-ph-cloud-arrow-down-bold
                v-else-if="link.icon === 'baidu'"
                class="h-5 w-5 text-brand"
              />
              <i-ph-cloud-bold v-else class="h-5 w-5 text-brand" />
              {{ link.label }}
              <div
                class="flex items-center gap-0.5 rounded-full bg-brand-light px-2 py-0.5"
                v-if="link.icon !== 'bilibili'"
              >
                <i-material-symbols-lock class="h-3 w-3 text-brand" />
                <span class="text-[0.7rem] text-brand">BASS</span>
              </div>
              <i-ph-arrow-square-out-bold
                class="ml-auto h-4 w-4 text-muted group-hover:text-brand"
              />
            </a>
          </div>
        </div>

        <!-- 暂无链接提示 -->
        <div
          v-else
          class="rounded-2xl border border-color bg-card px-5 py-4 text-center text-xs text-muted shadow-card"
        >
          下载链接尚未添加
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
:deep(.prose) {
  overflow-wrap: break-word;
}
</style>
