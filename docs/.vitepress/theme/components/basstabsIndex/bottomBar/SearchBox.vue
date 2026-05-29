<template>
  <div class="rounded-full border border-color bg-card px-3 py-1.5 shadow-card">
    <div class="flex items-center gap-2">
      <Transition name="fade-slide">
        <span
          :key="selectedArtist"
          v-if="selectedArtist"
          class="flex items-center gap-1 rounded-full bg-brand-light px-2 py-1 text-sm font-semibold text-brand transition-all"
        >
          <i-material-symbols-artist class="h-4 w-4" />
          <span class="whitespace-nowrap">{{ selectedArtist }}</span>
          <button
            @click="clearArtist"
            class="flex h-4 w-4 items-center justify-center rounded-full text-brand hover:bg-brand hover:text-brand-light"
          >
            <i-ph-x-bold class="h-3 w-3" />
          </button>
        </span>
      </Transition>

      <el-input
        :model-value="searchQuery"
        @update:model-value="setSearchQuery"
        placeholder="搜索歌曲名称/艺术家名称..."
        clearable
        class="!w-[400px]"
      />

      <button
        class="rounded-[1rem] p-1 transition-all duration-200 ease-in-out hover:scale-110 hover:bg-brand-light hover:text-brand active:scale-100"
      >
        <i-ph-magnifying-glass-bold />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBassTabsIndex } from "../../../composables/useBassTabsIndex";

const { searchQuery, selectedArtist, setSearchQuery, clearArtist } =
  useBassTabsIndex();
</script>

<style scoped>
/* 进入状态：从透明、缩小、无宽度开始 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 200px; /* 给一个足够大的预设宽度 */
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-width: 0;
  transform: scale(0.9);
  margin-right: -8px; /* 抵消 gap 的影响，让过渡更紧凑 */
  padding-left: 0;
  padding-right: 0;
}

/* 确保内部文字不会在宽度变小时换行导致闪烁 */
.fade-slide-enter-active span,
.fade-slide-leave-active span {
  white-space: nowrap;
}
</style>
