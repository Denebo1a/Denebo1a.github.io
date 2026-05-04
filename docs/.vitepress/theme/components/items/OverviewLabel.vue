<template>
  <div
    class="flex items-center gap-1 rounded-b-[1rem] bg-brand-light px-3 pb-1 pt-1.5 text-sm text-brand"
  >
    <span>✦ </span><span>{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({ label: String });
</script>
