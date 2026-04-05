<?php
class User {
    private $conn;
    private $table = 'users';

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

    public function findByEmail($email) {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findByUsername($username) {
        $query = "SELECT * FROM {$this->table} WHERE username = :username";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        $query = "INSERT INTO {$this->table} (username, email, password, role, balance) 
                  VALUES (:username, :email, :password, :role, :balance)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $data['username']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':password', $data['password']);
        $stmt->bindParam(':role', $data['role']);
        $stmt->bindParam(':balance', $data['balance']);
        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        return false;
    }

    public function update($id, $data) {
        $allowed = ['username', 'email', 'phone', 'address', 'student_id'];
        $updates = [];
        $params = [':id' => $id];
        foreach ($allowed as $field) {
            if (isset($data[$field])) {
                $updates[] = "$field = :$field";
                $params[":$field"] = $data[$field];
            }
        }
        if (empty($updates)) return false;
        $query = "UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }
        return $stmt->execute();
    }

    public function updatePassword($id, $hashedPassword) {
        $query = "UPDATE {$this->table} SET password = :pass WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':pass', $hashedPassword);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function updateBalance($id, $newBalance) {
        $query = "UPDATE {$this->table} SET balance = :balance WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':balance', $newBalance);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function getBalance($id) {
        $query = "SELECT balance FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchColumn();
    }
}
?>