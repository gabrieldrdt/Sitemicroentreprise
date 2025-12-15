<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

if (
  $email === "gabrieldurand707@gmail.com" &&
  in_array($password, ["admin", "admin123", "Admin123"], true)
) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
}
