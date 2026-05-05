<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    title?: string;
    imgClass?: string;
    noZoom?: boolean;
  }>(),
  {
    alt: "",
    title: "",
    imgClass: "",
    noZoom: false,
  },
);

const loaded = ref(false);
const errored = ref(false);

const resetState = () => {
  loaded.value = false;
  errored.value = false;
};

const handleLoad = () => {
  loaded.value = true;
  errored.value = false;
};

const handleError = () => {
  loaded.value = false;
  errored.value = true;
};

watch(() => props.src, resetState);

const imageClassName = computed(() => [
  "base-image__img",
  props.imgClass,
  props.noZoom ? "no-zoom" : "",
  loaded.value ? "is-loaded" : "",
  errored.value ? "is-error" : "",
]);
</script>

<template>
  <div class="base-image">
    <div
      v-if="!loaded && !errored"
      class="base-image__skeleton"
      aria-hidden="true"
    />

    <img
      :src="props.src"
      :alt="props.alt"
      :title="props.title || undefined"
      :class="imageClassName"
      @load="handleLoad"
      @error="handleError"
    />

    <div v-if="errored" class="base-image__error" role="img" :aria-label="props.alt || '图片加载失败'">
      <span>图片加载失败</span>
    </div>
  </div>
</template>

<style scoped>
.base-image {
  position: relative;
  display: block;
  width: 100%;
  overflow: hidden;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-bg-alt) 78%, transparent);
}

.base-image__skeleton,
.base-image__error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.base-image__skeleton {
  background:
    linear-gradient(
      110deg,
      color-mix(in srgb, var(--color-bg-alt) 90%, transparent) 8%,
      color-mix(in srgb, var(--color-brand) 10%, var(--color-bg-alt) 90%) 18%,
      color-mix(in srgb, var(--color-bg-alt) 90%, transparent) 33%
    );
  background-size: 200% 100%;
  animation: base-image-skeleton 1.4s ease-in-out infinite;
}

.base-image__img {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.28s ease;
}

.base-image__img.is-loaded {
  opacity: 1;
}

.base-image__error {
  background: color-mix(in srgb, var(--color-bg-card) 92%, transparent);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@keyframes base-image-skeleton {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
