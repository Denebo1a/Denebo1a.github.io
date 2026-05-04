<template>
  <AsideCard title="按类型筛选" :icon="IconFilter">
    <nav class="space-y-1">
      <div
        v-for="cat in categories"
        @click="setSelectedCategory(cat.category)"
        :key="cat.category"
        class="group flex cursor-pointer items-center justify-between rounded-md px-3 py-1 transition-colors duration-300 ease-in-out"
        :class="{
          'bg-brand-light': selectedCategory === cat.category,
          'hover:bg-alt': selectedCategory !== cat.category,
        }"
      >
        <span
          class="text-sm font-semibold transition-colors"
          :class="{
            'text-brand': selectedCategory === cat.category,
            'text-muted group-hover:text-brand': selectedCategory !== cat.category,
          }"
        >
          {{ cat.category }}
        </span>
        <span
          class="inline-flex min-w-[1.5em] items-center justify-center rounded-full bg-alt px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums transition-colors"
          :class="{
            'bg-brand text-slate-100': selectedCategory === cat.category,
            'text-muted': selectedCategory !== cat.category,
          }"
        >
          {{ cat.count }}
        </span>
      </div>
    </nav>
  </AsideCard>
</template>

<script setup>
import AsideCard from "../../container/AsideCard.vue";

import IconFilter from "~icons/material-symbols/filter-alt-outline";
import { useBlogIndex } from "../../../composables/useBlogIndex";

const { categories, selectedCategory, setSelectedCategory } = useBlogIndex();
</script>
