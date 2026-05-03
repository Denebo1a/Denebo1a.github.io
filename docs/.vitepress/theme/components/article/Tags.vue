<template>
  <div
    v-if="tags"
    class="flex flex-wrap items-center gap-3 rounded-full border border-color bg-card px-3 py-2"
  >
    <div class="flex items-center gap-1 border-r text-sm font-bold text-main">
      <i-material-symbols-bookmarks-rounded class="text-brand" />
      <span class="mr-2">标签</span>
    </div>
    <Tag
      v-for="tag in tags"
      :key="tag"
      class="px-3 py-1.5 text-xs"
      :tag="tag"
    />
  </div>
</template>

<script setup>
import Tag from "../items/Tag.vue";

defineProps({ tags: Array });
</script>
