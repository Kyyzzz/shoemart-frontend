import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110"
        />
        {product.featured && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-500 uppercase">{product.brand}</p>
        <h3 className="text-lg font-semibold text-gray-800 mt-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-primary mt-2">
          ${product.price.toFixed(2)}
        </p>
        
        {/* Available sizes */}
        <div className="flex flex-wrap gap-1 mt-3">
          {product.sizes.slice(0, 5).map((sizeObj, index) => (
            <span
              key={index}
              className="text-medium bg-gray-100 px-2 py-1 rounded"
            >
              {sizeObj.size}
            </span>
          ))}
          {product.sizes.length > 5 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              +{product.sizes.length - 5}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;