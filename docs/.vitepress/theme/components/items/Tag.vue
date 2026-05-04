<template>
  <div
    class="relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-full py-1 pl-6 pr-2 text-[0.7rem] font-bold transition-all duration-300 ease-in-out hover:border-brand hover:bg-brand-light hover:text-brand"
    :class="
      props.isActive
        ? 'border border-brand bg-brand-light text-brand'
        : 'border border-color bg-card text-muted'
    "
  >
    <i-ph-hash-bold
      class="absolute left-2 transition-all duration-300 ease-in-out"
      :class="
        props.isActive
          ? '-translate-y-full opacity-0'
          : 'translate-y-0 opacity-100'
      "
    />
    <i-ph-check-bold
      class="absolute left-2 transition-all duration-300 ease-in-out"
      :class="
        props.isActive
          ? 'translate-y-0 opacity-100'
          : 'translate-y-full opacity-0'
      "
    />
    <span>{{ props.tag }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  tag: String,
  isActive: {
    type: Boolean,
    default: false,
  },
});
</script>
