import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function DynamicTheme() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", settings.primary_color);
    root.style.setProperty("--secondary", settings.secondary_color);
    root.style.setProperty("--background", settings.background_color);
  }, [settings]);

  useEffect(() => {
    if (!settings) return;
    document.title = settings.seo_title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", settings.seo_description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = settings.seo_description;
      document.head.appendChild(meta);
    }
    if (settings.favicon_url) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings]);

  return null;
}
