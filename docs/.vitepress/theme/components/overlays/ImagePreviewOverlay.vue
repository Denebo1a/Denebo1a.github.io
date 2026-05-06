<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vitepress";
import {
  closeImagePreview,
  useImagePreview,
} from "../../composables/useImagePreview";

const route = useRoute();
const { previewState } = useImagePreview();

const isVisible = computed(
  () => previewState.isOpen && Boolean(previewState.src),
);

const handleClose = () => {
  closeImagePreview();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    handleClose();
  }
};

const bindScrollClose = () => {
  const scrollRoot = document.getElementById("site-main-scroll");
  scrollRoot?.addEventListener("scroll", handleClose, { passive: true });
  return scrollRoot;
};

let scrollRoot: HTMLElement | null = null;

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleClose);
  scrollRoot = bindScrollClose();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleClose);
  scrollRoot?.removeEventListener("scroll", handleClose);
});

watch(
  () => route.path,
  () => {
    handleClose();
    scrollRoot?.removeEventListener("scroll", handleClose);
    scrollRoot = bindScrollClose();
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="image-preview-fade">
      <div v-if="isVisible" class="image-preview-overlay" @click="handleClose">
        <div class="image-preview-backdrop" />

        <div class="image-preview-wrapper">
          <img
            :src="previewState.src"
            :alt="previewState.alt"
            :title="previewState.title || undefined"
            class="image-preview-image"
            @click="handleClose"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.image-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.image-preview-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
}

.image-preview-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.image-preview-image {
  display: block;
  max-width: min(100%, 1280px);
  max-height: 100%;
  border-radius: 1rem;
  cursor: zoom-out;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
}

.image-preview-fade-enter-active,
.image-preview-fade-leave-active {
  transition:
    opacity 0.22s ease,
    backdrop-filter 0.3s ease;
}

.image-preview-fade-enter-to .image-preview-backdrop,
.image-preview-fade-leave-from .image-preview-backdrop {
  backdrop-filter: blur(10px);
}

.image-preview-fade-enter-active .image-preview-image,
.image-preview-fade-leave-active .image-preview-image {
  transition:
    transform 0.24s ease,
    opacity 0.24s ease;
}

.image-preview-fade-enter-from,
.image-preview-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.image-preview-fade-enter-from .image-preview-image,
.image-preview-fade-leave-to .image-preview-image {
  opacity: 0;
  transform: scale(0.96);
}
</style>
