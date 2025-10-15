/* @vitest-environment jsdom */
/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom/vitest";
import {describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach} from "vitest";
import {cleanup, render} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProductButton from "./NewProductButton";

const __realGetComputedStyle = window.getComputedStyle;
const __realMatchMedia = window.matchMedia as any;

function renderWithUser() {
    const user = userEvent.setup()
    const view = render(<NewProductButton />);
    return {user, ...view};
}


describe("NewProductButton", () => {
    beforeAll(() => {
        window.getComputedStyle = (elt: Element, _pseudo?: string | null) => {
            const style = __realGetComputedStyle(elt);
            const gpv = (prop: string) => {
                if (typeof (style as any).getPropertyValue === "function") {
                    return (style as any).getPropertyValue(prop);
                }
                if (
                    prop === "animation-duration" ||
                    prop === "animation-delay" ||
                    prop === "transition-duration" ||
                    prop === "transition-delay"
                ) {
                    return "0s";
                }
                return "";
            };
            return {...style, getPropertyValue: gpv} as CSSStyleDeclaration;
        };
        window.matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        });
    });
    afterAll(() => {
        window.getComputedStyle = __realGetComputedStyle;
        window.matchMedia = __realMatchMedia;
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        vi.useRealTimers();
        cleanup();
        vi.resetAllMocks();
    });

    it("renders the button and opens the modal on click", async () => {
        const {getByRole, getByText} = renderWithUser();

        const addButton = getByRole("button", { name: /add new product/i });
        expect(addButton).toBeInTheDocument();
        await userEvent.click(addButton);

        expect(getByText(/add new product to inventory/i)).toBeInTheDocument();
    });
});
