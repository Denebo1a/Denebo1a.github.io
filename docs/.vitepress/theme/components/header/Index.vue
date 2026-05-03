<template>
  <!-- Index 组件内部实现 -->
  <a
    :href="url"
    class="group relative inline-flex items-center justify-center overflow-hidden rounded-full duration-300 ease-out will-change-transform"
    style="transition-property: transform, padding, gap"
    :class="[
      compact ? 'gap-0 px-2.5 py-1.5' : 'gap-1.5 px-3 py-1.5',
      ActiveStatus ? 'scale-105' : 'hover:scale-105 active:scale-95',
    ]"
  >
    <div
      class="will-change-opacity absolute inset-0 rounded-full bg-brand duration-300"
      style="transition-property: opacity"
      :class="ActiveStatus ? 'opacity-10' : 'opacity-0 group-hover:opacity-10'"
    ></div>

    <div
      class="relative z-10 flex items-center duration-300"
      style="transition-property: color, gap"
      :class="[
        compact ? 'gap-0' : 'gap-1.5',
        ActiveStatus ? 'text-brand' : 'text-main group-hover:text-brand',
      ]"
    >
      <component :is="icon" class="block h-4 w-4 shrink-0 sm:h-5 sm:w-5" />

      <!-- 这里同样没有 truncate，利用父级的溢出隐藏直接裁剪 -->
      <div
        class="grid duration-300 ease-out"
        style="
          transition-property: grid-template-columns, opacity, transform;
          will-change: grid-template-columns, opacity, transform;
        "
        :class="
          compact
            ? 'translate-x-1 grid-cols-[0fr] opacity-0'
            : 'translate-x-0 grid-cols-[1fr] opacity-100'
        "
      >
        <span
          class="min-w-0 overflow-hidden whitespace-nowrap text-sm font-medium"
        >
          {{ title }}
        </span>
      </div>
    </div>
  </a>
</template>

<script setup>
defineProps({
  url: String,
  ActiveStatus: Boolean,
  icon: Object,
  title: String,
  compact: Boolean,
});
</script>
