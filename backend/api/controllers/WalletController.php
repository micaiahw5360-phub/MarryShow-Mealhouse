<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Transaction.php';

class WalletController {
    private $userModel;
    private $transactionModel;
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        $this->userModel = new User($this->conn);
        $this->transactionModel = new Transaction($this->conn);
    }

    private function getUserId() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        return Security::verifyToken($token);
    }

    public function get($id = null) {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $balance = $this->userModel->getBalance($userId);
        Response::send(200, ['balance' => (float)$balance]);
    }

    public function topUp() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);

        $input = Security::getJsonInput();
        if (!$input || !isset($input['amount']) || $input['amount'] <= 0) {
            Response::send(400, ['error' => 'Valid amount required']);
        }
        $amount = (float)$input['amount'];

        $this->conn->beginTransaction();
        try {
            $currentBalance = $this->userModel->getBalance($userId);
            $newBalance = $currentBalance + $amount;
            $this->userModel->updateBalance($userId, $newBalance);

            $this->transactionModel->create([
                'user_id' => $userId,
                'order_id' => null,
                'amount' => $amount,
                'type' => 'topup',
                'description' => 'Online top-up'
            ]);

            $this->conn->commit();
            Response::send(200, ['newBalance' => $newBalance]);
        } catch (Exception $e) {
            $this->conn->rollBack();
            Response::send(500, ['error' => 'Top-up failed']);
        }
    }

    public function post() {}
    public function put($id = null) {}
    public function delete($id = null) {}
}
?>