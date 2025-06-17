import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Categories() {
  const [allProducts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/products`),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`),
        ]);

        const productData = await productRes.json();
        const categoryData = await categoryRes.json();

        setProducts(productData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl font-semibold text-gray-700">Loading categories...</p>
        </div>
      </div>
    );
  }

  const categoryMap = {};
  allProducts.forEach((product) => {
    if (!categoryMap[product.category]) {
      categoryMap[product.category] = [];
    }
    categoryMap[product.category].push(product);
  });

  const displayData = categories.map((catObj) => {
    const catName = catObj.name;
    const productsInCat = categoryMap[catName] || [];
    const randomProduct = productsInCat[Math.floor(Math.random() * productsInCat.length)];
    return {
      category: catName,
      product: randomProduct,
    };
  }).filter(item => item.product); // Remove empty ones

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8">
      {displayData.map(({ category, product }) => (
        <Link
          to={`/category/${category.replace(/\s+/g, '-').toLowerCase()}`}
          key={category}
          className="relative group border rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <h3 className="text-white text-xl font-bold">{category}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}