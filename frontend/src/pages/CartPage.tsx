import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import Button from '../components/ui/Button';
import Card, { CardBody, CardFooter, CardHeader } from '../components/ui/Card';
import QuantitySelector from '../components/ui/QuantitySelector';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/payment');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious items from our menu.</p>
        <Link to="/menu">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow space-y-4">
          {items.map(item => (
            <Card key={item.id}>
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍔</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-primary-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <Card>
            <CardHeader>Order Summary</CardHeader>
            <CardBody>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button onClick={handleCheckout} fullWidth>
                Proceed to Payment
              </Button>
              <button onClick={clearCart} className="text-sm text-red-500 mt-2 w-full text-center">
                Clear Cart
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}