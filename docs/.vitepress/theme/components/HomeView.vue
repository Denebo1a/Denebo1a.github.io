<template>
  <div class="grid grid-cols-1 items-start gap-6 px-6 py-4 lg:grid-cols-12">
    <aside class="flex flex-col gap-4 lg:col-span-4">
      <ProfileCard />
      <LatestUpdates />
    </aside>

    <OverView />
  </div>
</template>

<script setup>
import ProfileCard from "./homeView/ProfileCard.vue";
import LatestUpdates from "./homeView/LatestUpdates.vue";
import OverView from "./homeView/OverView.vue";
</script>
