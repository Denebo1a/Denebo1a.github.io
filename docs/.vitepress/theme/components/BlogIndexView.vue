<template>
  <div class="relative w-full px-6 py-4">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="min-h-[160vh] lg:col-span-9">
        <Transition name="posts-fade" mode="out-in">
          <div :key="postsViewKey">
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
        </Transition>
      </div>

      <aside class="sticky top-4 space-y-4 self-start lg:col-span-3">
        <LayoutMenu
          v-model:layout="selectedLayout"
          v-model:sort="selectedSort"
        />
        <Filter
          @reset="handleReset"
          @submit="handleSearch"
          v-model:dateRangeModel="dateRangeInput"
          v-model:searchQueryModel="searchQueryInput"
          v-model:tagQueryModel="tagQueryInput"
          :allTags="tags"
        />
        <CategoryNav
          :categories="categories"
          v-model:selectedCat="selectedCategory"
        />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { data as allPosts } from "../../../blog/posts.data";

import GridArticleCard from "./blogIndex/GridArticleCard.vue";
import ListArticleCard from "./blogIndex/ListArticleCard.vue";

import LayoutMenu from "./blogIndex/Aside/LayoutMenu.vue";
import Filter from "./blogIndex/Aside/Filter.vue";
import CategoryNav from "./blogIndex/Aside/CategoryNav.vue";

const searchQueryInput = ref("");
const searchQuery = ref("");
const tagQueryInput = ref([]);
const tagQuery = ref([]);
const dateRangeInput = ref([]);
const dateRange = ref([]);
const selectedCategory = ref("全部");

const handleSearch = () => {
  searchQuery.value = searchQueryInput.value;
  tagQuery.value = tagQueryInput.value;
  dateRange.value = dateRangeInput.value;
};

const handleReset = () => {
  searchQueryInput.value = "";
  tagQueryInput.value = [];
  dateRangeInput.value = [];
  handleSearch();
};

const selectedLayout = ref("grid");
const selectedSort = ref("date");

const categories = computed(() => {
  // 1. 遍历一次 allPosts，统计每个分类的数量
  const categoryCounts = allPosts.reduce((acc, post) => {
    const cat = post.category;
    if (cat) {
      acc[cat] = (acc[cat] || 0) + 1;
    }
    return acc;
  }, {});

  // 2. 将统计对象转换为目标数组，并把“全部”放在首位
  const result = [
    { category: "全部", count: allPosts.length },
    ...Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    })),
  ];

  return result;
});

const tags = computed(() => {
  const tags = new Set(allPosts.flatMap((p) => p.tags || []));
  return [...tags];
});

const filteredPosts = computed(() => {
  let result = allPosts.filter((post) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(q) ||
      post.summary?.toLowerCase().includes(q);

    const t = tagQuery.value;
    const matchesTags = t.every((queryTag) =>
      post.tags?.some((postTag) =>
        postTag.toLowerCase().includes(queryTag.toLowerCase()),
      ),
    );

    const matchesCat =
      selectedCategory.value === "全部" ||
      post.category === selectedCategory.value;

    let matchesDate = true;
    const postTime = post.date.time;

    if (dateRange.value[0]) {
      const startTime = new Date(dateRange.value[0]).getTime();
      if (postTime < startTime) matchesDate = false;
    }
    if (dateRange.value[1]) {
      const endTime = new Date(dateRange.value[1]).getTime() + 86399999;
      if (postTime > endTime) matchesDate = false;
    }

    return matchesSearch && matchesTags && matchesCat && matchesDate;
  });

  return result.sort((a, b) => {
    return selectedSort.value === "date-asc"
      ? a.date.time - b.date.time
      : b.date.time - a.date.time;
  });
});

const postsViewKey = computed(() =>
  JSON.stringify({
    layout: selectedLayout.value,
    sort: selectedSort.value,
    category: selectedCategory.value,
    search: searchQuery.value,
    tags: tagQuery.value,
    dateRange: dateRange.value,
    posts: filteredPosts.value.map((post) => post.url),
  }),
);

const handleTagClick = (tag) => {
  tagQueryInput.value = [tag];
  handleSearch();
};
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
