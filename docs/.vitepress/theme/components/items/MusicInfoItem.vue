<template>
  <div
    class="flex w-full items-center gap-2 rounded-[1rem] bg-base px-2 py-1 text-[0.8rem] font-bold text-muted"
  >
    <div class="flex items-center gap-1">
      <component :is="icon" />
      <span>{{ label }}</span>
    </div>
    <Divider :vertical="true" margin="mx-0" />
    <span class="ml-auto">{{ value }}</span>
  </div>
</template>

<script setup>
import Divider from "./Divider.vue";

const props = defineProps({
  label: String,
  value: String,
  icon: Object,
});
</script>
