<script setup>
import { ref } from "vue";
import BassTabsView from "./BassTabsView.vue";
import OtherResourcesView from "./OtherResourcesView.vue";
import otherIcon from "~icons/ph/dots-three-circle-vertical-fill";
import bassIcon from "~icons/ph/music-notes-fill";

const tabs = [
  { key: "basstabs", label: "BASS TAB", icon: bassIcon },
  { key: "others", label: "其他", icon: otherIcon },
];

const activeTab = ref("basstabs");
</script>

<template>
  <div class="relative min-h-full w-full">
    <!-- 顶部 Switch -->
    <div class="fixed left-1/2 top-16 z-30 -translate-x-1/2">
      <div
        class="inline-flex rounded-2xl border border-color bg-card p-1 shadow-card"
      >
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="flex items-center gap-1 rounded-full px-2 py-1 text-[0.8rem] font-bold transition-all duration-200"
          :class="
            activeTab === tab.key
              ? 'bg-brand-light text-brand shadow-sm'
              : 'text-muted hover:bg-alt'
          "
        >
          <component :is="tab.icon" class="mr-1 inline-block h-4 w-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- 子视图 -->
    <BassTabsView v-if="activeTab === 'basstabs'" />
    <OtherResourcesView v-else-if="activeTab === 'others'" />
  </div>
</template>

<style>
/* 修改点 3： 
  在这里直接定义 custom-scrollbar 的样式。
  不加 scoped，确保它能稳定作用于整个 main 容器。
*/

/* 针对 Webkit 浏览器 (Chrome, Edge, Safari) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* 纤细的滚动条 */
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
