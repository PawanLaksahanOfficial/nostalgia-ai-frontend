import React, { useState } from "react";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "../helpers/avatar";

interface AvatarProps {
  src?: string | null;
  size?: number;
  alt?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, size = 36, alt = "Profile photo" }) => {
  const resolved = resolveAvatarUrl(src);
  // Remember which URL failed so a later, different URL (e.g. a new upload) is tried again.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showDefault = failedSrc === resolved;

  return (
    <img
      src={showDefault ? DEFAULT_AVATAR : resolved}
      alt={alt}
      width={size}
      height={size}
      onError={() => {
        if (resolved !== DEFAULT_AVATAR) setFailedSrc(resolved);
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
        flexShrink: 0,
        backgroundColor: "var(--color-accent-soft)",
        border: "2px solid var(--color-bg-card)",
        boxShadow: "0 0 0 1px var(--color-border-strong)",
      }}
    />
  );
};
