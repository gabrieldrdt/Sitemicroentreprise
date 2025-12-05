<?php
header("Content-Type: application/json");

$db = new PDO('sqlite:../db/database.sqlite');

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $db->prepare("SELECT * FROM admins WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "message" => "Email incorrect"]);
    exit;
}

if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Mot de passe incorrect"]);
    exit;
}

echo json_encode(["success" => true]);
?>
