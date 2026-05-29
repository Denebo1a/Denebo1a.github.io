<script setup lang="ts">
import { computed } from "vue";
import OverflowMenu from "./OverflowMenu.vue";
import type { BassTabItem } from "../../composables/useBassTabsIndex";
import Category from "../items/Category.vue";
import { useSiteConfig } from "../../composables/useSiteConfig";

const props = defineProps<{
  tab: BassTabItem;
}>();

const { resolveAssetUrl } = useSiteConfig();
const coverUrl = computed(() => resolveAssetUrl(props.tab.cover || ""));
const hasCover = computed(() => Boolean(coverUrl.value));
</script>

<template>
  <div class="perspective-1000 group relative">
    <OverflowMenu :tab="tab" />

    <a :href="tab.url" class="block">
      <div
        class="preserve-3d rotate-crate cursor-pointer rounded-[1rem] p-1 transition-colors transition-transform duration-700 ease-in-out"
      >
        <div
          class="relative aspect-square w-full overflow-hidden rounded-[1rem] border border-color bg-alt shadow-card transition-colors duration-500 ease-in-out hover:border-brand"
        >
          <img
            v-if="hasCover"
            :src="coverUrl"
            :alt="tab.title"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="from-brand/20 to-brand/5 flex h-full w-full items-center justify-center bg-gradient-to-br"
          >
            <i-ph-music-notes-simple-bold
              class="h-12 w-12 text-brand opacity-40"
            />
          </div>

          <Category :category="tab.genre" class="absolute bottom-2 left-2" />
        </div>

        <div class="mt-3 px-0.5">
          <h3
            class="line-clamp-1 text-sm font-bold text-main transition-colors group-hover:text-brand"
          >
            {{ tab.title }}
          </h3>
          <p class="mt-0.5 line-clamp-1 text-xs text-muted">
            {{ tab.artist }}
          </p>
        </div>
      </div>
    </a>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.rotate-crate {
  transform: rotateY(-10deg) rotateX(4deg);
}
.group:hover .rotate-crate {
  transform: rotateY(0deg) rotateX(0deg);
}
</style>
