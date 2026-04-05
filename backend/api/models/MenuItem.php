<?php
class MenuItem {
    private $conn;
    private $table = 'menu_items';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Public methods (used by ItemsController)
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

    // Admin methods
    public function findAllAdmin() {
        $query = "SELECT * FROM {$this->table} ORDER BY id";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
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
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update($id, $data) {
        $fields = [];
        $params = [':id' => $id];
        $allowed = ['name', 'category', 'price', 'image', 'description', 'sort_order', 'is_available'];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }
        if (empty($fields)) return false;
        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }
        return $stmt->execute();
    }

    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function countActive() {
        $query = "SELECT COUNT(*) FROM {$this->table} WHERE is_available = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return (int)$stmt->fetchColumn();
    }

    // Options management
    public function getOptions($itemId) {
        $query = "SELECT * FROM menu_item_options WHERE menu_item_id = :item_id ORDER BY sort_order";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':item_id', $itemId);
        $stmt->execute();
        $options = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($options as &$opt) {
            $valQuery = "SELECT * FROM menu_item_option_values WHERE option_id = :opt_id ORDER BY sort_order";
            $valStmt = $this->conn->prepare($valQuery);
            $valStmt->bindParam(':opt_id', $opt['id']);
            $valStmt->execute();
            $opt['values'] = $valStmt->fetchAll(PDO::FETCH_ASSOC);
        }
        return $options;
    }

    public function addOption($itemId, $name) {
        $query = "INSERT INTO menu_item_options (menu_item_id, option_name) VALUES (:item_id, :name)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':item_id', $itemId);
        $stmt->bindParam(':name', $name);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function addOptionValue($optionId, $valueName, $priceModifier) {
        $query = "INSERT INTO menu_item_option_values (option_id, value_name, price_modifier) VALUES (:opt_id, :name, :modifier)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':opt_id', $optionId);
        $stmt->bindParam(':name', $valueName);
        $stmt->bindParam(':modifier', $priceModifier);
        return $stmt->execute();
    }

    public function updateOption($optionId, $name) {
        $query = "UPDATE menu_item_options SET option_name = :name WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':id', $optionId);
        return $stmt->execute();
    }

    public function deleteOptionValues($optionId) {
        $query = "DELETE FROM menu_item_option_values WHERE option_id = :opt_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':opt_id', $optionId);
        return $stmt->execute();
    }

    public function deleteOption($optionId) {
        $this->deleteOptionValues($optionId);
        $query = "DELETE FROM menu_item_options WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $optionId);
        return $stmt->execute();
    }
}
?>