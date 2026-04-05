import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';  // ADDED useSearchParams
import { CheckCircle, FileText, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useKiosk } from '../contexts/KioskContext';
import { ordersService } from '../services/api';   // ADDED import

interface OrderDetails {
  orderNumber: string;
  items: any[];
  total: number;
  paymentMethod: string;
  walletUsed: number;
  timestamp: string;
}

export function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { isKioskMode } = useKiosk();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();   // ADDED
  const orderId = searchParams.get('orderId');   // ADDED

  // REPLACED useEffect
  useEffect(() => {
    if (!orderId) {
      navigate('/menu');
      return;
    }
    ordersService.getOrder(parseInt(orderId)).then(order => {
      setOrderDetails({
        orderNumber: order.id.toString(),
        items: order.items,
        total: order.total,
        paymentMethod: order.payment_method,
        walletUsed: 0,
        timestamp: order.order_date,
      });
    }).catch(() => navigate('/menu'));
  }, [orderId, navigate]);

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className={`text-center ${isKioskMode ? 'p-12' : 'p-8'}`}>
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className={`font-bold text-green-600 mb-2 ${isKioskMode ? 'text-4xl' : 'text-3xl'}`}>
              Order Confirmed!
            </h1>
            <p className={`text-gray-600 mb-8 ${isKioskMode ? 'text-xl' : 'text-lg'}`}>
              Thank you for your order. Your food is being prepared.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className={`text-gray-600 ${isKioskMode ? 'text-lg' : ''}`}>
                    Order Number
                  </span>
                  <span className={`font-bold ${isKioskMode ? 'text-xl' : 'text-lg'}`}>
                    {orderDetails.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-gray-600 ${isKioskMode ? 'text-lg' : ''}`}>Total Paid</span>
                  <span className={`font-bold text-[#074af2] ${isKioskMode ? 'text-xl' : 'text-lg'}`}>
                    ${orderDetails.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-gray-600 ${isKioskMode ? 'text-lg' : ''}`}>
                    Payment Method
                  </span>
                  <span className={`capitalize ${isKioskMode ? 'text-lg' : ''}`}>
                    {orderDetails.paymentMethod === 'cash' ? 'Cash on Pickup' : orderDetails.paymentMethod}
                  </span>
                </div>
                {orderDetails.walletUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span className={isKioskMode ? 'text-lg' : ''}>Wallet Used</span>
                    <span className={isKioskMode ? 'text-lg' : ''}>
                      ${orderDetails.walletUsed.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={`text-gray-600 ${isKioskMode ? 'text-lg' : ''}`}>
                    Order Time
                  </span>
                  <span className={isKioskMode ? 'text-lg' : ''}>
                    {new Date(orderDetails.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className={`font-bold mb-3 ${isKioskMode ? 'text-xl' : ''}`}>Order Items</h3>
                <div className="space-y-2">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className={`text-gray-600 ${isKioskMode ? 'text-base' : ''}`}>
                        {item.quantity}x {item.name}
                      </span>
                      <span className={isKioskMode ? 'text-base' : ''}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className={`mb-8 ${isKioskMode ? 'text-lg' : ''}`}>
              {orderDetails.paymentMethod === 'cash' ? (
                <p className="text-gray-600">
                  Please pay <strong>${orderDetails.total.toFixed(2)}</strong> when you pick up
                  your order.
                </p>
              ) : (
                <p className="text-green-600 font-medium">Payment completed successfully!</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className={isKioskMode ? 'h-14 text-base' : ''}
                onClick={() => window.print()}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
              <Link to="/menu" className="block">
                <Button
                  variant="outline"
                  className={`w-full ${isKioskMode ? 'h-14 text-base' : ''}`}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Order Again
                </Button>
              </Link>
              <Link to="/" className="block">
                <Button className={`w-full ${isKioskMode ? 'h-14 text-base' : ''}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Pickup Instructions */}
            <div className={`mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg ${isKioskMode ? 'text-lg' : 'text-sm'}`}>
              <p className="text-blue-800">
                <strong>Pickup Location:</strong> Marryshow Mealhouse, TAMCC Campus
              </p>
              <p className="text-blue-800 mt-1">
                Please show your order number when collecting your food.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}