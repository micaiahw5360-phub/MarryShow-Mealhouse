import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../context/cartStore';
import { useAuthStore } from '../context/authStore';
import { useCreateOrder } from '../hooks/useOrder';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const { items, totalPrice } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const createOrderMutation = useCreateOrder();

  const totalWithTax = totalPrice * 1.1;
  const hasSufficientBalance = user ? user.wallet_balance >= totalWithTax : false;

  const handlePayment = () => {
    createOrderMutation.mutate(undefined, {
      onSuccess: (data) => {
        navigate(`/confirmation/${data.orderId}`);
      },
    });
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <Card className="mb-6">
        <CardHeader>Order Summary</CardHeader>
        <CardBody>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax (10%)</span>
            <span>${(totalPrice * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg border-t mt-2 pt-2">
            <span>Total</span>
            <span>${totalWithTax.toFixed(2)}</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Wallet Balance</CardHeader>
        <CardBody>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-primary-600">
              ${user?.wallet_balance.toFixed(2)}
            </div>
            <p className="text-gray-500 mt-1">Available balance</p>
            {!hasSufficientBalance && (
              <p className="text-red-500 text-sm mt-2">Insufficient balance. Please add funds.</p>
            )}
          </div>
        </CardBody>
        <CardFooter>
          <Button
            onClick={() => setShowConfirmModal(true)}
            disabled={!hasSufficientBalance || createOrderMutation.isPending}
            isLoading={createOrderMutation.isPending}
            fullWidth
          >
            Confirm Payment
          </Button>
        </CardFooter>
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Payment"
        onConfirm={handlePayment}
        confirmText="Pay Now"
      >
        <p>You are about to pay <strong>${totalWithTax.toFixed(2)}</strong> using your wallet.</p>
        <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}