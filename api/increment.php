<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!isset($_GET["type"])) {
  echo json_encode(["success" => false, "message" => "Type manquant"]);
  exit;
}

$type = $_GET["type"];
$allowed = ["visitors", "views", "forms"];

if (!in_array($type, $allowed)) {
  echo json_encode(["success" => false, "message" => "Type invalide"]);
  exit;
}

try {
  $db = new PDO("sqlite:../db/database.sqlite");
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $db->exec("UPDATE stats SET $type = $type + 1 WHERE id = 1");
  echo json_encode(["success" => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}