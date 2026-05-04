<template>
  <AsideCard title="快捷查找" :icon="IconSearchBold">
    <template #header>
      <div class="flex items-center">
        <button
          @click="handleReset"
          class="text-bold flex items-center justify-center gap-1 rounded-l-xl border border-color px-2 py-0.5 text-[0.875rem] text-muted transition-colors duration-300 ease-in-out hover:border-brand hover:bg-brand-light hover:text-brand"
        >
          <i-material-symbols-prompt-suggestion-rounded class="h-4 w-4" />
          <span>还原</span>
        </button>
        <button
          @click="handleSubmit"
          class="text-bold flex items-center justify-center gap-1 rounded-r-xl border border-color px-2 py-0.5 text-[0.875rem] text-muted transition-colors duration-300 ease-in-out hover:border-brand hover:bg-brand-light hover:text-brand"
        >
          <i-material-symbols-feature-search class="h-4 w-4" />
          <span>搜索</span>
        </button>
      </div>
    </template>
    <div class="flex flex-col gap-2 sm:gap-2">
      <el-date-picker
        v-model="dateRangeModel"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        :unlink-panels="true"
        :prefix-icon="IconCalendarBlank"
        class="!w-full"
      />
      <el-input
        v-model="searchQueryModel"
        type="text"
        placeholder="搜索标题、概要..."
        class="w-full"
        :prefix-icon="IconTitle"
      />
      <el-select
        tag-type="primary"
        v-model="tagQueryModel"
        multiple
        filterable
        clearable
        :multiple-limit="5"
        no-match-text="暂无匹配标签"
        placeholder="搜索标签(至多5个)..."
        class="w-full"
      >
        <template #prefix>
          <i-material-symbols-bookmarks-rounded
            class="h-[0.9rem] w-[0.9rem] text-main opacity-60"
          />
        </template>
        <el-option
          v-for="tag in allTags"
          :key="tag"
          :value="tag"
          :label="tag"
        />
      </el-select>
      <AllTags :allTags="allTags" v-model="tagQueryModel" />
    </div>
  </AsideCard>
</template>

<script setup>
import { h } from "vue";
import AsideCard from "../../container/AsideCard.vue";

import IconSearchBold from "~icons/ph/magnifying-glass-bold";
import IconCalendarBlank from "~icons/ph/calendar-blank-fill";
import IconTitle from "~icons/material-symbols/title";

import AllTags from "./AllTags.vue";

const dateRangeModel = defineModel("dateRangeModel", Array);
const searchQueryModel = defineModel("searchQueryModel", String);
const tagQueryModel = defineModel("tagQueryModel", Array);

const emit = defineEmits(["reset", "submit"]);

defineProps({
  allTags: Array,
});

const handleReset = () => {
  emit("reset");
};

const handleSubmit = () => {
  emit("submit");
};

// --- 自定义空图标 ---
const customBlankIcon = h("div");
</script>
