<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import GlowCard from "./styles/GlowCardBg.vue";
import { latestUpdates } from "../data/latestUpdates";
import { ElMessage } from "element-plus";

import { useRouter } from "vitepress";

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

const getTimelineItemTypeClass = (type) => {
  switch (type) {
    case "blog":
      return "bg-brand/10 text-brand";
    case "basstab":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    default:
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
};

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

const router = useRouter();
const clickCount = ref(0);
let clickTimer = null;

const handleSecretClick = () => {
  ++clickCount.value;
  clearTimeout(clickTimer);

  if (clickCount.value === 5) {
    ElMessage.error("真的还要继续点吗!?");
  }
  if (clickCount.value === 6) {
    ElMessage.error("你感到有个邪恶的东西在看着你……");
  }
  if (clickCount.value === 7) {
    ElMessage.warning("古老的光明与黑暗之魂已经释放。");
  }
  if (clickCount.value === 8) {
    ElMessage.warning("你的头脑变得麻木……");
  }
  if (clickCount.value === 9) {
    ElMessage.warning("月亮末日慢慢逼近……");
  }
  if (clickCount.value >= 10) {
    router.go("/pandora/intro");
    ElMessage.success("这是哪里来着...");
    clickCount.value = 0;
  } else {
    clickTimer = setTimeOut(() => {
      clickCount.value = 0;
    }, 500);
  }
};
</script>

<template>
  <div class="grid grid-cols-1 items-start gap-6 px-6 py-4 lg:grid-cols-12">
    <aside class="flex flex-col gap-4 lg:col-span-4">
      <div
        class="relative z-0 flex flex-col rounded-[2.5rem] bg-card shadow-card"
      >
        <GlowCard
          glowColor="bg-brand-light"
          class="flex h-full flex-col p-4 md:p-6"
        >
          <div class="flex flex-col items-start">
            <div
              class="relative mb-4 flex flex-row items-center gap-5 sm:gap-6"
            >
              <div class="relative shrink-0">
                <img
                  src="/avatar.png"
                  @click="handleSecretClick"
                  alt="Denebora"
                  class="h-20 w-20 rounded-full object-cover shadow-card ring-4 ring-alt transition-all hover:scale-105 sm:h-24 sm:w-24"
                />
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

            <p class="mt-2 leading-relaxed text-muted transition-colors">
              欢迎来到Denebora的数字花园(๑╹◡╹๑)
            </p>
          </div>
        </GlowCard>
      </div>

      <div
        class="flex h-96 flex-col overflow-hidden rounded-[1.5rem] border border-color bg-card shadow-card"
      >
        <div class="flex shrink-0 items-center border-b border-color p-4 pb-2">
          <div class="flex items-center gap-2">
            <div
              class="h-3 w-3 rounded-full bg-brand ring-2 ring-brand-light"
            ></div>
            <h2 class="text-[1rem] font-bold text-main">最新动态</h2>
          </div>
        </div>

        <div
          class="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden pr-4 pt-4"
        >
          <el-timeline class="home-updates-timeline">
            <el-timeline-item
              v-for="item in latestUpdates"
              :key="`${item.type}-${item.url}`"
              placement="top"
              :timestamp="item.date.string + ' 上传了'"
              class="home-updates-timeline-item"
            >
              <template #dot>
                <div
                  class="flex h-5 w-5 -translate-x-1 items-center justify-center rounded-full border-2 border-brand bg-card"
                >
                  <i-ph-music-notes-fill
                    v-if="item.type === 'basstab'"
                    class="h-3 w-3 text-brand"
                  />
                  <i-ph-text-align-left-bold
                    v-else-if="item.type === 'blog'"
                    class="h-3 w-3 text-brand"
                  />
                  <i-ph-dots-three-outline-vertical-fill
                    v-else
                    class="h-3 w-3 text-brand"
                  />
                </div>
              </template>

              <div
                class="group flex flex-col rounded-[1rem] border border-color px-2 py-2 shadow-card transition-colors hover:border-brand hover:bg-brand-light"
              >
                <div
                  class="flex cursor-pointer items-center justify-between"
                  @click="router.go(item.url)"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[12px] font-bold text-white"
                      >{{ item.typeLabel }}</span
                    >
                    <span
                      class="font group text-[15px] leading-relaxed text-muted transition-colors group-hover:text-brand"
                    >
                      {{ item.title }}
                    </span>
                  </div>
                  <div class="bg flex h-6 w-6 items-center">
                    <i-ph-arrow-square-out-bold
                      class="h-4 w-4 text-muted group-hover:text-brand"
                    />
                  </div>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </aside>

    <section
      class="flex h-full flex-col rounded-[2.5rem] bg-card p-6 shadow-card ring-1 ring-alt transition-colors duration-300 md:p-8 lg:col-span-8"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <div class="mb-6 grid grid-cols-3 gap-3 sm:gap-6">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          @click="setTab(index)"
          class="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 transition-all duration-300 sm:py-6"
          :class="
            activeTabIndex === index
              ? 'bg-gradient-to-b from-[var(--color-brand-light)] to-[var(--color-bg-card)] text-brand shadow-card ring-2 ring-alt'
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
