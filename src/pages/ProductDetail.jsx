import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { Star, ShoppingCart, ChevronLeft } from 'lucide-react';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewCheckReason, setReviewCheckReason] = useState('');

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (isAuthenticated) {
      checkReviewEligibility();
    }
  }, [id, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get(`/reviews/product/${id}`);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const response = await api.get(`/reviews/can-review/${id}`);
      setCanReview(response.data.canReview);
      setReviewCheckReason(response.data.reason);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await api.post('/reviews', reviewData);
      alert('✅ Review submitted successfully!');
      setShowReviewForm(false);
      fetchReviews();
      fetchProduct(); // Refresh product to get updated rating
      checkReviewEligibility();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      alert('Please login to mark reviews as helpful');
      return;
    }
  
    try {
      await api.patch(`/reviews/${reviewId}/helpful`);
      fetchReviews(); // Refresh reviews to get updated count
    } catch (error) {
      if (error.response?.status === 401) {
        alert('Please login to mark reviews as helpful');
      } else {
        console.error('Error marking review as helpful:', error);
      }
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setAddingToCart(true);
    addToCart(product, selectedSize, quantity);
    
    setSuccessMessage(`Added ${quantity} item(s) to cart!`);
    setTimeout(() => setSuccessMessage(''), 3000);
    setAddingToCart(false);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  if (loading) return <Loading />;

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize);
  const stockAvailable = selectedSizeObj?.stock || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-8"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Images Section */}
        <div className="flex flex-col">
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-96 md:h-[500px]">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-20 w-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  selectedImage === index
                    ? 'border-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <div className="text-sm text-gray-500 mb-2">
            {product.category} / {product.brand}
          </div>

          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating Display */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(product.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.averageRating > 0 ? product.averageRating.toFixed(1) : 'No ratings yet'} 
              {product.totalReviews > 0 && ` (${product.totalReviews} ${product.totalReviews === 1 ? 'review' : 'reviews'})`}
            </span>
          </div>

          <div className="mb-6">
            <p className="text-3xl font-bold text-blue-600 mb-2">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600">Free shipping on orders over $100</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="font-semibold mb-3 block">
              Select Size:
              {selectedSize && (
                <span className="text-blue-600 ml-2">US {selectedSize}</span>
              )}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  disabled={sizeObj.stock === 0}
                  className={`py-3 rounded border-2 font-medium transition ${
                    selectedSize === sizeObj.size
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-blue-600'
                  } ${
                    sizeObj.stock === 0
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : ''
                  } ${
                    sizeObj.stock > 0 && sizeObj.stock <= 5
                      ? 'border-orange-300'
                      : ''
                  }`}
                >
                  <div>{sizeObj.size}</div>
                  <div className="text-xs text-gray-500">
                    {sizeObj.stock === 0 ? (
                      'Out of Stock'
                    ) : sizeObj.stock <= 5 ? (
                      <span className="text-orange-600">Only {sizeObj.stock} left!</span>
                    ) : (
                      'In Stock'
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="font-semibold mb-3 block">Quantity:</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={stockAvailable}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 border border-gray-300 rounded p-2 text-center"
              />
              <button
                onClick={() =>
                  setQuantity(Math.min(stockAvailable, quantity + 1))
                }
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                +
              </button>
              <span className="text-sm text-gray-500 ml-4">
                {stockAvailable} available
              </span>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 bg-green-100 text-green-700 p-4 rounded-lg">
              ✓ {successMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedSize || stockAvailable === 0}
              className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={addingToCart || !selectedSize || stockAvailable === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Product Info Grid */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Brand:</span>
              <span className="font-semibold">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold capitalize">
                {product.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SKU:</span>
              <span className="font-semibold">{product._id.slice(0, 8)}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              ✓ 30-day money-back guarantee
            </p>
            <p className="text-sm text-gray-700">✓ Free returns & exchanges</p>
            <p className="text-sm text-gray-700">✓ Secure checkout</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-8">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

        {/* Review Summary */}
        {product.totalReviews > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {product.averageRating.toFixed(1)}
                </p>
                <div className="flex items-center justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(product.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{product.totalReviews} reviews</p>
              </div>
            </div>
          </div>
        )}

        {/* Write Review Button */}
        {isAuthenticated ? (
          <div className="mb-8">
            {canReview && reviewCheckReason === 'can_review' && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Write a Review
              </button>
            )}
            {reviewCheckReason === 'already_reviewed' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  You have already reviewed this product. Thank you for your feedback!
                </p>
              </div>
            )}
            {reviewCheckReason === 'no_purchase' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Purchase this product to write a verified review.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Sign in
              </button>{' '}
              to write a review
            </p>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <div className="mb-8">
            <ReviewForm
              productId={product._id}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <Loading />
        ) : (
          <ReviewList reviews={reviews} onMarkHelpful={handleMarkHelpful} />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;