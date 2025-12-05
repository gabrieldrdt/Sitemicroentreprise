<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://gabrieldrdt.github.io');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$DB_FILE = __DIR__ . '/../db/database.sqlite';

// Admin "de secours"
$FALLBACK_EMAIL = 'gabrieldurand707@gmail.com';
$FALLBACK_PASS  = 'admin';            // mot de passe en clair
$FALLBACK_HASH  = md5($FALLBACK_PASS);

try {
    if (!file_exists($DB_FILE)) {
        throw new Exception('Fichier DB introuvable');
    }

    $pdo = new PDO('sqlite:' . $DB_FILE);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur base de données'
    ]);
    exit;
}

// Récupération JSON
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Email ou mot de passe manquant'
    ]);
    exit;
}

// Recherche de l’admin dans la DB
$stmt = $pdo->prepare('SELECT * FROM admins WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

// Si aucun admin trouvé, on tente de créer / synchroniser l’admin de secours
if (!$admin && $email === $FALLBACK_EMAIL) {
    $insert = $pdo->prepare('INSERT OR IGNORE INTO admins (email, password) VALUES (:email, :password)');
    $insert->execute([
        ':email'    => $FALLBACK_EMAIL,
        ':password' => $FALLBACK_HASH
    ]);

    $stmt->execute([':email' => $FALLBACK_EMAIL]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
}

// Toujours rien → mauvais email
if (!$admin) {
    echo json_encode([
        'success' => false,
        'message' => 'Email incorrect'
    ]);
    exit;
}

// Vérif mot de passe (md5)
$inputHash = md5($password);

if ($admin['password'] !== $inputHash) {
    echo json_encode([
        'success' => false,
        'message' => 'Mot de passe incorrect'
    ]);
    exit;
}

// OK ✅
echo json_encode([
    'success' => true,
    'message' => 'Connexion réussie'
]);
