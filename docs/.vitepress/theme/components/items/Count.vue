<template>
  <div
    class="flex items-center gap-1 font-bold text-muted"
    :class="{
      'text-xs': props.size === 'small',
      'text-sm': props.size === 'medium',
    }"
  >
    <el-tooltip :content="types[props.type].label">
      <component :is="types[props.type].icon" />
    </el-tooltip>
    <slot></slot>
  </div>
</template>

<script setup>
import ViewIcon from "~icons/material-symbols/visibility-rounded";
import CommentIcon from "~icons/material-symbols/comment-rounded";
import VisitorIcon from "~icons/material-symbols/person";

const props = defineProps({
  type: {
    type: String,
    validator: (value) => {
      return ["view", "comment", "visitor"].includes(value);
    },
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => {
      return ["small", "medium"].includes(value);
    },
  },
});

const types = {
  view: {
    icon: ViewIcon,
    label: "阅读次数",
  },
  comment: {
    icon: CommentIcon,
    label: "评论数",
  },
  visitor: {
    icon: VisitorIcon,
    label: "访客数量",
  },
};
</script>
