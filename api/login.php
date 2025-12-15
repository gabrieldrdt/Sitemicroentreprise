<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (
  ($data["email"] ?? "") === "gabrieldurand707@gmail.com" &&
  in_array($data["password"] ?? "", ["admin", "admin123", "Admin123"])
) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "Identifiants incorrects"]);
}
