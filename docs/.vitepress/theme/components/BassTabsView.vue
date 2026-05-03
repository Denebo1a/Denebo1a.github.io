<script setup>
import { ref, computed } from "vue";
import { data as allTabs } from "../../../resources/basstabs/basstabs.data";

// --- 筛选状态 ---
const searchQuery = ref("");
const selectedGenre = ref("全部");
const selectedArtist = ref("");

const genres = ["全部", "虚拟歌手", "偶像音乐企划", "邦摇"];

// --- 提取唯一艺术家列表 ---
const artists = computed(() => {
  const set = new Set(allTabs.map((t) => t.artist).filter(Boolean));
  return Array.from(set);
});

// --- 艺术家头像首字符 ---
const artistInitial = (name) => {
  if (!name) return "?";
  // 取第一个非空白字符
  return name.trim()[0].toUpperCase();
};

const toggleArtist = (artist) => {
  selectedArtist.value = selectedArtist.value === artist ? "" : artist;
};

// --- 过滤 ---
const filteredTabs = computed(() => {
  const q = searchQuery.value.toLowerCase();
  return allTabs.filter((t) => {
    const matchesSearch = !q || t.title?.toLowerCase().includes(q);
    const matchesGenre =
      selectedGenre.value === "全部" || t.genre === selectedGenre.value;
    const matchesArtist =
      !selectedArtist.value || t.artist === selectedArtist.value;
    return matchesSearch && matchesGenre && matchesArtist;
  });
});

// --- 溢出菜单的外链列表（过滤空值）---
const getLinks = (tab) => {
  const links = [];
  if (tab.bilibiliUrl)
    links.push({ label: "B站视频", icon: "bilibili", url: tab.bilibiliUrl });
  if (tab.baiduDiskUrl)
    links.push({ label: "百度网盘", icon: "baidu", url: tab.baiduDiskUrl });
  if (tab.lanzouUrl)
    links.push({ label: "蓝奏云", icon: "lanzou", url: tab.lanzouUrl });
  return links;
};
</script>

