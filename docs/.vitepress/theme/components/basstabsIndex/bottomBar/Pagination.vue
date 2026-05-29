<template>
  <div
    v-if="totalPages > 1"
    class="rounded-full border border-color bg-card px-3 py-2 shadow-card"
  >
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      size="small"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalTabs"
      :page-count="totalPages"
      pager-count="7"
      @current-change="setCurrentPage"
    />
  </div>
</template>

<script setup lang="ts">
import { useBassTabsIndex } from "../../../composables/useBassTabsIndex";

const { currentPage, pageSize, totalTabs, totalPages, setCurrentPage } =
  useBassTabsIndex();
</script>
