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
import {render, screen, fireEvent} from '@testing-library/react';
import NewProductButton from './NewProductButton';

describe('NewProductButton', () => {
    test('renders the button and opens the modal on click', () => {
        render(<NewProductButton />);
        const addButton = screen.getByText('Add new product');
        expect(addButton).toBeInTheDocument();
        fireEvent.click(addButton);
        expect(screen.getByText('Add new product to inventory')).toBeInTheDocument();
    });

});
