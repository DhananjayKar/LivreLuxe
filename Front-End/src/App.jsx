import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useMatch } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Admin from "./Components/Admin/Admin";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Home from "./Pages/Home";
import Category from "./Components/Category/Category";
import Checkout from "./Pages/Checkout";
import Developer from "./Pages/Developer";
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
  const isAdmin = useMatch("/admin");
  const isPayment = useMatch("/checkout");
  const isSellItem = useMatch("/sell-item");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyCombo = (e) => {
      if (
        e.ctrlKey &&
        e.shiftKey &&
        (e.key === "d" || e.key === "D") &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
      ) {
        navigate("/developer");
      }
    };

    window.addEventListener("keydown", handleKeyCombo);

    return () => {
      window.removeEventListener("keydown", handleKeyCombo);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
      <OrderProvider>
      <CartProvider>
        {location.pathname !== "/developer" && <Navbar />}
        {!isLoginPage && !isAdmin && !isPayment && !isTracking && !isSellItem && location.pathname !== "/developer" && <Search />}
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
            <Route path="/developer" element={ <Developer />} />
            <Route path="/no-orders" element={<ErrorPage code={204} message="No Orders" />} />
            <Route path="/auth" element={<Authentic />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<ErrorPage code={404} message="Page Not Found!" />} />
          </Routes>
        </main>
        {location.pathname !== "/developer" && <Footer />}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: 'rgba(230, 245, 255, 0.95)',
            color: '#0a2540',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #cce4f6',
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