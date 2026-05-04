<template>
  <AsideCard title="曲目信息" :icon="MusicInfoIcon"> </AsideCard>
</template>

<script setup>
import MusicInfoIcon from "~icons/material-symbols/queue-music-rounded";

import AsideCard from "../container/AsideCard.vue";

defineProps({ title: String, artist: String });
</script>
