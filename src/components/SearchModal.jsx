import { useEffect } from 'react';
import { X } from 'lucide-react';
import SearchBar from './SearchBar';

const SearchModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Search Products</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <SearchBar onClose={onClose} />
          </div>
        </div>

        {/* Search Tips */}
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>💡 Try searching by brand, category, or product name</p>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;