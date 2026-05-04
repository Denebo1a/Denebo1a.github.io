<template>
  <div class="rounded-[1rem] border border-color bg-card px-3 py-2 shadow-card">
    <div class="flex items-center">
      <i-material-symbols-filter-alt-outline class="h-6 w-6 text-brand" />
      <Divider :vertical="true" margin="mx-2" />
      <div class="flex items-center gap-2">
        <button
          v-for="genre in genres"
          @click="setSelectedGenre(genre)"
          class="rounded-full px-2 py-1 text-sm font-bold transition-all duration-300 ease-in-out"
          :class="
            selectedGenre === genre
              ? 'bg-brand text-slate-100'
              : 'bg-alt text-muted hover:bg-brand-light hover:text-brand'
          "
        >
          <span class="whitespace-nowrap">{{ genre }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBassTabsIndex } from "../../../composables/useBassTabsIndex";
import Divider from "../../items/Divider.vue";

const { genres, selectedGenre, setSelectedGenre } = useBassTabsIndex();
</script>
