<template>
  <!-- 垂直分割线 -->
  <div
    v-if="vertical"
    role="separator"
    aria-orientation="vertical"
    class="color-muted inline-block self-stretch align-middle"
    :class="[
      dashed
        ? 'w-0 border-l border-dashed border-[var(--color-border)]'
        : solid
          ? 'w-[1px] bg-[var(--color-border)]'
          : 'w-[1px] bg-gradient-to-b from-transparent via-[var(--color-border)] to-transparent',
      margin || 'mx-4 my-1', // 默认垂直边距
    ]"
  ></div>

  <!-- 水平分割线 -->
  <div
    v-else
    role="separator"
    aria-orientation="horizontal"
    class="color-muted flex w-full items-center"
    :class="margin || 'my-8'"
  >
    <!-- 左侧线条 -->
    <div
      class="transition-all duration-300"
      :class="[
        align === 'left' ? 'w-8' : 'flex-1',
        dashed
          ? 'border-t border-dashed border-[var(--color-border)]'
          : solid
            ? 'h-[1px] bg-[var(--color-border)]'
            : 'h-[1px] bg-gradient-to-r from-transparent via-[var(--color-border)] to-[var(--color-border)]',
        // 如果没有内容，左侧渐变直接横跨，不需要在末尾保持实色（仅对渐变样式生效）
        !$slots.default && !dashed && !solid ? '!to-transparent' : '',
      ]"
    ></div>

    <!-- 中间内容 (插槽) -->
    <div
      v-if="$slots.default"
      class="px-4 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
    >
      <slot></slot>
    </div>

    <!-- 右侧线条 -->
    <div
      v-if="$slots.default || align !== 'center'"
      class="transition-all duration-300"
      :class="[
        align === 'right' ? 'w-8' : 'flex-1',
        dashed
          ? 'border-t border-dashed border-[var(--color-border)]'
          : solid
            ? 'h-[1px] bg-[var(--color-border)]'
            : 'h-[1px] bg-gradient-to-l from-transparent via-[var(--color-border)] to-[var(--color-border)]',
      ]"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  // 方向：水平 (false) 或 垂直 (true)
  vertical: {
    type: Boolean,
    default: false,
  },
  // 线条样式：虚线
  dashed: {
    type: Boolean,
    default: false,
  },
  // 线条样式：实线（无渐变）
  solid: {
    type: Boolean,
    default: false,
  },
  // 文本对齐方式：'left' | 'center' | 'right'
  align: {
    type: String,
    default: "center",
  },
  // 自定义外边距 (例如 'my-4', 'mx-2')
  margin: {
    type: String,
    default: "",
  },
});
</script>
