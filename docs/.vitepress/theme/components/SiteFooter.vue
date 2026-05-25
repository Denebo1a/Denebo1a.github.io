<template>
  <div class="h-16 w-full items-center border-t border-color bg-card px-4 py-2">
    <div class="flex h-full items-center justify-between">
      <div class="flex items-center gap-2">
        <Author />
        <Divider :vertical="true" :dashed="false" margin="mx-2" />
        <License />
      </div>
      <div class="flex items-center gap-2">
        <SocialAccountLinkButton
          v-for="item in referenceLinks"
          :key="item.url"
          :url="item.url"
          :icon="item.icon"
        />
      </div>
      <div class="flex items-center gap-2">
        <PoweredBy />
        <Divider :vertical="true" :dashed="false" margin="mx-2" />
        <InspiredBy />
      </div>
    </div>
  </div>
</template>

<script setup>
import Author from "./items/Author.vue";
import License from "./items/License.vue";
import PoweredBy from "./items/PoweredBy.vue";
import InspiredBy from "./items/InspiredBy.vue";
import Divider from "./items/Divider.vue";
import GitHubIcon from "~icons/ph/github-logo-fill";
import BilibiliIcon from "~icons/ant-design/bilibili-outlined";
import QQIcon from "~icons/ant-design/qq-outlined";
import EmailIcon from "~icons/material-symbols/attach-email";
import XIcon from "~icons/ant-design/x-outlined";

import SocialAccountLinkButton from "./items/SocialAccountLinkButton.vue";

const referenceLinks = [
  {
    url: "https://github.com/Denebo1a",
    icon: GitHubIcon,
  },
  {
    url: "https://space.bilibili.com/324205603",
    icon: BilibiliIcon,
  },
  {
    url: "mailto:denebo1a@163.com",
    icon: EmailIcon,
  },
  {
    url: "http://wpa.qq.com/msgrd?v=3&uin=3395882338&site=qq&menu=yes",
    icon: QQIcon,
  },
  {
    url: "https://x.com/SChibashi82908",
    icon: XIcon,
  },
];
</script>
