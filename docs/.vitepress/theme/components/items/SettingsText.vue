<template>
  <div class="flex flex-col gap-2 p-2">
    <span class="font-bold text-main">{{ props.optionLabel }}</span>
    <span class="text-sm font-medium text-muted">{{
      props.optionDescription
    }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  optionLabel: String,
  optionDescription: String,
});
</script>
