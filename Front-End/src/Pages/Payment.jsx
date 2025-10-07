import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useOrders } from "../Context/OrderContext";
import { useCart } from "../Context/CartContext";
import phonepe from "../Components/Assets/phonepe.png";
import gpay from "../Components/Assets/gpay.png";
import paytm from "../Components/Assets/paytm.png";
import mastercard from "../Components/Assets/mastercard.png";
import visa from "../Components/Assets/visa.png";
import paypal from "../Components/Assets/paypal.png";
import bhim from "../Components/Assets/bhim.png";

const upiOptions = [
  { name: "PhonePe", icon: phonepe },
  { name: "G Pay", icon: gpay },
  { name: "Paytm", icon: paytm },
  { name: "MasterCard", icon: mastercard },
  { name: "Visa", icon: visa },
  { name: "PayPal", icon: paypal },
  { name: "BHIM", icon: bhim },
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderSummary } = location.state || {};
  const { placeOrder } = useOrders();
  const { removePurchasedItems } = useCart(); // ✅ updated hook

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [cardData, setCardData] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [selectedUpiOption, setSelectedUpiOption] = useState("");
  const [processing, setProcessing] = useState(false);

  // Protect payment page — if refreshed or entered manually, redirect to home
  useEffect(() => {
    if (!orderSummary) {
      navigate("/", { replace: true });
      toast.error("Payment session expired or invalid. Redirecting to home.");
    }
  }, [orderSummary, navigate]);

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const validatePayment = () => {
    if (paymentMethod === "Card") {
      const { cardName, cardNumber, expiry, cvv } = cardData;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

      if (!cardName || !cardNumber || !expiry || !cvv) {
        toast.error("Please fill in all card details.");
        return false;
      }

      if (!/^\d{16}$/.test(cardNumber)) {
        toast.error("Card number must be 16 digits.");
        return false;
      }

      if (!expiryRegex.test(expiry)) {
        toast.error("Expiry must be in MM/YY format.");
        return false;
      }

      if (!/^\d{3}$/.test(cvv)) {
        toast.error("CVV must be 3 digits.");
        return false;
      }

      return true;
    }

    if (paymentMethod === "UPI") {
      if (!upiId && !selectedUpiOption) {
        toast.error("Please enter UPI ID or select a UPI provider.");
        return false;
      }
      return true;
    }

    return true; // COD needs no validation
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      toast.success("Payment successful! Placing your order...");
      placeOrder(orderSummary);

      // ✅ Remove only purchased items, not all
      if (orderSummary?.items?.length) {
        removePurchasedItems(orderSummary.items.map((i) => i.id || i.productId));
      }

      // ✅ Go to orders & block going back to payment
      setTimeout(() => navigate("/orders", { replace: true }), 1000);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Confirm Your Purchase</h1>

      {/* Order Summary */}
      <div className="border p-4 rounded mb-6 bg-gray-50">
        <h2 className="text-lg font-medium mb-2">Order Summary</h2>
        {orderSummary?.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm border-b py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.total.toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-4 text-sm space-y-1">
          <div className="flex justify-between"><span>Subtotal:</span><span>₹{orderSummary?.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount:</span><span>{orderSummary?.discount ? `₹${orderSummary.discount.toFixed(2)}` : "–"}</span></div>
          <div className="flex justify-between"><span>Tax (14%):</span><span>₹{orderSummary?.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-semibold"><span>Grand Total:</span><span>₹{orderSummary?.grandTotal.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-gray-100">
        {/* Payment Method Select */}
        <div>
          <label className="block mb-1 font-medium">Select Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Card">Credit/Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Card Fields */}
        {paymentMethod === "Card" && (
          <>
            <input
              type="text"
              name="cardName"
              placeholder="Cardholder Name"
              value={cardData.cardName}
              onChange={handleCardChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number (16 digits)"
              value={cardData.cardNumber}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16),
                })
              }
              className="w-full p-2 border rounded"
              required
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={handleCardChange}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="cvv"
                placeholder="CVV"
                value={cardData.cvv}
                onChange={handleCardChange}
                maxLength={3}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}

        {/* UPI Fields */}
        {paymentMethod === "UPI" && (
          <>
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. yourname@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className={`w-full p-2 border rounded mb-2 transition ${
                selectedUpiOption ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
              required={!selectedUpiOption}
              disabled={!!selectedUpiOption}
            />
            <div className="flex gap-3 flex-wrap">
              {upiOptions.map((opt) => (
                <div
                  key={opt.name}
                  onClick={() =>
                    setSelectedUpiOption((prev) => (prev === opt.name ? "" : opt.name))
                  }
                  className={`relative cursor-pointer border-2 p-2 rounded-3xl transition-all transform ${
                    selectedUpiOption === opt.name
                      ? "border-blue-600 scale-105 shadow-lg"
                      : "border-gray-300 hover:scale-105 hover:shadow-md"
                  }`}
                  title={opt.name}
                >
                  <img src={opt.icon} alt={opt.name} className="w-12 h-12" />
                  {selectedUpiOption === opt.name && (
                    <div className="absolute top-0 right-0 bg-blue-600 w-5 h-5 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Buttons */}
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {processing ? "Processing..." : "Confirm & Pay"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="w-full mt-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
        >
          Cancel & Go Home
        </button>
      </form>
    </div>
  );
};

export default Payment;
