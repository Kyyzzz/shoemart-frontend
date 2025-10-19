import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Mail, Download } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const lastOrder = sessionStorage.getItem('lastOrder');
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">No order found</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline font-semibold"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-gray-600 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-800">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-800">
                {estimatedDelivery.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">
                ${order.pricing.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t pt-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Package size={24} />
              Shipping To
            </h2>
            <p className="text-gray-700">
              {order.shippingInfo.firstName} {order.shippingInfo.lastName}
            </p>
            <p className="text-gray-700">{order.shippingInfo.address}</p>
            <p className="text-gray-700">
              {order.shippingInfo.city}, {order.shippingInfo.state}{' '}
              {order.shippingInfo.zipCode}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-lg font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center pb-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} × Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.pricing.shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `$${order.pricing.shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${order.pricing.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-blue-600">
                ${order.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Email */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 flex items-center gap-4">
          <Mail className="text-blue-600" size={24} />
          <div>
            <p className="font-semibold text-gray-800">Confirmation email sent</p>
            <p className="text-gray-600">to {order.shippingInfo.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/products')}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;