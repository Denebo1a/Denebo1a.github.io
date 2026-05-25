<template>
  <AsideCard
    v-if="relatedPosts.length > 0"
    title="相关博客"
    :icon="IconBookOpenBold"
  >
    <div class="flex flex-col">
      <a v-for="post in relatedPosts" :key="post.url" :href="post.url">
        <div
          class="group mb-2 flex flex-col gap-1 rounded-[0.5rem] border border-color p-2 transition-all duration-300 ease-in-out hover:border-brand hover:bg-brand-light"
        >
          <span
            class="line-clamp-2 text-sm font-bold text-main transition-colors group-hover:text-main"
          >
            {{ post.title }}
          </span>
          <div class="flex items-center gap-2">
            <Date :date="post.date.string" size="small" />
            <Count type="comment" size="small"
              ><span
                class="artalk-comment-count"
                :data-page-key="post.url"
              ></span
            ></Count>
          </div>
        </div>
      </a>
    </div>
  </AsideCard>
</template>

<script setup>
import { onMounted } from "vue";
import Artalk from "artalk";

import IconBookOpenBold from "~icons/ph/book-open-bold";
import AsideCard from "../../container/AsideCard.vue";
import Date from "../../items/Date.vue";
import Count from "../../items/Count.vue";
import { useSiteConfig } from "../../../composables/useSiteConfig";

const { artalkServer } = useSiteConfig();

onMounted(() => {
  Artalk.loadCountWidget({
    server: artalkServer.value,
    site: "DeneBlog",
    countEl: ".artalk-comment-count",
    statPageKeyAttr: "data-page-key",
  });
});

defineProps({
  relatedPosts: {
    posts: Array,
    default: [],
  },
});
</script>
