<?php
// Désactiver l'affichage des erreurs en production
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// Headers CORS - TRÈS IMPORTANT
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");
header("Content-Type: application/json; charset=utf-8");

// Gérer la requête OPTIONS (preflight CORS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

// Vérifier que c'est bien une requête POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode([
    "success" => false, 
    "message" => "Méthode non autorisée. Utilisez POST."
  ]);
  exit;
}

// Récupérer les données JSON
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
  http_response_code(400);
  echo json_encode([
    "success" => false,
    "message" => "Données JSON invalides"
  ]);
  exit;
}

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

// Vérifier les identifiants
if (
  $email === "gabrieldurand707@gmail.com" &&
  in_array($password, ["admin", "admin123", "Admin123"], true)
) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(401);
  echo json_encode([
    "success" => false, 
    "message" => "Identifiants incorrects"
  ]);
}
?>