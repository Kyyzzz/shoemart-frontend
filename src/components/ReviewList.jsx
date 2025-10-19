import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ReviewList = ({ reviews, onMarkHelpful }) => {
  const { isAuthenticated } = useAuth();
  const [helpfulStatus, setHelpfulStatus] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      checkHelpfulStatus();
    }
  }, [reviews, isAuthenticated]);

  const checkHelpfulStatus = async () => {
    const status = {};
    for (const review of reviews) {
      try {
        const response = await api.get(`/reviews/${review._id}/helpful-status`);
        status[review._id] = response.data.userMarkedHelpful;
      } catch (error) {
        console.error('Error checking helpful status:', error);
      }
    }
    setHelpfulStatus(status);
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    await onMarkHelpful(reviewId);
    
    // Toggle the status locally
    setHelpfulStatus(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isMarkedHelpful = helpfulStatus[review._id] || false;

        return (
          <div key={review._id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-blue-600">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{review.user.name}</p>
                      {review.isVerifiedPurchase && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <ShieldCheck size={14} />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
            </div>

            <h4 className="font-semibold text-gray-800 mb-2">{review.title}</h4>
            <p className="text-gray-700 mb-3">{review.comment}</p>

            <button
              onClick={() => handleMarkHelpful(review._id)}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isMarkedHelpful
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <ThumbsUp 
                size={16} 
                className={isMarkedHelpful ? 'fill-blue-600' : ''} 
              />
              <span>
                {isMarkedHelpful ? 'Helpful' : 'Mark as helpful'} ({review.helpful})
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;