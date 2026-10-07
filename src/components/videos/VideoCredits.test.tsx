import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { VideoCredits } from "./VideoCredits";

const renderCredits = (props: React.ComponentProps<typeof VideoCredits>) =>
    render(
        <Provider store={store}>
            <VideoCredits {...props} />
        </Provider>
    );

describe("VideoCredits", () => {
    it("renders nothing for an AI narration without stock photos", () => {
        const { container } = renderCredits({ narrationSource: "Ai", stockPhotoCredit: null });
        expect(container).toBeEmptyDOMElement();
    });

    it("tells the owner when their original text was narrated", () => {
        renderCredits({ narrationSource: "Original" });
        expect(screen.getByText(/narrated from your original text/i)).toBeInTheDocument();
    });

    it("credits the photographers and links to Pexels", () => {
        renderCredits({ stockPhotoCredit: "Ana Silva, Ravi Perera" });

        expect(screen.getByText(/Photos by Ana Silva, Ravi Perera on/)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Pexels" })).toHaveAttribute("href", "https://www.pexels.com");
    });

    it("links to the site named in the credit", () => {
        renderCredits({ stockPhotoCredit: "Ana Silva, Ravi Perera on Pixabay" });

        expect(screen.getByText(/Photos by Ana Silva, Ravi Perera on/)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Pixabay" })).toHaveAttribute("href", "https://pixabay.com");
    });

    it("names the site once when the credit already includes it", () => {
        renderCredits({ stockPhotoCredit: "Ana Silva on Pexels" });

        expect(screen.getByText(/Photos by Ana Silva on/)).toBeInTheDocument();
        expect(screen.queryByText(/on Pexels on/)).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Pexels" })).toHaveAttribute("href", "https://www.pexels.com");
    });
});
