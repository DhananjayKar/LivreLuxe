import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Search = () => {
  const [allProducts, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setQuery('');
    setDebouncedQuery('');
    setRecommendations([]);
    setShowDropdown(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!query.trim()) {
      setRecommendations([]);
      setDebouncedQuery('');
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setRecommendations([]);
      setShowDropdown(false);
      return;
    }

    const matches = allProducts.filter((book) => {
      const searchable = `${book.name} ${book.author} ${book.category}`.toLowerCase();
      return searchable.includes(debouncedQuery);
    });

    setRecommendations(matches);
    setShowDropdown(true);
  }, [debouncedQuery, allProducts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    const handleScroll = () => {
      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = query.trim().toLowerCase();
    const exactMatch = allProducts.find((book) => {
      const searchable = `${book.name} ${book.author} ${book.category}`.toLowerCase();
      return searchable.includes(q);
    });

    if (exactMatch) {
      navigate(`/book/${exactMatch.id}`);
    } else {
      navigate('/error');
    }

    setRecommendations([]);
    setShowDropdown(false);
  };

  const handleSelect = (book) => {
    navigate(`/book/${book.id}`);
    setQuery('');
    setRecommendations([]);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white shadow-sm px-4 py-3 flex justify-center">
      <div className="w-full max-w-xl relative" ref={dropdownRef}>
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
              disabled={!query.trim()}
            >
              Search
            </button>
          </form>
        </div>

        {showDropdown && (
          <ul className="absolute top-full left-0 w-full bg-white border z-50 rounded-b-xl shadow-md mt-1 max-h-64 overflow-y-auto">
            {loading && (
              <li className="px-4 py-2 text-gray-500 italic">Searching...</li>
            )}
            {!loading && recommendations.length > 0 &&
              recommendations.map((book) => (
                <li
                  key={book.id}
                  onClick={() => handleSelect(book)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {book.name}
                </li>
              ))
            }
            {!loading && debouncedQuery && recommendations.length === 0 && (
              <li className="px-4 py-2 text-red-500 italic">No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;