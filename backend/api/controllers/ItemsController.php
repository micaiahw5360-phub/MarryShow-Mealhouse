<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/MenuItem.php';

class ItemsController {
    private $menuItemModel;

    public function __construct() {
        $database = new Database();
        $conn = $database->getConnection();
        $this->menuItemModel = new MenuItem($conn);
    }

    public function get($id = null) {
        if ($id) {
            $item = $this->menuItemModel->findById($id);
            if ($item) {
                Response::send(200, $item);
            } else {
                Response::send(404, ['error' => 'Item not found']);
            }
        } else {
            $category = isset($_GET['category']) ? $_GET['category'] : null;
            $items = $this->menuItemModel->findAll($category);
            Response::send(200, $items);
        }
    }

    public function getCategories() {
        $categories = $this->menuItemModel->getAllCategories();
        Response::send(200, $categories);
    }

    public function post() {}
    public function put($id = null) {}
    public function delete($id = null) {}
}
?>