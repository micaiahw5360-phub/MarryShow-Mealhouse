<?php
class Favorite {
    private $conn;
    private $table = 'user_favorites';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByUserId($userId) {
        $query = "SELECT menu_item_id FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function add($userId, $menuItemId) {
        $query = "INSERT IGNORE INTO {$this->table} (user_id, menu_item_id) VALUES (:user_id, :menu_item_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':menu_item_id', $menuItemId);
        return $stmt->execute();
    }

    public function remove($userId, $menuItemId) {
        $query = "DELETE FROM {$this->table} WHERE user_id = :user_id AND menu_item_id = :menu_item_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':menu_item_id', $menuItemId);
        return $stmt->execute();
    }
}
?>