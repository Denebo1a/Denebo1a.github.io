<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRoute } from "vitepress";
import {
  closeGlobalSettings,
  useGlobalSettings,
} from "../../composables/useGlobalSettings";

import ThemePicker from "../settingsOptions/ThemePicker.vue";
import ContextMenuToggle from "../settingsOptions/ContextMenuToggle.vue";
import RouteLoadingToggle from "../settingsOptions/RouteLoadingToggle.vue";

const route = useRoute();
const dialogRef = ref<HTMLElement | null>(null);
const lastActiveElement = ref<HTMLElement | null>(null);
const { settingsState } = useGlobalSettings();

const isVisible = computed(() => settingsState.isOpen);

const handleClose = () => {
  closeGlobalSettings();
};

const lockBodyScroll = (locked: boolean) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = locked ? "hidden" : "";
};

const restoreFocus = () => {
  if (lastActiveElement.value instanceof HTMLElement) {
    lastActiveElement.value.focus();
  }
  lastActiveElement.value = null;
};

const focusDialog = async () => {
  await nextTick();
  dialogRef.value?.focus();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isVisible.value) return;

  if (event.key === "Escape") {
    event.preventDefault();
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  lockBodyScroll(false);
});

watch(
  () => isVisible.value,
  async (visible) => {
    if (visible) {
      lastActiveElement.value = document.activeElement as HTMLElement | null;
      lockBodyScroll(true);
      await focusDialog();
      return;
    }

    lockBodyScroll(false);
    restoreFocus();
  },
);

watch(
  () => route.path,
  () => {
    handleClose();
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="global-settings-fade">
      <div
        v-if="isVisible"
        class="global-settings-overlay"
        @click="handleClose"
      >
        <div class="global-settings-backdrop" />

        <section
          ref="dialogRef"
          class="global-settings-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-settings-title"
          tabindex="-1"
          @click.stop
        >
          <header class="global-settings-header">
            <div class="flex items-center gap-2">
              <i-material-symbols-settings-outline-rounded class="text-brand" />
              <span class="text-lg font-bold text-main">全局设置</span>
            </div>

            <button
              type="button"
              aria-label="关闭设置"
              @click="handleClose"
              class="rounded-full p-1 text-muted transition-all duration-300 ease-in-out hover:bg-brand-light hover:text-brand active:scale-95"
            >
              <i-material-symbols-close-rounded class="h-5 w-5" />
            </button>
          </header>

          <div class="global-settings-body">
            <ThemePicker />
            <ContextMenuToggle />
            <RouteLoadingToggle />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.global-settings-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.global-settings-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
}

.global-settings-panel {
  position: relative;
  z-index: 1;
  width: min(100%, 42rem);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  background: var(--color-bg-card);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.18);
}

.global-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 20px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--color-border) 75%, transparent);
}

.global-settings-close:hover {
  background: var(--color-bg-alt);
  color: var(--color-text-main);
}

.global-settings-close:active {
  transform: scale(0.94);
}

.global-settings-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.global-settings-fade-enter-active,
.global-settings-fade-leave-active {
  transition: opacity 0.22s ease;
}

.global-settings-fade-enter-active .global-settings-panel,
.global-settings-fade-leave-active .global-settings-panel {
  transition:
    transform 0.24s ease,
    opacity 0.24s ease;
}

.global-settings-fade-enter-from,
.global-settings-fade-leave-to {
  opacity: 0;
}

.global-settings-fade-enter-from .global-settings-panel,
.global-settings-fade-leave-to .global-settings-panel {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

@media (max-width: 640px) {
  .global-settings-overlay {
    align-items: flex-end;
    padding: 0.75rem;
  }

  .global-settings-panel {
    width: 100%;
    border-radius: 1.25rem;
  }

  .global-settings-header,
  .global-settings-body {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
