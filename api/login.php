<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || empty($data["email"]) || empty($data["password"])) {
  echo json_encode(["success" => false, "message" => "Email ou mot de passe manquant"]);
  exit;
}

$email = trim(strtolower($data["email"]));
$password = (string)$data["password"];

try {
  $db = new PDO("sqlite:../db/database.sqlite");
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $stmt = $db->prepare("SELECT email, password FROM admins WHERE lower(email) = :email LIMIT 1");
  $stmt->execute([":email" => $email]);
  $admin = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$admin) {
    echo json_encode(["success" => false, "message" => "Email incorrect"]);
    exit;
  }

  $stored = (string)$admin["password"];

  // Compat: certains dumps stockent un md5 en clair (comme dans init.sql)
  $ok = hash_equals($stored, $password) || hash_equals($stored, md5($password));

  if (!$ok) {
    echo json_encode(["success" => false, "message" => "Mot de passe incorrect"]);
    exit;
  }

  echo json_encode(["success" => true, "message" => "Connexion réussie"]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Erreur serveur"]);
}
?>