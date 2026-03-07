import { useEffect, useMemo, useState } from "react";

export default function useHomeBackground() {
  const [shouldUseGalaxy, setShouldUseGalaxy] = useState(true);

  const galaxyConfig = useMemo(
    () => ({
      saturation: 0.8,
      hueShift: 140,
      density: 1.9,
      starSpeed: 1.3,
      mouseRepulsion: false,
    }),
    [],
  );

  const webglFallbackStyle = useMemo(
    () => ({
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
      backgroundColor: "#050011",
      backgroundImage: `
        radial-gradient(900px circle at 15% 12%, rgba(127, 252, 255, 0.2), transparent 60%),
        radial-gradient(780px circle at 85% 18%, rgba(125, 92, 255, 0.28), transparent 58%),
        radial-gradient(680px circle at 50% 82%, rgba(188, 107, 255, 0.22), transparent 65%),
        radial-gradient(420px circle at 30% 65%, rgba(59, 120, 249, 0.18), transparent 72%),
        linear-gradient(180deg, #060010 0%, #09051a 42%, #04000d 100%)
      `,
    }),
    [],
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setShouldUseGalaxy(false);
      return;
    }

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      setShouldUseGalaxy(false);
      return;
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

    if (!debugInfo) {
      setShouldUseGalaxy(true);
      return;
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    const isSoftwareRenderer = /swiftshader|software|llvmpipe/i.test(renderer);

    setShouldUseGalaxy(!isSoftwareRenderer);
  }, []);

  return {
    shouldUseGalaxy,
    galaxyConfig,
    webglFallbackStyle,
  };
}
