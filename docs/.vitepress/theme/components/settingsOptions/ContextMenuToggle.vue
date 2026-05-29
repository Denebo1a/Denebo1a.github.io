<template>
  <div class="flex items-center justify-between gap-4">
    <SettingsText
      optionLabel="右键菜单"
      optionDescription="是否使用站内右键菜单覆盖浏览器原生菜单"
    />
    <el-switch v-model="isEnabled" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import SettingsText from "../items/SettingsText.vue";
import { usePreferences } from "../../composables/usePreferences";

const {
  isCustomContextMenuEnabled,
  setCustomContextMenuEnabled,
  initPreferences,
} = usePreferences();

const isEnabled = computed({
  get: () => isCustomContextMenuEnabled.value,
  set: (value: boolean) => {
    setCustomContextMenuEnabled(value);
  },
});

onMounted(() => {
  initPreferences();
});
</script>
