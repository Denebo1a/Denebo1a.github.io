<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import GlowCard from "./styles/GlowCardBg.vue";

import blogBoldIcon from "~icons/ph/article-bold";
import resourcesBoldIcon from "~icons/ph/package-bold";
import studioBoldIcon from "~icons/ph/atom-bold";

// --- 选项卡数据 ---
const tabs = [
  { id: "blog", label: "博客", icon: blogBoldIcon },
  { id: "resources", label: "资源", icon: resourcesBoldIcon },
  { id: "studio", label: "Studio", icon: studioBoldIcon },
];

const activeTabIndex = ref(0);
const progress = ref(0);
const isHovered = ref(false);

// --- 走马灯与进度条逻辑 ---
const duration = 5000; // 每个 Tab 停留 5 秒
let startTime = null;
let animationFrame = null;

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

<template>
  <div class="grid grid-cols-1 items-start gap-6 px-6 py-4 lg:grid-cols-12">
    <aside class="flex flex-col gap-10 lg:col-span-4">
      <div
        class="relative z-0 flex flex-col rounded-[2.5rem] bg-card shadow-card transition-colors duration-300"
      >
        <GlowCard
          glowColor="bg-brand-light"
          class="flex h-full flex-col p-5 md:p-10"
        >
          <div class="flex flex-col items-start">
            <div
              class="relative mb-8 flex flex-row items-center gap-5 sm:gap-6"
            >
              <div class="relative shrink-0">
                <img
                  src="/avatar.png"
                  alt="Denebora"
                  class="h-20 w-20 rounded-full object-cover shadow-card ring-4 ring-alt transition-all hover:scale-105 sm:h-24 sm:w-24"
                />
                <span
                  class="absolute bottom-1 right-1 block h-4 w-4 rounded-full border-[3px] border-card bg-[#10b981] transition-colors sm:h-5 sm:w-5 sm:border-4"
                ></span>
              </div>

              <div
                class="flex flex-col items-start justify-center gap-3 border-l-2 border-color py-1.5 pl-5 transition-colors sm:pl-6"
              >
                <a
                  href="https://github.com/Denebo1a"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-2 text-muted transition-colors hover:text-brand"
                >
                  <i-ph-github-logo-fill
                    class="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5"
                  />
                  <span class="text-sm font-medium tracking-wide"
                    >@Denebo1a</span
                  >
                </a>

                <a
                  href="https://space.bilibili.com/324205603"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-2 text-muted transition-colors hover:text-brand"
                >
                  <i-ant-design-bilibili-outlined
                    class="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5"
                  />
                  <span class="text-sm font-medium tracking-wide"
                    >@Denebora</span
                  >
                </a>
                <a
                  href="mailto:denebo1a@163.com"
                  class="group flex items-center gap-2 text-muted transition-colors hover:text-brand"
                >
                  <i-material-symbols-attach-email
                    class="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5"
                  />
                  <span class="text-sm font-medium tracking-wide"
                    >denebo1a@163.com</span
                  >
                </a>
                <a
                  href="https://www.linkedin.com/in/denebo1a/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex items-center gap-2 text-muted transition-colors hover:text-brand"
                >
                </a>
              </div>
            </div>

            <h1
              class="mb-2 text-3xl font-extrabold tracking-tight text-main transition-colors md:text-4xl"
            >
              Hi, I'm <span class="text-brand">Denebora</span>.
            </h1>
            <h2 class="text-lg font-bold text-muted transition-colors">
              Developer / Music Enthusiast
            </h2>

            <p class="mt-5 leading-relaxed text-muted transition-colors">
              欢迎来到Denebora的数字花园(๑╹◡╹๑)
            </p>
          </div>
        </GlowCard>
      </div>

      <div class="px-2">
        <h3 class="mb-8 text-xl font-bold text-main transition-colors">
          最新动态
        </h3>
        <div class="relative ml-3 space-y-10 transition-colors">
          <div class="relative pl-8">
            <div
              class="absolute -left-[9px] top-1 bg-base py-1 transition-colors duration-300"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand"
              >
                <div class="h-1.5 w-1.5 rounded-full bg-brand"></div>
              </div>
            </div>
          </div>

          <div class="relative pl-8">
            <div
              class="absolute -left-[9px] top-1 bg-base py-1 transition-colors duration-300"
            >
              <div
                class="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white"
              >
                <i-heroicons-check-16-solid class="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <section
      class="flex h-full flex-col rounded-[2.5rem] bg-card p-6 shadow-card transition-colors duration-300 md:p-8 lg:col-span-8"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="mb-4 grid grid-cols-3 gap-3 sm:gap-6">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          @click="setTab(index)"
          class="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border py-4 transition-all duration-300 sm:py-6"
          :class="
            activeTabIndex === index
              ? 'border-1 border-color bg-gradient-to-b from-[var(--color-brand-light)] to-[var(--color-bg-card)] text-brand shadow-card'
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
            <div
              class="h-full bg-brand"
              :style="{ width: `${progress}%` }"
            ></div>
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
            <div class="mb-4 flex items-center gap-3">
              <span
                class="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white"
                >实战驱动</span
              >
              <span class="text-sm font-bold text-main"
                >深入理解现代 Web 架构</span
              >
            </div>
            <p class="text-sm leading-relaxed text-muted">
              没有焦虑与浮夸，只有亲身体验过，感觉不错才会推荐。涵盖 Vue3,
              Node.js 与现代工程化的高阶用法与开发体验分享。
            </p>
            <div class="mt-6 flex-1 rounded-xl border border-color bg-card p-4">
              <span class="text-xs text-muted"
                >Blog Content Placeholder...</span
              >
            </div>
          </div>

          <div
            v-else-if="activeTabIndex === 1"
            class="flex h-full flex-col p-6 sm:p-8"
            key="resources"
          >
            <h3 class="mb-4 text-xl font-bold text-main">开源项目与资源库</h3>
            <p class="text-sm leading-relaxed text-muted">
              这里存放了我参与整理的开源工具、UI
              组件片段以及配置指南。开箱即用，提升开发效率。
            </p>
          </div>

          <div
            v-else-if="activeTabIndex === 2"
            class="flex h-full flex-col p-6 sm:p-8"
            key="studio"
          >
            <h3 class="mb-4 text-xl font-bold text-main">
              数字实验室 (Studio)
            </h3>
            <p class="text-sm leading-relaxed text-muted">
              一些关于 AI 辅助编程、视觉设计和实验性交互的狂想区。
            </p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

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
