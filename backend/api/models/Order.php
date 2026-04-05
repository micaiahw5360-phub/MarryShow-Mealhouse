<?php
class Order {
    private $conn;
    private $table = 'orders';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findById($id) {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByUserId($userId) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id ORDER BY order_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} (user_id, total, status, payment_method, payment_status, source, pickup_time) 
                  VALUES (:user_id, :total, :status, :payment_method, :payment_status, :source, :pickup_time)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $data['user_id']);
        $stmt->bindParam(':total', $data['total']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':payment_method', $data['payment_method']);
        $stmt->bindParam(':payment_status', $data['payment_status']);
        $stmt->bindParam(':source', $data['source']);
        $stmt->bindParam(':pickup_time', $data['pickup_time']);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function updateStatus($id, $status) {
        $query = "UPDATE {$this->table} SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>