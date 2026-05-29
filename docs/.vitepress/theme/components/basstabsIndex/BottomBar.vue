<template>
  <div
    :key="route.path"
    class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 duration-200"
    :style="{
      bottom: `${bottomOffset}px`,
      transitionProperty: 'bottom, opacity',
    }"
  >
    <div class="flex items-center gap-4">
      <Pagination />
      <GenreFilter />
      <SearchBox />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vitepress";

import { useFooterAwareBottomOffset } from "../../composables/useFooterAwareBottomOffset";
import Pagination from "./bottomBar/Pagination.vue";
import GenreFilter from "./bottomBar/GenreFilter.vue";
import SearchBox from "./bottomBar/SearchBox.vue";

const route = useRoute();
const { bottomOffset } = useFooterAwareBottomOffset();
</script>
