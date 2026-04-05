<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/OrderItem.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Transaction.php';
require_once __DIR__ . '/../models/Notification.php';

class OrdersController {
    private $orderModel;
    private $orderItemModel;
    private $userModel;
    private $transactionModel;
    private $notificationModel;
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->orderModel = new Order($this->conn);
        $this->orderItemModel = new OrderItem($this->conn);
        $this->userModel = new User($this->conn);
        $this->transactionModel = new Transaction($this->conn);
        $this->notificationModel = new Notification($this->conn);
    }

    private function getUserId() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        return Security::verifyToken($token);
    }

    public function getUserOrders() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $orders = $this->orderModel->findByUserId($userId);
        Response::send(200, $orders);
    }

    public function get($id = null) {
        if (!$id) Response::send(400, ['error' => 'Order ID required']);
        $order = $this->orderModel->findById($id);
        if (!$order) Response::send(404, ['error' => 'Order not found']);
        $order['items'] = $this->orderItemModel->findByOrderId($id);
        Response::send(200, $order);
    }

    public function post() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);

        $input = Security::getJsonInput();
        if (!$input || !isset($input['items']) || !isset($input['total'])) {
            Response::send(400, ['error' => 'Invalid order data']);
        }

        $items = $input['items'];
        $total = (float)$input['total'];
        $paymentMethod = isset($input['paymentMethod']) ? $input['paymentMethod'] : 'wallet';
        $pickupTime = isset($input['pickupTime']) ? $input['pickupTime'] : null;

        $this->conn->beginTransaction();
        try {
            // Create order
            $orderId = $this->orderModel->create([
                'user_id' => $userId,
                'total' => $total,
                'status' => 'completed',
                'payment_method' => $paymentMethod,
                'payment_status' => 'paid',
                'source' => 'web',
                'pickup_time' => $pickupTime
            ]);

            if (!$orderId) throw new Exception('Failed to create order');

            // Add order items
            $this->orderItemModel->createBatch($orderId, $items);

            // Handle wallet deduction (if applicable)
            if ($paymentMethod === 'wallet') {
                $balance = $this->userModel->getBalance($userId);
                if ($balance < $total) {
                    throw new Exception('Insufficient funds');
                }
                $newBalance = $balance - $total;
                $this->userModel->updateBalance($userId, $newBalance);

                // Record transaction
                $this->transactionModel->create([
                    'user_id' => $userId,
                    'order_id' => $orderId,
                    'amount' => $total,
                    'type' => 'payment',
                    'description' => "Order #$orderId"
                ]);
            }

            // Add notification
            $this->notificationModel->create([
                'user_id' => $userId,
                'type' => 'order',
                'title' => 'Order Received',
                'message' => "Your order #$orderId has been received and is being prepared.",
                'action_url' => '/orders'
            ]);

            $this->conn->commit();
            Response::send(200, ['orderId' => $orderId]);
        } catch (Exception $e) {
            $this->conn->rollBack();
            Response::send(500, ['error' => 'Order failed: ' . $e->getMessage()]);
        }
    }

    public function put($id = null) {}
    public function delete($id = null) {}
}
?>