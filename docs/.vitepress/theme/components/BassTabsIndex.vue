<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";
import BasstabCard from "./basstabsIndex/BasstabCard.vue";
import { useBassTabsIndex } from "../composables/useBassTabsIndex";
import { useScrollPersistence } from "../composables/useScrollPersistence";
import Empty from "./items/Empty.vue";

const {
  filteredTabs,
  paginatedTabs,
  currentPage,
  filterViewKey,
  tabsViewKey,
  resetBassTabsIndexState,
} = useBassTabsIndex();

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

onBeforeUnmount(() => {
  resetBassTabsIndexState();
});
</script>

<template>
  <div class="relative flex min-h-[160vh] w-full gap-0">
    <div class="min-w-0 flex-1 pt-6">
      <div class="p-6">
        <Transition name="posts-fade" mode="out-in">
          <div :key="tabsViewKey">
            <Empty v-if="filteredTabs.length === 0" />

            <div
              v-else
              class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            >
              <BasstabCard
                v-for="tab in paginatedTabs"
                :key="tab.url"
                :tab="tab"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

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
