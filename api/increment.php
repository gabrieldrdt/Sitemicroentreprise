<?php
header("Content-Type: application/json");

$db = new PDO("sqlite:../db/database.sqlite");

// augmente pages vues
$db->exec("UPDATE stats SET views = views + 1 WHERE id = 1");

// vérifie si nouveau visiteur (simple cookie)
if (!isset($_COOKIE["visited"])) {
    $db->exec("UPDATE stats SET visitors = visitors + 1 WHERE id = 1");
    setcookie("visited", "1", time() + 3600 * 24 * 30);
}

echo json_encode(["success" => true]);
?>
