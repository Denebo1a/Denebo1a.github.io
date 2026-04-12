<script setup>
import { useData } from "vitepress";
import SiteHeader from "./components/SiteHeader.vue";
import HomeView from "./components/HomeView.vue";
import BlogIndexView from "./components/BlogIndexView.vue";
import ResourcesIndexView from "./components/ResourcesIndexView.vue";
import ArticleLayout from "./components/ArticleLayout.vue";
import Breadcrumb from "./components/Breadcrumb.vue";

const { frontmatter } = useData();
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-base font-sans text-main transition-colors duration-300 selection:bg-brand selection:text-white"
  >
    <SiteHeader />
    <Breadcrumb />

    <main class="w-full flex-1 px-6 pb-20">
      <HomeView v-if="frontmatter.layout === 'home'" />
      <BlogIndexView v-else-if="frontmatter.layout === 'blog-index'" />
      <ResourcesIndexView
        v-else-if="frontmatter.layout === 'resources-index'"
      />
      <ArticleLayout v-else-if="frontmatter.layout === 'article'" />

      <div
        v-else
        class="mx-auto max-w-4xl rounded-[2rem] bg-card p-8 shadow-card transition-colors duration-300 md:p-12"
      >
        <Content class="prose prose-lg max-w-none" />
      </div>
    </main>
  </div>
</template>
