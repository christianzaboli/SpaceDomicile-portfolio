import { useEffect } from "react";

export default function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");

    document.title = title ? `${title} | Space Domiciles` : "Space Domiciles";

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle || "Space Domiciles";
      if (description) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta && previousDescription) {
          meta.setAttribute("content", previousDescription);
        }
      }
    };
  }, [title, description]);
}
