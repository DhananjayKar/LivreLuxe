import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Categories () {
  const categoryMap = {};
  const [allProducts, setProducts] = useState([]);

  useEffect(() => {
  const fetchProducts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  };
  fetchProducts();
}, []);
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
