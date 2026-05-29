<template>
  <div class="flex items-center justify-center">
    <div
      class="relative shrink-0 overflow-hidden rounded-[0.25rem] border border-color bg-card px-4 py-1 text-sm font-medium text-main before:absolute before:bottom-0 before:left-0 before:top-0 before:w-1 before:bg-brand"
    >
      {{ props.monthLabel }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  monthLabel: String,
});
</script>
