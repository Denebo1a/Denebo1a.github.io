<template>
  <section
    class="flex h-full flex-col rounded-[1rem] border border-color bg-card p-6 shadow-card transition-colors duration-300 md:p-8 lg:col-span-8"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="mb-6 grid grid-cols-3 gap-3 sm:gap-6">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        @click="setTab(index)"
        class="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-[1rem] py-4 transition-all duration-300 sm:py-6"
        :class="
          activeTabIndex === index
            ? 'border border-color bg-gradient-to-b from-[var(--color-brand-light)] to-[var(--color-bg-card)] text-brand shadow-card'
            : 'bg-light border-transparent text-muted hover:bg-alt hover:text-main'
        "
      >
        <component
          :is="tab.icon"
          class="h-6 w-6 transition-transform duration-300 sm:h-8 sm:w-8"
          :class="
            activeTabIndex === index ? 'scale-110' : 'group-hover:scale-110'
          "
        />
        <span class="text-xs font-bold sm:text-sm">{{ tab.label }}</span>

        <div
          class="absolute left-1/2 top-0 h-1 w-1/3 -translate-x-1/2 rounded-b-full transition-all duration-300"
          :class="activeTabIndex === index ? 'bg-brand' : 'bg-transparent'"
        ></div>
        <div
          v-if="activeTabIndex === index"
          class="absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 bg-transparent transition-all transition-colors duration-300"
        >
          <div class="h-full bg-brand" :style="{ width: `${progress}%` }"></div>
        </div>
      </button>
    </div>
    <div
      class="relative flex-1 overflow-hidden rounded-2xl border border-color bg-alt transition-colors"
    >
      <transition name="fade" mode="out-in">
        <div
          v-if="activeTabIndex === 0"
          class="flex h-full flex-col p-6 sm:p-8"
          key="blog"
        >
          <h3 class="mb-4 text-xl font-bold text-main">占位符</h3>
        </div>

        <div
          v-else-if="activeTabIndex === 1"
          class="flex h-full flex-col p-6 sm:p-8"
          key="resources"
        >
          <h3 class="mb-4 text-xl font-bold text-main">占位符</h3>
        </div>

        <div
          v-else-if="activeTabIndex === 2"
          class="flex h-full flex-col p-6 sm:p-8"
          key="studio"
        >
          <h3 class="mb-4 text-xl font-bold text-main">占位符</h3>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import blogBoldIcon from "~icons/ph/article-bold";
import resourcesBoldIcon from "~icons/ph/package-bold";
import studioBoldIcon from "~icons/ph/atom-bold";

// --- 走马灯与进度条逻辑 ---
const duration = 5000; // 每个 Tab 停留 5 秒
let startTime = null;
let animationFrame = null;

const activeTabIndex = ref(0);
const progress = ref(0);
const isHovered = ref(false);

// --- 选项卡数据 ---
const tabs = [
  { id: "blog", label: "博客", icon: blogBoldIcon },
  { id: "resources", label: "资源", icon: resourcesBoldIcon },
  { id: "studio", label: "Studio", icon: studioBoldIcon },
];

const startTimer = () => {
  startTime = performance.now();
  const animate = (currentTime) => {
    if (isHovered.value) {
      // 鼠标悬浮时暂停：不断更新 startTime，让已流失的时间保持不变
      startTime = currentTime - (progress.value / 100) * duration;
    } else {
      let elapsed = currentTime - startTime;
      if (elapsed >= duration) {
        // 时间到，切换到下一个 Tab
        activeTabIndex.value = (activeTabIndex.value + 1) % tabs.length;
        startTime = currentTime;
        elapsed = 0;
      }
      // 计算进度百分比
      progress.value = (elapsed / duration) * 100;
    }
    animationFrame = requestAnimationFrame(animate);
  };
  animationFrame = requestAnimationFrame(animate);
};

// 手动点击切换 Tab
const setTab = (index) => {
  activeTabIndex.value = index;
  startTime = performance.now(); // 重置计时器
  progress.value = 0;
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
