<script setup lang="ts">
import { useData } from "vitepress";
import SheetPlayer from "./SheetPlayer.vue";
import Links from "./basstab/Links.vue";
import Info from "./basstab/Info.vue";

const { frontmatter } = useData();
</script>

<template>
  <div class="relative w-full px-6 py-4">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <!-- 左侧：播放器 + 正文 -->
      <div class="lg:col-span-8">
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
        <Info :title="frontmatter.title" :artist="frontmatter.artist" />

        <!-- 下载/外链 -->
        <Links />
      </aside>
    </div>
  </div>
</template>

<style scoped>
:deep(.prose) {
  overflow-wrap: break-word;
}
</style>
