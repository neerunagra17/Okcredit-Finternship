import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import { MarketProvider } from '@/context/MarketContext';
import { ProductProvider } from '@/context/ProductContext';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';
import CategoryPage from '@/pages/CategoryPage';
import DealsPage from '@/pages/DealsPage';
import SupportPage from '@/pages/SupportPage';
import AdminPage from '@/pages/AdminPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ProductPage from '@/pages/ProductPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';

function App() {
  return (
    <ProductProvider>
      <MarketProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="category/:categoryId" element={<CategoryPage />} />
                <Route path="deals" element={<DealsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="product/:productId" element={<ProductPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
              </Route>
              {/* Admin route is completely separate from Layout */}
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
          <Toaster position="bottom-right" richColors />
        </CartProvider>
      </MarketProvider>
    </ProductProvider>
  );
}

export default App;
