/* @vitest-environment jsdom */
/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom/vitest";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import {type ByRoleMatcher, type ByRoleOptions, cleanup, render, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SearchProvider} from "../../../../context/SearchContext.tsx";
import {DataProvider} from "../../../../context/DataContext.tsx";
import InventoryTable from "./InventoryTable.tsx";
import {deleteProduct, getFilteredProducts} from "../../../../services/Requests";
import type {Product} from "../../../../types/Product.ts";
import type {AxiosResponse} from "axios";

const __realGetComputedStyle = window.getComputedStyle;
const __realMatchMedia = window.matchMedia as any;
vi.mock("../../../../services/Requests", () => ({
    getFilteredProducts: vi.fn(),
    getCategories: vi.fn(),
    getSummary: vi.fn(),
    deleteProduct: vi.fn(),
}));

const productsPage1: Product[] = [
    {
        id: "p1",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p2",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
];
const productsAfterSort: Product[] = [
    {
        id: "p2",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p1",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    }
];
const productsAfterDelete: Product[] = [
    {
        id: "p2",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
];

function getFirstColumnTexts(
    getByRole: (
        role: ByRoleMatcher,
        options?: (ByRoleOptions | undefined)
    ) => HTMLElement): string[] {
    const table = getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1]; // [0]=thead, [1]=tbody
    const rows = within(tbody).getAllByRole("row");
    return rows.map((row) => {
        const cells = within(row).getAllByRole("cell");
        return cells[2].textContent?.trim() || "";
    });
}

function renderWithProviders() {
    const user = userEvent.setup()
    const view = render(
        <SearchProvider>
            <DataProvider>
                <InventoryTable/>
            </DataProvider>
        </SearchProvider>);
    return {user, ...view};
}

describe("InventoryTable tests", () => {
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

    it("renders rows with data after start", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        const {getByRole, getByText} = renderWithProviders();

        await waitFor(() => {
            expect(getByRole("table")).toBeInTheDocument();
            expect(getByText("Coke")).toBeVisible();
            expect(getByText("Apple")).toBeVisible();
        });

        expect(getFilteredProducts).toHaveBeenCalledTimes(1);
    });

    it("sorts by Name column (asc/desc) when header is clicked", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsAfterSort,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);

        const {getByRole, findByText} = renderWithProviders();
        await findByText("Coke");
        await findByText("Apple");
        const nameHeader = getByRole("columnheader", {name: /name/i});

        await userEvent.click(nameHeader);
        await findByText("Coke");
        await waitFor(() => {
            expect(getFirstColumnTexts(getByRole)).toEqual(["Apple", "Coke"]);
        });

        await userEvent.click(nameHeader);
        await findByText("Coke");
        await waitFor(() => {
            expect(getFirstColumnTexts(getByRole)).toEqual(["Coke", "Apple"]);
        });
    });

    it("deletes a row after confirm and the table reflects the removal", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        vi.mocked(deleteProduct("p1"));
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsAfterDelete,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        const {
            getByRole,
            findByText,
            queryByText,
            getAllByRole,
            getByText
        } = renderWithProviders();
        await findByText("Coke");
        await findByText("Apple");

        const deleteButton = getAllByRole("button", {name: /delete/i})[0];
        await userEvent.click(deleteButton);

        const confirmBtn =
            getByRole("button", {name: /^yes$/i});
        await userEvent.click(confirmBtn!);
        await findByText("Apple");

        await waitFor(() => {
            expect(deleteProduct).toHaveBeenCalledTimes(2);
            expect(deleteProduct).toHaveBeenCalledWith("p1");
        });

        await waitFor(() => {
            expect(queryByText("Coke")).not.toBeInTheDocument();
            expect(getByText("Apple")).toBeVisible();
        });

        expect(getFilteredProducts).toHaveBeenCalledTimes(2);
    });
});