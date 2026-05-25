<template>
  <AsideCard>
    <div class="gap2 flex flex-col">
      <div class="flex items-center justify-start gap-4">
        <Avatar sizeClass="h-16 w-16" />
        <div class="flex flex-1 flex-col gap-1"></div>
      </div>
      <div class="w-full">
        <div class="grid grid-cols-5 gap-0.5">
          <SiteData
            v-for="item in displayItems"
            :icon="item.icon"
            :label="item.label"
          >
            {{ item.data }}
          </SiteData>
          <SiteData :icon="ViewIcon" label="总访客"
            ><span id="busuanzi_site_pv"></span
          ></SiteData>
          <SiteData :icon="VisitorIcon" label="总访问"
            ><span id="busuanzi_site_uv"></span
          ></SiteData>
        </div>
      </div>
    </div>
  </AsideCard>
</template>

<script setup>
import AsideCard from "../../container/AsideCard.vue";
import Avatar from "../../items/Avatar.vue";

import { siteMeta } from "../../../data/siteMeta";

import PostIcon from "~icons/material-symbols/folder-open-rounded";
import RunningDaysIcon from "~icons/material-symbols/calendar-clock-rounded";
import BassTabIcon from "~icons/material-symbols/library-music-rounded";
import ViewIcon from "~icons/material-symbols/visibility";
import VisitorIcon from "~icons/material-symbols/article-person-rounded";
import SiteData from "../../items/SiteData.vue";

const { postCount, bassTabCount, siteRunningDays } = siteMeta;

const displayItems = {
  runningDays: {
    icon: RunningDaysIcon,
    label: "建站共",
    data: siteRunningDays,
  },
  post: {
    icon: PostIcon,
    label: "文章数",
    data: postCount,
  },
  bassTab: {
    icon: BassTabIcon,
    label: "乐谱共",
    data: bassTabCount,
  },
};
</script>
