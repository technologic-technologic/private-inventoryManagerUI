/* @vitest-environment jsdom */
/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom/vitest";
import {describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach} from "vitest";
import {render, waitFor, cleanup} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {createProduct, updateProduct} from "../../../services/Requests";
import ProductForm from "./ProductForm";
import type {Product} from "../../../types/Product.ts";

const __realGetComputedStyle = window.getComputedStyle;
const __realMatchMedia = window.matchMedia as any;

vi.mock("../../../services/Requests", () => ({
    createProduct: vi.fn(),
    updateProduct: vi.fn()
}));

const productsCreate: Product = {
    id: "p1",
    name: "Coke",
    category: "Beverages",
    unitPrice: 1.5,
    stockQuantity: 12,
    creationDate: new Date("13-10-2025")
};
const productsEdit: Product = {
    id: "p1",
    name: "Coke Light",
    category: "Beverages",
    unitPrice: 1.5,
    stockQuantity: 12,
    creationDate: new Date("13-10-2025")
};

function renderWithUsers(mode: "create" | "edit" | undefined, initialValues?: Product) {
    const onClose = vi.fn();
    const user = userEvent.setup()
    const view = render(
        <ProductForm
            initialValues={initialValues ?? undefined}
            mode={mode}
            onClose={onClose}/>
    );
    return {user, ...view};
}

describe("ProductForm", () => {
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
        vi.mocked(createProduct).mockResolvedValue({} as any);
    });
    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it("submits form in create mode", async () => {
        vi.mocked(createProduct).mockResolvedValueOnce(productsCreate);
        const {getAllByText, getByLabelText, getByText} = renderWithUsers("create");

        await userEvent.type(getByLabelText(/name/i), "Coke");
        await userEvent.click(getByLabelText(/category/i));
        await userEvent.type(getByLabelText(/category/i), "Beverage");
        const options = getAllByText("Beverage");
        await userEvent.click(options[options.length - 1]);
        await userEvent.type(getByLabelText(/stock/i), "12");
        await userEvent.type(getByLabelText(/unit price/i), "1.5");
        await userEvent.click(getByText("Save"));

        await waitFor(() => {
            expect(createProduct).toHaveBeenCalled();
        });
    });

    it("submits form in edit mode", async () => {
        vi.mocked(updateProduct).mockResolvedValueOnce(productsEdit);
        const {getByLabelText, getByText} = renderWithUsers("edit", productsEdit);

        await userEvent.type(getByLabelText(/name/i), "Coke Light");
        await userEvent.type(getByLabelText(/unit price/i), "1.55");
        await userEvent.click(getByText("Save"));

        await waitFor(() => {
            expect(updateProduct).toHaveBeenCalled();
        });
    });

});
