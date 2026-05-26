<script setup lang="ts">
import BaseImage from "../common/BaseImage.vue";

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    title?: string;
  }>(),
  {
    alt: "",
    title: "",
  },
);
</script>

<template>
  <figure class="md-image" :class="{ 'has-caption': Boolean(props.title) }">
    <BaseImage
      :src="props.src"
      :alt="props.alt"
      :title="props.title"
      img-class="md-image__img"
    />

    <figcaption v-if="props.title" class="md-image__caption">
      {{ props.title }}
    </figcaption>
  </figure>
</template>

<style scoped>
.md-image {
  margin: 2rem 0;
}

.md-image__caption {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}
</style>
