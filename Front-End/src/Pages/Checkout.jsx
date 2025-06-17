import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useOrders } from '../Context/OrderContext';
import { useCart } from '../Context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from, orderSummary } = location.state || {};
  const { placeOrder } = useOrders();
  const { clearCart } = useCart();

  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [upiId, setUpiId] = useState("");

  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const validatePayment = () => {
    if (paymentMethod === "Card") {
      const { cardName, cardNumber, expiry, cvv } = paymentData;
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  
      if (!cardName || !cardNumber || !expiry || !cvv) {
        toast.error('Please fill in all card details.');
        return false;
      }
  
      if (!/^\d{16}$/.test(cardNumber)) {
        toast.error('Card number must be exactly 16 digits.');
        return false;
      }
  
      if (!expiryRegex.test(expiry)) {
        toast.error('Expiry must be in MM/YY format.');
        return false;
      }
  
      if (!/^\d{3}$/.test(cvv)) {
        toast.error('Invalid CVV.');
        return false;
      }
  
      return true;
    }
  
    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        toast.error("Please enter a valid UPI ID.");
        return false;
      }
      return true;
    }
  
    // Cash on Delivery — no validation needed
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePayment()) return;

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      toast.success('Payment successful! Placing your order...');
      placeOrder(orderSummary);
      if (from === 'cart') clearCart();
      setTimeout(() => navigate('/orders'), 1000);
    }, 2000);
  };

  if (!orderSummary) {
    return (
      <div className="text-center mt-20 text-red-500">
        Invalid checkout session. Please go back and try again.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Confirm Your Purchase</h1>

      <div className="border p-4 rounded mb-6 bg-gray-50">
        <h2 className="text-lg font-medium mb-2">Order Summary</h2>
        {orderSummary.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm border-b py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.total.toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>{orderSummary.discount ? `₹${orderSummary.discount.toFixed(2)}` : '–'}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (14%):</span>
            <span>₹{orderSummary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Grand Total:</span>
            <span>₹{orderSummary.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

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
              value={paymentData.cardName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number (16 digits)"
              value={paymentData.cardNumber}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 16);
                setPaymentData({ ...paymentData, cardNumber: onlyNums });
              }}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={paymentData.expiry}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="cvv"
                placeholder="CVV"
                value={paymentData.cvv}
                onChange={handleChange}
                maxLength={3}
                className="w-full p-2 border rounded"
              />
            </div>
          </>
        )}
      
        {/* UPI Field */}
        {paymentMethod === "UPI" && (
          <input
            type="text"
            placeholder="Enter UPI ID (e.g. yourname@upi)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}
      
        <button
          type="submit"
          disabled={processing}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          {processing ? 'Processing...' : 'Confirm & Pay'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-200"
        >
          Cancel & Go Back
        </button>
      </form>
    </div>
  );
};

export default Checkout;