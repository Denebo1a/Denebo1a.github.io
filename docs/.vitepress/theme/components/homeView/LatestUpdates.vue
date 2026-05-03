<template>
  <div
    class="flex h-96 flex-col overflow-hidden rounded-[1.5rem] border border-color bg-card shadow-card"
  >
    <div class="flex shrink-0 items-center border-b border-color p-4 pb-2">
      <div class="flex items-center gap-2">
        <div
          class="h-3 w-3 rounded-full bg-brand ring-2 ring-brand-light"
        ></div>
        <h2 class="text-[1rem] font-bold text-main">最新动态</h2>
      </div>
    </div>

    <div
      class="custom-scrollbar flex-1 overflow-y-auto overflow-x-hidden pr-4 pt-4"
    >
      <el-timeline class="home-updates-timeline">
        <el-timeline-item
          v-for="item in latestUpdates"
          :key="`${item.type}-${item.url}`"
          placement="top"
          :timestamp="item.date.string + ' 上传了'"
          class="home-updates-timeline-item"
        >
          <template #dot>
            <div
              class="flex h-5 w-5 -translate-x-1 items-center justify-center rounded-full border-2 border-brand bg-card"
            >
              <i-ph-music-notes-fill
                v-if="item.type === 'basstab'"
                class="h-3 w-3 text-brand"
              />
              <i-ph-text-align-left-bold
                v-else-if="item.type === 'blog'"
                class="h-3 w-3 text-brand"
              />
              <i-ph-dots-three-outline-vertical-fill
                v-else
                class="h-3 w-3 text-brand"
              />
            </div>
          </template>

          <div
            class="group flex flex-col rounded-[1rem] border border-color px-2 py-2 shadow-card transition-colors hover:border-brand hover:bg-brand-light"
          >
            <div
              class="flex cursor-pointer items-center justify-between"
              @click="router.go(item.url)"
            >
              <div class="flex items-center gap-2">
                <span
                  class="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[12px] font-bold text-white"
                  >{{ item.typeLabel }}</span
                >
                <span
                  class="font group text-[15px] leading-relaxed text-muted transition-colors group-hover:text-brand"
                >
                  {{ item.title }}
                </span>
              </div>
              <div class="bg flex h-6 w-6 items-center">
                <i-ph-arrow-square-out-bold
                  class="h-4 w-4 text-muted group-hover:text-brand"
                />
              </div>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { latestUpdates } from "../../data/latestUpdates";
</script>
