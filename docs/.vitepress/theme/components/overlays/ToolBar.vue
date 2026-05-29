<template>
  <div
    class="fixed bottom-4 right-4 z-40 flex h-auto w-16 flex-col items-center justify-center gap-2 p-3 transition-[bottom] duration-200"
    :style="{ bottom: `${bottomOffset}px` }"
  >
    <ThemeSwithcer />
    <GoRandomButton />
    <BackTopButton />
  </div>
</template>

<script setup>
import GoRandomButton from "./toolBarButtons/GoRandomButton.vue";
import BackTopButton from "./toolBarButtons/BackTopButton.vue";
import ThemeSwithcer from "./toolBarButtons/ThemeSwithcer.vue";
import { useFooterAwareBottomOffset } from "../../composables/useFooterAwareBottomOffset";

const { bottomOffset } = useFooterAwareBottomOffset();
</script>
