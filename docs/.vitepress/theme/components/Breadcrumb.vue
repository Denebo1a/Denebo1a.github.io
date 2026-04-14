<script setup>
import { computed } from "vue";
import { useRoute, useData } from "vitepress";

const route = useRoute();
const { page, frontmatter } = useData();

// 智能计算面包屑层级
const breadcrumbs = computed(() => {
  const items = [{ name: "DeneBlog", path: "/" }];

  // 场景 1：当前在博客文章详情页
  if (route.path.startsWith("/blog/")) {
    items.push({ name: "博客", path: "/blog/" });
    if (route.path !== "/blog/") {
      // 如果文章有分类，把分类也加上（不可点击，纯展示层级）
      if (frontmatter.value.category) {
        items.push({ name: frontmatter.value.category, path: null });
      }
      // 最后一级是当前文章的标题
      items.push({ name: page.value.title, path: null }); // 当前页不需要加上链接
    }
  } else if (route.path.startsWith("/resources/")) {
    items.push({ name: "资源", path: "/resources/" });
    if (route.path !== "/resources/") {
      if (frontmatter.value.layout === "basstab-detail") {
        items.push({
          name:
            frontmatter.value.layout === "basstab-detail" ? "BASS TAB" : "其他",
          path: null,
        });
        items.push({ name: frontmatter.value.genre, path: null });
        items.push({ name: frontmatter.value.artist, path: null });
        items.push({ name: frontmatter.value.title, path: null });
      }
    }
  }
  return items;
});
</script>

<template>
  <div class="drop-shadow-mds fixed top-14 z-40 w-fit">
    <div
      class="flex h-7 max-w-[70vw] items-center gap-2 rounded-br-[1rem] bg-alt px-6 shadow-md"
    >
      <span class="text-brand">
        <i-material-symbols-location-on class="h-4 w-4" />
      </span>
      <nav aria-label="Breadcrumb" class="w-full">
        <ol class="flex flex-wrap items-center gap-2">
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="flex items-center gap-2"
          >
            <i-ph-caret-right-bold
              v-if="index !== 0"
              class="h-3 w-3 text-muted opacity-50"
            />
            <a
              v-if="crumb.path"
              :href="crumb.path"
              class="flex items-center gap-1.5 text-[0.8rem] font-semibold text-muted transition-colors hover:text-brand"
            >
              {{ crumb.name }}
            </a>

            <span
              v-else
              class="line-clamp-1 max-w-[200px] text-[0.8rem] font-bold text-muted transition-colors md:max-w-[300px]"
              :title="crumb.name"
            >
              {{ crumb.name }}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>
