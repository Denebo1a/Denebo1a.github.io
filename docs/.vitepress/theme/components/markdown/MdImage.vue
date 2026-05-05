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
  <BaseImage
    :src="props.src"
    :alt="props.alt"
    :title="props.title"
    img-class="md-image__img"
  />
</template>
