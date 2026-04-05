import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardBody, CardHeader } from '../components/ui/Card';

export default function ConfirmationPage() {
  const { orderId } = useParams();

  // Simulate email receipt (Phase 6 will implement real email)
  const handleEmailReceipt = () => {
    alert(`Receipt for order #${orderId} would be emailed. (API integration in Phase 6)`);
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
      <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

      <Card className="mb-6">
        <CardHeader>Order Details</CardHeader>
        <CardBody>
          <p><strong>Order Number:</strong> #{orderId}</p>
          <p><strong>Status:</strong> <span className="text-green-600">Completed</span></p>
          <p><strong>Estimated Pickup:</strong> 15-20 minutes</p>
        </CardBody>
      </Card>

      <div className="space-y-3">
        <Button onClick={handleEmailReceipt} variant="secondary" fullWidth>
          📧 Email Receipt
        </Button>
        <Link to="/menu">
          <Button fullWidth>Order More</Button>
        </Link>
        <Link to="/">
          <Button variant="outline" fullWidth>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}