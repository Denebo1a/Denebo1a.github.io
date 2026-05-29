import { reactive, readonly } from "vue";

const state = reactive({
  isOpen: false,
});

export const openGlobalSettings = () => {
  state.isOpen = true;
};

export const closeGlobalSettings = () => {
  state.isOpen = false;
};

export const useGlobalSettings = () => ({
  settingsState: readonly(state),
  openGlobalSettings,
  closeGlobalSettings,
});
