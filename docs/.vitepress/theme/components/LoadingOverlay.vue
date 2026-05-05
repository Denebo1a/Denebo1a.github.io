<script setup lang="ts">
const props = defineProps<{
  visible: boolean;
}>();
</script>

<template>
  <Transition name="route-loading">
    <div
      v-if="props.visible"
      class="route-loading-overlay"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="route-loading-backdrop" />

      <div class="route-loading-wrapper">
        <div class="route-loading-content">
          <span class="route-loading-star" aria-hidden="true">✦</span>
          <span class="route-loading-text"
            ><span class="text-main">Dene</span
            ><span class="text-brand">Blog</span></span
          >
        </div>

        <!-- 底部等宽循环进度条 -->
        <div class="route-loading-progress" aria-hidden="true">
          <div class="route-loading-progress-bar" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.route-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.route-loading-backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top,
      color-mix(in srgb, var(--color-brand) 16%, transparent),
      transparent 48%
    ),
    color-mix(in srgb, var(--color-bg-base) 88%, transparent);
  backdrop-filter: blur(12px);
}

/* 居中自适应宽度的垂直容器 */
.route-loading-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch; /* 确保进度条自动拉伸至与内容完全等宽 */
  gap: 0.6rem; /* 元素上下间距 */
}

.route-loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem; /* 稍微拉开一点间距，给放大的星星留出呼吸空间 */
}

/* 四芒星核心优化区 */
.route-loading-star {
  font-size: 2.5rem;
  color: var(--color-brand);
  line-height: 1;
  /* 使用定制的 cubic-bezier 增加张力，起步蓄力，中间爆发，结尾平滑 */
  animation: star-dynamic-pulse 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

/* 文字部分：挂载时的一次性简单淡入动画 */
.route-loading-text {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  animation: text-fade-in 0.6s ease-out forwards;
}
.route-loading-progress {
  height: 3px;
  width: 100%;
  background: color-mix(in srgb, var(--color-brand) 15%, transparent);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.route-loading-progress-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40%;
  background: var(--color-brand);
  border-radius: 999px;
  animation: progress-loop 1.6s ease-in-out infinite;
}

.route-loading-enter-active,
.route-loading-leave-active {
  transition: opacity 0.28s ease;
}

.route-loading-enter-active .route-loading-panel,
.route-loading-leave-active .route-loading-panel {
  transition:
    transform 0.32s ease,
    opacity 0.32s ease;
}

.route-loading-enter-from,
.route-loading-leave-to {
  opacity: 0;
}

.route-loading-enter-from .route-loading-panel,
.route-loading-leave-to .route-loading-panel {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}

/* 极大化动态反差的关键帧 */
@keyframes star-dynamic-pulse {
  0% {
    opacity: 1;
    transform: scale(1) rotate(90deg);
  }
  50% {
    opacity: 0;
    transform: scale(0.4) rotate(-45deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

/* 文字一次性淡入动画 */
@keyframes text-fade-in {
  0% {
    opacity: 0;
    transform: translateY(6px); /* 配合淡入的一点点微小位移，让效果更平滑 */
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 进度条循环关键帧 */
@keyframes progress-loop {
  0% {
    left: -40%;
  }
  100% {
    left: 100%;
  }
}
</style>
