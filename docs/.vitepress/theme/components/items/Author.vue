<script setup>
import { computed } from "vue";
import { useSiteConfig } from "../../composables/useSiteConfig";

const { resolveAssetUrl } = useSiteConfig();
const avatarUrl = computed(() => resolveAssetUrl("/shared/avatar.png"));
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center text-sm font-medium text-muted">
      <i-material-symbols-alternate-email-rounded />
      <span>2026 至今 by</span>
    </div>

    <span
      class="group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full p-[2px] transition-all duration-300 hover:scale-105 hover:bg-brand-light hover:text-brand"
    >
      <span
        class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--color-brand)_30%,transparent_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      ></span>
      <div
        class="relative z-10 flex inline-flex h-full w-full items-center justify-center gap-1 rounded-full border border-color bg-card py-1 pl-1 pr-2 font-medium text-main shadow-card group-hover:shadow-none"
      >
        <img :src="avatarUrl" alt="Denebora" class="h-6 w-6 rounded-full" />
        Denebora
      </div>
    </span>
  </div>
</template>
