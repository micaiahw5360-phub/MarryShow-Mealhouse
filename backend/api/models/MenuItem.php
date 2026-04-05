<?php
class MenuItem {
    private $conn;
    private $table = 'menu_items';

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

    public function findAll($category = null) {
        if ($category && in_array($category, ['Breakfast','A La Carte','Combo','Beverage','Dessert'])) {
            $query = "SELECT * FROM {$this->table} WHERE category = :category AND is_available = 1 ORDER BY sort_order";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':category', $category);
        } else {
            $query = "SELECT * FROM {$this->table} WHERE is_available = 1 ORDER BY sort_order";
            $stmt = $this->conn->prepare($query);
        }
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllCategories() {
        $query = "SELECT DISTINCT category FROM {$this->table} ORDER BY FIELD(category, 'Breakfast','A La Carte','Combo','Beverage','Dessert')";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} (name, category, price, image, description, sort_order, is_available) 
                  VALUES (:name, :category, :price, :image, :description, :sort_order, :is_available)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':image', $data['image']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':sort_order', $data['sort_order']);
        $stmt->bindParam(':is_available', $data['is_available']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = "UPDATE {$this->table} SET name = :name, category = :category, price = :price, 
                  image = :image, description = :description, sort_order = :sort_order, is_available = :is_available 
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':category', $data['category']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':image', $data['image']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':sort_order', $data['sort_order']);
        $stmt->bindParam(':is_available', $data['is_available']);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
}
?>