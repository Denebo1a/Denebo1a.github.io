<template>
  <div
    class="h-full w-full rounded-[1rem] border border-color bg-base px-3 pb-3"
  >
    <div class="flex flex-col items-center gap-2">
      <div class="flex w-full items-center justify-between">
        <a
          href="/basstabs/"
          class="mt-1.5 flex items-center gap-1 rounded-full border border-color px-2 py-1 text-xs text-muted transition-colors duration-300 hover:border-brand hover:bg-brand-light hover:text-brand"
        >
          <i-ph-music-notes />
          <span>点击前往</span>
        </a>
        <div class="flex flex-1 items-center justify-center gap-3">
          <OverviewLabel label="和B站同步更新" />
          <OverviewLabel label="在线播放浏览" />
          <OverviewLabel label="下载链接一键直达" />
        </div>
        <div class="mt-1.5 flex w-20 items-center justify-end gap-2">
          <div
            class="h-3 w-3 rounded-full border border-red-500/20 bg-red-400"
          ></div>
          <div
            class="h-3 w-3 rounded-full border border-yellow-500/20 bg-yellow-400"
          ></div>
          <div
            class="h-3 w-3 rounded-full border border-green-500/20 bg-green-400"
          ></div>
        </div>
      </div>
      <div
        class="overflow-hidden rounded-[1rem] border border-color shadow-card"
      >
        <img src="/basstab-overview.png" class="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OverviewLabel from "../../items/OverviewLabel.vue";
</script>
