<template>
  <div class="rounded-[1rem] border border-color bg-card p-3 shadow-card">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <component :is="icon" class="h-4 w-4 text-brand" />
        <span class="text-sm font-bold text-main">{{ title }}</span>
      </div>
      <div>
        <slot name="header"></slot>
      </div>
    </div>
    <Divider :solid="true" margin="mx-0 my-2" />
    <slot></slot>
  </div>
</template>

<script setup>
import Divider from "../items/Divider.vue";

defineProps({ title: String, icon: Object });
</script>
