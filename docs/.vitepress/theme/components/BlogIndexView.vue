<template>
  <div class="relative w-full px-6 py-4">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="min-h-[160vh] lg:col-span-9">
        <Transition name="posts-fade" mode="out-in">
          <div :key="postsViewKey" class="space-y-8">
            <Empty v-if="filteredPosts.length === 0" />
            <div v-else class="space-y-8">
              <section
                v-for="group in paginatedMonthGroups"
                :key="group.monthKey"
                class="space-y-4"
              >
                <MonthLabel :monthLabel="group.monthLabel" />

                <div
                  v-if="selectedLayout === 'grid'"
                  class="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-3"
                >
                  <div
                    v-for="post in group.posts"
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
                    v-for="post in group.posts"
                    :key="post.url"
                    class="min-w-0"
                  >
                    <ListArticleCard :post="post" @tagClick="handleTagClick" />
                  </div>
                </div>
              </section>
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
import { nextTick, onMounted, watch } from "vue";
import GridArticleCard from "./blogIndex/GridArticleCard.vue";
import ListArticleCard from "./blogIndex/ListArticleCard.vue";
import MonthLabel from "./blogIndex/MonthLabel.vue";

import LayoutMenu from "./blogIndex/Aside/LayoutMenu.vue";
import Filter from "./blogIndex/Aside/Filter.vue";
import CategoryNav from "./blogIndex/Aside/CategoryNav.vue";
import Empty from "./items/Empty.vue";
import { useBlogIndex } from "../composables/useBlogIndex";
import { useScrollPersistence } from "../composables/useScrollPersistence";

const {
  filteredPosts,
  currentPage,
  paginatedMonthGroups,
  filterViewKey,
  postsViewKey,
  selectedLayout,
  handleTagClick,
} = useBlogIndex();

const { scrollToTop } = useScrollPersistence();

let hasMounted = false;

const scrollListToTop = async () => {
  if (!hasMounted) {
    return;
  }

  await nextTick();
  scrollToTop();
};

watch(currentPage, async (nextPage, previousPage) => {
  if (nextPage === previousPage) {
    return;
  }

  await scrollListToTop();
});

watch(
  () => filterViewKey.value,
  async (nextKey, previousKey) => {
    if (!hasMounted || !previousKey || nextKey === previousKey) {
      return;
    }

    await scrollListToTop();
  },
);

onMounted(() => {
  hasMounted = true;
});
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
