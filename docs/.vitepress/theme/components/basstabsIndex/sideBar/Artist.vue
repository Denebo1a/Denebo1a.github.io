<template>
  <el-tooltip :content="artist" placement="left" :show-after="200">
    <button
      @click="toggleArtist(artist)"
      class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold transition-all duration-200"
      :class="
        selectedArtist === artist
          ? 'scale-105 bg-brand shadow-brand ring-1 ring-brand'
          : 'bg-alt text-main hover:bg-brand-light hover:text-brand'
      "
    >
      <img
        v-if="!avatarLoadFailed"
        :src="avatarUrl"
        :alt="artist"
        class="h-full w-full object-cover"
        @error="avatarLoadFailed = true"
      />
      <span v-else>{{ initial }}</span>
    </button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useBassTabsIndex } from "../../../composables/useBassTabsIndex";

const props = defineProps<{
  artist: string;
}>();

const { selectedArtist, toggleArtist } = useBassTabsIndex();
const avatarLoadFailed = ref(false);

const initial = computed(() => {
  if (!props.artist) return "?";
  return props.artist.trim()[0]?.toUpperCase() ?? "?";
});

const artistSlug = computed(() =>
  props.artist
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, ""),
);

const avatarUrl = computed(() => `/basstabs/artists/${artistSlug.value}.webp`);

watch(
  () => props.artist,
  () => {
    avatarLoadFailed.value = false;
  },
);
</script>
