import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, NavLink } from "react-router-dom";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "../App.css"

import banner1 from "../Components/Assets/banner1.jpg";
import banner2 from "../Components/Assets/banner2.jpg";
import banner3 from "../Components/Assets/banner3.jpg";
import banner4 from "../Components/Assets/banner4.jpg";

const allCategories = [
  "Fantasy & Fiction",
  "Academic & Activity",
  "Moral & Motivation",
  "Box-Set",
  "Stationary",
  "Best Seller",
  "Non-Fiction",
  "Children",
];

function getRandomCategories(categories, count) {
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const featuredCategories = getRandomCategories(allCategories, 4);

const carouselImages = [
  { url: banner1, promo: "" },
  { url: banner2, promo: "" },
  { url: banner3, promo: "" },
  { url: banner4, promo: "" },
];

export default function Home() {
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      console.log(data);
      setProducts(data);
    };
    fetchProducts();
  }, []);
  
const scrollRef = useRef(null);

const scroll = (direction) => {
  const container = scrollRef.current;
  if (!container) return;
  const scrollAmount = container.offsetWidth * 0.8;
  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};

  return (
    <div className="flex flex-col">
      <div className="w-full h-64 md:h-96">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          className="h-full"
        >
          {carouselImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <img
                  src={img.url}
                  alt={`slide-${idx}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                  <h2 className="text-white text-2xl md:text-4xl font-bold">
                    {img.promo}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <nav className="bg-gray-100 py-2 shadow-sm">
        <ul
          ref={scrollRef}
          className={` no-scrollbar
            flex overflow-x-auto lg:overflow-x-hidden
            whitespace-nowrap gap-6 px-4 lg:px-16 scroll-smooth
            lg:justify-evenly `}
        >
          {allCategories.map((cat, idx) => {
            const categoryUrl = cat.toLowerCase().replace(/\s+/g, "-");
            return (
              <NavLink
                key={idx}
                to={`/category/${categoryUrl}`}
                className="flex-shrink-0"
              >
                <li className="text-gray-700 cursor-pointer font-medium relative group hover:text-blue-600 transform hover:scale-110 transition-all">
                  {cat}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-600 rounded-xl group-hover:w-full transition-all"></span>
                </li>
              </NavLink>
            );
          })}
        </ul>
      </nav>

      <main className="flex flex-col gap-8 px-4 py-6">
        {featuredCategories.map((category, idx) => {
          const books = products
            .filter(book => book.category === category)
            .slice(0, 6);

          if (books.length === 0) return null;

          return (
            <section key={idx}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {books.map((book, i) => (
                <Link to={`/book/${book.id}`}
                key={book.id || i}
                className="block border p-4 rounded-lg hover:shadow-md transition">
                  <div
                    className="bg-white shadow-md rounded p-2 hover:shadow-lg transition"
                  >
                    <img
                      src={book.image}
                      alt={book.name}
                      className="w-full h-50 object-cover rounded"
                    />
                    <h4 className="mt-2 text-sm font-semibold">
                      {book.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {book.author}
                    </p>
                    <div className="text-sm font-medium text-blue-600">
                      ₹{book.newPrice}
                    </div>
                    <div className="text-xs line-through text-gray-400">
                      ₹{book.oldPrice}
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}