<template>
  <AsideCard :title="title" :icon="MusicInfoIcon">
    <div class="flex items-center gap-2">
      <MusicInfoItem label="艺术家" :value="artist" :icon="ArtistIcon" />
    </div>
  </AsideCard>
</template>

<script setup>
import MusicInfoIcon from "~icons/material-symbols/queue-music-rounded";
import ArtistIcon from "~icons/material-symbols/artist";

import AsideCard from "../container/AsideCard.vue";
import MusicInfoItem from "../items/MusicInfoItem.vue";

defineProps({ title: String, artist: String });
</script>
