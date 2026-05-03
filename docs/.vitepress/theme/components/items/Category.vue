<template>
  <span
    class="rounded-full bg-brand px-2 py-0.5 text-[0.75rem] font-bold tracking-widest text-slate-100"
  >
    {{ category }}
  </span>
</template>

<script setup>
const props = defineProps({
  category: String,
});
</script>
