<template>
  <el-tooltip
    :content="`回到顶部（已浏览 ${progress}%）`"
    placement="left-start"
    :show-arrow="false"
  >
    <button
      type="button"
      class="group relative h-[50px] w-[50px] overflow-hidden rounded-full border border-color bg-card p-2 text-main shadow-card transition-all duration-300 hover:border-brand hover:bg-brand-light"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="scrollToTop"
    >
      <el-progress
        type="circle"
        :percentage="progress"
        color="var(--color-brand)"
        :width="36"
        :stroke-width="5"
        :show-text="false"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out"
        :class="
          isHovered
            ? '-translate-y-full opacity-0'
            : '-translate-y-1/2 opacity-100'
        "
      />
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span
          class="text-xs font-medium tracking-tighter text-muted transition-all duration-300 ease-in-out"
          :class="isHovered ? '-translate-y-full opacity-0' : 'opacity-100'"
        >
          {{ progress }}
        </span>
      </div>

      <i-material-symbols-arrow-upward-rounded
        class="absolute left-1/2 top-1/2 -translate-x-1/2 text-2xl text-brand transition-all duration-300 ease-in-out"
        :class="
          isHovered
            ? '-translate-y-1/2 opacity-100'
            : 'translate-y-full opacity-0'
        "
      />
    </button>
  </el-tooltip>
</template>

<script setup>
import { ref } from "vue";
import { useScrollPersistence } from "../../../composables/useScrollPersistence";

const { progress, scrollToTop } = useScrollPersistence();
const isHovered = ref(false);
</script>
