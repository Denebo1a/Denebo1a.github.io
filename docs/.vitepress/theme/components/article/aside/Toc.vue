<template>
  <AsideCard
    v-if="headers.length > 0"
    title="文章目录"
    :icon="IconListDashesBold"
  >
    <nav
      class="relative flex flex-col gap-1 pl-4 after:absolute after:left-0 after:top-0 after:h-[100%] after:w-1 after:rounded-full after:bg-alt after:content-['']"
    >
      <a
        v-for="header in headers"
        :key="header.link"
        :href="header.link"
        @click="handleClick(header.link)"
        class="relative block before:absolute before:-left-4 before:top-1/2 before:z-10 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-brand before:transition-all before:duration-300 before:content-['']"
        :class="[
          activeHash === header.link
            ? 'before:h-5 before:opacity-100'
            : 'before:h-0 before:opacity-0',
        ]"
      >
        <span
          class="flex items-center rounded-md p-1 transition-all duration-300 ease-in-out hover:bg-brand-light"
          :class="[
            header.level === 2
              ? 'pl-2 text-[0.9rem] font-medium'
              : header.level === 3
                ? 'ml-4 py-0.5 text-[0.85rem]'
                : header.level === 4
                  ? 'ml-8'
                  : '',
            activeHash === header.link
              ? 'scale-[105%] bg-brand-light text-brand'
              : 'text-muted',
          ]"
        >
          {{ header.title }}
        </span>
      </a>
    </nav>
  </AsideCard>
</template>

<script setup>
import IconListDashesBold from "~icons/ph/list-dashes-bold";
import AsideCard from "../../container/AsideCard.vue";

const emit = defineEmits(["tocClick"]);

const handleClick = (link) => {
  emit("tocClick", link);
};

defineProps({ headers: Array, activeHash: String });
</script>
