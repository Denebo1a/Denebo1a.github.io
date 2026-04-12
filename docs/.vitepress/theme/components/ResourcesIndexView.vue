<script setup>
// 模拟数据
const bassTabs = [
  {
    id: 1,
    title: "祝福 (The Blessing)",
    artist: "YOASOBI · 高阶 Slap",
    cover: "/covers/blessing-cover.jpg",
    link: "/basstabs/blessing.pdf",
    type: "PDF",
  },
  {
    id: 2,
    title: "星座 (Constellation)",
    artist: "Bocchi the Rock! · 拨片",
    cover: "/covers/constellation-cover.jpg",
    link: "/basstabs/constellation.gp5",
    type: "GP5",
  },
  {
    id: 3,
    title: "夜に駆ける",
    artist: "YOASOBI · 指弹",
    cover: "/covers/yoru-cover.jpg",
    link: "#",
    type: "PDF",
  },
  {
    id: 4,
    title: "群青",
    artist: "YOASOBI · 综合",
    cover: "/covers/gunjo-cover.jpg",
    link: "#",
    type: "GP5",
  },
];
</script>

<template>
  <section class="w-full overflow-hidden py-8">
    <div class="mb-8 flex items-center justify-between px-6 md:px-8">
      <div class="flex items-center gap-3">
        <Icon
          icon="ph:record-fill"
          class="h-8 w-8 text-brand transition-colors"
        />
        <h2
          class="text-2xl font-extrabold tracking-tight text-main transition-colors"
        >
          Bass Tabs
        </h2>
      </div>
      <a
        href="/resources"
        class="text-sm font-bold text-brand transition-colors hover:underline"
      >
        View All
      </a>
    </div>

    <div
      class="hide-scrollbar flex w-full gap-8 overflow-x-auto px-6 pb-16 pt-8 md:px-8"
    >
      <div
        v-for="tab in bassTabs"
        :key="tab.id"
        class="perspective-1000 w-64 shrink-0 transition-transform duration-500 hover:-translate-y-3 md:w-72"
      >
        <a :href="tab.link" target="_blank" class="group block">
          <div
            class="preserve-3d rotate-crate group-hover:rotate-flat relative cursor-pointer transition-transform duration-700"
          >
            <div
              class="relative aspect-square w-full overflow-hidden rounded-md bg-alt shadow-[20px_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-black/5 transition-shadow duration-700 dark:shadow-[20px_20px_60px_rgba(0,0,0,0.4)] dark:ring-white/10"
            >
              <img
                v-if="tab.cover"
                :src="tab.cover"
                :alt="tab.title"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-card"
              >
                <Icon
                  icon="ph:music-notes-simple-bold"
                  class="h-12 w-12 text-muted opacity-30"
                />
              </div>

              <span
                class="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-[0.65rem] font-bold tracking-widest text-white backdrop-blur-md"
              >
                {{ tab.type }}
              </span>
            </div>

            <div class="mt-6 flex flex-col">
              <h3
                class="line-clamp-1 text-xl font-bold text-main transition-colors group-hover:text-brand"
              >
                {{ tab.title }}
              </h3>
              <p class="mt-1 text-sm font-medium text-muted transition-colors">
                {{ tab.artist }}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 隐藏丑陋的滚动条 */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* =========================================
   3D 唱片箱核心 CSS
========================================= */

/* 1. 定义观察者的镜头距离（值越小，透视畸变越严重；1000px 是最舒适的物理距离） */
.perspective-1000 {
  perspective: 1000px;
}

/* 2. 保持子元素的 3D 空间关系 */
.preserve-3d {
  transform-style: preserve-3d;
}

/* 3. 初始的倾斜状态：向左转 12 度，向上仰 5 度 */
.rotate-crate {
  transform: rotateY(-12deg) rotateX(5deg);
}

/* 4. 悬浮时的展平状态：恢复到 0 度直视 */
.rotate-flat {
  transform: rotateY(0deg) rotateX(0deg);
}
</style>
