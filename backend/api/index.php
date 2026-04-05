<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Use __DIR__ to always include from the correct folder
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/utils/Response.php';
require_once __DIR__ . '/utils/Security.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/RegisterController.php';
require_once __DIR__ . '/controllers/ItemsController.php';
require_once __DIR__ . '/controllers/OrdersController.php';
require_once __DIR__ . '/controllers/WalletController.php';
require_once __DIR__ . '/controllers/FavoritesController.php';
require_once __DIR__ . '/controllers/NotificationsController.php';
require_once __DIR__ . '/controllers/ProfileController.php';

// Extract the API endpoint by removing everything before and including '/api'
$requestUri = $_SERVER['REQUEST_URI'];
$apiPos = strpos($requestUri, '/api');
if ($apiPos !== false) {
    $endpoint = substr($requestUri, $apiPos + 4); // +4 to skip '/api'
} else {
    $endpoint = $requestUri;
}
$endpoint = trim($endpoint, '/');
$path = explode('/', $endpoint);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// If no endpoint (empty path), return API running message
if (empty($path[0])) {
    Response::send(200, ['message' => 'API is running']);
}

// Route to appropriate controller
switch ($path[0]) {
    case 'login':
        $controller = new AuthController();
        $controller->post();
        break;
    case 'register':
        $controller = new RegisterController();
        $controller->post();
        break;
    case 'items':
        $controller = new ItemsController();
        if (isset($path[1]) && is_numeric($path[1])) {
            $controller->get((int)$path[1]);
        } else {
            $controller->get();
        }
        break;
    case 'categories':
        $itemsController = new ItemsController();
        $itemsController->getCategories();
        break;
    case 'orders':
        $controller = new OrdersController();
        if ($requestMethod === 'GET') {
            if (isset($path[1]) && is_numeric($path[1])) {
                $controller->get((int)$path[1]);
            } else {
                $controller->getUserOrders();
            }
        } elseif ($requestMethod === 'POST') {
            $controller->post();
        } else {
            Response::send(405, ['error' => 'Method not allowed']);
        }
        break;
    case 'wallet':
        $controller = new WalletController();
        if ($requestMethod === 'GET') {
            $controller->get();
        } elseif ($requestMethod === 'POST' && isset($path[1]) && $path[1] === 'topup') {
            $controller->topUp();
        } else {
            Response::send(405, ['error' => 'Method not allowed']);
        }
        break;
    case 'favorites':
        $controller = new FavoritesController();
        if ($requestMethod === 'GET') {
            $controller->get();
        } elseif ($requestMethod === 'POST') {
            $controller->post();
        } elseif ($requestMethod === 'DELETE' && isset($path[1])) {
            $controller->delete((int)$path[1]);
        } else {
            Response::send(405, ['error' => 'Method not allowed']);
        }
        break;
    case 'notifications':
        $controller = new NotificationsController();
        if ($requestMethod === 'GET') {
            $controller->get();
        } elseif ($requestMethod === 'POST' && isset($path[2]) && $path[2] === 'read') {
            $controller->markAsRead((int)$path[1]);
        } elseif ($requestMethod === 'DELETE' && isset($path[1])) {
            $controller->delete((int)$path[1]);
        } else {
            Response::send(405, ['error' => 'Method not allowed']);
        }
        break;
    case 'profile':
        $controller = new ProfileController();
        if ($requestMethod === 'PUT') {
            if (isset($path[1]) && $path[1] === 'password') {
                $controller->changePassword();
            } else {
                $controller->put();
            }
        } else {
            Response::send(405, ['error' => 'Method not allowed']);
        }
        break;
    default:
        Response::send(404, ['error' => 'Endpoint not found']);
}
?>