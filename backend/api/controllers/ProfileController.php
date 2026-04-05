<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/User.php';

class ProfileController {
    private $userModel;

    public function __construct() {
        $database = new Database();
        $conn = $database->getConnection();
        $this->userModel = new User($conn);
    }

    private function getUserId() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        return Security::verifyToken($token);
    }

    public function put() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $input = Security::getJsonInput();
        if (!$input) Response::send(400, ['error' => 'No data provided']);

        $allowed = ['username', 'email', 'phone', 'address', 'student_id'];
        $updateData = array_intersect_key($input, array_flip($allowed));
        if (empty($updateData)) {
            Response::send(400, ['error' => 'No valid fields to update']);
        }
        $this->userModel->update($userId, $updateData);
        Response::send(200, ['message' => 'Profile updated']);
    }

    public function changePassword() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $input = Security::getJsonInput();
        if (!$input || !isset($input['old_password']) || !isset($input['new_password'])) {
            Response::send(400, ['error' => 'Old and new password required']);
        }
        $old = $input['old_password'];
        $new = $input['new_password'];
        $user = $this->userModel->findById($userId);
        if (!$user || !password_verify($old, $user['password'])) {
            Response::send(400, ['error' => 'Incorrect current password']);
        }
        $hashed = password_hash($new, PASSWORD_DEFAULT);
        $this->userModel->updatePassword($userId, $hashed);
        Response::send(200, ['message' => 'Password changed']);
    }
}
?>