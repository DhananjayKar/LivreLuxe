import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from  "../Pages/Authentic/firebaseConfig";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) return;
  
    const token = await user.getIdToken();
  
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const data = await res.json();
  
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Unexpected response from /api/orders:", data);
        setOrders([]); // fallback to avoid crashes
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const placeOrder = async (order) => {
    const user = auth.currentUser;
    if (!user) return;
    const token = await user.getIdToken();

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });

      const saved = await res.json();
      setOrders((prev) => [...prev, saved]);
    } catch (err) {
      console.error("Failed to place order:", err.message);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, fetchOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);