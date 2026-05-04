<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import BasstabCard from './basstabsIndex/BasstabCard.vue'
import { useBassTabsIndex } from '../composables/useBassTabsIndex'

const { filteredTabs, resetBassTabsIndexState } = useBassTabsIndex()

onBeforeUnmount(() => {
  resetBassTabsIndexState()
})
</script>

<template>
  <div class="relative flex min-h-[160vh] w-full gap-0">
    <div class="min-w-0 flex-1 pt-6">
      <div class="p-6">
        <p v-if="filteredTabs.length === 0" class="py-16 text-center text-muted">
          暂无匹配的 TAB 谱
        </p>

        <div
          v-else
          class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          <BasstabCard v-for="tab in filteredTabs" :key="tab.url" :tab="tab" />
        </div>
      </div>
    </div>
  </div>
</template>
