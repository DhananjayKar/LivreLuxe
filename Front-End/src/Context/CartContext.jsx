import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../Pages/Authentic/firebaseConfig";
import { toast } from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const token = await user.getIdToken();

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      const cleaned = data.items.map(item => ({
        productId: typeof item.productId === "object" ? item.productId.id : item.productId,
        quantity: item.quantity
      }));

      setCartItems(cleaned);
    } catch (err) {
      console.error("Failed to fetch cart:", err.message);
    }
  });

  return () => unsubscribe();
}, []);

  const syncCartWithBackend = async (itemsToSync) => {
    const user = auth.currentUser;
    if (!user) return;

    const token = await user.getIdToken();

    const cleanedItems = itemsToSync.map(item => ({
      productId: typeof item.productId === "object" ? item.productId.id : item.productId,
      quantity: item.quantity
    }));

    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: cleanedItems })
      });
    } catch (err) {
      console.error("Failed to sync cart:", err.message);
    }
  };

  const addToCart = (productId) => {
    const existing = cartItems.find(item => item.productId === productId);
    const updated = existing
      ? cartItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { productId, quantity: 1 }];

    setCartItems(updated);
    syncCartWithBackend(updated);
  };

  const increaseQuantity = (productId) => {
    const updated = cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updated);
    syncCartWithBackend(updated);
    toast.success("Item increased");
  };

  const decreaseQuantity = (productId) => {
  const item = cartItems.find(item => item.productId === productId);

  if (!item) return;

  if (item.quantity === 1) {
    const updated = cartItems.filter(item => item.productId !== productId);
    setCartItems(updated);
    syncCartWithBackend(updated);
    toast.custom(() => (
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded shadow">
                      ⚠️ Item removed!
                    </div>
                  ));
  } else {
    const updated = cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
    syncCartWithBackend(updated);
    toast.error("Item decreased");
  }
};

  const removeFromCart = (productId) => {
  const updated = cartItems.filter(item => item.productId !== productId);
  setCartItems(updated);
  syncCartWithBackend(updated);
};

  const clearCart = () => {
    setCartItems([]);
    syncCartWithBackend([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);