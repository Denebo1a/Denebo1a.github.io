<template>
  <div class="relative flex w-full flex-col gap-4 lg:flex-row">
    <div class="w-full md:w-[80%]">
      <article
        class="flex w-full flex-col space-y-4 rounded-[1rem] border border-color bg-card p-8 shadow-card"
      >
        <header class="flex w-full flex-col">
          <Header
            :category="frontmatter.category"
            :date="formattedDate"
            :title="page.title"
            :tags="frontmatter.tags"
            :summary="frontmatter.summary"
          />
        </header>

        <div class="vp-doc article-content">
          <Content />
        </div>
        <Tags :tags="frontmatter.tags" />
        <Artalk />
      </article>
    </div>

    <aside class="flex w-full flex-col gap-4 md:w-[20%]">
      <ProfileCard />
      <div class="sticky top-4 flex w-full flex-col gap-4">
        <Toc
          :headers="headers"
          :active-hash="activeHash"
          @tocClick="handleTocClick"
        />
        <ShareCard :xShareLink="xShareLink" @call-copy="handleCopy" />
        <RelatedPosts :related-posts="relatedPosts" />
      </div>
    </aside>
  </div>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useData, useRoute } from "vitepress";
import { data as allPosts } from "../../../blog/posts.data";
import { formatDate } from "../utils/format";
import { ElMessage } from "element-plus";

import { copyTextToClipboard } from "../utils/copyText";

import Header from "./article/Header.vue";
import Tags from "./article/Tags.vue";
import Artalk from "./artalk/Artalk.vue";

import Toc from "./article/aside/Toc.vue";
import ShareCard from "./article/aside/ShareCard.vue";
import RelatedPosts from "./article/aside/RelatedPosts.vue";
import ProfileCard from "./article/aside/ProfileCard.vue";

const { page, frontmatter } = useData();
const route = useRoute();

const isCopied = ref(false);
const xShareLink = ref("");
const activeHash = ref("");
const lockedHash = ref("");
const isHashNavigating = ref(false);

const formattedDate = computed(() => {
  return formatDate(frontmatter.value.date).string;
});

let headingObserver = null;

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

const syncActiveHashFromLocation = () => {
  activeHash.value = decodeURIComponent(window.location.hash || "");
};

const getFirstVisibleHeading = (headings, scrollRoot) => {
  const rootTop = scrollRoot.getBoundingClientRect().top + 96;

  return (
    headings.find(
      (heading) => heading.getBoundingClientRect().bottom > rootTop,
    ) ||
    headings[headings.length - 1] ||
    null
  );
};

const setupHeadingObserver = async () => {
  headingObserver?.disconnect();
  headingObserver = null;

  await nextTick();

  const scrollRoot = document.getElementById("site-main-scroll");
  const headings = Array.from(
    document.querySelectorAll(".article-content :is(h2, h3, h4)[id]"),
  );

  if (!scrollRoot || headings.length === 0) {
    syncActiveHashFromLocation();
    return;
  }

  headingObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (isHashNavigating.value) return;

      if (visibleEntries.length > 0) {
        const currentHeading = visibleEntries[0].target;
        activeHash.value = `#${currentHeading.id}`;
      }
    },
    {
      root: scrollRoot,
      threshold: [0, 1],
      rootMargin: "-96px 0px -65% 0px",
    },
  );

  headings.forEach((heading) => headingObserver.observe(heading));

  if (window.location.hash) {
    syncActiveHashFromLocation();
    return;
  }

  const firstVisibleHeading = getFirstVisibleHeading(headings, scrollRoot);
  activeHash.value = firstVisibleHeading ? `#${firstVisibleHeading.id}` : "";
};

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

const lockHashNavigation = (link) => {
  lockedHash.value = link;
  activeHash.value = link;
  isHashNavigating.value = true;
};

const handleTocClick = (link) => {
  lockHashNavigation(link);
};

const handleHashChange = () => {
  const hash = decodeURIComponent(window.location.hash || "");
  if (!hash) return;

  lockHashNavigation(hash);
};

let unlockTimer = null;

const releaseHashNavigation = () => {
  isHashNavigating.value = false;
  lockedHash.value = "";
};

const handleScrollSpyUnlock = () => {
  if (!isHashNavigating.value) return;

  clearTimeout(unlockTimer);
  unlockTimer = window.setTimeout(() => {
    releaseHashNavigation();
    syncActiveHashFromLocation();
  }, 120);
};

onMounted(async () => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(`DeneBlog: ${document.title}`);
  xShareLink.value = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;

  await setupHeadingObserver();
  window.addEventListener("hashchange", handleHashChange);

  const scrollRoot = document.getElementById("site-main-scroll");
  scrollRoot?.addEventListener("scroll", handleScrollSpyUnlock, {
    passive: true,
  });
});

onBeforeUnmount(() => {
  headingObserver?.disconnect();
  window.removeEventListener("hashchange", handleHashChange);
});

watch(
  () => route.path,
  async () => {
    await setupHeadingObserver();
  },
);
</script>
