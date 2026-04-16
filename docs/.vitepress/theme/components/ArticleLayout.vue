<script setup>
import { computed, onMounted, ref } from "vue";
import { useData, useRoute } from "vitepress";
import { data as allPosts } from "../../../blog/posts.data";
import { formatDate } from "../utils/format";
import { ElMessage } from "element-plus";

import { copyTextToClipboard } from "../utils/copyText";

const { page, frontmatter } = useData();
const route = useRoute();

const isCopied = ref(false);
const xShareLink = ref("");

const successMessageOptions = {
  message: "链接成功复制到剪贴板",
  type: "success",
  placement: "bottom",
};

const errorMessageOptions = {
  message: "复制失败，可能是浏览器权限限制，请手动复制地址栏链接。",
  type: "error",
  placement: "bottom",
};

// 提取文章所有标题(h1/h2/h3)并将原始的树形结构展开为一维数组
const headers = computed(() => {
  const rawHeaders = page.value.headers || [];
  const flatHeaders = [];

  // 定义一个递归函数来遍历所有的 children
  const flatten = (items) => {
    items.forEach((item) => {
      // 把当前标题推入数组
      flatHeaders.push(item);
      // 如果有子标题，递归继续推入
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };

  flatten(rawHeaders);
  return flatHeaders;
});

// 获取相关文章
const relatedPosts = computed(() => {
  const currentTags = frontmatter.value.tags || [];
  return allPosts
    .filter((post) => {
      if (post.url === route.path) return false;
      return post.tags?.some((tag) => currentTags.includes(tag));
    })
    .slice(0, 5);
});

// 处理复制逻辑
const handleCopy = async () => {
  // 防抖/节流：如果已经在提示成功状态，则不重复执行
  if (isCopied.value) return;
  const textToCopy = `DeneBlog: ${document.title}\n${window.location.href}`;
  const success = await copyTextToClipboard(textToCopy);

  if (success) {
    isCopied.value = true;
    ElMessage(successMessageOptions);
    // 3秒后恢复默认状态
    setTimeout(() => {
      isCopied.value = false;
    }, 3000);
  } else {
    ElMessage(errorMessageOptions);
  }
};

onMounted(() => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(`DeneBlog: ${document.title}`);
  xShareLink.value = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
});
</script>

<template>
  <div
    class="relative flex w-full flex-col items-start gap-10 px-6 py-4 lg:flex-row"
  >
    <article
      class="w-full rounded-[2.5rem] bg-card p-8 shadow-card transition-colors duration-300 md:p-14 lg:w-[80%]"
    >
      <header class="mx-auto mb-12 max-w-3xl text-center">
        <div class="mb-6 flex items-center justify-center gap-3">
          <span
            class="rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand transition-colors"
          >
            {{ frontmatter.category }}
          </span>
          <span class="text-sm font-medium text-muted transition-colors">{{
            formatDate(frontmatter.date).string
          }}</span>
        </div>

        <h1
          class="mb-6 text-4xl font-extrabold leading-[1.2] tracking-tight text-main transition-colors md:text-5xl"
        >
          {{ page.title }}
        </h1>

        <p
          v-if="frontmatter.summary"
          class="text-xl font-medium leading-relaxed text-muted transition-colors"
        >
          {{ frontmatter.summary }}
        </p>
      </header>

      <div
        v-if="frontmatter.cover"
        class="mb-16 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-alt shadow-inner transition-colors"
      >
        <img
          :src="frontmatter.cover"
          class="h-full w-full object-cover"
          alt="Cover Image"
        />
      </div>

      <div
        class="article-content prose-brand prose prose-lg mx-auto max-w-none transition-colors duration-300"
      >
        <Content />
      </div>

      <div
        v-if="frontmatter.tags"
        class="mt-16 flex flex-wrap gap-3 border-t border-color pt-8 transition-colors"
      >
        <span
          class="mr-2 flex items-center text-sm font-bold text-main transition-colors"
          >标签:</span
        >
        <span
          v-for="tag in frontmatter.tags"
          :key="tag"
          class="cursor-pointer rounded-full bg-alt px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:bg-brand-light hover:text-brand"
        >
          #{{ tag }}
        </span>
      </div>
    </article>

    <aside class="sticky top-24 w-full space-y-8 lg:w-[20%]">
      <div
        v-if="headers.length > 0"
        class="rounded-[1.5rem] bg-card p-6 shadow-card transition-colors duration-300"
      >
        <h3
          class="mb-5 flex items-center gap-2 font-bold text-main transition-colors"
        >
          <i-ph-list-dashes-bold class="h-5 w-5 text-brand" /> 文章目录
        </h3>
        <nav class="flex flex-col gap-3">
          <a
            v-for="header in headers"
            :key="header.link"
            :href="header.link"
            class="relative line-clamp-1 text-sm font-medium text-muted transition-colors before:absolute before:-left-3 before:top-1/2 before:h-1 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-brand before:opacity-0 before:transition-transform hover:text-brand hover:before:scale-150 hover:before:opacity-100"
            :class="[
              header.level === 3 ? 'ml-4' : header.level === 4 ? 'ml-8' : '',
            ]"
          >
            {{ header.title }}
          </a>
        </nav>
      </div>

      <div
        class="rounded-[1.5rem] bg-card p-6 shadow-card transition-colors duration-300"
      >
        <h3
          class="mb-5 flex items-center gap-2 font-bold text-main transition-colors"
        >
          <i-ph-share-network-bold class="h-5 w-5 text-brand" /> 分享文章
        </h3>
        <div class="flex gap-3">
          <a
            :href="xShareLink"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-1 justify-center rounded-xl bg-alt py-2.5 text-muted transition-all hover:bg-brand-light hover:text-brand"
          >
            <i-ph-x-logo-bold class="h-5 w-5" />
          </a>
          <button
            @click="handleCopy"
            class="flex flex-1 justify-center rounded-xl bg-alt py-2.5 text-muted transition-all hover:bg-brand-light hover:text-brand"
          >
            <i-ph-link-bold class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        v-if="relatedPosts.length > 0"
        class="rounded-[1.5rem] bg-card p-6 shadow-card transition-colors duration-300"
      >
        <h3
          class="mb-3 flex items-center gap-2 border-b border-color pb-3 font-bold text-main transition-colors"
        >
          <i-ph-book-open-bold class="h-5 w-5 text-brand" /> 相关博客
        </h3>
        <div class="flex flex-col">
          <a
            v-for="post in relatedPosts"
            :key="post.url"
            :href="post.url"
            class="group mb-3 flex flex-col gap-1 border-b border-color px-2 pb-3"
          >
            <h4
              class="line-clamp-2 text-sm font-bold text-main transition-colors group-hover:text-brand"
            >
              {{ post.title }}
            </h4>
            <span class="text-xs font-medium text-muted transition-colors">{{
              post.date.string
            }}</span>
          </a>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* 针对 prose 插件生成的代码块做一点美化修正 */
:deep(.prose) {
  overflow-wrap: break-word;
}
:deep(.prose pre) {
  border-radius: 1rem;
  /* 修复暗色模式下代码块的内阴影表现：使用 CSS 变量，或者索性让它足够微弱 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
:deep(.prose a) {
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
</style>
