import { describe, it, expect } from "vitest";
import { DEFAULT_AVATAR, MAX_AVATAR_BYTES, resolveAvatarUrl, validateAvatarFile } from "./avatar";
import { clampSocialButtonWidth, MAX_SOCIAL_BUTTON_WIDTH, MIN_SOCIAL_BUTTON_WIDTH } from "./socialAuth";

const fileOf = (type: string, size: number) =>
    new File([new Uint8Array(size)], "photo", { type });

describe("resolveAvatarUrl", () => {
    it("falls back to the default image when there is no avatar", () => {
        expect(resolveAvatarUrl(null)).toBe(DEFAULT_AVATAR);
        expect(resolveAvatarUrl("")).toBe(DEFAULT_AVATAR);
    });

    it("prefixes API-relative avatar paths with the API base URL", () => {
        const resolved = resolveAvatarUrl("/api/profile/avatar/1/abc.jpg");
        expect(resolved.endsWith("/api/profile/avatar/1/abc.jpg")).toBe(true);
    });

    it("leaves absolute URLs untouched", () => {
        expect(resolveAvatarUrl("https://example.com/me.png")).toBe("https://example.com/me.png");
    });
});

describe("validateAvatarFile", () => {
    it("accepts a small JPEG", () => {
        expect(validateAvatarFile(fileOf("image/jpeg", 1024))).toBeNull();
    });

    it("rejects unsupported types", () => {
        expect(validateAvatarFile(fileOf("image/gif", 1024))).toMatch(/JPEG, PNG, or WebP/);
    });

    it("rejects files over 2MB", () => {
        expect(validateAvatarFile(fileOf("image/png", MAX_AVATAR_BYTES + 1))).toMatch(/2MB/);
    });
});

describe("clampSocialButtonWidth", () => {
    it("keeps widths inside Google's 200-400px range", () => {
        expect(clampSocialButtonWidth(120)).toBe(MIN_SOCIAL_BUTTON_WIDTH);
        expect(clampSocialButtonWidth(900)).toBe(MAX_SOCIAL_BUTTON_WIDTH);
    });

    it("rounds fractional widths down so the button never overflows", () => {
        expect(clampSocialButtonWidth(356.8)).toBe(356);
    });
});
