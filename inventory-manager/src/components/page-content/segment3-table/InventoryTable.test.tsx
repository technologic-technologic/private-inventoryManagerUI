import {deleteProduct, markOutOfStock} from "../../../services/Requests";

global.matchMedia = global.matchMedia || function() {
    return {
        matches: false,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    };
};


import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryTable from './InventoryTable';
import { useProductsData } from '../../context/DataContext';
import { useSearchContext } from '../../context/SearchContext';
import {waitFor} from "@testing-library/dom";

jest.mock('../../context/DataContext');
jest.mock('../../context/SearchContext');
jest.mock('../../services/Requests');

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Columns should all contain `filteredValue`')
        ) {
            return;
        }
        console.error(...args);
    });
});

beforeEach(() => {
    (useProductsData as jest.Mock).mockReturnValue({
        products: [{ id: 1, category: 'Fruit', name: 'Apple', unitPrice: 1, expirationDate: '2023-06-22', stockQuantity: 10 }],
        loading: false,
        categories: ['Fruit', 'Vegetables'],
        error: null,
        total: 1,
        summary: [],
        refreshProducts: jest.fn(),
    });
    (useSearchContext as jest.Mock).mockReturnValue({
        stockQuantity: 0,
        page: 1,
        setParams: jest.fn(),
    });
});

describe('InventoryTable', () => {
    it('renders the table with products', async () => {
        (useProductsData as jest.Mock).mockReturnValue({
            products: [
                { id: 1, category: 'Fruit', name: 'Apple', unitPrice: 1, expirationDate: '2023-06-22', stockQuantity: 10 },
            ],
            loading: false,
        });
        (useSearchContext as jest.Mock).mockReturnValue({
            stockQuantity: 0,
            page: 1,
            setParams: jest.fn(),
        });

        render(<InventoryTable />);

        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Fruit')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('Stock')).toBeInTheDocument();
    });
    it('opens the edit modal when Edit is clicked', async () => {
        (useProductsData as jest.Mock).mockReturnValue({
            products: [
                { id: 1, category: 'Fruit', name: 'Apple', unitPrice: 1, expirationDate: '2023-06-22', stockQuantity: 10 },
            ],
            loading: false,
            categories: ['Fruit', 'Vegetables'],
            error: null,
            total: 1,
            summary: [],
            refreshProducts: jest.fn(),
        });
        (useSearchContext as jest.Mock).mockReturnValue({
            stockQuantity: 0,
            page: 1,
            setParams: jest.fn(),
        });

        render(<InventoryTable />);

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(screen.getByText('Edit Product')).toBeInTheDocument();
    });
    test('should call deleteProduct when Delete is clicked', async () => {
        (deleteProduct as jest.Mock).mockResolvedValueOnce({});

        render(<InventoryTable />);

        const deleteLink = screen.getByText('Delete');
        fireEvent.click(deleteLink);

        const confirmButton = screen.getByText('Yes');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(deleteProduct).toHaveBeenCalledWith(1);
        });
    });
    test('should call markOutOfStock when clicking "Change availability"', async () => {
        (useProductsData as jest.Mock).mockReturnValueOnce({
            products: [{ id: 1, category: 'Fruit', name: 'Apple', unitPrice: 1, expirationDate: '2023-06-22', stockQuantity: 10 }],
            loading: false,
            categories: ['Fruit', 'Vegetables'],
            error: null,
            total: 1,
            summary: [],
            refreshProducts: jest.fn(),
        });
        render(<InventoryTable />);

        const checkbox = screen.getAllByRole('checkbox');
        fireEvent.click(checkbox[1]);

        const changeButton = screen.getByText('Change availability');
        fireEvent.click(changeButton);

        await waitFor(() => {
            expect(markOutOfStock).toHaveBeenCalledWith(1);
        });
    });
});
