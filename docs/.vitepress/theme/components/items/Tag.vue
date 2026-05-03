<template>
  <div
    class="flex cursor-pointer items-center gap-1 rounded-full border border-color bg-card px-2 py-1 text-[0.7rem] font-bold text-muted transition-all duration-300 ease-in-out hover:border-brand hover:bg-brand-light hover:text-brand"
  >
    <i-ph-hash-bold />{{ tag }}
  </div>
</template>

<script setup>
defineProps({
  tag: String,
});
</script>
