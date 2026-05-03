<template>
  <AsideCard title="分享文章" :icon="IconShareNetworkBold">
    <div class="flex gap-3">
      <a
        :href="xShareLink"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-1 justify-center rounded-[1rem] border border-color py-1.5 text-muted transition-all hover:border-brand hover:bg-brand-light hover:text-brand"
      >
        <i-ph-x-logo-bold class="h-4 w-4" />
      </a>
      <button
        @click="triggerCopy"
        class="hover flex flex-1 justify-center rounded-[1rem] border border-color py-1.5 text-muted transition-all hover:border-brand hover:bg-brand-light"
      >
        <i-ph-link-bold class="h-4 w-4" />
      </button>
    </div>
  </AsideCard>
</template>

<script setup>
import IconShareNetworkBold from "~icons/ph/share-network-bold";
import AsideCard from "../../container/AsideCard.vue";

const emit = defineEmits(["call-copy"]);

const triggerCopy = () => {
  emit("call-copy");
};

defineProps({ xShareLink: { url: String } });
</script>
