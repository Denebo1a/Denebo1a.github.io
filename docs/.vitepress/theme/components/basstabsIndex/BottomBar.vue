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
      <GenreFilter />
      <SearchBox />
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vitepress";

import GenreFilter from "./bottomBar/GenreFilter.vue";
import SearchBox from "./bottomBar/SearchBox.vue";

const route = useRoute();
const bottomOffset = ref(12);

let scrollRoot = null;
let footer = null;

const BASE_OFFSET = 12;
const FOOTER_GAP = 0;

const updateBottomOffset = () => {
  if (!scrollRoot || !footer) {
    bottomOffset.value = BASE_OFFSET;
    return;
  }

  const rootRect = scrollRoot.getBoundingClientRect();
  const footerRect = footer.getBoundingClientRect();

  const overlap = rootRect.bottom - footerRect.top;

  if (overlap > 0) {
    bottomOffset.value = BASE_OFFSET + overlap + FOOTER_GAP;
  } else {
    bottomOffset.value = BASE_OFFSET;
  }
};

const bindScrollListeners = async () => {
  await nextTick();

  scrollRoot?.removeEventListener("scroll", updateBottomOffset);
  window.removeEventListener("resize", updateBottomOffset);

  scrollRoot = document.getElementById("site-main-scroll");
  footer = document.getElementById("site-footer");

  scrollRoot?.addEventListener("scroll", updateBottomOffset, { passive: true });
  window.addEventListener("resize", updateBottomOffset);

  updateBottomOffset();
};

onMounted(() => {
  bindScrollListeners();
});

onBeforeUnmount(() => {
  scrollRoot?.removeEventListener("scroll", updateBottomOffset);
  window.removeEventListener("resize", updateBottomOffset);
});

watch(
  () => route.path,
  async () => {
    await bindScrollListeners();
  },
);
</script>
