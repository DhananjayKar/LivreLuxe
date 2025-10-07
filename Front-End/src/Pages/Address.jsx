import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../Pages/Authentic/firebaseConfig";

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderSummary, from } = location.state || {};

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const fetchedOnce = useRef(false);

  const [formAddress, setFormAddress] = useState({
    homeNo: "",
    roadNo: "",
    locality: "",
    pinCode: "",
    city: "",
    state: "",
    email: "",
    mobile: "",
    category: "home",
  });

  const resetForm = () => {
    setFormAddress({
      homeNo: "",
      roadNo: "",
      locality: "",
      pinCode: "",
      city: "",
      state: "",
      email: "",
      mobile: "",
      category: "home",
    });
    setEditingId(null);
  };

  // ------------------- FETCH ADDRESSES -------------------
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchAddresses = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setAddresses([]);
          return;
        }

        try {
          const token = await user.getIdToken();

          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/addresses`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setAddresses(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Failed to fetch addresses:", err.response || err);
          toast.error("Failed to fetch addresses.");
          setAddresses([]);
        }
      });
    };

    fetchAddresses();
  }, []);

  // ------------------- SELECT / EDIT / DELETE -------------------
  const handleSelect = (id) => setSelectedId(id);

  const handleEditClick = (addr) => {
    setEditingId(addr._id);
    setFormAddress({
      homeNo: addr.homeNo || "",
      roadNo: addr.roadNo || "",
      locality: addr.locality || "",
      pinCode: addr.pinCode || "",
      city: addr.city || "",
      state: addr.state || "",
      email: addr.email || "",
      mobile: addr.mobile || "",
      category: addr.category || "home",
    });
    setAddingNew(true);
  };

  const handleDelete = async (id) => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      try {
        const token = await user.getIdToken();
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/addresses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(addresses.filter((a) => a._id !== id));
        if (selectedId === id) setSelectedId(null);
        toast.success("Address deleted successfully.");
      } catch (err) {
        console.error("Failed to delete address:", err.response || err);
        toast.error("Failed to delete address.");
      }
    });
  };

  // ------------------- ADD / UPDATE FORM -------------------
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formAddress.homeNo ||
      !formAddress.locality ||
      !formAddress.city ||
      !formAddress.state ||
      !formAddress.pinCode ||
      !formAddress.mobile
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const token = await user.getIdToken();

        const { data } = editingId
          ? await axios.put(
              `${import.meta.env.VITE_API_URL}/api/addresses/${editingId}`,
              formAddress,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          : await axios.post(
              `${import.meta.env.VITE_API_URL}/api/addresses`,
              formAddress,
              { headers: { Authorization: `Bearer ${token}` } }
            );

        if (editingId) {
          setAddresses(addresses.map((a) => (a._id === editingId ? data : a)));
          toast.success("Address updated successfully.");
        } else {
          setAddresses([...addresses, data]);
          toast.success("Address added successfully.");
        }

        resetForm();
        setAddingNew(false);
      } catch (err) {
        console.error("Failed to save address:", err.response || err);
        toast.error("Failed to save address.");
      }
    });
  };

  const handleProceed = () => {
    if (!selectedId) {
      toast.error("Please select an address before proceeding.");
      return;
    }
    navigate("/payment", { state: { orderSummary, from: "address" }, replace: true });
  };

  // ------------------- RENDER -------------------
  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
      {/* Left Section */}
      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Delivery Address</h1>

        {/* Saved Addresses */}
        {!addingNew && addresses.length > 0 && (
          <motion.div layout className="space-y-3 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AnimatePresence>
              {addresses.map((addr) => (
                <motion.div
                  key={addr._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center justify-between border p-4 rounded-xl shadow-sm transition ${
                    selectedId === addr._id ? "border-blue-500 bg-blue-50" : "hover:shadow-md"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="selectedAddress"
                      checked={selectedId === addr._id}
                      onChange={() => handleSelect(addr._id)}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{addr.category?.toUpperCase()}</p>
                      <p className="text-gray-600 text-sm">
                        {`${addr.homeNo}, ${addr.roadNo}, ${addr.locality}, ${addr.city} - ${addr.pinCode}`}
                      </p>
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(addr)}
                      className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-sm px-3 py-1 border rounded-lg hover:bg-red-50 text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Add/Edit Form */}
        <AnimatePresence>
          {addingNew && (
            <motion.form
              key="address-form"
              layout
              onSubmit={handleFormSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-6 rounded-xl shadow-sm mb-4 bg-white"
            >
              {[
                { name: "homeNo", placeholder: "Home No" },
                { name: "roadNo", placeholder: "Road No" },
                { name: "locality", placeholder: "Locality" },
                { name: "city", placeholder: "City" },
                { name: "state", placeholder: "State" },
                { name: "pinCode", placeholder: "Pin Code" },
                { name: "mobile", placeholder: "Mobile Number", span: 2 },
                { name: "email", placeholder: "Email (optional)", span: 2 },
              ].map((field) => (
                <input
                  key={field.name}
                  placeholder={field.placeholder}
                  className={`border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    field.span ? "md:col-span-2" : ""
                  }`}
                  value={formAddress[field.name]}
                  onChange={(e) =>
                    setFormAddress({ ...formAddress, [field.name]: e.target.value })
                  }
                />
              ))}

              <select
                className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-blue-400"
                value={formAddress.category}
                onChange={(e) =>
                  setFormAddress({ ...formAddress, category: e.target.value })
                }
              >
                <option value="home">Home</option>
                <option value="shop">Shop</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>

              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? "Update Address" : "Add Address"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              setAddingNew(!addingNew);
              resetForm();
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            {addingNew ? "Back to Addresses" : "Add New Address"}
          </button>
          <button
            onClick={handleProceed}
            disabled={!selectedId}
            className={`px-4 py-2 rounded-lg text-white transition ${
              selectedId
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/* Right Section - Order Summary */}
      <motion.div
        layout
        className="w-full lg:w-96 flex-shrink-0 bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
        <div className="w-full border-t border-gray-200 mb-3"></div>
        {orderSummary?.items?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between w-full mb-2"
          >
            <img
              src={item.image}
              alt="Product image"
              className="w-16 h-16 md:w-24 md:h-24 rounded-2xl object-cover"
            />
            <p className="text-gray-700 text-xl font-bold mt-2 sm:mt-0 sm:mx-4 text-center sm:text-left">
              {item.name} x{item.quantity}
            </p>
            <p className="font-medium text-gray-800 text-xl mt-2 sm:mt-0 text-center sm:text-left">
              ₹{item.total}
            </p>
          </div>
        ))}
        <div className="w-full border-t border-gray-200 mt-2 pt-2">
          <div className="flex justify-between font-semibold">
            <p>Subtotal</p>
            <p>₹{orderSummary?.subtotal}</p>
          </div>
          {orderSummary?.discount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <p>Discount</p>
              <p>-₹{orderSummary.discount}</p>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2 text-gray-900">
            <p>Total <small>(incl. of all taxes and charges)</small></p>
            <p>₹{orderSummary?.grandTotal}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Address;
