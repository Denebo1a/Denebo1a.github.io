<template>
  <Teleport to="body">
    <Transition name="context-menu-fade">
      <div
        v-if="show"
        class="context-menu-mask"
        @click="closeMenu"
        @contextmenu.prevent="reopenMenu($event)"
      >
        <div
          ref="menuRef"
          class="context-menu-panel"
          :style="{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }"
          @click.stop
          @contextmenu.prevent.stop="reopenMenu($event)"
        >
          <div class="context-menu-tools">
            <button
              v-for="tool in toolItems"
              :key="tool.label"
              type="button"
              class="context-menu-icon-btn"
              :title="tool.label"
              @click="runMenuAction(tool.action)"
            >
              <component
                :is="tool.icon"
                class="h-4 w-4"
                :class="tool.iconClass"
              />
            </button>
          </div>

          <div
            v-for="group in visibleGroups"
            :key="group.key"
            class="context-menu-group"
          >
            <button
              v-for="item in group.items"
              :key="`${group.key}-${item.label}`"
              type="button"
              class="context-menu-item"
              :class="item.danger ? 'danger' : ''"
              @click="runMenuAction(item.action)"
            >
              <component :is="item.icon" class="h-5 w-5 shrink-0" />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vitepress";
import { data as allPosts } from "../../../../blog/posts.data";
import { copyTextToClipboard } from "../../utils/copyText";
import { useTheme } from "../../composables/useTheme";
import { useScrollPersistence } from "../../composables/useScrollPersistence";
import backIcon from "~icons/material-symbols/arrow-back-ios-new-rounded";
import forwardIcon from "~icons/material-symbols/arrow-forward-ios-rounded";
import refreshIcon from "~icons/material-symbols/refresh-rounded";
import upIcon from "~icons/material-symbols/arrow-upward-rounded";
import shuffleIcon from "~icons/ph/dice-three-fill";
import copyIcon from "~icons/material-symbols/content-copy-outline-rounded";
import shareIcon from "~icons/material-symbols/share-outline";
import linkIcon from "~icons/ph/link";
import imageIcon from "~icons/ph/image-square";
import moonIcon from "~icons/ph/palette-bold";
import closeIcon from "~icons/material-symbols/cancel";
import openIcon from "~icons/ph/arrow-square-out";
import downloadIcon from "~icons/ph/download-simple";
import searchIcon from "~icons/ph/magnifying-glass";
import pasteIcon from "~icons/ph/clipboard-text";
import selectAllIcon from "~icons/ph/text-aa";

const route = useRoute();
const router = useRouter();
const show = ref(false);
const menuRef = ref(null);
const position = reactive({ x: 0, y: 0 });
const context = reactive({
  type: "page",
  href: "",
  imageSrc: "",
  imageAlt: "",
  imageLinkHref: "",
  selectedText: "",
  isExternalLink: false,
  editableEl: null,
  hasEditableSelection: false,
});

const { cycleTheme, initTheme } = useTheme();
const { scrollToTop } = useScrollPersistence();
const searchEngines = {
  bing: "https://cn.bing.com/search?q=",
  baidu: "https://www.baidu.com/s?wd=",
};

const isEditableElement = (value) =>
  value instanceof HTMLElement &&
  (value.matches("input, textarea") || value.isContentEditable);

const getClosest = (target, selector) => {
  if (!(target instanceof Element)) return null;
  return target.closest(selector);
};

const getSelectedText = () => window.getSelection?.()?.toString().trim() ?? "";

const resetContext = () => {
  context.type = "page";
  context.href = "";
  context.imageSrc = "";
  context.imageAlt = "";
  context.imageLinkHref = "";
  context.selectedText = "";
  context.isExternalLink = false;
  context.editableEl = null;
  context.hasEditableSelection = false;
};

const resolveContext = (target) => {
  resetContext();

  const anchorEl = getClosest(target, "a[href]");
  const imageEl =
    target instanceof HTMLImageElement ? target : getClosest(target, "img");
  const editableEl = isEditableElement(target)
    ? target
    : getClosest(target, "input, textarea, [contenteditable='true']");
  const selectedText = getSelectedText();

  if (editableEl) {
    context.type = "editable";
    context.editableEl = editableEl;
    if (
      editableEl instanceof HTMLInputElement ||
      editableEl instanceof HTMLTextAreaElement
    ) {
      context.hasEditableSelection =
        editableEl.selectionStart !== editableEl.selectionEnd;
      context.selectedText =
        editableEl.selectionStart !== null && editableEl.selectionEnd !== null
          ? editableEl.value.slice(
              editableEl.selectionStart,
              editableEl.selectionEnd,
            )
          : "";
    }
    return;
  }

  if (selectedText) {
    context.type = "selection";
    context.selectedText = selectedText;
    return;
  }

  if (imageEl instanceof HTMLImageElement) {
    context.type = "image";
    context.imageSrc = imageEl.currentSrc || imageEl.src || "";
    context.imageAlt = imageEl.alt || "";
    const imageAnchor = imageEl.closest("a[href]");
    context.imageLinkHref = imageAnchor?.href || "";
    return;
  }

  if (anchorEl instanceof HTMLAnchorElement) {
    context.type = "link";
    context.href = anchorEl.href;
    context.isExternalLink = /^https?:\/\//.test(anchorEl.href);
  }
};

