<template>
  <div
    class="flex items-center gap-1 font-bold text-muted"
    :class="{
      'text-xs': props.size === 'small',
      'text-sm': props.size === 'medium',
    }"
  >
    <i-material-symbols-event-note-rounded />
    <span>
      {{ date }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
  size: {
    type: String,
    default: "medium",
    validator: (value) => {
      return ["small", "medium"].includes(value);
    },
  },
});
</script>
