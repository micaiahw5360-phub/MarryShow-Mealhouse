<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Security.php';
require_once __DIR__ . '/../models/Favorite.php';

class FavoritesController {
    private $favoriteModel;

    public function __construct() {
        $database = new Database();
        $conn = $database->getConnection();
        $this->favoriteModel = new Favorite($conn);
    }

    private function getUserId() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        return Security::verifyToken($token);
    }

    public function get() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $favorites = $this->favoriteModel->getByUserId($userId);
        // Return as array of objects with menu_item_id
        $result = array_map(function($id) { return ['menu_item_id' => $id]; }, $favorites);
        Response::send(200, $result);
    }

    public function post() {
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $input = Security::getJsonInput();
        if (!$input || !isset($input['menu_item_id'])) {
            Response::send(400, ['error' => 'menu_item_id required']);
        }
        $menuItemId = (int)$input['menu_item_id'];
        $this->favoriteModel->add($userId, $menuItemId);
        Response::send(201, ['message' => 'Favorite added']);
    }

    public function delete($id = null) {
        if (!$id) Response::send(400, ['error' => 'menu_item_id required']);
        $userId = $this->getUserId();
        if (!$userId) Response::send(401, ['error' => 'Unauthorized']);
        $this->favoriteModel->remove($userId, (int)$id);
        Response::send(200, ['message' => 'Favorite removed']);
    }
}
?>