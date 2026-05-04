<template>
  <article
    :key="post.url"
    @click="handleArticleClick"
    class="group flex cursor-pointer flex-col overflow-hidden rounded-[1rem] border border-color bg-card shadow-card transition-colors duration-300 hover:border-brand md:h-48 md:flex-row"
  >
    <div
      class="aspect-video w-full shrink-0 overflow-hidden bg-alt md:aspect-auto md:w-72 lg:w-80"
    >
      <img :src="post.cover" class="h-full w-full object-cover" />
    </div>

    <div class="flex flex-1 flex-col p-3 sm:p-5">
      <div class="mb-2 flex items-center gap-3">
        <Category :category="post.category" />
        <Date :date="post.date.string" />
      </div>

      <h3
        class="mb-2 line-clamp-2 text-xl font-bold text-main transition-colors sm:text-xl"
      >
        {{ post.title }}
      </h3>

      <p
        class="mb-2 line-clamp-2 text-sm leading-relaxed text-muted sm:line-clamp-2"
      >
        {{ post.summary }}
      </p>
      <div class="mt-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Tag
            v-for="tag in post.tags.slice(0, 5)"
            :key="tag"
            @click.stop="handleTagClick(tag)"
            :tag="tag"
          />
          <i-ph-dots-three-outline-fill
            v-if="post.tags.length > 5"
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
