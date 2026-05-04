<template>
  <span
    class="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[0.75rem] font-bold text-slate-100"
    :class="{ 'tracking-widest': trackingWidest }"
  >
    {{ category }}
  </span>
</template>

<script setup>
const props = defineProps({
  category: String,
  trackingWidest: { type: Boolean, default: true },
});
</script>
