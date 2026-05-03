<template>
  <div
    class="relative flex flex-col overflow-hidden rounded-3xl border border-color bg-card shadow-card transition-colors duration-300"
  >
    <div
      class="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full blur-[80px] transition-colors duration-300"
      :class="glowColor"
    ></div>

    <div class="relative z-10 flex flex-1 flex-col">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  glowColor: {
    type: String,
    default: "bg-brand-light",
  },
});
</script>
