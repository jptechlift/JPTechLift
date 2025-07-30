import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductTemplatePage from '../src/pages/Products/ProductTemplate';

describe('ProductTemplatePage', () => {
  it('renders product intro when given a valid productId', () => {
    render(
      <MemoryRouter initialEntries={['/san-pham/thang-may-gia-dinh']}>
        <HelmetProvider>
          <Routes>
            <Route path="san-pham/:productId" element={<ProductTemplatePage />} />
          </Routes>
        </HelmetProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Thang Máy Gia Đình/)).toBeInTheDocument();
  });
});