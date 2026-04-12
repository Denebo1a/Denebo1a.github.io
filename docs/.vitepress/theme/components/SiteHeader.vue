<script setup>
import { useRoute } from "vitepress";
import ThemeSwitcher from "./ThemeSwitcher.vue";

const route = useRoute();

// 辅助函数：判断当前路径是否处于激活状态
const isActive = (path) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};
</script>

<template>
  <header
    class="relative sticky top-0 z-50 flex h-14 w-full items-center justify-between px-4 py-2 shadow-sm backdrop-blur-md transition-colors duration-300"
    style="
      background-color: color-mix(
        in srgb,
        var(--color-bg-card) 85%,
        transparent
      );
    "
  >
    <div class="flex items-center">
      <a
        href="/"
        class="flex items-center rounded-lg px-2 py-1 text-2xl font-bold tracking-tight text-main transition-colors duration-200 hover:bg-brand-light"
      >
        Dene<span class="text-brand">Blog</span>
      </a>
    </div>

    <nav class="hidden gap-8 text-sm font-semibold text-muted md:flex">
      <a
        href="/"
        class="group border-b-2 pb-1 transition-colors duration-200 hover:text-brand-dark"
        :class="
          isActive('/') ? 'border-brand text-brand' : 'border-transparent'
        "
      >
        <div class="relative flex items-center gap-0.5">
          <i-ph-house class="group-hover:hiddens block h-4 w-4 sm:h-5 sm:w-5" />
          <i-ph-house-duotone
            class="absolute left-0 top-0 hidden h-4 w-4 group-hover:block sm:h-5 sm:w-5"
          />
          <span>首页</span>
        </div>
      </a>

      <a
        href="/blog/"
        class="group border-b-2 pb-1 transition-colors duration-200 hover:text-brand-dark"
        :class="
          isActive('/blog') ? 'border-brand text-brand' : 'border-transparent'
        "
      >
        <div class="relative flex items-center gap-0.5">
          <i-ph-article
            class="group-hover:hiddens block h-4 w-4 sm:h-5 sm:w-5"
          />
          <i-ph-article-duotone
            class="absolute left-0 top-0 hidden h-4 w-4 group-hover:block sm:h-5 sm:w-5"
          />
          <span>博客</span>
        </div>
      </a>
      <a
        href="/resources/"
        class="group border-b-2 pb-1 transition-colors duration-200 hover:text-brand-dark"
        :class="
          isActive('/resources')
            ? 'border-brand text-brand'
            : 'border-transparent'
        "
      >
        <div class="relative flex items-center gap-0.5">
          <i-ph-package
            class="group-hover:hiddens block h-4 w-4 sm:h-5 sm:w-5"
          />
          <i-ph-package-duotone
            class="absolute left-0 top-0 hidden h-4 w-4 group-hover:block sm:h-5 sm:w-5"
          />
          <span>资源</span>
        </div>
      </a>
      <a
        href="/studio/"
        class="group border-b-2 pb-1 transition-colors duration-200 hover:text-brand-dark"
        :class="
          isActive('/studio') ? 'border-brand text-brand' : 'border-transparent'
        "
      >
        <div class="relative flex items-center gap-0.5">
          <i-ph-atom class="group-hover:hiddens block h-4 w-4 sm:h-5 sm:w-5" />
          <i-ph-atom-duotone
            class="absolute left-0 top-0 hidden h-4 w-4 group-hover:block sm:h-5 sm:w-5"
          />
          <span>Studio</span>
        </div>
      </a>
    </nav>

    <div class="flex shrink-0 items-center justify-end gap-4">
      <ThemeSwitcher />
    </div>
  </header>
</template>
