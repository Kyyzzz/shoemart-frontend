import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const StripeCheckout = ({ formData, pricing }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateStock = async () => {
    try {
      // Check stock for each item in cart
      for (const item of cart) {
        const response = await api.get(`/products/${item.product._id}`);
        const product = response.data.data;
        
        const sizeObj = product.sizes.find(s => s.size === item.size);
        
        if (!sizeObj) {
          throw new Error(`Size ${item.size} is no longer available for ${product.name}`);
        }
        
        if (sizeObj.stock < item.quantity) {
          throw new Error(
            `Only ${sizeObj.stock} units of ${product.name} (Size ${item.size}) are available. Please update your cart.`
          );
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 0: Validate stock availability
      await validateStock();

      // Step 1: Create Payment Intent
      const intentResponse = await api.post('/payment/create-payment-intent', {
        amount: pricing.total,
      });

      const { clientSecret } = intentResponse.data;

      // Step 2: Confirm Payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.zipCode,
                country: 'US',
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Step 3: Create Order in Database
      const orderResponse = await api.post('/payment/create-order', {
        items: cart,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        pricing,
        paymentIntentId: paymentIntent.id,
      });

      const order = orderResponse.data.data;

      // Step 4: Clear cart and navigate to success
      sessionStorage.setItem('lastOrder', JSON.stringify(order));
      clearCart();
      navigate('/order-success');

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div>
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <AlertCircle className="text-red-600" size={24} />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lock size={20} />
          Payment Information
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Card Details
          </label>
          <div className="p-4 border border-gray-300 rounded-lg">
            <CardElement options={cardStyle} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock size={16} />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing Payment...' : `Pay $${pricing.total.toFixed(2)}`}
      </button>

      <p className="text-center text-gray-600 text-sm mt-4">
        Test card: 4242 4242 4242 4242 | Any future date | Any CVC
      </p>
    </div>
  );
};

export default StripeCheckout;