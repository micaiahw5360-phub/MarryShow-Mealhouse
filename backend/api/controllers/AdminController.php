<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/MenuItem.php';

class AdminController {
    private $conn;
    private $orderModel;
    private $userModel;
    private $menuItemModel;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->orderModel = new Order($this->conn);
        $this->userModel = new User($this->conn);
        $this->menuItemModel = new MenuItem($this->conn);
    }

    private function getUserId() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        return Security::verifyToken($token);
    }

    private function isAdmin() {
        $userId = $this->getUserId();
        if (!$userId) return false;
        $user = $this->userModel->findById($userId);
        return $user && $user['role'] === 'admin';
    }

    // Dashboard stats
    public function getStats() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $totalOrders = $this->orderModel->countAll();
        $pendingOrders = $this->orderModel->countByStatus('pending');
        $totalUsers = $this->userModel->countAll();
        $activeMenuItems = $this->menuItemModel->countActive();
        Response::send(200, [
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'totalUsers' => $totalUsers,
            'activeMenuItems' => $activeMenuItems
        ]);
    }

    public function getWeeklySales() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $query = "SELECT DAYNAME(order_date) as day, SUM(total) as sales 
                  FROM orders 
                  WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                  GROUP BY DAYOFWEEK(order_date)
                  ORDER BY DAYOFWEEK(order_date)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $salesMap = [];
        foreach ($results as $row) {
            $dayName = substr($row['day'], 0, 3);
            $salesMap[$dayName] = (float)$row['sales'];
        }
        $weekly = [];
        foreach ($days as $day) {
            $weekly[] = ['day' => $day, 'sales' => $salesMap[$day] ?? 0];
        }
        Response::send(200, $weekly);
    }

    public function getPopularItems() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $query = "SELECT mi.name, SUM(oi.quantity) as orders 
                  FROM order_items oi
                  JOIN menu_items mi ON oi.menu_item_id = mi.id
                  GROUP BY oi.menu_item_id
                  ORDER BY orders DESC
                  LIMIT 5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::send(200, $items);
    }

    public function getRecentOrders() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $query = "SELECT o.id, u.username as customer, o.order_date as date, o.total, o.status 
                  FROM orders o
                  LEFT JOIN users u ON o.user_id = u.id
                  ORDER BY o.order_date DESC
                  LIMIT 5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::send(200, $orders);
    }

    public function getAllOrders() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $query = "SELECT o.id, u.username as customer, u.email, o.order_date as date, 
                         COUNT(oi.id) as items, o.total, o.status
                  FROM orders o
                  LEFT JOIN users u ON o.user_id = u.id
                  LEFT JOIN order_items oi ON oi.order_id = o.id
                  GROUP BY o.id
                  ORDER BY o.order_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::send(200, $orders);
    }

    public function updateOrderStatus($orderId) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $input = Security::getJsonInput();
        if (!$input || !isset($input['status'])) {
            Response::send(400, ['error' => 'Status required']);
        }
        $status = $input['status'];
        $allowed = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
        if (!in_array($status, $allowed)) {
            Response::send(400, ['error' => 'Invalid status']);
        }
        $result = $this->orderModel->updateStatus($orderId, $status);
        if ($result) {
            Response::send(200, ['message' => 'Order status updated']);
        } else {
            Response::send(500, ['error' => 'Update failed']);
        }
    }

    public function getAllUsers() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $query = "SELECT id, username, email, role, balance as walletBalance, is_active as active 
                  FROM users ORDER BY id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::send(200, $users);
    }

    public function toggleUserActive($userId) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $query = "UPDATE users SET is_active = NOT is_active WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $userId);
        if ($stmt->execute()) {
            Response::send(200, ['message' => 'User toggled']);
        } else {
            Response::send(500, ['error' => 'Failed to toggle']);
        }
    }

    // Menu management (admin)
    public function getAllItems() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $items = $this->menuItemModel->findAllAdmin();
        Response::send(200, $items);
    }

    public function createItem() {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $input = Security::getJsonInput();
        if (!$input || !isset($input['name']) || !isset($input['category']) || !isset($input['price'])) {
            Response::send(400, ['error' => 'Name, category and price required']);
        }
        $data = [
            'name' => Security::sanitizeInput($input['name']),
            'category' => Security::sanitizeInput($input['category']),
            'price' => (float)$input['price'],
            'image' => isset($input['image']) ? Security::sanitizeInput($input['image']) : null,
            'description' => isset($input['description']) ? Security::sanitizeInput($input['description']) : '',
            'sort_order' => 0,
            'is_available' => true
        ];
        $result = $this->menuItemModel->create($data);
        if ($result) {
            Response::send(201, ['id' => $this->conn->lastInsertId()]);
        } else {
            Response::send(500, ['error' => 'Failed to create item']);
        }
    }

    public function updateItem($id) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $input = Security::getJsonInput();
        if (!$input) {
            Response::send(400, ['error' => 'No data provided']);
        }
        $allowed = ['name', 'category', 'price', 'image', 'description', 'sort_order', 'is_available'];
        $updateData = array_intersect_key($input, array_flip($allowed));
        if (isset($updateData['price'])) $updateData['price'] = (float)$updateData['price'];
        if (isset($updateData['is_available'])) $updateData['is_available'] = (bool)$updateData['is_available'];
        if (isset($updateData['sort_order'])) $updateData['sort_order'] = (int)$updateData['sort_order'];
        $result = $this->menuItemModel->update($id, $updateData);
        if ($result) {
            Response::send(200, ['message' => 'Item updated']);
        } else {
            Response::send(500, ['error' => 'Update failed']);
        }
    }

    public function deleteItem($id) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $result = $this->menuItemModel->delete($id);
        if ($result) {
            Response::send(200, ['message' => 'Item deleted']);
        } else {
            Response::send(500, ['error' => 'Delete failed']);
        }
    }

    // Options management
    public function getOptions($itemId) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $options = $this->menuItemModel->getOptions($itemId);
        Response::send(200, $options);
    }

    public function addOption($itemId) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $input = Security::getJsonInput();
        if (!$input || !isset($input['name']) || !isset($input['values'])) {
            Response::send(400, ['error' => 'Option name and values required']);
        }
        $name = Security::sanitizeInput($input['name']);
        $values = $input['values']; // array of {name, priceModifier}
        $optionId = $this->menuItemModel->addOption($itemId, $name);
        if ($optionId) {
            foreach ($values as $val) {
                $valName = Security::sanitizeInput($val['name']);
                $modifier = isset($val['priceModifier']) ? (float)$val['priceModifier'] : 0;
                $this->menuItemModel->addOptionValue($optionId, $valName, $modifier);
            }
            Response::send(201, ['id' => $optionId]);
        } else {
            Response::send(500, ['error' => 'Failed to add option']);
        }
    }

    public function updateOption($optionId) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $input = Security::getJsonInput();
        if (!$input) {
            Response::send(400, ['error' => 'No data provided']);
        }
        if (isset($input['name'])) {
            $name = Security::sanitizeInput($input['name']);
            $this->menuItemModel->updateOption($optionId, $name);
        }
        if (isset($input['values'])) {
            // Delete existing values and re-add
            $this->menuItemModel->deleteOptionValues($optionId);
            foreach ($input['values'] as $val) {
                $valName = Security::sanitizeInput($val['name']);
                $modifier = isset($val['priceModifier']) ? (float)$val['priceModifier'] : 0;
                $this->menuItemModel->addOptionValue($optionId, $valName, $modifier);
            }
        }
        Response::send(200, ['message' => 'Option updated']);
    }

    public function deleteOption($optionId) {
        if (!$this->isAdmin()) Response::send(403, ['error' => 'Forbidden']);
        $this->menuItemModel->deleteOption($optionId);
        Response::send(200, ['message' => 'Option deleted']);
    }
}
?>