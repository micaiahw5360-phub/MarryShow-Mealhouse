<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/Notification.php';

class NotificationsController {
    private $notificationModel;

    public function __construct() {
        $database = new Database();
        $conn = $database->getConnection();
        $this->notificationModel = new Notification($conn);
    }

    private function getUserId() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        return Security::verifyToken($token);
    }

    public function get() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $notifications = $this->notificationModel->getByUserId($userId);
        Response::send(200, $notifications);
    }

    public function markAsRead($id) {
        if (!$id) Response::send(400, ['error' => 'Notification ID required']);
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $this->notificationModel->markAsRead($id, $userId);
        Response::send(200, ['message' => 'Marked as read']);
    }

    public function delete($id) {
        if (!$id) Response::send(400, ['error' => 'Notification ID required']);
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $this->notificationModel->delete($id, $userId);
        Response::send(200, ['message' => 'Notification deleted']);
    }
}
?>