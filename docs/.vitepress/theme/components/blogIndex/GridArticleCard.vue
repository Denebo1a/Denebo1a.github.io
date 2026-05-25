<template>
  <article
    @click="handleArticleClick"
    :key="post.url"
    class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1rem] border border-color bg-card shadow-card transition-colors duration-300 ease-in-out hover:border-brand"
  >
    <div class="aspect-[16/9] overflow-hidden bg-alt">
      <img :src="post.cover" class="h-full w-full object-cover" />
    </div>

    <div class="flex flex-1 flex-col border-t border-color p-3 sm:p-5">
      <div class="mb-2 flex items-center gap-2">
        <Category :category="post.category" />
        <Date :date="post.date.string" />
      </div>

      <span class="mb-2 line-clamp-2 text-lg font-bold text-main">
        {{ post.title }}
      </span>

      <span class="mb-3 line-clamp-2 text-[0.8rem] leading-relaxed text-muted">
        {{ post.summary }}
      </span>

      <div class="mt-auto flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Tag
            v-for="tag in post.tags.slice(0, 2)"
            :key="tag"
            @click.stop="handleTagClick(tag)"
            class="flex cursor-pointer items-center gap-1 rounded-full border border-color bg-card px-2 py-1 text-[0.7rem] font-bold text-muted hover:border-brand hover:bg-brand-light hover:text-brand"
            :tag="tag"
          />
          <i-ph-dots-three-outline-fill
            v-if="post.tags.length > 2"
            class="h-4 w-4 text-muted opacity-50"
          />
        </div>
        <div class="flex items-center justify-end gap-2">
          <Count type="comment"
            ><span class="artalk-comment-count"></span
          ></Count>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vitepress";

import Artalk from "artalk";

import Tag from "../items/Tag.vue";
import Category from "../items/Category.vue";
import Date from "../items/Date.vue";
import Count from "../items/Count.vue";
import { useSiteConfig } from "../../composables/useSiteConfig";

const router = useRouter();
const { artalkServer } = useSiteConfig();

const props = defineProps({ post: Object });

const emit = defineEmits(["tagClick"]);

onMounted(() => {
  Artalk.loadCountWidget({
    server: artalkServer.value,
    site: "DeneBlog",
    countEl: ".artalk-comment-count",
  });
});

const handleTagClick = (tag) => {
  emit("tagClick", tag);
};

const handleArticleClick = () => {
  router.go(props.post.url);
};
</script>
