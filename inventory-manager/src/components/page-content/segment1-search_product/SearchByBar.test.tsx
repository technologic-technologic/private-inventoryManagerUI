/* @vitest-environment jsdom */
/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom/vitest";
import {describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach} from "vitest";
import {render, waitFor, cleanup} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchByBar from "./SearchByBar";
import {SearchProvider} from "../../../context/SearchContext";
import {DataProvider} from "../../../context/DataContext";
import {getFilteredProducts} from "../../../services/Requests";

const __realGetComputedStyle = window.getComputedStyle;
const __realMatchMedia = window.matchMedia as any;

vi.mock("../../../services/Requests", () => ({
    getFilteredProducts: vi.fn(),
    getCategories: vi.fn(),
    getSummary: vi.fn(),
}));

function renderWithProviders() {
    const u = userEvent.setup();
    const view = render(
        <SearchProvider>
            <DataProvider>
                <SearchByBar/>
            </DataProvider>
        </SearchProvider>
    );
    return {user: u, ...view};
}

describe("SearchByBar tests", () => {
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
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {products: [], totalPages: 3},
        } as any);
    });
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it("debounce name input and triggers refetch", async () => {
        const {user, findByPlaceholderText, getByPlaceholderText} = renderWithProviders();
        await findByPlaceholderText(/Watermelon/i);
        const name = getByPlaceholderText(/Watermelon/i);
        await user.click(name);
        await user.type(name, "Watermelon");
        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledTimes(2);
        });
        expect(getFilteredProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({name: "Watermelon", page: 0})
        );
    });

    it("debounce category input and triggers refetch", async () => {
        const {user, findByPlaceholderText, getByPlaceholderText} = renderWithProviders();
        await findByPlaceholderText(/Food/i);
        const category = getByPlaceholderText(/Food/i);
        await user.click(category);
        await user.type(category, "Beverages");
        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledTimes(2);
        });
        expect(getFilteredProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({category: "Beverages", page: 0})
        );
    });

    it("choosing In stock in the cascader and triggers refetch", async () => {
        const {user, findByText, getByText, findAllByText} = renderWithProviders();
        await findByText(/Everything/i);
        const stockCascader = getByText(/Everything/i);
        await user.click(stockCascader);
        const inStock = await findAllByText(/stock/i);
        await user.click(inStock[inStock.length - 1]);
        await waitFor(() => {
            expect(getFilteredProducts).toHaveBeenCalledTimes(2);
        });
        expect(getFilteredProducts).toHaveBeenLastCalledWith(
            expect.objectContaining({stockQuantity: expect.anything()})
        );
    });
});
