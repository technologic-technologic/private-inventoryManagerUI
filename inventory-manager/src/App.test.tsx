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
import { render, screen } from '@testing-library/react';
import App from './App';


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
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/encora/i);
  expect(linkElement[0]).toBeInTheDocument();
});
