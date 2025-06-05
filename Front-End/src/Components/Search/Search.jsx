import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { debounce } from "lodash";

const Search = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const debouncedFetch = useCallback(
    debounce(async (q, signal) => {
      if (!q) {
        setRecommendations([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/search?q=${encodeURIComponent(q)}`,
          { signal }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setRecommendations(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    setQuery("");
    setRecommendations([]);
    debouncedFetch.cancel();
  }, [location.pathname, debouncedFetch]);

  useEffect(() => {
    const controller = new AbortController();
    debouncedFetch(query.trim().toLowerCase(), controller.signal);
    return () => controller.abort();
  }, [query, debouncedFetch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recommendations.length) return;
    navigate(`/book/${recommendations[0].id}`);
    setQuery("");
    setRecommendations([]);
  };

  const handleSelect = (book) => {
    navigate(`/book/${book.id}`);
    setQuery("");
    setRecommendations([]);
  };

  return (
    <div className="bg-white shadow-sm px-4 py-3 flex justify-center">
      <div className="w-full max-w-xl relative">
        <form
          onSubmit={handleSubmit}
          className="flex items-center border border-gray-300 rounded-3xl overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search for books, authors, or genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </form>

        {query && (
          <ul className="absolute top-full left-0 w-full bg-white border z-50 rounded-b-xl shadow-md mt-1 max-h-64 overflow-y-auto">
            {loading ? (
              <li className="px-4 py-2 text-gray-500">Loading…</li>
            ) : recommendations.length ? (
              recommendations.map((book) => (
                <li
                  key={book.id}
                  onClick={() => handleSelect(book)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {book.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No matches found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;