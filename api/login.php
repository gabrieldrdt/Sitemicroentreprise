<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Gestion du preflight CORS (OBLIGATOIRE)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// Lecture JSON
$data = json_decode(file_get_contents("php://input"), true);

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

// Auth admin simple (portfolio)
if (
  $email === "gabrieldurand707@gmail.com" &&
  in_array($password, ["admin", "admin123", "Admin123"], true)
) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "Identifiants incorrects"
  ]);
}
