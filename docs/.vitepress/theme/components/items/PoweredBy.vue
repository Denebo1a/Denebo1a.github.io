<template>
  <!-- 外层容器 -->
  <div class="flex w-[210px] items-center rounded-[0.5rem] p-1">
    <!-- Powered by 部分 -->
    <div
      class="flex items-center overflow-hidden whitespace-nowrap text-sm font-medium text-muted transition-all duration-300 ease-in-out"
      :class="
        isHovered
          ? 'mr-0 max-w-0 -translate-x-4 opacity-0'
          : 'mr-2 max-w-[80px] translate-x-0 opacity-100'
      "
    >
      <span>Powered by</span>
    </div>

    <!-- VitePress 标签 -->
    <a
      href="https://vitepress.dev/zh/"
      target="_blank"
      rel="noopener noreferrer"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="group relative inline-flex flex-1 items-center justify-center gap-1 overflow-hidden rounded-[0.5rem] bg-alt p-1 text-muted transition-all duration-300 ease-in-out hover:bg-brand-light hover:text-main"
    >
      <img
        src="/vitepress-logo-mini.svg"
        alt="VitePress"
        class="h-6 w-6 shrink-0"
      />

      <div class="relative flex h-6 flex-1 items-center overflow-hidden">
        <span
          class="absolute left-0 whitespace-nowrap font-medium transition-all duration-300 ease-in-out"
          :class="
            isHovered
              ? '-translate-y-full opacity-0'
              : 'translate-y-0 opacity-100'
          "
        >
          VitePress
        </span>

        <span
          class="absolute left-0 whitespace-nowrap text-xs font-medium transition-all duration-300 ease-in-out"
          :class="
            isHovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0'
          "
        >
          一个基于Vue&Vite的SSG框架
        </span>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isHovered = ref(false);
</script>
