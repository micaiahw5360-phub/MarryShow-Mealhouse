<?php
class Security {
    public static function sanitizeInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }

    public static function getJsonInput() {
        $json = file_get_contents('php://input');
        return json_decode($json, true);
    }

    public static function generateToken($userId) {
        $payload = $userId . '|' . time() . '|' . bin2hex(random_bytes(16));
        return base64_encode($payload);
    }

    public static function verifyToken($token) {
        $decoded = base64_decode($token);
        if (!$decoded) return null;
        $parts = explode('|', $decoded);
        if (count($parts) !== 3) return null;
        if ($parts[1] < time() - 86400) return null;
        return (int)$parts[0];
    }
}
?>