const goRandomPost = () => {
  if (!allPosts.length) return;
  const candidates = allPosts.filter((post) => post.url !== route.path);
  const pool = candidates.length > 0 ? candidates : allPosts;
  const randomPost = pool[Math.floor(Math.random() * pool.length)];
  if (randomPost?.url) {
    router.go(randomPost.url);
  }
};

const copyCurrentPageUrl = async () => {
  await copyTextToClipboard(window.location.href);
};

const copyLinkUrl = async (url) => {
  if (!url) return;
  await copyTextToClipboard(url);
};

const openUrlInNewTab = (url) => {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const downloadImage = async () => {
  if (!context.imageSrc) return;

  const link = document.createElement("a");
  link.href = context.imageSrc;
  link.download =
    context.imageAlt || context.imageSrc.split("/").pop() || "image";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const searchSelectedText = (engine) => {
  const query = context.selectedText.trim();
  if (!query || !searchEngines[engine]) return;
  openUrlInNewTab(`${searchEngines[engine]}${encodeURIComponent(query)}`);
};

const pasteToEditable = async () => {
  if (!context.editableEl) return;

  const text = await navigator.clipboard.readText();
  const target = context.editableEl;

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const newValue =
      target.value.slice(0, start) + text + target.value.slice(end);

    target.value = newValue;
    const cursor = start + text.length;
    target.setSelectionRange(cursor, cursor);
    target.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  if (target instanceof HTMLElement && target.isContentEditable) {
    document.execCommand("insertText", false, text);
  }
};

const copyEditableSelection = async () => {
  if (context.selectedText) {
    await copyTextToClipboard(context.selectedText);
  }
};

const selectAllEditable = () => {
  const target = context.editableEl;
  if (!target) return;

  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    target.focus();
    target.select();
    return;
  }

  if (target instanceof HTMLElement && target.isContentEditable) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
};

const shareCurrentPage = async () => {
  const shareData = {
    title: document.title,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch {
      // noop
    }
  }

  openUrlInNewTab(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(document.title)}&url=${encodeURIComponent(window.location.href)}`,
  );
};

const menuHandlers = {
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  reload: () => window.location.reload(),
  top: () => scrollToTop(),
  random: () => goRandomPost(),
  copyPage: () => copyCurrentPageUrl(),
  sharePage: () => shareCurrentPage(),
  cycleTheme: () => cycleTheme(),
  openLink: () => openUrlInNewTab(context.href),
  copyLink: () => copyLinkUrl(context.href),
  openImageLink: () => openUrlInNewTab(context.imageLinkHref),
  copyImageLink: () => copyLinkUrl(context.imageLinkHref),
  copyImage: () => copyLinkUrl(context.imageSrc),
  downloadImage: () => downloadImage(),
  copySelection: () => copyTextToClipboard(context.selectedText),
  searchBing: () => searchSelectedText("bing"),
  searchBaidu: () => searchSelectedText("baidu"),
  editableCopy: () => copyEditableSelection(),
  editablePaste: () => pasteToEditable(),
  editableSelectAll: () => selectAllEditable(),
  close: () => closeMenu(),
};

const runMenuAction = async (action) => {
  const handler = menuHandlers[action];
  if (!handler) return;

  await handler();
  closeMenu();
};

const toolItems = [
  { label: "后退", icon: backIcon, action: "back" },
  { label: "前进", icon: forwardIcon, action: "forward" },
  { label: "刷新", icon: refreshIcon, action: "reload", iconClass: "h-5 w-5" },
  { label: "返回顶部", icon: upIcon, action: "top", iconClass: "h-5 w-5" },
];

const groupDefinitions = computed(() => {
  const groups = [];

  if (context.type === "page") {
    groups.push({
      key: "page",
      items: [
        { label: "随机前往", icon: shuffleIcon, action: "random" },
        { label: "复制本页地址", icon: copyIcon, action: "copyPage" },
        { label: "分享当前页面", icon: shareIcon, action: "sharePage" },
        { label: "切换主题", icon: moonIcon, action: "cycleTheme" },
      ],
    });
  }

  if (context.type === "link") {
    groups.push({
      key: "link",
      items: [
        { label: "新标签页打开", icon: openIcon, action: "openLink" },
        { label: "复制链接地址", icon: linkIcon, action: "copyLink" },
      ],
    });
  }

  if (context.type === "image") {
    const items = [
      { label: "复制图片地址", icon: imageIcon, action: "copyImage" },
      { label: "下载此图片", icon: downloadIcon, action: "downloadImage" },
    ];

    if (context.imageLinkHref) {
      items.push(
        { label: "打开图片链接", icon: openIcon, action: "openImageLink" },
        { label: "复制图片链接地址", icon: linkIcon, action: "copyImageLink" },
      );
    }

    groups.push({ key: "image", items });
  }

  if (context.type === "selection") {
    groups.push({
      key: "selection",
      items: [
        { label: "复制选中文本", icon: copyIcon, action: "copySelection" },
        { label: "使用 Bing 搜索", icon: searchIcon, action: "searchBing" },
        { label: "使用百度搜索", icon: searchIcon, action: "searchBaidu" },
      ],
    });
  }

  if (context.type === "editable") {
    groups.push({
      key: "editable",
      items: [
        { label: "复制", icon: copyIcon, action: "editableCopy" },
        { label: "粘贴", icon: pasteIcon, action: "editablePaste" },
        { label: "全选", icon: selectAllIcon, action: "editableSelectAll" },
      ],
    });
  }

  groups.push({
    key: "common",
    items: [
      { label: "关闭菜单", icon: closeIcon, action: "close", danger: true },
    ],
  });

  return groups;
});

const visibleGroups = computed(() =>
  groupDefinitions.value.filter((group) => group.items.length),
);

const clampMenuPosition = (clientX, clientY) => {
  const menuWidth = menuRef.value?.offsetWidth ?? 220;
  const menuHeight = menuRef.value?.offsetHeight ?? 260;
  const margin = 16;

  position.x = Math.min(
    Math.max(clientX, margin),
    window.innerWidth - menuWidth - margin,
  );
  position.y = Math.min(
    Math.max(clientY, margin),
    window.innerHeight - menuHeight - margin,
  );
};

const openMenu = async (event) => {
  if (event.ctrlKey || window.innerWidth < 768) return;

  event.preventDefault();
  resolveContext(event.target);
  show.value = false;

  await nextTick();
  show.value = true;
  await nextTick();
  clampMenuPosition(event.clientX, event.clientY);
};

const closeMenu = () => {
  show.value = false;
};

const reopenMenu = (event) => {
  openMenu(event);
};

const handleKeydown = (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
};

onMounted(() => {
  initTheme();
  window.addEventListener("contextmenu", openMenu);
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", closeMenu);
  window.addEventListener("scroll", closeMenu, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("contextmenu", openMenu);
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", closeMenu);
  window.removeEventListener("scroll", closeMenu, true);
});

watch(
  () => route.path,
  () => {
    closeMenu();
  },
);
</script>

<style scoped>
.context-menu-mask {
  position: fixed;
  inset: 0;
  z-index: 999;
}

.context-menu-panel {
  position: absolute;
  width: 200px;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-bg-card);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transform-origin: top left;
  animation: context-menu-pop 0.25s ease-out;
  transition: border-color 0.2s ease-in-out;
}

.context-menu-panel:hover {
  border-color: var(--color-brand);
}

.context-menu-tools,
.context-menu-group {
  display: grid;
  gap: 0.125rem;
}

.context-menu-tools {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid
    color-mix(in srgb, var(--color-border) 82%, transparent);
}

.context-menu-group + .context-menu-group {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-border) 82%, transparent);
}

.context-menu-icon-btn,
.context-menu-item {
  border: 0;
  outline: none;
  cursor: pointer;
  color: var(--color-text-main);
  background: transparent;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.context-menu-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.25rem;
  border-radius: 0.75rem;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  text-align: left;
}

.context-menu-icon-btn:hover,
.context-menu-item:hover {
  color: var(--color-brand);
  background: var(--color-brand-light);
}

.context-menu-icon-btn:active,
.context-menu-item:active {
  transform: scale(0.98);
}

.context-menu-item span {
  flex: 1;
}

.context-menu-item.danger:hover {
  color: #ef4444;
  background: color-mix(in srgb, #ef4444 10%, transparent);
}

.context-menu-fade-enter-active,
.context-menu-fade-leave-active {
  transition: opacity 0.16s ease;
}

.context-menu-fade-enter-from,
.context-menu-fade-leave-to {
  opacity: 0;
}

@keyframes context-menu-pop {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
