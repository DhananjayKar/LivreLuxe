import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Search = () => {
  const [allProducts, setProducts] = useState([]);
  useEffect(() => {
  const fetchProducts = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  };
  fetchProducts();
}, []);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setQuery('');
    setDebouncedQuery('');
    setRecommendations([]);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setRecommendations([]);
      return;
    }

    const keywords = debouncedQuery.split(/\s+/);

    const matches = allProducts.filter((book) => {
      const searchable = `${book.name} ${book.author} ${book.category}`.toLowerCase();
      return keywords.every((kw) => searchable.includes(kw));
    });

    setRecommendations(matches);
  }, [debouncedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const keywords = query.trim().toLowerCase().split(/\s+/);
    const exactMatch = allProducts.find((book) => {
      const searchable = `${book.name} ${book.author} ${book.category}`.toLowerCase();
      return keywords.every((kw) => searchable.includes(kw));
    });

    if (exactMatch) {
      navigate(`/book/${exactMatch.id}`);
    } else {
      navigate('/error');
    }

    setRecommendations([]);
  };

  const handleSelect = (book) => {
    navigate(`/book/${book.id}`);
    setQuery('');
    setRecommendations([]);
  };

  return (
    <div>
      <div className="bg-white shadow-sm px-4 py-3 flex justify-center">
        <div className="w-full max-w-xl relative">
          <div className="flex items-center border border-gray-300 rounded-3xl overflow-hidden">
            <form onSubmit={handleSubmit} className="w-full flex">
              <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>
          </div>

          {recommendations.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border z-50 rounded-b-xl shadow-md mt-1 max-h-64 overflow-y-auto">
              {recommendations.map((book) => (
                <li
                  key={book.id}
                  onClick={() => handleSelect(book)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {book.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;