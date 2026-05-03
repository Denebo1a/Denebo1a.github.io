<template>
  <el-tooltip
    content="随便挑篇看看~"
    placement="left-start"
    :show-arrow="false"
  >
    <button
      type="button"
      class="group relative h-[50px] w-[50px] overflow-hidden rounded-full border border-color bg-card p-2 text-main shadow-card transition-all duration-300 hover:border-brand hover:bg-brand-light"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="goRandomPost"
    >
      <i-ph-dice-three-fill
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-muted transition-all duration-300 ease-in-out group-hover:rotate-180 group-hover:text-brand"
      />
    </button>
  </el-tooltip>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vitepress";
import { data as allPosts } from "../../../../../blog/posts.data";

const router = useRouter();
const route = useRoute();
const isHovered = ref(false);

const goRandomPost = () => {
  if (!allPosts.length) return;

  const candidates = allPosts.filter((post) => post.url !== route.path);
  const pool = candidates.length > 0 ? candidates : allPosts;

  const randomPost = pool[Math.floor(Math.random() * pool.length)];
  if (!randomPost?.url) return;

  router.go(randomPost.url);
};
</script>
