import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Package, Truck, CheckCircle, Calendar } from 'lucide-react';

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payment/order/${orderNumber}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Order not found</p>
        <button
          onClick={() => navigate('/orders')}
          className="text-blue-600 hover:underline font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const orderSteps = [
    { 
      status: 'processing', 
      label: 'Order Placed', 
      icon: Package,
      completed: true 
    },
    { 
      status: 'shipped', 
      label: 'Shipped', 
      icon: Truck,
      completed: order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
    },
    { 
      status: 'delivered', 
      label: 'Delivered', 
      icon: CheckCircle,
      completed: order.orderStatus === 'delivered'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Order Details</h1>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Total</p>
                <p className="font-semibold text-blue-600">
                  ${order.pricing.total.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold text-green-600">
                  {order.paymentInfo.paymentStatus.charAt(0).toUpperCase() + 
                   order.paymentInfo.paymentStatus.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="font-semibold">{order.items.length} items</p>
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Order Tracking</h2>
            <div className="relative">
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ 
                    width: order.orderStatus === 'processing' ? '0%' : 
                           order.orderStatus === 'shipped' ? '50%' : '100%' 
                  }}
                />
              </div>
              <div className="relative flex justify-between">
                {orderSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                        step.completed
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <step.icon size={24} />
                    </div>
                    <p className="text-sm font-semibold text-center">
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div>
              <p className="font-semibold">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p className="text-gray-700">{order.shippingInfo.address}</p>
              <p className="text-gray-700">
                {order.shippingInfo.city}, {order.shippingInfo.state}{' '}
                {order.shippingInfo.zipCode}
              </p>
              <p className="text-gray-700 mt-2">
                Phone: {order.shippingInfo.phone}
              </p>
              <p className="text-gray-700">Email: {order.shippingInfo.email}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
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
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;