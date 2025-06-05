import React, { useEffect, useState } from "react";
import { useCart } from '../Context/CartContext';
import { useOrders } from '../Context/OrderContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import ImagePopup from '../Components/ImagePopup/ImagePopup';
import { toast } from "react-hot-toast";

const SingleBook = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { placeOrder } = useOrders();
  const { id } = useParams();
  const [allProduct, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
  if (allProduct.length === 0) return;

  const foundProduct = allProduct.find(item => item.id.toString() === id);
  setCurrentProduct(foundProduct);

  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-semibold text-gray-700">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (foundProduct) {
    const filtered = allProduct.filter(
      item => item.category === foundProduct.category && item.id !== id
    );
    setSimilarProducts(filtered);
  }
}, [id, allProduct]);

  if (!currentProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-3">
    <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
    <p className="text-xl font-semibold text-gray-700">Loading ...</p>
  </div>
</div>
    );
  }

  const handleBuyNow = () => {
    const bookOrder = {
      id: currentProduct.id,
      image: currentProduct.image,
      name: currentProduct.name,
      author: currentProduct.author,
      price: Number(currentProduct.newPrice),
      quantity: 1,
      total: Number(currentProduct.newPrice),
    };

    const orderSummary = {
      items: [bookOrder],
      status: "PENDING",
      subtotal: bookOrder.total,
      discount: 0,
      tax: Math.floor(+((bookOrder.total) * 0.14)),
      grandTotal: bookOrder.total+ Math.floor(+((bookOrder.total) * 0.14)),
    };

    console.log("Order summary before placing order directly:", orderSummary);
    placeOrder(orderSummary);
    navigate("/orders");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <img
        src={currentProduct.image}
        alt={currentProduct.name}
        className="w-64 h-85 object-cover mb-6 cursor-pointer"
        onClick={() => setIsPopupOpen(true)}
      />

      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-semibold">{currentProduct.name}</h2>
        <p className="text-gray-600">{currentProduct.author}</p>
        <p className="text-sm text-gray-400">{currentProduct.category}</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl font-bold text-green-600">
          ₹{Number(currentProduct.newPrice).toFixed(2)}
        </span>
        <span className="line-through text-gray-500">
          ₹{(Number(currentProduct.oldPrice) * 1.5).toFixed(2)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} />
          ))}
        </div>
        <p className="text-gray-600 text-sm">(24 Reviews)</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
          toast.success("Added to Cart");
          addToCart(currentProduct)}}
          className="px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-800"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Buy Now
        </button>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Similar Books/Items</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {similarProducts.map((book) => (
              <div
                key={book.id}
                className="cursor-pointer border rounded-xl p-3 bg-white hover:shadow-xl hover:scale-105 transition duration-300 ease-in-out"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-full h-70 object-cover rounded"
                />
                <p className="mt-2 text-center font-medium truncate">{book.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isPopupOpen && (
        <ImagePopup
          imageUrl={currentProduct.image}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default SingleBook;