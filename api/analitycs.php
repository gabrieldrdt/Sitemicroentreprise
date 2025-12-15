<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

// --- Configuration via variables d'environnement (Render / Docker env) ---
$propertyId = getenv("GA4_PROPERTY_ID");         // ex: 123456789
$clientEmail = getenv("GA4_CLIENT_EMAIL");       // service-account@project.iam.gserviceaccount.com
$privateKey = getenv("GA4_PRIVATE_KEY");         // contenu PEM (avec \n) ou vrai multi-line

// Optionnel: restreindre l'accès à l'admin (simple)
// if (!isset($_GET["admin"]) || $_GET["admin"] !== "1") { http_response_code(403); echo json_encode(["success"=>false,"message"=>"Forbidden"]); exit; }

if (!$propertyId || !$clientEmail || !$privateKey) {
  echo json_encode([
    "success" => false,
    "message" => "GA4 non configuré (GA4_PROPERTY_ID / GA4_CLIENT_EMAIL / GA4_PRIVATE_KEY manquants)."
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

// Render peut stocker la clé avec \n littéraux
$privateKey = str_replace("\\n", "\n", $privateKey);

function b64url($data) {
  return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function http_post_json($url, $payload, $headers = []) {
  $opts = [
    "http" => [
      "method"  => "POST",
      "header"  => array_merge(["Content-Type: application/json"], $headers),
      "content" => json_encode($payload),
      "timeout" => 8
    ]
  ];
  $ctx = stream_context_create($opts);
  $res = @file_get_contents($url, false, $ctx);
  return [$res, $http_response_header ?? []];
}

// 1) JWT -> Access token (OAuth2)
$now = time();
$jwtHeader = b64url(json_encode(["alg" => "RS256", "typ" => "JWT"]));
$jwtClaim = b64url(json_encode([
  "iss" => $clientEmail,
  "scope" => "https://www.googleapis.com/auth/analytics.readonly",
  "aud" => "https://oauth2.googleapis.com/token",
  "iat" => $now,
  "exp" => $now + 3600
]));

$jwtToSign = $jwtHeader . "." . $jwtClaim;

$signature = "";
$ok = openssl_sign($jwtToSign, $signature, $privateKey, OPENSSL_ALGO_SHA256);
if (!$ok) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Impossible de signer le JWT (clé privée invalide ?)"]);
  exit;
}
$jwt = $jwtToSign . "." . b64url($signature);

// Token request (x-www-form-urlencoded)
$tokenPayload = http_build_query([
  "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
  "assertion"  => $jwt
]);

$tokenCtx = stream_context_create([
  "http" => [
    "method" => "POST",
    "header" => "Content-Type: application/x-www-form-urlencoded",
    "content" => $tokenPayload,
    "timeout" => 8
  ]
]);

$tokenRes = @file_get_contents("https://oauth2.googleapis.com/token", false, $tokenCtx);
if ($tokenRes === false) {
  http_response_code(502);
  echo json_encode(["success" => false, "message" => "Échec OAuth2 (token)."]);
  exit;
}

$tokenJson = json_decode($tokenRes, true);
$accessToken = $tokenJson["access_token"] ?? null;
if (!$accessToken) {
  http_response_code(502);
  echo json_encode(["success" => false, "message" => "Token OAuth2 invalide.", "raw" => $tokenJson]);
  exit;
}

// 2) GA4 Data API: runReport
$days = isset($_GET["days"]) ? max(1, min(90, (int)$_GET["days"])) : 30;

$body = [
  "dateRanges" => [[
    "startDate" => $days . "daysAgo",
    "endDate" => "today"
  ]],
  "metrics" => [
    ["name" => "activeUsers"],
    ["name" => "sessions"],
    ["name" => "screenPageViews"]
  ]
];

$url = "https://analyticsdata.googleapis.com/v1beta/properties/" . urlencode($propertyId) . ":runReport";

list($resBody, $resHeaders) = http_post_json($url, $body, ["Authorization: Bearer " . $accessToken]);

if ($resBody === false) {
  http_response_code(502);
  echo json_encode(["success" => false, "message" => "Échec appel GA4 Data API"]);
  exit;
}

$report = json_decode($resBody, true);
if (!is_array($report)) {
  http_response_code(502);
  echo json_encode(["success" => false, "message" => "Réponse GA4 non JSON"]);
  exit;
}

$values = ["activeUsers" => 0, "sessions" => 0, "screenPageViews" => 0];

if (!empty($report["rows"][0]["metricValues"])) {
  $mv = $report["rows"][0]["metricValues"];
  $values["activeUsers"] = (int)($mv[0]["value"] ?? 0);
  $values["sessions"] = (int)($mv[1]["value"] ?? 0);
  $values["screenPageViews"] = (int)($mv[2]["value"] ?? 0);
}

echo json_encode([
  "success" => true,
  "days" => $days,
  "metrics" => $values
], JSON_UNESCAPED_UNICODE);
?>