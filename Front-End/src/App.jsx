import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useMatch } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Home from "./Pages/Home";
import Category from "./Components/Category/Category";
import Checkout from "./Pages/Checkout";
import Search from "./Components/Search/Search";
import Categories from "./Pages/Categories";
import Track from "./Pages/Track";
import Cart from "./Pages/Cart";
import Orders from "./Pages/Orders"
import SellItem from "./Pages/SellItem"
import { CartProvider } from './Context/CartContext';
import { OrderProvider } from './Context/OrderContext';
import { AuthProvider } from './Context/AuthProvider';
import SingleBook from "./Pages/SingleBook";
import Authentic from "./Pages/Authentic/AuthPage";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth";
  const isTracking = useMatch("/track/:orderId");
  const isPayment = useMatch("/checkout");
  const isSellItem = useMatch("/sell-item");

  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
      <OrderProvider>
      <CartProvider>
        <Navbar />
        {!isLoginPage && !isPayment && !isTracking && !isSellItem && <Search />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:name" element={<Category />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/track/:orderId" element={<Track />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/book/:id" element={<SingleBook />} />
            <Route path="/sell-item" element={ <SellItem />} />
            <Route path="/no-orders" element={<ErrorPage code={204} message="No Orders" />} />
            <Route path="/auth" element={<Authentic />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<ErrorPage code={404} message="Page Not Found!" />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 2500,
            style: {
              background: 'rgba(30, 30, 30, 0.85)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
            },
          }}
          containerStyle={{
            top: 60,
          }}
          gutter={16}
          animation="zoom"
        />
      </CartProvider>
      </OrderProvider>
      </AuthProvider>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}