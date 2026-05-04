<template>
  <div class="relative z-0 flex flex-col rounded-[2.5rem] bg-card shadow-card">
    <GlowCard
      glowColor="bg-brand-light"
      class="flex h-full flex-col p-4 md:p-6"
    >
      <div class="flex flex-col items-start">
        <div class="mb-4 flex flex-row items-center gap-5 sm:gap-6">
          <div
            class="group relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-alt p-[4px] transition-all duration-300 hover:scale-105"
          >
            <span
              class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-brand)_30%,transparent_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></span>

            <img
              src="/avatar.png"
              @click="handleSecretClick"
              alt="Denebora"
              class="relative z-10 h-20 w-20 rounded-full bg-card object-cover shadow-card transition-all group-hover:shadow-none sm:h-24 sm:w-24"
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
              <span class="text-sm font-medium tracking-wide">@Denebo1a</span>
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
              <span class="text-sm font-medium tracking-wide">@Denebora</span>
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
      </div>
    </GlowCard>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

import { useRouter } from "vitepress";

import GlowCard from "../styles/GlowCardBg.vue";

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
    router.go("/pandora/Welcome/01-intro");
    ElMessage.success("这是哪里来着...");
    clickCount.value = 0;
  } else {
    clickTimer = setTimeOut(() => {
      clickCount.value = 0;
    }, 500);
  }
};
</script>
