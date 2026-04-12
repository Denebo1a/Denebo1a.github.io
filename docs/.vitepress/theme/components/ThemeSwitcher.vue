<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

import oceanIcon from "~icons/ph/drop-half-bottom-bold";
import forestIcon from "~icons/ph/tree-evergreen-bold";
import autumnIcon from "~icons/ph/leaf-bold";
import darkIcon from "~icons/ph/moon-stars-bold";

// 其他图标...
const themes = [
  {
    id: "default",
    name: "Ocean",
    color: "#0284c7",
    icon: oceanIcon,
  },
  {
    id: "forest",
    name: "Forest",
    color: "#0f766e",
    icon: forestIcon,
  },
  { id: "autumn", name: "Autumn", color: "#ea580c", icon: autumnIcon },
  { id: "dark", name: "Dark", color: "#f8fafc", icon: darkIcon }, // 暗黑模式预览点使用白色
];

const currentTheme = ref("default");
const isOpen = ref(false);
const dropdownRef = ref(null);

// 2. 点击外部关闭下拉菜单的逻辑
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  // 读取本地存储
  const savedTheme = localStorage.getItem("blog-theme") || "default";
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);

  // 绑定全局点击事件
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 监听主题变化
watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
  localStorage.setItem("blog-theme", newTheme);
});

const applyTheme = (themeId) => {
  if (themeId === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeId);
  }
};

const selectTheme = (id) => {
  currentTheme.value = id;
  isOpen.value = false; // 选完后自动关闭
};

// 计算当前选中的主题对象（用于按钮显示）
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
              :style="theme.id === 'dark' ? {} : { color: theme.color }"
            />
            {{ theme.name }}
          </div>
          <i-ph-check-bold class="h-4 w-4" v-if="currentTheme === theme.id" />
        </button>
      </div>
    </transition>
  </div>
</template>
