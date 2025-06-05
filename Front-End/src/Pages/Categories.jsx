import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Categories () {
  const categoryMap = {};
  const [allProducts, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-semibold text-gray-700">Loading products...</p>
        </div>
      </div>
    );
  }
  
  allProducts.forEach((product) => {
    if (!categoryMap[product.category]) {
      categoryMap[product.category] = [];
    }
    categoryMap[product.category].push(product);
  });

  const randomProducts = Object.keys(categoryMap).map((category) => {
    const products = categoryMap[category];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    return { category, ...randomProduct };
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8">
      {randomProducts.map((item) => (
        <Link
          to={`/category/${item.category.replace(/\s+/g, '-').toLowerCase()}`}
          key={item.id}
          className="relative group border rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-contain"
          />
        
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <h3 className="text-white text-xl font-bold">{item.category}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};
