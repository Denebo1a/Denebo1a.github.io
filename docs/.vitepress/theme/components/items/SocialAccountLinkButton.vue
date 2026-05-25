<template>
  <a :href="url" class="badge-bevel" target="_blank" rel="noopener noreferrer">
    <component :is="icon" v-if="icon" class="icon" />
    <span v-if="text" class="text">{{ text }}</span>
  </a>
</template>

<script setup>
defineProps({
  url: { type: String, default: "#" },
  icon: Object,
  text: String,
});
</script>

<style scoped>
.badge-bevel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  padding: 0 0.75rem;
  border-radius: 1rem;
  text-decoration: none;

  background-color: var(--color-bg-base);
  color: var(--color-text-muted);

  /* 核心：上方和左右边框较细，下方边框极粗，形成 3D 边缘厚度 */
  border: 1px solid var(--color-border);
  border-bottom-width: 3px;
  border-bottom-color: var(
    --color-border
  ); /* 比正常的 border 稍微深一点点，增强厚度阴影 */

  transition: all 0.15s ease-out;
}

.badge-bevel .icon {
  width: 1.25rem;
  height: 1.25rem;
}

.badge-bevel:hover {
  background-color: var(--color-brand-light);
  color: var(--color-brand);
  border-color: var(--color-brand);
  border-bottom-color: var(--color-brand-dark);
}

.badge-bevel:active {
  /* 点击核心逻辑：下边框变细（被按扁），同时整体向下位移填补边框减少的高度 */
  border-bottom-width: 1px;
  transform: translateY(2px);
}
</style>
