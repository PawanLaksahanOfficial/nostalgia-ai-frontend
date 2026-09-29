import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";
import { DEFAULT_AVATAR } from "../helpers/avatar";

describe("Avatar", () => {
    it("shows the default image when the user has no photo", () => {
        render(<Avatar src={null} alt="me" />);
        expect(screen.getByAltText("me")).toHaveAttribute("src", DEFAULT_AVATAR);
    });

    it("shows the uploaded photo", () => {
        render(<Avatar src="https://example.com/me.png" alt="me" />);
        expect(screen.getByAltText("me")).toHaveAttribute("src", "https://example.com/me.png");
    });

    it("falls back to the default image when the photo fails to load", () => {
        render(<Avatar src="https://example.com/missing.png" alt="me" />);
        const img = screen.getByAltText("me");
        fireEvent.error(img);
        expect(img).toHaveAttribute("src", DEFAULT_AVATAR);
    });
});
