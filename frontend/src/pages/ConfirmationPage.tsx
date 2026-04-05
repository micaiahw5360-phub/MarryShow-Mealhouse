import { useParams } from 'react-router-dom';

export default function ConfirmationPage() {
  const { orderId } = useParams();
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Confirmed!</h1>
      <p className="text-gray-600">Your order #{orderId} has been placed successfully.</p>
    </div>
  );
}