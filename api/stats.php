<?php
header("Content-Type: application/json");

$db = new PDO("sqlite:../db/database.sqlite");

$stmt = $db->query("SELECT * FROM stats WHERE id = 1");
echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
?>
