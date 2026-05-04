<template>
  <div class="relative w-full px-6 py-4">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="min-h-[160vh] lg:col-span-9">
        <Transition name="posts-fade" mode="out-in">
          <div :key="postsViewKey">
            <Empty v-if="filteredPosts.length === 0" />
            <div v-else>
              <div
                v-if="selectedLayout === 'grid'"
                class="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3"
              >
                <div
                  v-for="post in filteredPosts"
                  :key="post.url"
                  class="h-full min-w-0"
                >
                  <GridArticleCard :post="post" @tagClick="handleTagClick" />
                </div>
              </div>
              <div
                v-else-if="selectedLayout === 'list'"
                class="flex flex-col gap-4"
              >
                <div
                  v-for="post in filteredPosts"
                  :key="post.url"
                  class="min-w-0"
                >
                  <ListArticleCard :post="post" @tagClick="handleTagClick" />
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <aside class="sticky top-4 space-y-4 self-start lg:col-span-3">
        <LayoutMenu />
        <Filter />
        <CategoryNav />
      </aside>
    </div>
  </div>
</template>

<script setup>
import GridArticleCard from "./blogIndex/GridArticleCard.vue";
import ListArticleCard from "./blogIndex/ListArticleCard.vue";

import LayoutMenu from "./blogIndex/Aside/LayoutMenu.vue";
import Filter from "./blogIndex/Aside/Filter.vue";
import CategoryNav from "./blogIndex/Aside/CategoryNav.vue";
import Empty from "./items/Empty.vue";
import { useBlogIndex } from "../composables/useBlogIndex";

const { filteredPosts, postsViewKey, selectedLayout, handleTagClick } =
  useBlogIndex();
</script>

<style scoped>
.posts-fade-enter-active,
.posts-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.posts-fade-enter-from,
.posts-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
