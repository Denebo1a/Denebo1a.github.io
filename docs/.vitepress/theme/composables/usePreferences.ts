import { ref } from "vue";

const STORAGE_KEY = "blog-preferences";

const defaultPreferences = {
  isCustomContextMenuEnabled: true,
  isRouteLoadingOverlayEnabled: false,
} as const;

const isCustomContextMenuEnabled = ref(
  defaultPreferences.isCustomContextMenuEnabled,
);
const isRouteLoadingOverlayEnabled = ref(
  defaultPreferences.isRouteLoadingOverlayEnabled,
);

let initialized = false;

const isClient = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const persistPreferences = () => {
  if (!isClient()) return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      isCustomContextMenuEnabled: isCustomContextMenuEnabled.value,
      isRouteLoadingOverlayEnabled: isRouteLoadingOverlayEnabled.value,
    }),
  );
};

const applyPreferences = (preferences?: Partial<typeof defaultPreferences>) => {
  isCustomContextMenuEnabled.value =
    preferences?.isCustomContextMenuEnabled ??
    defaultPreferences.isCustomContextMenuEnabled;
  isRouteLoadingOverlayEnabled.value =
    preferences?.isRouteLoadingOverlayEnabled ??
    defaultPreferences.isRouteLoadingOverlayEnabled;
};

const setCustomContextMenuEnabled = (enabled: boolean) => {
  isCustomContextMenuEnabled.value = enabled;
  persistPreferences();
};

const setRouteLoadingOverlayEnabled = (enabled: boolean) => {
  isRouteLoadingOverlayEnabled.value = enabled;
  persistPreferences();
};

const initPreferences = () => {
  if (!isClient() || initialized) return;

  initialized = true;

  const savedPreferences = window.localStorage.getItem(STORAGE_KEY);

  if (!savedPreferences) {
    applyPreferences();
    return;
  }

  try {
    const parsedPreferences = JSON.parse(savedPreferences);
    applyPreferences(parsedPreferences);
  } catch {
    applyPreferences();
  }
};

export const usePreferences = () => ({
  isCustomContextMenuEnabled,
  isRouteLoadingOverlayEnabled,
  setCustomContextMenuEnabled,
  setRouteLoadingOverlayEnabled,
  initPreferences,
});
