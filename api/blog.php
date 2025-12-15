<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

// Source "bien cotée" : Hugging Face Blog (RSS)
$feedUrl = "https://huggingface.co/blog/feed.xml";

// Paramètres
$limit = isset($_GET["limit"]) ? max(1, min(12, (int)$_GET["limit"])) : 6;

// Cache simple (évite de re-fetch en boucle)
$cacheDir = __DIR__ . "/../cache";
$cacheFile = $cacheDir . "/blog.json";
$cacheTtlSeconds = 60 * 30; // 30 min

if (!is_dir($cacheDir)) {
  @mkdir($cacheDir, 0775, true);
}

// Sert le cache si valide
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtlSeconds)) {
  $cached = json_decode(file_get_contents($cacheFile), true);
  if (is_array($cached)) {
    $cached["cached"] = true;
    $cached["ttl_seconds"] = $cacheTtlSeconds;
    // Coupe au limit demandé
    if (isset($cached["items"]) && is_array($cached["items"])) {
      $cached["items"] = array_slice($cached["items"], 0, $limit);
    }
    echo json_encode($cached, JSON_UNESCAPED_UNICODE);
    exit;
  }
}

// Fetch RSS
$ctx = stream_context_create([
  "http" => [
    "timeout" => 6,
    "header"  => "User-Agent: gabriel-dev-web/1.0\r\n"
  ]
]);

$xmlStr = @file_get_contents($feedUrl, false, $ctx);
if ($xmlStr === false) {
  http_response_code(502);
  echo json_encode(["success" => false, "message" => "Impossible de récupérer le flux RSS"], JSON_UNESCAPED_UNICODE);
  exit;
}

libxml_use_internal_errors(true);
$xml = simplexml_load_string($xmlStr, "SimpleXMLElement", LIBXML_NOCDATA);
if ($xml === false) {
  http_response_code(502);
  echo json_encode(["success" => false, "message" => "Flux RSS invalide"], JSON_UNESCAPED_UNICODE);
  exit;
}

$items = [];
// Support RSS2 (<channel><item>) + Atom (<entry>)
if (isset($xml->channel->item)) {
  foreach ($xml->channel->item as $it) {
    $title = trim((string)$it->title);
    $link = trim((string)$it->link);
    $pub = (string)$it->pubDate;
    $desc = (string)$it->description;

    $summary = trim(strip_tags($desc));
    if (mb_strlen($summary) > 220) $summary = mb_substr($summary, 0, 220) . "…";

    $items[] = [
      "title" => $title,
      "url" => $link,
      "date" => $pub ? gmdate("c", strtotime($pub)) : null,
      "summary" => $summary,
      "source" => "Hugging Face Blog"
    ];
    if (count($items) >= $limit) break;
  }
} elseif (isset($xml->entry)) {
  foreach ($xml->entry as $it) {
    $title = trim((string)$it->title);
    $link = "";
    foreach ($it->link as $lnk) {
      $attrs = $lnk->attributes();
      if (isset($attrs["href"])) { $link = (string)$attrs["href"]; break; }
    }
    $updated = (string)$it->updated;
    $content = (string)$it->content;

    $summary = trim(strip_tags($content));
    if (mb_strlen($summary) > 220) $summary = mb_substr($summary, 0, 220) . "…";

    $items[] = [
      "title" => $title,
      "url" => $link,
      "date" => $updated ?: null,
      "summary" => $summary,
      "source" => "AI Feed"
    ];
    if (count($items) >= $limit) break;
  }
}

$out = ["success" => true, "items" => $items, "cached" => false];

// Enregistre cache
@file_put_contents($cacheFile, json_encode($out, JSON_UNESCAPED_UNICODE));

echo json_encode($out, JSON_UNESCAPED_UNICODE);
?>