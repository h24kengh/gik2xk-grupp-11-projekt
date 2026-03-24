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

// Definierar appens alla rutter med App som föräldralayout
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Products /> },           // Startsida med produktlista
      { path: '/product/:id', element: <ProductDetail /> }, // Produktdetaljsida
      { path: '/cart', element: <Cart /> },            // Kundkorgssida
      { path: '/product/:id/edit', element: <ProductForm /> }, // Redigera befintlig produkt
      { path: '/product/new', element: <ProductForm /> },      // Skapa ny produkt
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline /> {/* Nollställer webbläsarens standardstilar */}
    <CartProvider> {/* Tillhandahåller kundvagnsstate till hela appen */}
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);