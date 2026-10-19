<?php
/**
 * ChuoiCungUng.com - Production Supabase API Bridge for iNET Hosting
 * Delivers 150.000+ Enterprises & Single Enterprise Details via Supabase Cloud
 */

ini_set('display_errors', '0');
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, apikey');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Supabase Cloud Configuration
$supabaseUrl = getenv('SUPABASE_URL') ?: 'https://fcllkddudeslshqwldeb.supabase.co';
$supabaseKey = getenv('SUPABASE_SECRET_KEY') ?: getenv('SUPABASE_SERVICE_ROLE_KEY') ?: getenv('SUPABASE_KEY') ?: '';

// Load credentials from local .env file if running in an environment without exported env vars
if (empty($supabaseKey) && file_exists(__DIR__ . '/../.env')) {
    $envLines = @file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($envLines as $line) {
        $line = trim($line);
        if (strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v, " \t\n\r\0\x0B\"'");
            if (($k === 'SUPABASE_SECRET_KEY' || $k === 'SUPABASE_SERVICE_ROLE_KEY') && empty($supabaseKey)) {
                $supabaseKey = $v;
            }
            if ($k === 'SUPABASE_URL' && empty($supabaseUrl)) {
                $supabaseUrl = $v;
            }
        }
    }
}

// 2. Identify if requesting single enterprise detail
$id = $_GET['id'] ?? '';
if (empty($id)) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (preg_match('#^/api/enterprises/([^/]+)$#', $uri, $matches)) {
        $id = $matches[1];
    }
}

// Helper cURL call to Supabase
function callSupabase($url, $apiKey, $needCount = false) {
    $ch = curl_init($url);
    $headers = [
        'apikey: ' . $apiKey,
        'Authorization: Bearer ' . $apiKey,
        'Accept: application/json'
    ];
    if ($needCount) {
        $headers[] = 'Prefer: count=exact';
    }

    $responseHeaders = [];
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_HEADERFUNCTION => function($curl, $header) use (&$responseHeaders) {
            $len = strlen($header);
            $parts = explode(':', $header, 2);
            if (count($parts) === 2) {
                $responseHeaders[strtolower(trim($parts[0]))] = trim($parts[1]);
            }
            return $len;
        }
    ]);

    $body = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'headers' => $responseHeaders,
        'body' => $body
    ];
}

// -------------------------------------------------------------
// Case A: Single Enterprise Detail
// -------------------------------------------------------------
if (!empty($id)) {
    // 1. Try exact ID lookup
    $targetUrl = $supabaseUrl . '/rest/v1/enterprises?id=eq.' . rawurlencode($id) . '&select=*&limit=1';
    $res = callSupabase($targetUrl, $supabaseKey);

    $items = json_decode($res['body'] ?? '[]', true);
    if (!empty($items) && is_array($items) && isset($items[0])) {
        $ent = $items[0]['data'] ?? $items[0];
        echo json_encode([
            'success' => true,
            'source' => 'supabase',
            'data' => $ent
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. Try normalized name / slug fallback
    $cleanSlug = str_replace('-', ' ', $id);
    $targetUrl = $supabaseUrl . '/rest/v1/enterprises?normalized_name=ilike.*' . rawurlencode($cleanSlug) . '*&select=*&limit=1';
    $res = callSupabase($targetUrl, $supabaseKey);
    $items = json_decode($res['body'] ?? '[]', true);

    if (!empty($items) && is_array($items) && isset($items[0])) {
        $ent = $items[0]['data'] ?? $items[0];
        echo json_encode([
            'success' => true,
            'source' => 'supabase',
            'data' => $ent
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(404);
    echo json_encode([
        'success' => false,
        'error' => ['code' => 'NOT_FOUND', 'message' => 'Không tìm thấy hồ sơ doanh nghiệp trên hệ thống.']
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// -------------------------------------------------------------
// Case B: Search & Directory Pagination
// -------------------------------------------------------------
$page = max(1, intval($_GET['page'] ?? 1));
$limit = min(100, max(1, intval($_GET['limit'] ?? 24)));
$offset = ($page - 1) * $limit;

$q = trim($_GET['q'] ?? '');
$province = trim($_GET['province'] ?? '');
$category = trim($_GET['category'] ?? '');
$letter = trim($_GET['letter'] ?? '');
$stage = trim($_GET['stage'] ?? '');
$phase = trim($_GET['phase'] ?? '');

$queryParams = [
    'select' => 'id,data',
    'limit' => $limit,
    'offset' => $offset
];

if (!empty($province) && $province !== 'Toàn quốc' && $province !== 'all') {
    $queryParams['province'] = 'ilike.*' . $province . '*';
}

if (!empty($category) && $category !== 'all') {
    $queryParams['category'] = 'ilike.*' . $category . '*';
}

if (!empty($letter) && $letter !== 'TẤT CẢ') {
    $queryParams['name'] = 'ilike.' . $letter . '*';
}

if (!empty($stage) && $stage !== 'all') {
    $queryParams['stage'] = 'eq.' . $stage;
}

if (!empty($phase) && $phase !== 'all') {
    $queryParams['phase'] = 'eq.' . $phase;
}

if (!empty($q)) {
    $queryParams['or'] = '(name.ilike.*' . $q . '*,category.ilike.*' . $q . '*)';
}

$queryString = http_build_query($queryParams);
$targetUrl = $supabaseUrl . '/rest/v1/enterprises?' . $queryString;

$res = callSupabase($targetUrl, $supabaseKey, true);

// Extract exact total from Content-Range header: e.g. "0-23/174278"
$total = 0;
$contentRange = $res['headers']['content-range'] ?? '';
if (preg_match('#/(\d+)$#', $contentRange, $matches)) {
    $total = intval($matches[1]);
}

$rows = json_decode($res['body'] ?? '[]', true);
$data = [];
if (is_array($rows)) {
    foreach ($rows as $row) {
        $data[] = $row['data'] ?? $row;
    }
}

if ($total === 0 && !empty($data)) {
    $total = count($data);
}

$totalPages = max(1, (int)ceil($total / $limit));

echo json_encode([
    'success' => true,
    'source' => 'supabase',
    'total' => $total,
    'count' => count($data),
    'totalPages' => $totalPages,
    'currentPage' => $page,
    'pageSize' => $limit,
    'data' => $data
], JSON_UNESCAPED_UNICODE);
