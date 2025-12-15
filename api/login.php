<?php
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  http_response_code(200);
  exit;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["success" => false, "message" => "POST required"]);
  exit;
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Invalid JSON"]);
  exit;
}

$email = isset($data["email"]) ? strtolower(trim($data["email"])) : "";
$password = isset($data["password"]) ? $data["password"] : "";

if (empty($email) || empty($password)) {
  echo json_encode(["success" => false, "message" => "Email et password requis"]);
  exit;
}

if ($email === "gabrieldurand707@gmail.com" && in_array($password, ["admin", "admin123", "Admin123"], true)) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
}