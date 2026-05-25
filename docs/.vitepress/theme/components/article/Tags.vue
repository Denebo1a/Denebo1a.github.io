<template>
  <div
    v-if="tags"
    class="flex flex-wrap items-center rounded-full border border-color bg-card px-3 py-2 transition-colors duration-300"
  >
    <div class="flex items-center gap-1 text-sm font-bold text-main">
      <i-material-symbols-bookmarks-rounded class="text-brand" />
      <span>标签</span>
    </div>
    <Divider :vertical="true" :solid="true" margin="mx-2 my-0" />
    <div class="flex items-center gap-2">
      <Tag
        v-for="tag in tags"
        :key="tag"
        class="px-3 py-1.5 text-xs"
        :tag="tag"
      />
    </div>
  </div>
</template>

<script setup>
import Divider from "../items/Divider.vue";
import Tag from "../items/Tag.vue";

defineProps({ tags: Array });
</script>
