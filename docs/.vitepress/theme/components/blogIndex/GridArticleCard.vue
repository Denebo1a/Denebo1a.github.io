<template>
  <article
    @click="handleArticleClick"
    :key="post.url"
    class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1rem] border border-color bg-card shadow-card transition-all duration-300 ease-in-out hover:border-brand"
  >
    <div class="aspect-[16/9] overflow-hidden bg-alt">
      <img :src="post.cover" class="h-full w-full object-cover" />
    </div>

    <div class="flex flex-1 flex-col border-t border-color p-3 sm:p-5">
      <div class="mb-2 flex items-center gap-4">
        <Category :category="post.category" />
        <Date :date="post.date.string" />
      </div>

      <h3 class="mb-2 line-clamp-2 text-lg font-bold text-main">
        {{ post.title }}
      </h3>

      <p class="mb-3 line-clamp-2 text-[0.8rem] leading-relaxed text-muted">
        {{ post.summary }}
      </p>

      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Tag
            v-for="tag in post.tags.slice(0, 2)"
            :key="tag"
            @click="handleTagClick(tag)"
            class="flex cursor-pointer items-center gap-1 rounded-full border border-color bg-card px-2 py-1 text-[0.7rem] font-bold text-muted hover:border-brand hover:bg-brand-light hover:text-brand"
            :tag="tag"
          />
          <i-ph-dots-three-outline-fill
            v-if="post.tags.length > 2"
            class="h-4 w-4 text-muted opacity-50"
          />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import Tag from "../items/Tag.vue";
import { useRouter } from "vitepress";

import Category from "../items/Category.vue";
import Date from "../items/Date.vue";

const router = useRouter();

const props = defineProps({ post: Object });

const emit = defineEmits(["tagClick"]);

const handleTagClick = (tag) => {
  emit("tagClick", tag);
};

const handleArticleClick = () => {
  router.go(props.post.url);
};
</script>
