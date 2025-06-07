import { useParams, Link } from 'react-router-dom';
import { capitalizeWords, decodeCategoryName } from '../../Utils/Utils';
import { useEffect, useState } from "react";

const Category = () => {
  const { name } = useParams();
  const [allProducts, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  };
  fetchProducts();
}, []);

  const filteredProducts = allProducts.filter(
    (product) =>
      product.category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '&') === name.toLowerCase()
  );

  return (
    <div>
      <h2 className="text-2xl ms-10 font-bold">{capitalizeWords(decodeCategoryName(name))}</h2>

      <div className="space-y-6">
        {filteredProducts.map((item) => (
        <Link key={item.id} to={`/book/${item.id}`} >
          <div className="flex border rounded p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="w-32 h-40 flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="ml-6 flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              {item.author && (
               <p className="text-gray-600 text-sm mt-1">by {item.author}</p>
               )}
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-gray-400 line-through">
                  ₹{item.oldPrice}
                </span>
                <span className="text-green-600 font-bold">
                  ₹{item.newPrice}
                </span>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;