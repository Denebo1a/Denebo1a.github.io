<template>
  <Transition name="floating-pagination-route" mode="out-in">
    <div
      :key="route.path"
      class="fixed left-1/2 z-40 -translate-x-1/2 duration-200"
      :style="{
        bottom: `${bottomOffset}px`,
        transitionProperty: 'bottom, opacity, transform',
      }"
    >
      <div
        class="rounded-full border border-color bg-card px-3 py-2 shadow-card"
      >
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          size="small"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-count="totalPages"
          pager-count="10"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRoute } from "vitepress";
import { useFooterAwareBottomOffset } from "../../composables/useFooterAwareBottomOffset";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["current-change"]);

const route = useRoute();
const { bottomOffset } = useFooterAwareBottomOffset();

const handleCurrentChange = (page) => {
  emit("current-change", page);
};
</script>

<style scoped>
.floating-pagination-route-enter-active,
.floating-pagination-route-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.floating-pagination-route-enter-from,
.floating-pagination-route-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
