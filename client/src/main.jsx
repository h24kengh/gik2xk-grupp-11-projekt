import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Products from './views/Products.jsx';
import ProductDetail from './views/ProductDetail.jsx';
import Cart from './views/Cart.jsx';
import ProductForm from './views/ProductForm.jsx';
import { CartProvider } from './CartContext.jsx';
import { CssBaseline } from '@mui/material';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Products /> },
      { path: '/product/:id', element: <ProductDetail /> },
      { path: '/cart', element: <Cart /> },
      { path: '/product/:id/edit', element: <ProductForm /> },
      { path: '/product/new', element: <ProductForm /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline />
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);