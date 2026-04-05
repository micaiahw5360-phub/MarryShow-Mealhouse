<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/db.php';
require_once 'utils/Response.php';
require_once 'utils/Security.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/ItemsController.php';
require_once 'controllers/OrdersController.php';
require_once 'controllers/WalletController.php';

$requestUri = str_replace('/api', '', $_SERVER['REQUEST_URI']);
$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = explode('/', trim($requestUri, '/'));

$controller = null;
$id = null;

if (isset($path[0]) && !empty($path[0])) {
    switch ($path[0]) {
        case 'login':
            $controller = new AuthController();
            break;
        case 'items':
            $controller = new ItemsController();
            break;
        case 'orders':
            $controller = new OrdersController();
            break;
        case 'wallet':
            $controller = new WalletController();
            break;
        default:
            Response::send(404, ['error' => 'Endpoint not found']);
            exit();
    }
    if (isset($path[1]) && is_numeric($path[1])) {
        $id = (int)$path[1];
    }
} else {
    Response::send(200, ['message' => 'API is running']);
    exit();
}

// Route to appropriate method
if ($controller) {
    switch ($requestMethod) {
        case 'GET':
            $controller->get($id);
            break;
        case 'POST':
            $controller->post();
            break;
        case 'PUT':
            $controller->put($id);
            break;
        case 'DELETE':
            $controller->delete($id);
            break;
        default:
            Response::send(405, ['error' => 'Method not allowed']);
    }
}