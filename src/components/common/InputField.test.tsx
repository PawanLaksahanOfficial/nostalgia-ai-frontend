import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { InputField } from "./InputField";

const renderInput = (props: Partial<React.ComponentProps<typeof InputField>> = {}) =>
    render(
        <Provider store={store}>
            <InputField label="Password" type="password" {...props} />
        </Provider>
    );

describe("InputField", () => {
    it("renders a password field with no value", () => {
        // NOTE: queried by selector rather than by label -- the <label> carries no
        // htmlFor and the <input> no id, so they are not associated.
        const { container } = renderInput({ value: "" });
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(container.querySelector("input")?.getAttribute("type")).toBe("password");
    });

    // Regression: the reveal icon renders only once the field has a value, and it
    // read `Styles.passwordEye.hidden` off a style key that was never defined --
    // so the first keystroke in any password field crashed the render.
    it("renders the reveal icon once the password field has a value", () => {
        expect(() => renderInput({ value: "a" })).not.toThrow();
    });

    it("toggles the input between password and text when the icon is clicked", async () => {
        const user = userEvent.setup();
        const { container } = renderInput({ value: "secret", onChange: vi.fn() });

        const input = container.querySelector("input")!;
        expect(input.getAttribute("type")).toBe("password");

        const icon = container.querySelector("svg")!;
        await user.click(icon);

        expect(input.getAttribute("type")).toBe("text");
    });

    it("renders the validation indicator without crashing", () => {
        expect(() =>
            renderInput({ value: "a", validation: { invalid: true, message: "Too short." } })
        ).not.toThrow();
    });
});
