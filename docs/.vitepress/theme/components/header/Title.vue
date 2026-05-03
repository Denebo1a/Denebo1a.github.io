<template>
  <div class="flex items-center gap-1">
    <!-- 1. 主标题（Logo）优化 -->
    <!-- 添加了 active:scale-[0.97] 增加点击时的物理阻尼感 -->
    <a
      href="/"
      class="flex items-center rounded-lg px-2 py-1 text-2xl font-bold tracking-tight text-main duration-300 ease-out hover:scale-[1.02] active:scale-[0.97]"
      style="
        transition-property: background-color, transform;
        will-change: background-color, transform;
      "
    >
      Dene<span class="text-brand">Blog</span>
    </a>

    <!-- 2. GitHub 源码链接优化 -->
    <!-- 拆分了背景与图标的动画，背景柔和出现，图标带有弹性缩放 -->
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/Denebo1a/Denebo1a.github.io"
      class="group flex h-8 w-8 items-center justify-center rounded-xl text-main duration-300 ease-out active:scale-90"
      style="
        transition-property: background-color, color, transform;
        will-change: background-color, color, transform;
      "
    >
      <!-- 图标在 Hover 时轻微放大，结合外层的点击缩小，手感绝佳 -->
      <i-ant-design-github-filled
        class="h-5 w-5 duration-300 group-hover:scale-110"
        style="
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        "
      />
    </a>
  </div>
</template>

<script setup>
defineProps({
  isHeaderTransparent: Boolean,
});
</script>
