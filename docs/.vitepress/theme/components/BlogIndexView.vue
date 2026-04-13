<script setup>
import { ref, computed, h } from "vue";
import { data as allPosts } from "../../../blog/posts.data";
import { formatDate } from "../utils/format";

import columnIcon from "~icons/material-symbols/view-apps-rounded";
import rowIcon from "~icons/material-symbols/table-rows-rounded";
import dateAscIcon from "~icons/ph/sort-ascending-bold";
import dateDescIcon from "~icons/ph/sort-descending-bold";

// --- 状态管理 ---
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

// --- 布局类型 ---
const layoutTypes = [
  {
    type: "grid",
    icon: columnIcon,
  },
  {
    type: "list",
    icon: rowIcon,
  },
];
const selectedLayout = ref("grid");

// --- 按日期排序 ---
const sortOptions = [
  {
    label: "按日期降序",
    value: "date",
    icon: dateDescIcon,
  },
  {
    label: "按日期升序",
    value: "date-asc",
    icon: dateAscIcon,
  },
];
const selectedSort = ref("date");

// --- 提取所有不重复的分类 ---
const categories = computed(() => {
  const cats = new Set(allPosts.map((p) => p.category).filter(Boolean));
  return ["全部", ...Array.from(cats)];
});

// --- 提取所有不重复的标签 ---
const tags = computed(() => {
  const tags = new Set(allPosts.flatMap((p) => p.tags || []));
  return [...tags];
});

// --- 搜索 + 分类过滤 + 日期筛选 + 排序 ---
const filteredPosts = computed(() => {
  // 第一步：先过滤 (Filter)
  let result = allPosts.filter((post) => {
    // 1. 关键字搜索
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

    // 2. 分类筛选
    const matchesCat =
      selectedCategory.value === "全部" ||
      post.category === selectedCategory.value;

    // 3. 日期区间筛选
    let matchesDate = true;
    // 兼容取时间戳
    const postTime = new Date(post.date.string || post.date).getTime();

    if (dateRange.value[0]) {
      const startTime = new Date(dateRange.value[0]).getTime();
      if (postTime < startTime) matchesDate = false;
    }
    if (dateRange.value[1]) {
      // 加上 86399999 毫秒 (一天的毫秒数减一)，确保能包含结束日期当天的文章
      const endTime = new Date(dateRange.value[1]).getTime() + 86399999;
      if (postTime > endTime) matchesDate = false;
    }

    return matchesSearch && matchesTags && matchesCat && matchesDate;
  });

  // 第二步：后排序 (Sort)
  return result.sort((a, b) => {
    const timeA = new Date(a.date.string || a.date).getTime();
    const timeB = new Date(b.date.string || b.date).getTime();

    // 根据选择的值返回升序或降序
    return selectedSort.value === "date-asc" ? timeA - timeB : timeB - timeA;
  });
});

const handleTagClick = (tag) => {
  tagQueryInput.value = [tag];
  handleSearch();
};

// --- 自定义图标 ---
const customBlankIcon = h("div");
</script>

