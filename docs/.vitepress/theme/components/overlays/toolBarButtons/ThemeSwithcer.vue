<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useTheme } from "../../../composables/useTheme";

const { themes, currentTheme, setTheme, initTheme } = useTheme();
const isOpen = ref(false);
const dropdownRef = ref(null);

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  initTheme();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const selectTheme = (id) => {
  setTheme(id);
  isOpen.value = false;
};

const activeTheme = computed(
  () => themes.find((t) => t.id === currentTheme.value) || themes[0],
);
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <el-tooltip content="切换主题" placement="left-start" :show-arrow="false">
      <button
        @click="isOpen = !isOpen"
        type="button"
        class="group relative h-[50px] w-[50px] overflow-hidden rounded-full border border-color bg-card p-2 text-main shadow-card transition-all duration-300 hover:border-brand hover:bg-brand-light"
      >
        <i-ph-palette-bold
          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-muted transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:text-brand"
        />
      </button>
    </el-tooltip>

    <!-- 水平向左丝滑滑出 -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95 translate-x-2"
      enter-to-class="opacity-100 scale-100 translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100 translate-x-0"
      leave-to-class="opacity-0 scale-95 translate-x-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-full top-1/2 z-50 mr-3 w-40 origin-right -translate-y-1/2 overflow-hidden rounded-2xl border border-color bg-card p-1.5 shadow-card"
      >
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="selectTheme(theme.id)"
          class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
          :class="
            currentTheme === theme.id
              ? 'bg-brand-light text-brand'
              : 'text-muted hover:bg-alt hover:text-main'
          "
        >
          <div class="flex items-center gap-3">
            <component :is="theme.icon" class="h-4 w-4" />
            {{ theme.name }}
          </div>
          <i-ph-check-bold class="h-4 w-4" v-if="currentTheme === theme.id" />
        </button>
      </div>
    </transition>
  </div>
</template>
