<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vitepress";
import { useBreadcrumbs } from "../../composables/useBreadcrumbs";

const route = useRoute();
const { breadcrumbs } = useBreadcrumbs();
const isExpanded = ref(false);
const measureRef = ref(null);
const expandedWidth = ref(40);
const animationDuration = ref(240);

let collapseTimer = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const measureExpandedWidth = async () => {
  await nextTick();

  const textWidth = measureRef.value?.scrollWidth ?? 0;
  const totalWidth = Math.ceil(textWidth + 12);
  expandedWidth.value = Math.max(40, totalWidth);

  const delta = Math.max(0, totalWidth - 40);
  animationDuration.value = clamp(180 + delta * 0.22, 200, 360);
};

const handleMouseEnter = async () => {
  if (collapseTimer) {
    clearTimeout(collapseTimer);
    collapseTimer = null;
  }

  await measureExpandedWidth();
  isExpanded.value = true;
};

const handleMouseLeave = () => {
  collapseTimer = window.setTimeout(() => {
    isExpanded.value = false;
    collapseTimer = null;
  }, 80);
};

watch(
  () => route.path,
  async () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }

    isExpanded.value = false;
    await measureExpandedWidth();
  },
);

watch(
  () =>
    breadcrumbs.value
      .map((crumb) => `${crumb.name}:${crumb.path ?? ""}`)
      .join("|"),
  async () => {
    await measureExpandedWidth();
  },
);

onMounted(() => {
  measureExpandedWidth();
});

onBeforeUnmount(() => {
  if (collapseTimer) {
    clearTimeout(collapseTimer);
  }
});
</script>

<template>
  <div class="fixed left-2 top-[4rem] z-40">
    <div
      class="group relative flex h-[40px] items-center overflow-hidden rounded-full border border-color bg-card text-main shadow-card ease-in-out"
      :style="{
        width: `${isExpanded ? expandedWidth : 40}px`,
        transitionProperty: 'width, border-color, background-color, box-shadow',
        transitionDuration: `${animationDuration}ms`,
      }"
      :aria-expanded="isExpanded"
      aria-label="面包屑导航"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <span
        class="absolute left-0 top-0 z-10 flex h-[40px] w-[40px] shrink-0 items-center justify-center"
      >
        <i-material-symbols-location-on
          class="h-[24px] w-[24px] text-2xl text-muted transition-colors duration-300 ease-in-out group-hover:text-brand"
        />
      </span>

      <div
        class="min-w-0 pl-[40px] pr-4"
        :style="{
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateX(0)' : 'translateX(-10%)',
          transitionProperty: 'opacity, transform',
          transitionDuration: `${Math.max(animationDuration - 20, 180)}ms`,
        }"
      >
        <nav aria-label="Breadcrumb" class="min-w-0">
          <ol
            class="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap"
          >
            <li
              v-for="(crumb, index) in breadcrumbs"
              :key="`${crumb.name}-${index}`"
              class="flex min-w-0 items-center gap-2"
            >
              <i-ph-caret-right-bold
                v-if="index !== 0"
                class="h-3 w-3 shrink-0 text-muted opacity-50"
              />
              <a
                v-if="crumb.path"
                :href="crumb.path"
                class="truncate rounded-md px-1 py-0.5 text-[0.8rem] font-semibold text-main transition-colors hover:bg-brand-light hover:text-brand"
              >
                {{ crumb.name }}
              </a>
              <span
                v-else
                class="truncate text-[0.8rem] font-bold text-muted"
                :title="crumb.name"
              >
                {{ crumb.name }}
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>

    <div
      class="pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden"
    >
      <div ref="measureRef" class="w-max pl-[40px] pr-4">
        <ol class="flex items-center gap-2 whitespace-nowrap">
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="`measure-${crumb.name}-${index}`"
            class="flex items-center gap-2"
          >
            <i-ph-caret-right-bold
              v-if="index !== 0"
              class="h-3 w-3 shrink-0 text-muted opacity-50"
            />
            <span
              class="rounded-md px-1 py-0.5 text-[0.8rem] font-semibold"
              :class="crumb.path ? 'text-main' : 'font-bold text-muted'"
            >
              {{ crumb.name }}
            </span>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
