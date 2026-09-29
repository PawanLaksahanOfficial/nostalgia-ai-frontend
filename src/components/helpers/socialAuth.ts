export const isGoogleAuthEnabled = Boolean(String(import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "").trim());
export const isMetaAuthEnabled = Boolean(String(import.meta.env.VITE_META_APP_ID ?? "").trim());
export const hasSocialProviders = isGoogleAuthEnabled || isMetaAuthEnabled;

// Google renders its button in an iframe that only accepts widths between 200 and 400 px.
export const MIN_SOCIAL_BUTTON_WIDTH = 200;
export const MAX_SOCIAL_BUTTON_WIDTH = 400;

export const clampSocialButtonWidth = (availableWidth: number): number =>
    Math.min(MAX_SOCIAL_BUTTON_WIDTH, Math.max(MIN_SOCIAL_BUTTON_WIDTH, Math.floor(availableWidth)));
