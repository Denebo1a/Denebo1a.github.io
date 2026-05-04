<template>
  <div
    class="relative flex w-full flex-col overflow-hidden rounded-[0.5rem] border border-color bg-base p-4"
  >
    <div class="mb-3 flex items-center gap-2">
      <Category :category="category" class="text-medium px-3 py-1" />
      <h1
        class="text-[1.25rem] font-bold leading-[1.2] tracking-tight text-main transition-colors md:text-[1.75rem]"
      >
        {{ title }}
      </h1>
    </div>
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2 text-sm font-medium text-muted">
        <i-ph-calendar-blank-fill />
        <span>{{ date }}</span>
      </div>

      <div class="flex items-center gap-2">
        <i-material-symbols-bookmarks-rounded class="text-sm text-muted" />
        <Tag
          v-for="tag in tags"
          :key="tag"
          class="px-3 py-1.5 text-xs"
          :tag="tag"
        />
      </div>
    </div>
    <Divider :solid="true" margin="my-2" />
    <span class="text-muted">{{ summary }}</span>
    <i-material-symbols-article-rounded
      class="absolute -right-8 -top-10 h-36 w-36 rotate-[-15deg] text-muted opacity-[0.06]"
    />
  </div>
</template>

<script setup>
import Category from "../items/Category.vue";
import Tag from "../items/Tag.vue";
import Divider from "../items/Divider.vue";

defineProps({
  category: String,
  date: String,
  title: String,
  tags: Array,
  summary: String,
});
</script>
