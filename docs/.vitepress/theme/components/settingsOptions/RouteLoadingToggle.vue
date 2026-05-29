<template>
  <div class="flex items-center justify-between gap-4">
    <SettingsText
      optionLabel="页面切换动画"
      optionDescription="是否开启页面切换时的加载动画"
    />
    <el-switch v-model="isEnabled" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import SettingsText from "../items/SettingsText.vue";
import { usePreferences } from "../../composables/usePreferences";

const {
  isRouteLoadingOverlayEnabled,
  setRouteLoadingOverlayEnabled,
  initPreferences,
} = usePreferences();

const isEnabled = computed({
  get: () => isRouteLoadingOverlayEnabled.value,
  set: (value: boolean) => {
    setRouteLoadingOverlayEnabled(value);
  },
});

onMounted(() => {
  initPreferences();
});
</script>
