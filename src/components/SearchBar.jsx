import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader } from 'lucide-react';
import api from '../services/api';

const SearchBar = ({ onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    // Click outside to close
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=8`);
      setResults(response.data.data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/products/${productId}`);
    setQuery('');
    setShowResults(false);
    onClose?.();
  };

  const handleViewAllResults = () => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
    setQuery('');
    setShowResults(false);
    onClose?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleViewAllResults();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for shoes..."
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Loader className="animate-spin text-blue-600" size={20} />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((product) => (
            <button
              key={product._id}
              onClick={() => handleSelectProduct(product._id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition border-b last:border-b-0"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-blue-600 font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.averageRating > 0 && (
                    <span className="text-xs text-yellow-600">
                      ⭐ {product.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* View All Results */}
          <button
            onClick={handleViewAllResults}
            className="w-full p-4 text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            View all results for "{query}"
          </button>
        </div>
      )}

      {/* No Results */}
      {showResults && query.trim().length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center z-50">
          <p className="text-gray-500">No products found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;