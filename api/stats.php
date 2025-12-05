<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$db = new PDO("sqlite:../db/database.sqlite");
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $db->query("SELECT visitors, views, forms FROM stats WHERE id = 1");
$row = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "stats" => $row
]);
?>
