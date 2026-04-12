<template>
  <div
    class="border-color bg-card shadow-card relative flex flex-col overflow-hidden rounded-3xl border transition-colors duration-300"
  >
    <div
      class="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full blur-[80px] transition-colors duration-300"
      :class="glowColor"
    ></div>

    <div class="relative z-10 flex flex-1 flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  glowColor: {
    type: String,
    // 2. 将写死的 teal 蓝绿色默认值，替换为当前的品牌浅色变量
    default: "bg-brand-light",
  },
});
</script>
