import React, { useEffect } from "react";
import { useOrders } from "../Context/OrderContext";
import { Link, useNavigate } from "react-router-dom";
import { downloadInvoice } from "../Utils/pdfInvoice";

const getStatusFromDate = (orderDate) => {
  const orderDay = new Date(orderDate);
  const today = new Date();
  const diffTime = today - orderDay;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays >= 5) return "DELIVERED";
  if (diffDays >= 2) return "SHIPPED";
  return "PENDING";
};

const Orders = () => {
  const { orders, loadingOrders, authReady } = useOrders();
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (authReady && !loadingOrders) {
      setHasFetched(true);
    }
  }, [authReady, loadingOrders]);

  useEffect(() => {
  if (hasFetched && orders.length === 0) {
    const timeout = setTimeout(() => {
      navigate("/no-orders", { replace: true });
    }, 100);
    return () => clearTimeout(timeout);
  }
}, [orders, hasFetched, navigate]);

  if (!hasFetched) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-semibold text-gray-700">Getting your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-8">Your Orders</h2>
      <div className="relative border-l-2 border-gray-200 ml-4">
        {orders.map((order, orderIdx) =>
          order.items.map((item, itemIdx) => (
            <div key={`${orderIdx}-${itemIdx}`} className="mb-10 ml-4 relative">
              <div className="absolute left-[-16px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
              <div className="bg-white shadow-md p-4 rounded-lg">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    {item.author && (
                      <p className="text-gray-500">by {item.author}</p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-700">
                      Discount: ₹{order.discount}
                    </p>
                    <p className="font-medium mt-1">
                      Total: ₹{order.grandTotal}
                    </p>

                    <span
                      className={`text-sm font-medium inline-block mt-1 px-2 py-1 rounded ${
                        getStatusFromDate(order.date) === "DELIVERED"
                          ? "bg-green-100 text-green-800"
                          : getStatusFromDate(order.date) === "SHIPPED"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {getStatusFromDate(order.date)}
                    </span>

                    <p className="text-sm text-gray-400 mt-1">{order.date}</p>

                    <div className="mt-3 flex gap-2">
                      <Link to="/error">
                        <button className="px-3 py-1 border rounded text-sm">
                          Track Order
                        </button>
                      </Link>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;