import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../Pages/Authentic/firebaseConfig";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const fetchOrders = async (user) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err.message);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthReady(true);
      if (user) {
        await fetchOrders(user);
      } else {
        setOrders([]);
        setLoadingOrders(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const placeOrder = async (order) => {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
      });

      const saved = await res.json();
      setOrders((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to place order:", err.message);
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, placeOrder, fetchOrders, loadingOrders, authReady }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);