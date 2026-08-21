import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { Button } from "./Button";

const renderButton = (props: Partial<React.ComponentProps<typeof Button>> = {}) =>
    render(
        <Provider store={store}>
            <Button label="Generate Video" type="button" variant="primary" disabled={false} {...props} />
        </Provider>
    );

describe("Button", () => {
    it("renders its label", () => {
        renderButton();
        expect(screen.getByRole("button", { name: "Generate Video" })).toBeInTheDocument();
    });

    it("calls onClick when clicked and not disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        renderButton({ onClick });

        await user.click(screen.getByRole("button", { name: "Generate Video" }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        renderButton({ onClick, disabled: true });

        await user.click(screen.getByRole("button", { name: "Generate Video" }));

        expect(onClick).not.toHaveBeenCalled();
    });

    it("shows a processing state and blocks clicks while loading", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        renderButton({ onClick, loading: true });

        const button = screen.getByRole("button", { name: "Processing..." });
        expect(button).toBeDisabled();

        await user.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("applies the variant as a className for App.css's hover/focus styling", () => {
        renderButton({ variant: "dangerOutline" });
        expect(screen.getByRole("button")).toHaveClass("btn", "btn-dangerOutline");
    });
});
