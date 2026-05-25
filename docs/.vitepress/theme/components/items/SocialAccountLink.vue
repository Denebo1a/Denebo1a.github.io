<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex items-center gap-2 text-muted transition-colors hover:text-brand"
  >
    <component
      :is="icon"
      class="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5"
    />
    <span class="text-sm font-medium tracking-wide">{{ label }}</span>
  </a>
</template>

<script setup>
defineProps({
  url: String,
  icon: Object,
  label: String,
});
</script>
