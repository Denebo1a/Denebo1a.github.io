<template>
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
      class="relative z-10 rounded-full bg-card object-cover shadow-card transition-all group-hover:shadow-none"
      :class="props.sizeClass || 'h-24 w-24'"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";

import { useRouter } from "vitepress";

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
    clickTimer = setTimeout(() => {
      clickCount.value = 0;
    }, 500);
  }
};

const props = defineProps({
  sizeClass: {
    type: String,
    default: "",
  },
});
</script>
