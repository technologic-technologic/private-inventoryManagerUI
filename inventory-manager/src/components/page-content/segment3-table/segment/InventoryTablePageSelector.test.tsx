/* @vitest-environment jsdom */
/// <reference types="@testing-library/jest-dom" />
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import type {AxiosResponse} from "axios";
import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from "vitest";
import type {Product} from "../../../../types/Product.ts";
import {cleanup, render, waitFor, within} from "@testing-library/react";
import {SearchProvider} from "../../../../context/SearchContext.tsx";
import {DataProvider} from "../../../../context/DataContext.tsx";
import InventoryTable from "./InventoryTable.tsx";
import InventoryTablePageSelector from "./InventoryTablePageSelector.tsx";
import {getFilteredProducts} from "../../../../services/Requests.ts";

const __realGetComputedStyle = window.getComputedStyle;
const __realMatchMedia = window.matchMedia as any;
vi.mock("../../../../services/Requests", () => ({
    getFilteredProducts: vi.fn(),
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
    {
        id: "p3",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p4",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p5",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p6",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p7",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p8",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p9",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p10",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p11",
        name: "Coke",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p12",
        name: "Apple",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
];
const productsPage2: Product[] = [
    {
        id: "p13",
        name: "AppleP2",
        category: "Fruit",
        unitPrice: 0.9,
        stockQuantity: 30,
        creationDate: new Date("13-10-2025")
    },
    {
        id: "p44",
        name: "CokeP2",
        category: "Beverages",
        unitPrice: 1.5,
        stockQuantity: 12,
        creationDate: new Date("13-10-2025")
    }
];

function renderWithProviders() {
    const user = userEvent.setup()
    const view = render(
        <SearchProvider>
            <DataProvider>
                <InventoryTable/>
                <InventoryTablePageSelector/>
            </DataProvider>
        </SearchProvider>);
    return {user, ...view};
}

describe("InventoryTablePageSelector tests", () => {
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

    it("makes call to Api whenever page is changed", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage2,
                totalPages: Math.ceil(productsPage2.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);

        const {getByRole, getByText, findByText, findAllByText} = renderWithProviders();

        await findAllByText("Coke");
        await findAllByText("Apple");

        const pager = getByRole('navigation');
        const next = within(pager).getAllByRole('button')[1];
        await userEvent.click(next);

        await findByText("CokeP2");
        await waitFor(() => {
            expect(getByText("CokeP2")).toBeVisible();
            expect(getByText("AppleP2")).toBeVisible();
        });

        expect(getFilteredProducts).toHaveBeenCalledTimes(2);
    });

    it("it goes back and forth", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage1,
                totalPages: Math.ceil(productsPage1.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: productsPage2,
                totalPages: Math.ceil(productsPage2.length / 10)
            }
        } as unknown as AxiosResponse<any, any, Product[]>);

        const {getByRole, getAllByText, findAllByText} = renderWithProviders();

        await findAllByText("Coke");

        let pager = getByRole('navigation');
        const next = within(pager).getAllByRole('button')[1];
        await userEvent.click(next);

        await findAllByText("Coke");
        await waitFor(() => {
            expect(getAllByText("Coke")[0]).toBeVisible();
            expect(getAllByText("Apple")[0]).toBeVisible();
        });

        pager = getByRole('navigation');
        const prev = within(pager).getAllByRole('button')[0];
        await userEvent.click(prev);
        await findAllByText("CokeP2");

        expect(getFilteredProducts).toHaveBeenCalledTimes(3);
    });
});
