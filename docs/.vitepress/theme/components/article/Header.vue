<template>
  <div
    class="relative flex w-full flex-col overflow-hidden rounded-[0.5rem] border border-color bg-alt p-4 transition-colors duration-300"
  >
    <div class="mb-3 flex items-center gap-2">
      <span
        class="rounded-full bg-brand px-3 py-1 text-sm font-bold tracking-wider text-brand-light transition-colors"
      >
        {{ category }}
      </span>
      <h1
        class="text-[1.25rem] font-bold leading-[1.2] tracking-tight text-main transition-colors md:text-[1.75rem]"
      >
        {{ title }}
      </h1>
    </div>
    <div class="mb-3 flex items-center gap-6 border-b-2 border-color pb-3">
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
    <span class="text-muted">{{ summary }}</span>
    <i-material-symbols-article-rounded
      class="absolute -right-8 -top-8 h-36 w-36 rotate-[-15deg] text-muted opacity-10"
    />
  </div>
</template>

<script setup>
import Tag from "../items/Tag.vue";

defineProps({
  category: String,
  date: String,
  title: String,
  tags: Array,
  summary: String,
});
</script>
