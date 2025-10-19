import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Start shopping to add items to your cart!
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Continue Shopping
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-4 gap-4 bg-gray-50 p-4 font-semibold text-gray-700 border-b">
              <div>Product</div>
              <div className="text-center">Quantity</div>
              <div className="text-center">Price</div>
              <div className="text-center">Total</div>
            </div>

            {/* Items */}
            <div className="divide-y">
              {cart.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}`}
                  className="p-4 md:p-6 hover:bg-gray-50 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Product Info */}
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size: US {item.size}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.product.brand}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <p className="font-semibold">
                        ${item.product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex items-center justify-between md:justify-center">
                      <p className="font-bold text-lg md:text-base">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() =>
                          removeFromCart(item.product._id, item.size)
                        }
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="p-4 md:p-6 border-t bg-gray-50">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => navigate('/products')}
            className="mt-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-semibold">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6 pb-6 border-b">
              <input
                type="text"
                placeholder="Promo code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300">
                Apply
              </button>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/products')}
              className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Continue Shopping
            </button>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
              <p>✓ Secure checkout</p>
              <p>✓ 30-day returns</p>
              <p>✓ Free shipping over $100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;