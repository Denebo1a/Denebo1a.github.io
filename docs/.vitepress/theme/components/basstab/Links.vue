<template>
  <AsideCard title="相关链接" :icon="LinkIcon">
    <div class="flex flex-col gap-2">
      <a
        v-for="link in activeLinks"
        :key="link.key"
        :href="frontmatter[link.key]"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center justify-between gap-3 rounded-xl border border-color px-3 py-1.5 text-sm font-semibold text-main transition-all hover:border-brand hover:bg-brand-light hover:text-brand"
      >
        <div class="flex items-center gap-2">
          <div class="h-4 w-4 text-brand">
            <i-ant-design-bilibili-outlined v-if="link.icon === 'bilibili'" />
            <i-ant-design-baidu-outlined v-else-if="link.icon === 'baidu'" />
            <i-ph-cloud-bold v-else />
          </div>
          <span class="text-main group-hover:text-brand">{{ link.label }}</span>
        </div>
        <div v-if="link.icon !== 'bilibili'" class="flex items-center gap-2">
          <Password />
          <i-ph-arrow-square-out-bold
            class="h-4 w-4 text-muted group-hover:text-brand"
          />
        </div>
      </a>
    </div>
  </AsideCard>
</template>

<script setup>
import { useData } from "vitepress";
import AsideCard from "../container/AsideCard.vue";
import LinkIcon from "~icons/ph/link-bold";
import Password from "../items/Password.vue";

const { frontmatter } = useData();

// 只有 url 非空才显示对应链接
const links = [
  {
    key: "bilibiliUrl",
    label: "B站走带视频",
    icon: "bilibili",
  },
  {
    key: "baiduDiskUrl",
    label: "百度网盘",
    icon: "baidu",
  },
  {
    key: "lanzouUrl",
    label: "蓝奏云",
    icon: "lanzou",
  },
];

const activeLinks = links.filter((l) => frontmatter.value[l.key]);
</script>
