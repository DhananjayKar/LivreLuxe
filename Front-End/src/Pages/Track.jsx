import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Pages/Authentic/firebaseConfig";
import {
  Hourglass,
  Settings,
  Truck,
  PackageCheck,
  CheckCircle,
} from "lucide-react";

const mockStatusFlow = [
  { label: "PENDING", icon: <Hourglass size={20} /> },
  { label: "PROCESSING", icon: <Settings size={20} /> },
  { label: "SHIPPED", icon: <Truck size={20} /> },
  { label: "OUT FOR DELIVERY", icon: <PackageCheck size={20} /> },
  { label: "DELIVERED", icon: <CheckCircle size={20} /> },
];

const Track = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("Please log in to track your order.");
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch order");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load order tracking.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  if (loading) return <p className="text-center mt-6">Loading order status...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!order) return <p className="text-center mt-6">No order found.</p>;

  const currentStep = mockStatusFlow.findIndex(
    (step) => step.label.toLowerCase() === order.status?.toLowerCase()
  );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Tracking Order #{orderId}</h2>

      <div className="flex justify-between items-center">
        {mockStatusFlow.map((step, index) => (
          <div key={step.label} className="flex flex-col items-center w-1/5">
            <div className="mb-1">{step.icon}</div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index < currentStep ? "bg-green-500 text-white"
                  : index === currentStep ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"}`}
            >
              {index + 1}
            </div>
            <p className="text-xs mt-2 text-center">{step.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/orders")}
        className="mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md block mx-auto"
      >
        Back to Orders
      </button>
    </div>
  );
};

export default Track;