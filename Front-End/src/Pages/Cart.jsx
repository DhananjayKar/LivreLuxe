import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { useOrders } from "../Context/OrderContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import emptyCart from "../Components/Assets/cart.gif";
import { auth } from "../Pages/Authentic/firebaseConfig";

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, clearCart, removeFromCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      }
    };

    fetchProducts();
  }, []);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user || null);
      setAuthChecked(true);
    });
  
    return () => unsubscribe();
  }, []);

  const detailedCart = cartItems.map(item => {
    const actualId = typeof item.productId === "object" ? item.productId.id : item.productId;
    const product = allProducts.find(p => p.id === actualId);
    return {
      ...item,
      ...product
    };
  });

  const subtotal = detailedCart.reduce((acc, item) => acc + Number(item?.newPrice || 0) * item.quantity, 0);
  const discount = couponApplied ? Math.floor(subtotal * 0.2) : 0;
  const tax = Math.floor(subtotal * 0.14);
  const grandTotal = subtotal - discount + tax;

  const applyCoupon = () => {
    if (couponCode.trim() !== '') {
      setCouponApplied(true);
      toast.success("Coupon applied!");
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    toast.error("Coupon removed");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast("This is a warning!", {
      icon: "⚠️",
      style: {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba"
      }
    });
      return;
    }

    const orderSummary = {
      items: detailedCart.map(item => ({
        id: item.id,
        image: item.image,
        name: item.name,
        author: item.author,
        quantity: item.quantity,
        price: Number(item.newPrice),
        total: Number(item.newPrice) * item.quantity
      })),
      status: "PENDING",
      subtotal,
      discount,
      tax,
      grandTotal
    };

    console.log("Order Summary from cart:", orderSummary);
    placeOrder(orderSummary);
    clearCart();
    navigate("/orders");
  };
  
  useEffect(() => {
  if (authChecked && !user) {
    toast.error("Please log in first!");
  }
}, [authChecked, user]);

if (!authChecked) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xl font-semibold text-gray-700">Checking login status...</p>
      </div>
    </div>
  );
}

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <img src={emptyCart} alt="Empty Cart" className="w-40 h-40" />
        <h1 className="text-2xl font-semibold mb-4">Your cart is empty!</h1>
        <Link to="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Home</button>
        </Link>
      </div>
    );
  }
  
  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Unauthorized Access</h1>
        <p className="text-gray-600 mb-3">Please log in to view your cart.</p>
        <Link to="/">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
  <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

  <div className="overflow-x-auto">
    <table className="min-w-full text-left border-collapse mb-6 border border-gray-300">
      <thead className="bg-gray-100 hidden md:table-header-group">
        <tr>
          <th className="border px-4 py-2">Image</th>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Author</th>
          <th className="border px-4 py-2">Price</th>
          <th className="border px-4 py-2">Quantity</th>
          <th className="border px-4 py-2">Total</th>
        </tr>
      </thead>
      <tbody>
  {detailedCart.map((item) => (
    <tr
      key={item.id || item.productId}
      className="block md:table-row md:border-b border-none mb-4"
    >

      <td className="block md:hidden flex gap-4 p-4 shadow rounded border">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-28 object-cover rounded"
        />
        <div className="flex-1 space-y-1 text-sm">
          <p><strong>{item.name}</strong></p>
          <p>Category: {item.category}</p>
          <p>Author: {item.author}</p>
          <p>Price: ₹{Number(item.newPrice).toFixed(2)}</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => {
                // if (item.quantity === 1) {
                //   removeFromCart(item.productId);
                // } else {
                  decreaseQuantity(item.productId);
                //   toast.error("Item decreased");
                // }
              }}
              className="px-2 py-1 border rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => {
                increaseQuantity(item.productId);
              }}
              className="px-2 py-1 border rounded"
            >
              +
            </button>
          </div>
          <p>Total: ₹{(Number(item.newPrice) * item.quantity).toFixed(2)}</p>
        </div>
      </td>

      <td className="hidden md:table-cell px-4 py-2 border">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-28 object-cover rounded mx-auto"
        />
      </td>
      <td className="hidden md:table-cell border px-4 py-2">{item.name}</td>
      <td className="hidden md:table-cell border px-4 py-2">{item.category}</td>
      <td className="hidden md:table-cell border px-4 py-2">{item.author}</td>
      <td className="hidden md:table-cell border px-4 py-2">
        ₹{Number(item.newPrice).toFixed(2)}
      </td>
      <td className="hidden md:table-cell border px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => decreaseQuantity(item.productId)}
            className="px-2 py-1 border rounded"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => increaseQuantity(item.productId)}
            className="px-2 py-1 border rounded"
          >
            +
          </button>
        </div>
      </td>
      <td className="hidden md:table-cell border px-4 py-2">
        ₹{(Number(item.newPrice) * item.quantity).toFixed(2)}
      </td>
    </tr>
  ))}
</tbody>
    </table>
  </div>

  <div className="max-w-xl mx-auto text-center">
    <p className="mb-2">Subtotal: ₹{subtotal.toFixed(2)}</p>
    <div className="flex justify-center gap-2 mb-2">
      {!couponApplied ? (
        <>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter Coupon Code"
            className="border px-2 py-1 rounded w-48 text-center"
          />
          <button onClick={applyCoupon} className="bg-green-600 text-white px-4 py-1 rounded">
            Apply
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={couponCode}
            disabled
            className="border px-2 py-1 rounded w-48 text-center bg-gray-100"
          />
          <button
            onClick={removeCoupon}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Remove
          </button>
        </>
      )}
    </div>
    <p className="mb-1">Discount: ₹{discount.toFixed(2)}</p>
    <p className="mb-1">Tax (14%): ₹{tax.toFixed(2)}</p>
    <p className="font-bold text-lg">Grand Total: ₹{grandTotal.toFixed(2)}</p>
    <button
      onClick={handleCheckout}
      className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Checkout
    </button>
  </div>
</div>
  );
};

export default Cart;