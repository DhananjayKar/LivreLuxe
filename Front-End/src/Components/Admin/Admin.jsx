import React, { useState, useEffect } from "react";
import ProductPanel from "./ProductPanel";
import UserPanel from "./UserPanel";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

const Admin = () => {
  const [view, setView] = useState("products");
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [countLoading, setCountLoading] = useState(false);

  const { firebaseUser, loading, userRole } = useAuth();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const handleToggle = (tab) => {
    setView(tab);
    toast.success(
      tab === "products" ? "Switched to Products View" : "Switched to Users View"
    );
  };

  const fetchCounts = async () => {
    setCountLoading(true);
    try {
      const [productRes, userRes] = await Promise.all([
        fetch(`${API}/api/products`),
        fetch(`${API}/api/users`)
      ]);
      const productData = await productRes.json();
      const userData = await userRes.json();
      setProductCount(productData.length || 0);
      setUserCount(userData.length || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setCountLoading(false);
    }
  };
  
  useEffect(() => {
    if (userRole === "admin") {
      fetchCounts();
    }
  }, [API, userRole]);

  if (loading) {
    return (
      <AnimatePresence>
        <motion.div
          className="min-h-screen flex items-center justify-center bg-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center space-y-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Loading dashboard...</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!firebaseUser || userRole !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-2">🚫 Access Denied</h2>
        <p className="text-gray-700 mb-4">
          You are not authorized to access the Admin Dashboard.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">🛠 Admin Dashboard</h1>

        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => handleToggle("products")}
            className={`w-32 h-32 rounded-lg shadow-md flex flex-col justify-center items-center text-sm font-semibold border transition ${
              view === "products"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            <span className="text-xs mb-1">Total</span>
            <span className="text-2xl font-bold">
              {countLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                productCount
              )}
            </span>
            <span className="mt-2 text-lg">📚 Products</span>
          </button>

          <button
            onClick={() => handleToggle("users")}
            className={`w-32 h-32 rounded-lg shadow-md flex flex-col justify-center items-center text-sm font-semibold border transition ${
              view === "users"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            <span className="text-xs mb-1">Total</span>
            <span className="text-2xl font-bold">
              {countLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                userCount
              )}
            </span>
            <span className="mt-2 text-lg">👥 Users</span>
          </button>
        </div>

        {view === "products" ? (
          <ProductPanel refreshCounts={fetchCounts} />
        ) : (
          <UserPanel refreshCounts={fetchCounts} />
        )}
      </div>
    </div>
  );
};

export default Admin;