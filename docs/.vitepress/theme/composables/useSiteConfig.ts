import { computed } from "vue";
import { useData, withBase } from "vitepress";

const HTTP_URL_RE = /^https?:\/\//i;

const ensureLeadingSlash = (value: string) =>
  value.startsWith("/") ? value : `/${value}`;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const resolveOptionalServiceUrl = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return "";
  if (HTTP_URL_RE.test(normalized)) return trimTrailingSlash(normalized);

  const path = ensureLeadingSlash(normalized);
  return withBase(path).replace(/\/+$/, "");
};

export function useSiteConfig() {
  const { theme } = useData();

  const assetBase = computed(() => {
    const raw = String(theme.value.assetBase ?? "").trim();
    return raw ? trimTrailingSlash(raw) : "";
  });

  const siteHostname = computed(() => {
    const raw = String(theme.value.siteHostname ?? "").trim();
    return raw ? trimTrailingSlash(raw) : "";
  });

  const artalkServer = computed(() =>
    resolveOptionalServiceUrl(String(theme.value.artalkServer ?? "")),
  );

  const busuanziScriptUrl = computed(() => {
    const raw = String(theme.value.busuanziScriptUrl ?? "").trim();
    return raw || "";
  });

  const resolveAssetUrl = (path: string) => {
    if (!path) return "";
    if (HTTP_URL_RE.test(path)) return path;

    const normalizedPath = ensureLeadingSlash(path);
    const base = assetBase.value;

    if (!base) return withBase(normalizedPath);
    if (HTTP_URL_RE.test(base)) return `${base}${normalizedPath}`;

    return withBase(`${ensureLeadingSlash(base)}${normalizedPath}`);
  };

  const resolveAssetDir = (path: string) => {
    const resolved = resolveAssetUrl(path);
    return resolved.endsWith("/") ? resolved : `${resolved}/`;
  };

  return {
    assetBase,
    siteHostname,
    artalkServer,
    busuanziScriptUrl,
    resolveAssetUrl,
    resolveAssetDir,
  };
}
