<template>
  <div
    class="relative z-0 flex flex-col overflow-hidden rounded-[1rem] border border-color bg-card shadow-card"
  >
    <div class="flex flex-col justify-start p-4 md:p-6">
      <div class="mb-4 flex flex-row items-center gap-5 sm:gap-6">
        <Avatar />
        <div
          class="flex flex-col items-start justify-center gap-3 py-1.5 pl-5 transition-colors sm:pl-6"
        >
          <SocialAccountLink
            v-for="socialLink in socialLinkList"
            :url="socialLink.url"
            :icon="socialLink.icon"
            :label="socialLink.label"
          />
        </div>
      </div>

      <h1
        class="mb-2 text-3xl font-extrabold tracking-tight text-main transition-colors md:text-4xl"
      >
        Hi, I'm <span class="text-brand">Denebora</span>.
      </h1>
      <h2 class="text-lg font-bold text-muted transition-colors">
        Developer / Music Enthusiast
      </h2>
    </div>
  </div>
</template>

<script setup>
import Avatar from "../items/Avatar.vue";
import SocialAccountLink from "../items/SocialAccountLink.vue";

import GithubIcon from "~icons/ph/github-logo-fill";
import BilibiliIcon from "~icons/ant-design/bilibili-outlined";
import EmailIcon from "~icons/material-symbols/attach-email";

const socialLinkList = [
  {
    platform: "github",
    url: "https://github.com/Denebo1a",
    icon: GithubIcon,
    label: "@Denebo1a",
  },
  {
    platform: "bilibili",
    url: "https://space.bilibili.com/324205603",
    icon: BilibiliIcon,
    label: "@Denebora",
  },
  {
    platform: "",
    url: "mailto:denebo1a@163.com",
    icon: EmailIcon,
    label: "denebo1a@163.com",
  },
];
</script>
