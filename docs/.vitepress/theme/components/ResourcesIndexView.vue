<script setup>
import { ref } from "vue";
import BassTabsView from "./BassTabsView.vue";
import OtherResourcesView from "./OtherResourcesView.vue";

const tabs = [
  { key: "basstabs", label: "贝斯 TAB 谱" },
  { key: "others", label: "其他资源" },
];

const activeTab = ref("basstabs");
</script>

<template>
  <div class="w-full">
    <!-- 顶部 Switch -->
    <div class="px-6 pb-0 pt-4">
      <div
        class="inline-flex rounded-2xl border border-color bg-card p-1 shadow-card"
      >
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-200"
          :class="
            activeTab === tab.key
              ? 'bg-brand text-white shadow-sm'
              : 'text-muted hover:bg-brand-light hover:text-brand'
          "
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 子视图 -->
    <BassTabsView v-if="activeTab === 'basstabs'" />
    <OtherResourcesView v-else-if="activeTab === 'others'" />
  </div>
</template>

<style scoped></style>