<template>
  <div class="relative flex min-h-[160vh] w-full gap-0">
    <!-- 左侧艺术家栏 -->
    <aside
      class="fixed right-6 top-1/2 flex max-h-[calc(100vh-5rem)] w-16 shrink-0 flex-col items-center gap-3 overflow-y-auto rounded-full border border-color bg-card py-2"
    >
      <el-tooltip
        v-for="artist in artists"
        :key="artist"
        :content="artist"
        placement="right"
        :show-after="200"
      >
        <button
          @click="toggleArtist(artist)"
          class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200"
          :class="
            selectedArtist === artist
              ? 'ring-brand/50 scale-110 bg-brand text-white shadow-brand ring-2'
              : 'bg-alt text-main hover:scale-105 hover:bg-brand-light hover:text-brand'
          "
        >
          {{ artistInitial(artist) }}
        </button>
      </el-tooltip>
    </aside>

    <!-- 主内容区 -->
    <div class="min-w-0 flex-1 pt-6">
      <!-- Sticky 筛选条 -->
      <div
        class="bg-base/90 sticky top-0 z-10 border-b border-color px-6 py-3 backdrop-blur-sm"
      >
        <div class="flex flex-wrap items-center gap-3">
          <el-input
            v-model="searchQuery"
            placeholder="搜索曲名..."
            clearable
            class="!w-96"
          >
            <template #prefix>
              <i-ph-magnifying-glass-bold class="h-4 w-4 text-muted" />
            </template>
          </el-input>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="genre in genres"
              :key="genre"
              @click="selectedGenre = genre"
              class="rounded-full px-3 py-1 text-sm font-semibold transition-all duration-200"
              :class="
                selectedGenre === genre
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-alt text-muted hover:bg-brand-light hover:text-brand'
              "
            >
              {{ genre }}
            </button>
          </div>

          <span
            v-if="selectedArtist"
            class="flex items-center gap-1 rounded-full bg-brand-light px-3 py-1 text-sm font-semibold text-brand"
          >
            <i-material-symbols-artist class="h-4 w-4" />
            <span>{{ selectedArtist }}</span>
            <button
              @click="selectedArtist = ''"
              class="text-muted hover:text-brand"
            >
              <i-ph-x-bold class="h-3 w-3" />
            </button>
          </span>
        </div>
      </div>

      <!-- 卡片网格 -->
      <div class="p-6">
        <p
          v-if="filteredTabs.length === 0"
          class="py-16 text-center text-muted"
        >
          暂无匹配的 TAB 谱
        </p>

        <div
          v-else
          class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        >
          <div
            v-for="tab in filteredTabs"
            :key="tab.url"
            class="perspective-1000 group relative"
          >
            <!-- 溢出菜单 -->
            <div class="absolute right-2 top-2 z-10" @click.stop>
              <el-dropdown trigger="click" placement="bottom-end">
                <button
                  class="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-black/70 group-hover:opacity-100"
                >
                  <i-ph-dots-three-bold class="h-4 w-4" />
                </button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <template v-if="getLinks(tab).length > 0">
                      <el-dropdown-item
                        v-for="link in getLinks(tab)"
                        :key="link.label"
                      >
                        <a
                          :href="link.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="flex items-center gap-2 text-main"
                        >
                          <i-ant-design-bilibili-outlined
                            v-if="link.icon === 'bilibili'"
                            class="h-4 w-4 text-brand"
                          />
                          <i-ph-cloud-arrow-down-bold
                            v-else-if="link.icon === 'baidu'"
                            class="h-4 w-4 text-brand"
                          />
                          <i-ph-cloud-bold v-else class="h-4 w-4 text-brand" />
                          {{ link.label }}
                          <div
                            class="flex items-center gap-0.5 rounded-full bg-brand-light px-1 py-0.5"
                            v-if="link.icon !== 'bilibili'"
                          >
                            <i-material-symbols-lock
                              class="h-3 w-3 text-brand"
                            />
                            <span class="text-[0.7rem] text-brand">BASS</span>
                          </div>
                        </a>
                      </el-dropdown-item>
                    </template>
                    <el-dropdown-item v-else disabled>
                      暂无外链
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <!-- 卡片主体 -->
            <a :href="tab.url" class="block">
              <div
                class="preserve-3d rotate-crate group-hover:rotate-flat cursor-pointer transition-transform duration-700"
              >
                <!-- 封面图 -->
                <div
                  class="relative aspect-square w-full overflow-hidden rounded-xl bg-alt shadow-[16px_16px_40px_rgba(0,0,0,0.1)] ring-1 ring-black/5 transition-shadow duration-700 group-hover:shadow-brand"
                >
                  <img
                    v-if="tab.cover"
                    :src="tab.cover"
                    :alt="tab.title"
                    class="h-full w-full object-cover"
                  />
                  <div
                    v-else
                    class="from-brand/20 to-brand/5 flex h-full w-full items-center justify-center bg-gradient-to-br"
                  >
                    <i-ph-music-notes-simple-bold
                      class="h-12 w-12 text-brand opacity-40"
                    />
                  </div>

                  <!-- genre 角标 -->
                  <span
                    class="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[0.8rem] font-bold tracking-wide text-white backdrop-blur-sm"
                  >
                    {{ tab.genre }}
                  </span>
                </div>

                <!-- 文字信息 -->
                <div class="mt-3 px-0.5">
                  <h3
                    class="line-clamp-1 text-sm font-bold text-main transition-colors group-hover:text-brand"
                  >
                    {{ tab.title }}
                  </h3>
                  <p class="mt-0.5 line-clamp-1 text-xs text-muted">
                    {{ tab.artist }}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.rotate-crate {
  transform: rotateY(-10deg) rotateX(4deg);
}
.rotate-flat {
  transform: rotateY(0deg) rotateX(0deg);
}
</style>
