import React, { useEffect, useState } from "react";
import { useCart } from '../Context/CartContext';
import { useOrders } from '../Context/OrderContext';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Pages/Authentic/firebaseConfig";
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
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const averageRating = reviews.length
    ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0;
    
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!currentProduct?._id) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${currentProduct._id}`);
        const data = await res.json();
    
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          setReviews([]);
          console.error("Expected array but got:", data);
        }
    
        if (user && Array.isArray(data)) {
          const reviewed = data.find((r) => r.userId === user.uid);
          if (reviewed) {
            setAlreadyReviewed(true);
            toast("You've already reviewed this product.", {
              icon: "ℹ️",
              style: {
                background: "#e8f4fd",
                color: "#0c5460",
                border: "1px solid #bee5eb"
              }
            });
          }
        }
      } catch (err) {
        setReviews([]); // fallback to empty array to avoid future slice errors
        toast.error("Failed to load reviews");
      }
    };
    fetchReviews();
  }, [currentProduct?._id, user]);

  const handleReviewSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please add rating and comment");
      return;
    }
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${currentProduct._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          username: user.displayName,
          rating,
          comment,
        }),
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error submitting review");
      }
  
      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      toast.success("Review submitted!");
      setShowForm(false);
      setAlreadyReviewed(true);
    } catch (err) {
      toast.error(err.message);
    }
  };
  
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
    navigate("/checkout", {
      state: {
        from: "single",
        orderSummary
      }
    });
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
          ₹{(Number(currentProduct.oldPrice) ).toFixed(2)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-2xl ${
                i < averageRating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-600 text-sm">({reviews.length} Reviews)</p>
      </div>

      {/* Lazy loaded reviews */}
      <div className="flex flex-col gap-4 mt-6 w-full max-w-xl mx-auto">
        {reviews.slice(0, visibleReviews).map((review, index) => (
          <div key={index} className="border p-4 rounded shadow-sm w-full">
            <div className="flex items-center gap-2 mb-2 text-yellow-400">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
            <p className="text-xs text-gray-500 text-right">— {review.username}</p>
          </div>
        ))}

        {visibleReviews < reviews.length && (
          <button
            onClick={() => setVisibleReviews((prev) => prev + 3)}
            className="mt-4 text-blue-600 hover:underline text-sm self-center"
          >
            Load more reviews
          </button>
        )}
      </div>
      
      {user && !alreadyReviewed && (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
            >
              Add Review
            </button>
          ) : (
            <div className="border p-4 rounded w-full max-w-md mt-4">
              <label className="block text-sm font-medium mb-1">Your Rating:</label>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer text-2xl ${
                      i < rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(i + 1)}
                  />
                ))}
              </div>
      
              <label className="block text-sm font-medium mb-1">Your Review:</label>
              <textarea
                className="w-full border rounded p-2 text-sm"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
      
              <div className="flex justify-between mt-3">
                <button
                  onClick={handleReviewSubmit}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Submit Review
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex gap-4 mt-6">
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