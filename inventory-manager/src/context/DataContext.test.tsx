/* @vitest-environment jsdom */
import React from "react";
import {describe, it, vi, expect, beforeEach, afterEach} from "vitest";
import userEvent from '@testing-library/user-event'
import {cleanup, render, waitFor} from "@testing-library/react";
import {SearchProvider, useSearchContext} from "./SearchContext.tsx";
import {getCategories, getFilteredProducts, getSummary} from "../services/Requests.ts";
import {DataProvider, useDataContext} from "./DataContext.tsx";
import type {AxiosResponse} from "axios";
import type {Product} from "../types/Product.ts";

vi.mock("../services/Requests", () => (
        {
            getProducts: vi.fn(),
            getCategories: vi.fn(),
            getSummary: vi.fn(),
            getFilteredProducts: vi.fn(),
            createProduct: vi.fn(),
            updateProduct: vi.fn(),
            markOutOfStock: vi.fn(),
            markInStock: vi.fn(),
            deleteProduct: vi.fn(),

        }
    )
);

const Consumer: React.FC = () => {
    const {setParams} = useSearchContext();
    const {products, loading, total, error, categories, summary} = useDataContext();
    return (
        <div>
            <div data-testid={"products"}>{products ? "yes" : "no"}</div>
            <div data-testid={"loading"}>{String(loading)}</div>
            <div data-testid={"error"}>{error ?? ""}</div>
            <div data-testid={"total"}>{total}</div>
            <div data-testid={"categories"}>{categories?.length ?? 0}</div>
            <div data-testid={"summary"}>{summary ? "yes" : "no"}</div>
            <button
                data-testid={"trigger-fetch"}
                onClick={() => {
                    setParams({category: "f"});
                    setParams(
                        {
                            name: "Watermelon",
                            category: "Fruit",
                            stockQuantity: 15,
                            page: 0
                        }
                    );
                }}>
                fetchProduct
            </button>
            <button
                data-testid={"trigger-fetches"}
                onClick={() => {
                    setParams({name: "w"});
                    setParams({name: "water"});
                }}>
                fetchParam
            </button>
        </div>
    );
};

function renderWithProvider() {
    const user = userEvent.setup()
    const view = render(
        <SearchProvider>
            <DataProvider>
                <Consumer/>
            </DataProvider>
        </SearchProvider>);
    return {user, ...view};
}

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.useRealTimers();
    cleanup();
    vi.resetAllMocks();
});

describe("DataContext initial tests", () => {
    it("starts with nothing", () => {
        const {getByTestId} = renderWithProvider();
        expect(getByTestId("products").textContent).toBe("no");
        expect(getByTestId("loading").textContent).toBe("true");
        expect(getByTestId("error").textContent).toBe("");
        expect(getByTestId("total").textContent).toBe("0");
        expect(getByTestId("categories").textContent).toBe("1");
        expect(getByTestId("summary").textContent).toBe("no");
    });
});

describe("DataContext triggers", () => {
    it("trigger fetch", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: [
                    {id: 1, name: 'Watermelon'}
                ],
                totalPages: 1
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        const {user, getByTestId} = renderWithProvider();
        await user.click(getByTestId("trigger-fetch"));

        expect(vi.mocked(getFilteredProducts)).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Watermelon",
                category: "Fruit",
                stockQuantity: 15,
                page: 0,
            }));
        await waitFor(() =>
            expect(getByTestId("loading").textContent).toBe("false"));
        expect(getByTestId("products").textContent).toBe("yes");
        expect(getByTestId("total").textContent).toBe("1");
    })

    it("trigger fetches", async () => {
        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {
                products: [
                    {id: 1, name: 'Watermelon'},
                    {id: 2, name: 'Water'},
                    {id: 3, name: 'Apple'}
                ],
                totalPages: 1
            }
        } as unknown as AxiosResponse<any, any, Product[]>);
        const {user, getByTestId} = renderWithProvider();
        await user.click(getByTestId("trigger-fetches"));

        expect(vi.mocked(getFilteredProducts)).toHaveBeenCalledWith(
            expect.objectContaining({name: "water"}));
        await waitFor(() =>
            expect(getByTestId("loading").textContent).toBe("false"));
        expect(getByTestId("products").textContent).toBe("yes");
        expect(getByTestId("total").textContent).toBe("1");
    });

    it("error handling", async () => {
        vi.mocked(getFilteredProducts).mockRejectedValueOnce(new Error("Network fail"));

        vi.mocked(getFilteredProducts).mockResolvedValueOnce({
            data: {products: [], totalPages: 0},
        } as unknown as AxiosResponse);
        vi.mocked(getCategories).mockResolvedValue({data: []} as unknown as AxiosResponse);
        vi.mocked(getSummary).mockResolvedValue({data: []} as unknown as AxiosResponse);
        const {user, getByTestId} = renderWithProvider();

        await user.click(getByTestId("trigger-fetch"));

        await waitFor(() =>
            expect(getByTestId("loading").textContent).toBe("false"));
        expect(getByTestId("error").textContent).toMatch(/Network fail/i);
    });
})












