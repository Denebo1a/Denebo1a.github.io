<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useTheme } from "../composables/useTheme";

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

const resolveThemeIconClass = (theme) =>
  theme.menuIconClass?.(currentTheme.value) ?? "";

const activeTheme = computed(
  () => themes.find((t) => t.id === currentTheme.value) || themes[0],
);
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex h-9 w-9 items-center justify-center rounded-xl bg-alt text-muted transition-colors hover:bg-brand-light hover:text-brand"
      :class="{ 'bg-brand-light text-brand': isOpen }"
      aria-label="Toggle Theme"
    >
      <i-ph-palette-bold class="h-5 w-5" />
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95 -translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 z-50 mt-3 w-40 origin-top-right overflow-hidden rounded-2xl border border-color bg-card p-1.5 shadow-card"
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
            <component
              :is="theme.icon"
              class="h-4 w-4"
              :class="resolveThemeIconClass(theme)"
            />
            {{ theme.name }}
          </div>
          <i-ph-check-bold class="h-4 w-4" v-if="currentTheme === theme.id" />
        </button>
      </div>
    </transition>
  </div>
</template>
