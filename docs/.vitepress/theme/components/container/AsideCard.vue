<template>
  <div class="rounded-[1rem] border border-color bg-card p-3 shadow-card">
    <div
      class="mb-3 flex items-center justify-between border-b border-color pb-2"
    >
      <div class="flex items-center gap-2">
        <component :is="icon" class="h-4 w-4 text-brand" />
        <span class="text-sm font-bold">{{ title }}</span>
      </div>
      <div>
        <slot name="header"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({ title: String, icon: Object });
</script>
