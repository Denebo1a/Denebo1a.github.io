<template>
  <div class="flex flex-col">
    <SettingsText optionLabel="主题" optionDescription="选择博客的外观主题" />
    <el-segmented
      v-model="selectedTheme"
      :options="themeOptions"
      block
      class="theme-picker"
    >
      <template #default="{ item }">
        <div class="flex items-center justify-center gap-2 p-2">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </template>
    </el-segmented>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import SettingsText from "../items/SettingsText.vue";
import { useTheme } from "../../composables/useTheme";

const { themes, currentTheme, setTheme, initTheme } = useTheme();

const themeOptions = computed(() =>
  themes.map((theme) => ({
    label: theme.name,
    value: theme.id,
    icon: theme.icon,
  })),
);

const selectedTheme = computed({
  get: () => currentTheme.value,
  set: (value: string) => {
    setTheme(value);
  },
});

onMounted(() => {
  initTheme();
});
</script>

<style scoped>
:deep(.theme-picker .el-segmented__item-selected) {
  color: var(--color-brand);
}
</style>
