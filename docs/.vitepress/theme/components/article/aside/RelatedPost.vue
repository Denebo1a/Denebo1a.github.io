<template>
  <AsideCard
    v-if="relatedPosts.length > 0"
    title="相关博客"
    :icon="IconBookOpenBold"
  >
    <div class="flex flex-col">
      <a v-for="post in relatedPosts" :key="post.url" :href="post.url">
        <div
          class="group mb-2 flex flex-col gap-1 rounded-[0.5rem] border border-color p-2 text-muted transition-all duration-300 ease-in-out hover:border-brand hover:bg-brand-light"
        >
          <h4
            class="line-clamp-2 text-sm font-bold transition-colors group-hover:text-main"
          >
            {{ post.title }}
          </h4>
          <div class="flex items-center gap-1 text-xs">
            <i-ph-calendar-blank />
            <span>{{ post.date.string }}</span>
          </div>
        </div>
      </a>
    </div>
  </AsideCard>
</template>

<script setup>
import IconBookOpenBold from "~icons/ph/book-open-bold";
import AsideCard from "../../container/AsideCard.vue";

defineProps({
  relatedPosts: {
    posts: Array,
    default: [],
  },
});
</script>
