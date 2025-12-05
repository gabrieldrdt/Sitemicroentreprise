<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["password"])) {
    echo json_encode(["success" => false, "message" => "Email ou mot de passe manquant"]);
    exit;
}

$email = $data["email"];
$password = $data["password"];

$db = new PDO('sqlite:../db/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $db->prepare("SELECT * FROM admins WHERE email = ?");
$stmt->execute([$email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {
    echo json_encode(["success" => false, "message" => "Email incorrect"]);
    exit;
}

if ($password !== $admin["password"]) {
    echo json_encode(["success" => false, "message" => "Mot de passe incorrect"]);
    exit;
}

echo json_encode([
    "success" => true,
    "message" => "Connexion réussie"
]);
?>
