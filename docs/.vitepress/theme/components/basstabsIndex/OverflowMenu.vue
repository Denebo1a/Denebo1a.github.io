<script setup lang="ts">
import { computed } from "vue";
import { useBassTabsIndex } from "../../composables/useBassTabsIndex";
import type { BassTabItem } from "../../composables/useBassTabsIndex";

const props = defineProps<{
  tab: BassTabItem;
}>();

const { buildTabLinks } = useBassTabsIndex();
const links = computed(() => buildTabLinks(props.tab));
</script>

<template>
  <div class="absolute right-3 top-3 z-10" @click.stop>
    <el-dropdown trigger="click" placement="bottom-end">
      <div
        class="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <button
          class="flex h-5 w-7 items-center justify-center rounded-full bg-card text-main shadow-card transition-colors hover:bg-brand-light"
        >
          <i-ph-dots-three-bold class="h-5 w-5" />
        </button>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <template v-if="links.length > 0">
            <el-dropdown-item v-for="link in links" :key="link.label">
              <a
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex w-36 items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <div class="h-4 w-4 text-brand">
                    <i-ant-design-bilibili-outlined
                      v-if="link.icon === 'bilibili'"
                    />
                    <i-ant-design-baidu-outlined
                      v-else-if="link.icon === 'baidu'"
                    />
                    <i-ph-cloud-bold v-else />
                  </div>
                  <span class="text-main">{{ link.label }}</span>
                </div>
                <div
                  v-if="link.icon !== 'bilibili'"
                  class="flex items-center gap-0.5 rounded-full bg-brand-light px-1 py-0.5 text-[0.7rem] text-brand"
                >
                  <i-material-symbols-lock />
                  <span>BASS</span>
                </div>
              </a>
            </el-dropdown-item>
          </template>
          <el-dropdown-item v-else disabled> 暂无外链 </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
