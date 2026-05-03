<template>
  <div
    class="flex items-center gap-1 border-color text-[0.8rem] font-bold text-muted"
  >
    <i-ph-calendar-blank />
    <span>
      {{ date }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
});
</script>
