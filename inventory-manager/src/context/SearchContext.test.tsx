/* @vitest-environment jsdom */
import React from "react";
import {describe, it, expect, beforeEach, vi, afterEach} from "vitest";
import userEvent from '@testing-library/user-event'
import {cleanup, render} from "@testing-library/react";
import {SearchProvider, useSearchContext} from "./SearchContext.tsx";

const Consumer: React.FC = () => {
    const clientSim = useSearchContext();
    return (
        <div>
            <div data-testid={"name"}>{clientSim.name}</div>
            <div data-testid={"category"}>{clientSim.category}</div>
            <div data-testid={"stockQuantity"}>{clientSim.stockQuantity}</div>
            <div data-testid={"page"}>{clientSim.page}</div>
            <div data-testid={"sort"}>{clientSim.sort}</div>
            <button
                onClick={() =>
                    clientSim.setParams(
                        {
                            name: "Watermelon",
                            category: "Fruits",
                            stockQuantity: 15,
                            page: 1
                        }
                    )
                }>
                setAll
            </button>
            <button
                onClick={() =>
                    clientSim.setParams(
                        {
                            page: 0
                        }
                    )
                }>
                setIgnored
            </button>
            <button
                onClick={() =>
                    clientSim.setParams(
                        {
                            name: "water",
                            category: "",
                            stockQuantity: 0,
                            page: 0
                        }
                    )
                }>
                setChange
            </button>
        </div>
    );
};

function renderWithProvider() {
    const user = userEvent.setup()
    const view = render(
        <SearchProvider>
            <Consumer/>
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

describe("SearchContext tests", () => {
    it("exposes initial state", () => {
        const {getByTestId} = renderWithProvider();
        expect(getByTestId("name").textContent).toBe("");
        expect(getByTestId("category").textContent).toBe("");
        expect(getByTestId("stockQuantity").textContent).toBe('0');
        expect(getByTestId("page").textContent).toBe('0');
    });

    it("set all to context", async () => {
        const {user, getByRole, getByTestId} = renderWithProvider();
        await user.click(getByRole('button', {name: /setAll/i}));

        expect(getByTestId("name").textContent).toBe("Watermelon");
        expect(getByTestId("category").textContent).toBe("Fruits");
        expect(getByTestId("stockQuantity").textContent).toBe('15');
        expect(getByTestId("page").textContent).toBe('1');
    });

    it("make small change to context", async () => {
        const {user, getByRole, getByTestId} = renderWithProvider();
        await user.click(getByRole('button', {name: /setChange/i}));

        expect(getByTestId("name").textContent).toBe("water");
        expect(getByTestId("category").textContent).toBe("");
        expect(getByTestId("stockQuantity").textContent).toBe('0');
        expect(getByTestId("page").textContent).toBe('0');
    });

    it("reset context state", async () => {
        const {user, getByRole, getByTestId} = renderWithProvider();
        await user.click(getByRole('button', {name: /setIgnored/i}));

        expect(getByTestId("name").textContent).toBe("");
        expect(getByTestId("category").textContent).toBe("");
        expect(getByTestId("stockQuantity").textContent).toBe('0');
        expect(getByTestId("page").textContent).toBe('0');

        const first = renderWithProvider();
        first.unmount()

        await first.user.click(first.getByRole('button', {name: /setAll/i}))

        expect(getByTestId("name").textContent).toBe("Watermelon");
        expect(getByTestId("category").textContent).toBe("Fruits");
        expect(getByTestId("stockQuantity").textContent).toBe('15');
        expect(getByTestId("page").textContent).toBe('1');

    });
})
