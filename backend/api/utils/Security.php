<?php
class Security {
    public static function sanitizeInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    public static function getJsonInput() {
        $json = file_get_contents('php://input');
        return json_decode($json, true);
    }
}