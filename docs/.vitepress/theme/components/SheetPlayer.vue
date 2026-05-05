<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { withBase } from "vitepress";
import { useSiteConfig } from "../composables/useSiteConfig";

const props = defineProps<{
  src: string;
}>();

const { resolveAssetDir, resolveAssetUrl } = useSiteConfig();

// --- 状态 ---
const wrapper = ref<HTMLElement | null>(null);
const isPlayerReady = ref(false);
const isPlaying = ref(false);
const soundFontProgress = ref(0);
const currentTimeMs = ref(0);
const endTimeMs = ref(0);

let apiRef: any = null;

// --- 时间格式化 mm:ss ---
const formatTime = (ms: number) => {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// --- Seek 拖拽 ---
const isSeeking = ref(false);
const seekValue = ref(0);

const onSeekStart = () => {
  isSeeking.value = true;
  seekValue.value = currentTimeMs.value;
};
const onSeekEnd = (e: Event) => {
  if (!apiRef) return;
  apiRef.timePosition = Number((e.target as HTMLInputElement).value);
  isSeeking.value = false;
};

// --- AlphaTab 初始化 ---
onMounted(async () => {
  if (import.meta.env.SSR) return;

  const scriptFile = resolveAssetUrl("/alphatab/alphaTab.mjs");
  const at = await import(/* @vite-ignore */ scriptFile);

  const settings = new at.Settings();

  settings.core.useWorkers = true;
  settings.core.scriptFile = scriptFile;
  // 显示：五线谱 + TAB 双行
  settings.notation.notationMode = at.NotationMode.GuitarPro;
  // 按页换行布局
  settings.display.layoutMode = at.LayoutMode.Page;
  settings.display.systemsLayoutMode = at.SystemsLayoutMode.UseModelLayout;
  // 启用播放器
  settings.player.enablePlayer = true;
  settings.player.enableUserInteraction = true;
  settings.player.scrollMode = at.ScrollMode.OffScreen;
  settings.player.scrollElement = wrapper.value!;
  // 强制指定底层字体与音源库目录
  settings.core.fontDirectory = resolveAssetDir("/font");
  settings.player.soundFont = resolveAssetUrl("/soundfont/sonivox.sf3");

  const api = new at.AlphaTabApi(wrapper.value!, settings);
  apiRef = api;

  // 加载乐谱
  if (props.src) {
    api.load(withBase(props.src));
  }

  // 音源就绪 → 解锁 Play 按钮
  api.playerReady.on(() => {
    isPlayerReady.value = true;
  });

  api.renderStarted.on(() => {
    console.debug("[SheetPlayer] render started");
  });

  api.renderFinished.on(() => {
    console.debug("[SheetPlayer] render finished");
  });

  api.soundFontLoaded.on(() => {
    console.debug("[SheetPlayer] soundfont loaded");
  });

  api.error.on((error: unknown) => {
    console.error("[SheetPlayer] alphaTab error", error);
  });

  // 播放/暂停状态同步
  api.playerStateChanged.on((e: any) => {
    // PlayerState.Playing = 1
    isPlaying.value = e.state === 1;
  });

  // SoundFont 加载进度
  api.soundFontLoad.on((e: any) => {
    if (e.total > 0) {
      soundFontProgress.value = Math.floor((e.loaded / e.total) * 100);
    }
  });

  // 走带位置更新（节流：每秒最多写入一次响应式状态）
  let lastSec = -1;
  api.playerPositionChanged.on((e: any) => {
    if (!isSeeking.value) {
      const sec = Math.floor(e.currentTime / 1000);
      if (sec !== lastSec) {
        lastSec = sec;
        currentTimeMs.value = e.currentTime;
        endTimeMs.value = e.endTime;
        seekValue.value = e.currentTime;
      }
    }
  });
});

// 页面跳转前销毁，防止"幽灵音频"
onBeforeUnmount(() => {
  apiRef?.destroy();
  apiRef = null;
});
</script>

<template>
  <ClientOnly>
    <div
      class="relative w-full overflow-hidden rounded-2xl border border-color bg-card shadow-card"
    >
      <!-- SoundFont 加载进度（播放器就绪前显示）-->
      <div
        v-if="!isPlayerReady && src"
        class="flex flex-col items-center justify-center gap-3 px-8 py-10 text-muted"
      >
        <i-ph-music-notes-simple-bold
          class="h-10 w-10 animate-pulse text-brand"
        />
        <p class="text-sm font-semibold">
          正在初始化音源... {{ soundFontProgress }}%
        </p>
        <div class="h-1.5 w-64 overflow-hidden rounded-full bg-alt">
          <div
            class="h-full rounded-full bg-brand transition-all duration-300"
            :style="{ width: soundFontProgress + '%' }"
          />
        </div>
      </div>

      <!-- 暂无乐谱文件占位 -->
      <div
        v-if="!src"
        class="flex flex-col items-center justify-center gap-3 py-12 text-muted"
      >
        <i-ph-file-x class="h-12 w-12 opacity-40" />
        <p class="text-sm font-medium">暂无 MusicXML 文件</p>
      </div>

      <!-- 控制条 -->
      <div
        v-if="src"
        class="bg-alt/50 flex items-center gap-3 border-b border-color px-4 py-2"
      >
        <!-- 播放/暂停 -->
        <button
          @click="apiRef?.playPause()"
          :disabled="!isPlayerReady"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all"
          :class="
            isPlayerReady
              ? 'bg-brand text-white hover:opacity-90'
              : 'cursor-not-allowed bg-alt text-muted opacity-50'
          "
        >
          <i-ph-pause-fill v-if="isPlaying" class="h-4 w-4" />
          <i-ph-play-fill v-else class="h-4 w-4" />
        </button>

        <!-- 停止 -->
        <button
          @click="apiRef?.stop()"
          :disabled="!isPlayerReady"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all"
          :class="
            isPlayerReady
              ? 'bg-alt text-muted hover:bg-brand-light hover:text-brand'
              : 'cursor-not-allowed opacity-40'
          "
        >
          <i-ph-stop-fill class="h-4 w-4" />
        </button>

        <!-- 时间显示 -->
        <span class="shrink-0 font-mono text-xs text-muted">
          {{ formatTime(currentTimeMs) }} / {{ formatTime(endTimeMs) }}
        </span>

        <!-- Seek 进度条 -->
        <input
          type="range"
          class="seek-bar h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-alt accent-brand"
          :max="endTimeMs || 1"
          :value="seekValue"
          :disabled="!isPlayerReady"
          @mousedown="onSeekStart"
          @touchstart="onSeekStart"
          @change="onSeekEnd"
        />
      </div>

      <!-- AlphaTab 渲染区 -->
      <div
        v-if="src"
        ref="wrapper"
        class="at-wrap custom-scrollbar h-[calc(100vh-11rem)] w-full overflow-y-auto overflow-x-hidden"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
/* ============================================
   AlphaTab 走带游标（CSS 驱动，零 JS 计算）
============================================ */

/* 当前小节背景高亮 */
:deep(.at-cursor-bar) {
  background: color-mix(in srgb, var(--color-brand) 15%, transparent);
}

/* 节拍纵线 */
:deep(.at-cursor-beat) {
  background: var(--color-brand);
  width: 3px;
  opacity: 0.85;
}

/* 当前演奏音符的颜色 */
:deep(.at-highlight *) {
  fill: var(--color-brand);
  stroke: var(--color-brand);
}

/* 乐谱背景与主题卡片色一致 */
:deep(.at-surface) {
  background: white !important;
}

/* seek 滑块美化（WebKit） */
.seek-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: var(--color-brand);
  cursor: pointer;
}

/* 针对 Webkit 浏览器 (Chrome, Edge, Safari) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* 纤细的滚动条 */
}

.custom-scrollbar::-webkit-scrollbar-button {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* 轨道透明 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  /* 使用半透明灰色，圆角设计 */
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 9999px; /* 对应 tailwind 的 rounded-full */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8); /* 悬停时加深 */
}

/* 针对 Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
}

/* 如果你的项目支持深色模式 (dark mode)，可以自动适配 */
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.2);
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
.dark .custom-scrollbar {
  scrollbar-color: rgba(156, 163, 175, 0.2) transparent;
}
</style>
