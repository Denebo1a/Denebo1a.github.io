<template>
  <div class="tags-cloud s-card">
    <!-- 动态绑定精准 maxHeight -->
    <div
      ref="tagsWrapper"
      class="all-tags"
      :class="{ 'is-expanded': isExpanded }"
      :style="{ maxHeight: isExpanded ? `${actualHeight}px` : '75px' }"
    >
      <Tag
        v-for="(tag, index) in allTags"
        :key="index"
        :tag="tag"
        :isActive="selectedTags.includes(tag)"
        @click="toggleTag(tag)"
        class="tag-item"
      />
    </div>

    <!-- 展开/收起 切换按钮 -->
    <button
      class="more-tags text-sm text-muted"
      @click="isExpanded = !isExpanded"
    >
      <!-- 将两个图标合并为一个，利用 CSS 实现丝滑旋转翻转 -->
      <i-material-symbols-keyboard-double-arrow-down-rounded
        class="expand-icon"
        :class="{ 'is-rotated': isExpanded }"
      />
      <span>
        {{ isExpanded ? "收起标签" : "展开全部" }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Tag from "../../items/Tag.vue";

const props = defineProps({
  allTags: {
    type: Array,
    default: () => [],
  },
});

const selectedTags = defineModel();

const isExpanded = ref(false);

// 新增：用于精准计算高度的响应式变量
const tagsWrapper = ref(null);
const actualHeight = ref(0);
let resizeObserver = null;

onMounted(() => {
  // 使用 ResizeObserver 动态获取真实的 DOM 内容高度 (scrollHeight)
  // 它可以完美处理窗口缩放、标签文字换行导致的高度变化
  resizeObserver = new ResizeObserver(() => {
    if (tagsWrapper.value) {
      // 获取真实高度，且确保不低于初始折叠高度 75px
      actualHeight.value = Math.max(tagsWrapper.value.scrollHeight, 75);
    }
  });

  if (tagsWrapper.value) {
    resizeObserver.observe(tagsWrapper.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect(); // 防止内存泄漏
  }
});

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};
</script>

<style scoped>
/* 基础卡片样式 */
.tags-cloud {
  background-color: var(--color-bg-base);
  border-radius: 10px;
  padding: 10px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border);
}

/* 标题栏区域 (保持不变) */
.tags-cloud .title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.tags-cloud .title .icon {
  font-size: 20px;
  color: var(--color-brand);
}

.tags-cloud .title .title-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-main);
}

/* 标签容器基础样式 */
.tags-cloud .all-tags {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  overflow: hidden;
  /* 使用贝塞尔曲线，赋予动画物理惯性，比 ease 更丝滑高级 */
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tags-cloud .all-tags .tag-item {
  cursor: pointer;
}

/* 渐变遮罩伪元素 */
.tags-cloud .all-tags::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px; /* 修改为固定值即可，不需要百分比 */
  background-image: linear-gradient(to top, var(--color-bg-base), transparent);
  pointer-events: none;
  opacity: 1;
  /* 遮罩的过渡时间与高度动画保持一致 */
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tags-cloud .all-tags.is-expanded::after {
  opacity: 0;
}

/* 展开/收起按钮 */
.tags-cloud .more-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px; /* 让图标和文字间有一点间距 */
  width: 100%;
  height: 24px;
  margin-top: 8px;
  border-radius: 9999px;
  font-size: 14px;
  cursor: pointer;
  background-color: transparent;
  border: none; /* 确保无默认边框 */
  transition: all 0.3s ease-in-out;
}

.tags-cloud .more-tags:hover {
  color: var(--color-brand);
  background-color: var(--color-brand-light);
}

/* --- 新增：箭头图标旋转动画 --- */
.tags-cloud .expand-icon {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.tags-cloud .expand-icon.is-rotated {
  transform: rotate(180deg);
}
</style>
