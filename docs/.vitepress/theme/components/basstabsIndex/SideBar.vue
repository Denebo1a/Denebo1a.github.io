<template>
  <div
    class="fixed left-6 top-1/2 z-40 flex max-h-[calc(100vh-5rem)] -translate-y-1/2 flex-col items-center gap-2 overflow-y-auto rounded-[1rem] border border-color bg-card p-2 shadow-card"
  >
    <i-material-symbols-artist class="h-5 w-5 text-brand" />
    <Divider :soild="true" margin="mx-0 my-0" />

    <Artist v-for="artist in artists" :key="artist" :artist="artist" />

    <div class="mt-2 h-1 w-5 rounded-full bg-slate-300" />
  </div>
</template>

<script setup lang="ts">
import Artist from "./sideBar/Artist.vue";
import { useBassTabsIndex } from "../../composables/useBassTabsIndex";
import Divider from "../items/Divider.vue";

const { artists } = useBassTabsIndex();
</script>
