import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../services/api';
import { ArrowLeft, Plus, X } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: '',
    category: 'casual',
    featured: false,
    images: [''],
    sizes: [{ size: '', stock: '' }],
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const product = response.data.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        brand: product.brand,
        category: product.category,
        featured: product.featured,
        images: product.images,
        sizes: product.sizes,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = value;
    setFormData((prev) => ({ ...prev, sizes: newSizes }));
  };

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: '' }],
    }));
  };

  const removeSize = (index) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.brand) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.images.some((img) => !img)) {
      setError('Please provide all image URLs');
      setLoading(false);
      return;
    }

    if (formData.sizes.some((s) => !s.size || !s.stock)) {
      setError('Please fill in all size and stock information');
      setLoading(false);
      return;
    }

    // Convert to correct types
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      sizes: formData.sizes.map((s) => ({
        size: parseInt(s.size),
        stock: parseInt(s.stock),
      })),
    };

    try {
      if (isEdit) {
        await productAPI.update(id, productData);
      } else {
        await productAPI.create(productData);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="running">Running</option>
                  <option value="casual">Casual</option>
                  <option value="sports">Sports</option>
                  <option value="formal">Formal</option>
                  <option value="sneakers">Sneakers</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="ml-2 text-gray-700">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Product Images</h2>

            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus size={20} />
              Add Another Image
            </button>
          </div>

          {/* Sizes & Stock */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Sizes & Stock</h2>

            {formData.sizes.map((sizeObj, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="number"
                  value={sizeObj.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  placeholder="Size (e.g., 9)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="number"
                  value={sizeObj.stock}
                  onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                  placeholder="Stock quantity"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {formData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSize}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Plus size={20} />
              Add Another Size
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Saving...'
                : isEdit
                ? 'Update Product'
                : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;