<template>
  <div class="relative w-full px-6 py-4">
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div class="lg:col-span-9">
        <div
          v-if="selectedLayout === 'grid'"
          class="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <article
            v-for="post in filteredPosts"
            :key="post.url"
            class="group flex flex-col overflow-hidden rounded-[2rem] border border-color bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-brand"
          >
            <div class="aspect-[16/9] overflow-hidden bg-alt">
              <img
                :src="post.cover"
                class="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>

            <div class="flex flex-1 flex-col border-t border-color p-3 sm:p-5">
              <div class="mb-2 flex items-center gap-3">
                <span
                  class="rounded-full bg-brand px-2 py-0.5 text-[0.75rem] font-bold uppercase tracking-widest text-slate-100"
                >
                  {{ post.category }}
                </span>
                <span class="text-[0.8rem] font-bold text-muted opacity-60">
                  {{ formatDate(post.date).string }}
                </span>
              </div>

              <h3 class="mb-2 line-clamp-2 text-lg font-bold text-main">
                {{ post.title }}
              </h3>

              <p
                class="mb-3 line-clamp-4 text-[0.8rem] leading-relaxed text-muted"
              >
                {{ post.summary }}
              </p>

              <div class="mt-auto flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span
                    v-for="tag in post.tags.slice(0, 2)"
                    :key="tag"
                    @click="handleTagClick(tag)"
                    class="cursor-pointer rounded-full bg-alt px-2 py-1 text-[0.7rem] font-bold text-muted hover:bg-brand-light hover:text-brand"
                  >
                    #{{ tag }}
                  </span>
                  <i-ph-dots-three-outline-fill
                    v-if="post.tags.length > 2"
                    class="h-4 w-4 text-muted opacity-50"
                  />
                </div>
                <a
                  :href="post.url"
                  class="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.8rem] font-bold text-brand transition-all hover:gap-2 hover:bg-brand-light"
                  ><span class="min-w-0 whitespace-nowrap">阅读全文</span>
                  <i-ph-read-cv-logo-fill class="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
        <div v-else-if="selectedLayout === 'list'" class="flex flex-col gap-4">
          <article
            v-for="post in filteredPosts"
            :key="post.url"
            class="group flex flex-col overflow-hidden rounded-[2rem] border border-color bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-brand md:h-48 md:flex-row"
          >
            <div
              class="aspect-video w-full shrink-0 overflow-hidden bg-alt md:aspect-auto md:w-72 lg:w-80"
            >
              <img
                :src="post.cover"
                class="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
            </div>

            <div class="flex flex-1 flex-col p-3 sm:p-5">
              <div class="mb-2 flex items-center gap-3">
                <span
                  class="rounded-full bg-brand px-2 text-[0.75rem] font-bold uppercase tracking-widest text-slate-100"
                >
                  {{ post.category }}
                </span>
                <span class="text-[0.8rem] font-bold text-muted opacity-60">
                  {{ formatDate(post.date).string }}
                </span>
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
                  <span
                    v-for="tag in post.tags.slice(0, 5)"
                    :key="tag"
                    @click="handleTagClick(tag)"
                    class="cursor-pointer rounded-full bg-alt px-2 py-1 text-[0.7rem] font-bold text-muted hover:bg-brand-light hover:text-brand"
                  >
                    #{{ tag }}
                  </span>
                  <i-ph-dots-three-outline-fill
                    v-if="post.tags.length > 5"
                    class="h-4 w-4 text-muted opacity-50"
                  />
                </div>
                <a
                  :href="post.url"
                  class="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.8rem] font-bold text-brand transition-all hover:gap-2 hover:bg-brand-light"
                  ><span class="min-w-0 whitespace-nowrap">阅读全文</span>
                  <i-ph-read-cv-logo-fill class="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="sticky top-20 space-y-4 self-start lg:col-span-3">
        <div
          class="rounded-[1.5rem] border border-color bg-card p-4 shadow-card"
        >
          <div
            class="mb-3 flex items-center justify-between border-b border-color pb-2"
          >
            <div class="flex items-center gap-2">
              <i-ph-layout-bold class="h-4 w-4 text-brand" />
              <h4 class="font-bold text-main">视图布局</h4>
            </div>
          </div>
          <div class="flex shrink-0 items-center justify-between gap-2">
            <div class="flex shrink-0 items-center gap-2">
              <button
                v-for="layout in layoutTypes"
                :key="layout.type"
                @click="selectedLayout = layout.type"
                class="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300"
                :class="{
                  'bg-brand-light text-brand ring-2 ring-brand':
                    selectedLayout === layout.type,
                  'bg-card text-muted hover:bg-brand-light hover:text-brand':
                    selectedLayout !== layout.type,
                }"
              >
                <component :is="layout.icon" class="h-5 w-5" />
              </button>
            </div>

            <div class="flex shrink-0 items-center">
              <el-select v-model="selectedSort" class="!w-40">
                <template #label="{ label, value }">
                  <div class="flex items-center gap-1">
                    <component
                      :is="sortOptions.find((o) => o.value === value)?.icon"
                      class="h-5 w-5"
                    />
                    {{ label }}
                  </div>
                </template>
                <el-option
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  :value="opt.value"
                  :label="opt.label"
                >
                  <div class="flex items-center gap-1">
                    <component :is="opt.icon" class="h-5 w-5" />
                    {{ opt.label }}
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div
          class="rounded-[1.5rem] border border-color bg-card p-4 shadow-card"
        >
          <div
            class="mb-3 flex items-center justify-between border-b border-color pb-2"
          >
            <div class="flex items-center gap-2">
              <i-ph-magnifying-glass-bold class="h-4 w-4 text-brand" />
              <h4 class="font-bold text-main">快捷查找</h4>
            </div>
            <div class="flex items-center">
              <button
                @click="handleReset"
                class="text-bold flex items-center justify-center gap-1 rounded-l-xl border border-color px-2 py-1 text-[0.875rem] text-muted transition-colors duration-300 hover:bg-brand-light hover:text-brand"
              >
                <i-material-symbols-prompt-suggestion-rounded class="h-4 w-4" />
                <span>还原</span>
              </button>
              <button
                @click="handleSearch"
                class="text-bold flex items-center justify-center gap-1 rounded-r-xl border border-color px-2 py-1 text-[0.875rem] text-muted transition-colors duration-300 hover:bg-brand-light hover:text-brand"
              >
                <i-material-symbols-feature-search class="h-4 w-4" />
                <span>搜索</span>
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-2 sm:gap-2">
            <el-date-picker
              v-model="dateRangeInput"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :unlink-panels="true"
              :prefix-icon="customBlankIcon"
              class="!w-full"
            />

            <el-input
              v-model="searchQueryInput"
              type="text"
              placeholder="搜索标题、概要..."
              class="w-full"
            />
            <el-select
              tag-type="primary"
              v-model="tagQueryInput"
              multiple
              filterable
              clearable
              :multiple-limit="5"
              no-match-text="暂无匹配标签"
              placeholder="搜索标签(至多5个)..."
              class="w-full"
            >
              <el-option
                v-for="tag in tags"
                :key="tag"
                :value="tag"
                :label="tag"
              />
            </el-select>
          </div>
        </div>

        <div
          class="rounded-[1.5rem] border border-color bg-card p-4 shadow-card transition-colors duration-300"
        >
          <div class="mb-3 flex items-center gap-2 border-b border-color pb-3">
            <i-material-symbols-filter-alt-outline class="h-5 w-5 text-brand" />
            <h4 class="font-bold text-main">按类型筛选</h4>
          </div>
          <nav class="space-y-1">
            <div
              v-for="cat in categories"
              @click="selectedCategory = cat"
              :key="cat"
              class="group flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5"
              :class="{
                'bg-brand-light': selectedCategory === cat,
                'hover:bg-alt': selectedCategory !== cat,
              }"
            >
              <span
                class="text-sm font-semibold transition-colors"
                :class="{
                  'text-brand': selectedCategory === cat,
                  'text-muted group-hover:text-brand': selectedCategory !== cat,
                }"
              >
                {{ cat }}
              </span>
              <span
                class="inline-flex items-center justify-center rounded-full bg-alt px-2 py-0.5 text-[0.65rem] font-bold transition-colors"
                :class="{
                  'bg-brand text-slate-100': selectedCategory === cat,
                  'text-muted group-hover:bg-brand group-hover:text-slate-100':
                    selectedCategory !== cat,
                }"
              >
                {{
                  cat === "全部"
                    ? allPosts.length
                    : allPosts.filter((p) => p.category === cat).length
                }}
              </span>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped></style>
