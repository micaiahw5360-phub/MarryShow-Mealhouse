<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $database = new Database();
        $conn = $database->getConnection();
        $this->userModel = new User($conn);
    }

    public function post() {
        $input = Security::getJsonInput();
        if (!$input || !isset($input['email']) || !isset($input['password'])) {
            Response::send(400, ['error' => 'Email and password required']);
        }

        $email = Security::sanitizeInput($input['email']);
        $password = $input['password'];

        $user = $this->userModel->findByEmail($email);
        if (!$user || !password_verify($password, $user['password'])) {
            Response::send(401, ['error' => 'Invalid credentials']);
        }

        unset($user['password']);
        $token = Security::generateToken($user['id']);

        Response::send(200, [
            'user' => $user,
            'token' => $token
        ]);
    }

    public function get($id = null) {}
    public function put($id = null) {}
    public function delete($id = null) {}
}
?>