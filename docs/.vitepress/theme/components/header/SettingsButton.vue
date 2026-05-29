<template>
  <button
    type="button"
    class="minimal-settings-btn"
    aria-label="设置"
    aria-haspopup="dialog"
    :aria-expanded="settingsState.isOpen"
    @click="openGlobalSettings"
  >
    <i-material-symbols-settings class="settings-icon text-sm text-muted" />
  </button>
</template>

<script setup>
import {
  openGlobalSettings,
  useGlobalSettings,
} from "../../composables/useGlobalSettings";

const { settingsState } = useGlobalSettings();
</script>

<style scoped>
/* 外层按钮：负责布局、颜色过渡和点击时的缩放反馈 */
.minimal-settings-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  outline: none;

  /* 提前告知浏览器即将发生的变化，开启 GPU 加速 */
  will-change: transform, scale;

  /* 外层动画：背景色与文字颜色的平滑过渡 */
  transition:
    scale 0.2s cubic-bezier(0.2, 0, 0, 1),
    transform 0.2s cubic-bezier(0.2, 0, 0, 1); /* 点击时的缩放非常迅速利落 */
}

/* 内层图标：单独负责旋转 */
.settings-icon {
  width: 22px;
  height: 22px;
  will-change: transform;

  /* 核心丝滑感：使用带有轻微阻尼感的贝塞尔曲线 */
  /* 回退动画（鼠标移出时）稍微快一点 */
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Hover 时触发图标旋转（顺时针旋转 90 度，模拟拧开齿轮的动作） */
.minimal-settings-btn:hover .settings-icon {
  transform: rotate(90deg);
  /* Hover 时的进入动画，带有轻微的弹性 */
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  scale: 1.1;
}

/* Active 状态：点击时的微缩放反馈 */
.minimal-settings-btn:active {
  transform: scale(0.92);
  /* 点击时背景色稍微加深一点点，提升交互质感 */
  background-color: var(--color-bg-alt);
}
</style>
