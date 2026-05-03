<template>
  <AsideCard title="视图布局" :icon="IconLayoutBold">
    <div class="flex shrink-0 items-center justify-between gap-2">
      <div class="flex shrink-0 items-center gap-2">
        <button
          v-for="layout in layoutTypes"
          :key="layout.type"
          @click="changeLayout(layout.type)"
          class="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300"
          :class="{
            'bg-brand-light text-brand': props.layout === layout.type,
            'bg-card text-muted hover:bg-alt': props.layout !== layout.type,
          }"
        >
          <component :is="layout.icon" class="h-5 w-5" />
        </button>
      </div>

      <div class="flex shrink-0 items-center">
        <el-select v-model="sort" class="!w-40">
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
  </AsideCard>
</template>

<script setup>
import AsideCard from "../../container/AsideCard.vue";

import columnIcon from "~icons/material-symbols/view-apps-rounded";
import rowIcon from "~icons/material-symbols/table-rows-rounded";
import dateAscIcon from "~icons/ph/sort-ascending-bold";
import dateDescIcon from "~icons/ph/sort-descending-bold";
import IconLayoutBold from "~icons/ph/layout-bold";

const props = defineProps({
  layout: String,
});
const emit = defineEmits(["update:layout"]);

const sort = defineModel("sort");

const changeLayout = (newLayout) => {
  emit("update:layout", newLayout);
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
</script>
