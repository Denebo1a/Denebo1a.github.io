<template>
  <div
    class="flex items-center gap-2 text-sm font-medium text-muted transition-all duration-300 ease-in-out"
    :class="{ 'w-[190px]': isHovered, 'w-[100px]': !isHovered }"
  >
    <a
      href="https://github.com/Denebo1a/Denebo1a.github.io"
      target="_blank"
      rel="noopener noreferrer"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="group flex flex-1 cursor-pointer items-center gap-1 rounded-[0.5rem] bg-alt px-2 py-1 duration-300 ease-in-out hover:bg-brand-light hover:text-main"
    >
      <i-ant-design-github-filled class="shrink-0" />

      <div class="grid flex-1 overflow-hidden">
        <span
          class="col-start-1 row-start-1 whitespace-nowrap transition-all duration-300 ease-in-out"
          :class="
            isHovered
              ? '-translate-x-full opacity-0'
              : 'translate-x-0 opacity-100'
          "
        >
          主题已开源！
        </span>
        <span
          class="relative col-start-1 row-start-1 items-center whitespace-nowrap transition-all duration-300 ease-in-out"
          :class="
            isHovered
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0'
          "
        >
          <span>前往仓库</span>
          <span class="right-100 absolute ml-2">- MIT license </span>
        </span>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isHovered = ref(false);
</script>
