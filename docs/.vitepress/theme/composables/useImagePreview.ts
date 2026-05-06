import { reactive, readonly } from "vue";

const state = reactive({
  isOpen: false,
  src: "",
  alt: "",
  title: "",
});

export const openImagePreview = ({
  src,
  alt = "",
  title = "",
}: {
  src: string;
  alt?: string;
  title?: string;
}) => {
  state.src = src;
  state.alt = alt;
  state.title = title;
  state.isOpen = true;
};

export const closeImagePreview = () => {
  state.isOpen = false;
};

export const useImagePreview = () => ({
  previewState: readonly(state),
  openImagePreview,
  closeImagePreview,
});
