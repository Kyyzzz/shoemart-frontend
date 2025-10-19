import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { ChevronDown, Search as SearchIcon } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  // Filter states
  const [filters, setFilters] = useState({
    brand: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    search: searchQuery,
  });

  const [showFilters, setShowFilters] = useState(true);

  const brands = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Converse'];
  const categories = ['Running', 'Casual', 'Sports', 'Formal', 'Sneakers'];
  const sizes = [6, 7, 8, 9, 10, 11, 12, 13, 14];
  const priceRanges = [
    { label: 'Under $50', max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $150', min: 100, max: 150 },
    { label: 'Over $150', min: 150 },
  ];

  useEffect(() => {
    // Update filters when URL search param changes
    setFilters(prev => ({ ...prev, search: searchQuery }));
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const queryFilters = {};
      if (filters.brand) queryFilters.brand = filters.brand;
      if (filters.category) queryFilters.category = filters.category.toLowerCase();
      if (filters.minPrice) queryFilters.minPrice = filters.minPrice;
      if (filters.maxPrice) queryFilters.maxPrice = filters.maxPrice;
      if (filters.size) queryFilters.size = filters.size;
      if (filters.search) queryFilters.search = filters.search;

      const response = await productAPI.getAll(queryFilters);
      setProducts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));

    // Clear search param from URL when other filters are applied
    if (filterName !== 'search' && searchParams.has('search')) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  const handlePriceRange = (range) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: range.min || '',
      maxPrice: range.max || '',
    }));
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      search: '',
    });
    
    // Clear search param from URL
    if (searchParams.has('search')) {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {filters.search ? `Search Results for "${filters.search}"` : 'Our Collection'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden w-full mb-4 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <span className="font-semibold">Filters</span>
              <ChevronDown
                size={20}
                className={`transform transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showFilters && (
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                {/* Search Input */}
                <div>
                  <label className="block font-semibold mb-2 text-sm text-gray-700">
                    Search
                  </label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="font-semibold mb-3 text-lg">Brand</h3>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.brand === brand}
                          onChange={(e) =>
                            handleFilterChange('brand', e.target.checked ? brand : '')
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="ml-3 text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="font-semibold mb-3 text-lg">Category</h3>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange('category', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <hr />

                <div>
                  <h3 className="font-semibold mb-3 text-lg">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <label
                        key={index}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          checked={
                            filters.maxPrice === (range.max || '') &&
                            filters.minPrice === (range.min || '')
                          }
                          onChange={() => handlePriceRange(range)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr />

                <div>
                  <h3 className="font-semibold mb-3 text-lg">Size</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          handleFilterChange(
                            'size',
                            filters.size === size.toString() ? '' : size.toString()
                          )
                        }
                        className={`p-2 rounded border text-sm font-medium transition ${
                          filters.size === size.toString()
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-600'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-red-100 text-red-700 py-2 rounded-md font-medium hover:bg-red-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <Loading />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  {filters.search 
                    ? `No results for "${filters.search}". Try a different search term.`
                    : 'Try adjusting your filters'}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;