<?php
class OrderItem {
    private $conn;
    private $table = 'order_items';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByOrderId($orderId) {
        $query = "SELECT oi.*, mi.name FROM {$this->table} oi 
                  JOIN menu_items mi ON oi.menu_item_id = mi.id 
                  WHERE oi.order_id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':order_id', $orderId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createBatch($orderId, $items) {
        $query = "INSERT INTO {$this->table} (order_id, menu_item_id, quantity, price) 
                  VALUES (:order_id, :menu_item_id, :quantity, :price)";
        $stmt = $this->conn->prepare($query);
        foreach ($items as $item) {
            $stmt->bindParam(':order_id', $orderId);
            $stmt->bindParam(':menu_item_id', $item['id']);
            $stmt->bindParam(':quantity', $item['quantity']);
            $stmt->bindParam(':price', $item['price']);
            $stmt->execute();
        }
        return true;
    }
}
?>