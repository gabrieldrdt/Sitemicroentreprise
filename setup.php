<?php
// setup.php - À SUPPRIMER après utilisation
$db = new PDO('sqlite:db/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = file_get_contents('db/init.sql');
$db->exec($sql);

echo "Base de données initialisée avec succès !";
?>
