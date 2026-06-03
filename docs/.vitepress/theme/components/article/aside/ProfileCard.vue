<template>
  <div
    class="profile-terminal overflow-hidden rounded-[1rem] border border-color bg-card shadow-card"
    :class="{ 'is-maximized': isMaximized }"
  >
    <div class="terminal-bar border-b border-color bg-card px-4 py-2">
      <div class="flex items-center gap-2 text-sm font-bold text-main">
        <i-material-symbols-terminal-rounded class="text-brand" />
        <span>PROFILE.SYS</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted">
        <button class="window-action" type="button">
          <i-material-symbols-remove />
        </button>
        <button class="window-action" type="button" @click="handleMaximize">
          <i-material-symbols-chrome-maximize-outline v-if="!isMaximized" />
          <i-material-symbols-chrome-restore-outline-rounded v-else />
        </button>
        <button class="window-action" type="button">
          <i-material-symbols-close />
        </button>
      </div>
    </div>

    <div class="terminal-body p-2">
      <div class="relative z-10 flex flex-col gap-5">
        <div class="flex items-start gap-4">
          <div class="avatar-shell">
            <Avatar sizeClass="h-12 w-12" />
          </div>

          <div class="min-w-0 flex-1">
            <p class="terminal-command">&gt; whoami --socialaccount</p>
            <h3 class="terminal-command">Denebora</h3>
          </div>
        </div>

        <div class="terminal-panel">
          <p class="terminal-command">&gt; ./site_meta --summary</p>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <div
              v-for="item in displayItems"
              :key="item.label"
              class="stat-tile"
            >
              <component :is="item.icon" class="text-lg text-brand" />
              <span class="mt-2 text-lg font-bold leading-none text-main">
                {{ item.data }}
              </span>
              <span
                class="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="terminal-panel">
          <p class="terminal-command">&gt; cat /proc/traffic</p>
          <div class="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div class="metric-line">
              <div class="flex items-center gap-2 text-muted">
                <ViewIcon class="text-base text-brand" />
                <span>总访问量</span>
              </div>
              <span id="busuanzi_site_pv" class="metric-value"></span>
            </div>
            <div class="metric-line">
              <div class="flex items-center gap-2 text-muted">
                <VisitorIcon class="text-base text-brand" />
                <span>总访客数</span>
              </div>
              <span id="busuanzi_site_uv" class="metric-value"></span>
            </div>
          </div>
        </div>

        <div class="prompt-line">
          <span class="text-muted">guest@deneblog:~$</span>
          <span class="cursor-block"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Avatar from "../../items/Avatar.vue";

import { siteMeta } from "../../../data/siteMeta";

import PostIcon from "~icons/material-symbols/folder-open-rounded";
import RunningDaysIcon from "~icons/material-symbols/calendar-clock-rounded";
import BassTabIcon from "~icons/material-symbols/library-music-rounded";
import ViewIcon from "~icons/material-symbols/visibility";
import VisitorIcon from "~icons/material-symbols/article-person-rounded";

const { postCount, bassTabCount, siteRunningDays } = siteMeta;

const isMaximized = ref(false);

const handleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};

const displayItems = [
  {
    icon: RunningDaysIcon,
    label: "运行天数",
    data: siteRunningDays,
  },
  {
    icon: PostIcon,
    label: "文章数",
    data: postCount,
  },
  {
    icon: BassTabIcon,
    label: "乐谱数",
    data: bassTabCount,
  },
];
</script>

<style scoped>
.profile-terminal {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.profile-terminal.is-maximized {
  transform: scale(1.01);
}

.terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.window-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  padding: 0.15rem;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.window-action:hover {
  background: color-mix(in srgb, var(--color-brand) 10%, transparent);
  color: var(--color-text-main);
}

.terminal-body {
  position: relative;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.avatar-shell :deep(.group) {
  border-radius: 0.9rem;
  background: color-mix(in srgb, var(--color-brand) 12%, var(--color-bg-alt));
}

.avatar-shell :deep(img) {
  border-radius: 0.75rem;
}

.terminal-command {
  font-size: 0.78rem;
  color: var(--color-brand);
}

.terminal-panel {
  position: relative;
  border: 1px solid
    color-mix(in srgb, var(--color-brand) 22%, var(--color-border));
  background: color-mix(in srgb, var(--color-bg-alt) 82%, transparent);
  border-radius: 0.85rem;
  padding: 0.9rem;
  box-shadow: inset 0 1px 0
    color-mix(in srgb, var(--color-brand) 8%, transparent);
}

.stat-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 5.5rem;
  border: 1px solid
    color-mix(in srgb, var(--color-brand) 14%, var(--color-border));
  border-radius: 0.7rem;
  background: color-mix(in srgb, var(--color-bg-card) 72%, transparent);
  text-align: center;
}

.metric-line {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-radius: 0.7rem;
  border: 1px solid
    color-mix(in srgb, var(--color-brand) 12%, var(--color-border));
  background: color-mix(in srgb, var(--color-bg-card) 70%, transparent);
  padding: 0.75rem;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-main);
}

.metric-value:empty::before {
  content: "--";
  color: var(--color-text-muted);
}

.prompt-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.cursor-block {
  width: 0.6rem;
  height: 1rem;
  background: var(--color-brand);
  box-shadow: 0 0 10px color-mix(in srgb, var(--color-brand) 50%, transparent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
