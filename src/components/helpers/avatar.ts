export const DEFAULT_AVATAR = "/images/default-avatar.svg";

// Uploaded avatars are stored as API-relative paths ("/api/profile/avatar/..."); social-login
// avatars may be absolute URLs. Anything missing falls back to the bundled default image.
export const resolveAvatarUrl = (url?: string | null): string => {
  if (!url) return DEFAULT_AVATAR;
  if (url.startsWith("/")) return `${import.meta.env.VITE_API_BASE_URL ?? ""}${url}`;
  return url;
};

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Mirrors the server's checks so users get instant feedback; the server re-validates the bytes.
export const validateAvatarFile = (file: File): string | null => {
  if (!AVATAR_TYPES.includes(file.type)) return "Please choose a JPEG, PNG, or WebP image.";
  if (file.size > MAX_AVATAR_BYTES) return "Profile photos must be 2MB or smaller.";
  return null;
};
