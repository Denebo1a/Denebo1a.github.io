<template>
  <div
    class="flex flex-col items-center gap-1 rounded-[0.5rem] bg-alt p-1"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="grid place-items-center overflow-hidden">
      <component
        :is="icon"
        class="col-start-1 row-start-1 text-sm text-brand transition-all duration-300 ease-in-out"
        :class="
          isHovered
            ? '-translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
        "
      />
      <span
        class="col-start-1 row-start-1 whitespace-nowrap text-xs font-bold transition-all duration-300 ease-in-out"
        :class="
          isHovered ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        "
        >{{ label }}</span
      >
    </div>
    <div class="text-sm font-bold text-muted">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  icon: Object,
  label: String,
});

const isHovered = ref(false);
</script>
