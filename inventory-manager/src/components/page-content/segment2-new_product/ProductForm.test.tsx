global.matchMedia = global.matchMedia || function () {
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
import {render, screen, waitFor} from '@testing-library/react';
import ProductForm from './ProductForm';
import {useSearchContext} from '../../context/SearchContext';
import {useProductsData} from '../../context/DataContext';
import {createProduct} from '../../services/Requests';
import userEvent from '@testing-library/user-event';

jest.mock('../../context/SearchContext');
jest.mock('../../context/DataContext');
jest.mock('../../services/Requests');

describe('ProductForm', () => {
    beforeEach(() => {
        (useSearchContext as jest.Mock).mockReturnValue({
            stockQuantity: 0,
            setParams: jest.fn(),
        });
        (useProductsData as jest.Mock).mockReturnValue({
            categories: ['Fruit', 'Vegetables'],
        });
    });

    test('submits form in create mode', async () => {
        const onClose = jest.fn();
        (createProduct as jest.Mock).mockResolvedValue({});
        render(<ProductForm mode="create" onClose={onClose}/>);
        await userEvent.type(screen.getByLabelText(/Name/i), 'Apple');
        await userEvent.click(screen.getByLabelText(/Category/i));
        const options = screen.getAllByText('Fruit');
        await userEvent.click(options[1]);
        await userEvent.type(screen.getByLabelText(/Stock/i), '10');
        await userEvent.type(screen.getByLabelText(/Unit Price/i), '1');
        await userEvent.click(screen.getByText('Save'));
        await waitFor(() => {
            expect(createProduct).toHaveBeenCalled();
        });
    });
});
