<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
require_once __DIR__ . '/controllers/AdminController.php';

$requestUri = $_SERVER['REQUEST_URI'];
$apiPos = strpos($requestUri, '/api');
if ($apiPos !== false) {
    $endpoint = substr($requestUri, $apiPos + 4);
} else {
    $endpoint = $requestUri;
}
$endpoint = trim($endpoint, '/');
$path = explode('/', $endpoint);
$requestMethod = $_SERVER['REQUEST_METHOD'];

if (empty($path[0])) {
    Response::send(200, ['message' => 'API is running']);
}

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
    case 'admin':
        $adminController = new AdminController();
        if ($requestMethod === 'GET') {
            if (!isset($path[1])) {
                Response::send(400, ['error' => 'Missing admin endpoint']);
            }
            switch ($path[1]) {
                case 'stats':
                    $adminController->getStats();
                    break;
                case 'sales-weekly':
                    $adminController->getWeeklySales();
                    break;
                case 'popular-items':
                    $adminController->getPopularItems();
                    break;
                case 'recent-orders':
                    $adminController->getRecentOrders();
                    break;
                case 'orders':
                    $adminController->getAllOrders();
                    break;
                case 'users':
                    $adminController->getAllUsers();
                    break;
                case 'items':
                    $adminController->getAllItems();
                    break;
                case 'items/options':
                    if (isset($path[2]) && is_numeric($path[2])) {
                        $adminController->getOptions((int)$path[2]);
                    } else {
                        Response::send(400, ['error' => 'Item ID required']);
                    }
                    break;
                default:
                    Response::send(404, ['error' => 'Admin endpoint not found']);
            }
        } elseif ($requestMethod === 'POST') {
            if ($path[1] === 'items') {
                $adminController->createItem();
            } elseif ($path[1] === 'items' && isset($path[2]) && $path[2] === 'options' && isset($path[3]) && is_numeric($path[3])) {
                $adminController->addOption((int)$path[3]);
            } else {
                Response::send(404, ['error' => 'Admin POST endpoint not found']);
            }
        } elseif ($requestMethod === 'PUT') {
            if ($path[1] === 'orders' && isset($path[3]) && $path[3] === 'status') {
                $adminController->updateOrderStatus($path[2]);
            } elseif ($path[1] === 'users' && isset($path[3]) && $path[3] === 'toggle-active') {
                $adminController->toggleUserActive($path[2]);
            } elseif ($path[1] === 'items' && isset($path[2]) && is_numeric($path[2])) {
                $adminController->updateItem((int)$path[2]);
            } elseif ($path[1] === 'options' && isset($path[2]) && is_numeric($path[2])) {
                $adminController->updateOption((int)$path[2]);
            } else {
                Response::send(404, ['error' => 'Admin PUT endpoint not found']);
            }
        } elseif ($requestMethod === 'DELETE') {
            if ($path[1] === 'items' && isset($path[2]) && is_numeric($path[2])) {
                $adminController->deleteItem((int)$path[2]);
            } elseif ($path[1] === 'options' && isset($path[2]) && is_numeric($path[2])) {
                $adminController->deleteOption((int)$path[2]);
            } else {
                Response::send(404, ['error' => 'Admin DELETE endpoint not found']);
            }
        } else {
            Response::send(405, ['error' => 'Method not allowed']);
        }
        break;
    default:
        Response::send(404, ['error' => 'Endpoint not found']);
}
?>