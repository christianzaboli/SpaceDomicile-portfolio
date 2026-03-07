import Galaxy from "../ReactBits/Galaxy";
import useHomeBackground from "../../hooks/useHomeBackground";

export default function HomeBackground() {
  const { shouldUseGalaxy, galaxyConfig, webglFallbackStyle } =
    useHomeBackground();

  if (shouldUseGalaxy) {
    return <Galaxy {...galaxyConfig} />;
  }

  return <div style={webglFallbackStyle} aria-hidden="true" />;
}
