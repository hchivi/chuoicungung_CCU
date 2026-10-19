<?php
/**
 * ChuoiCungUng.com - Production Media Proxy for iNET Hosting
 * Handles upstream image loading securely without exposing 3rd party domains
 */

// 1. Tắt output buffer & error display để ảnh không bị corrupt
ini_set('display_errors', '0');
error_reporting(0);

$allowedSubdomains = ['products', 'pic', 'logo', 'img'];

// 2. Lấy đường dẫn ảnh từ tham số 'path' hoặc REQUEST_URI
$path = $_GET['path'] ?? '';
if (empty($path)) {
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
    if (strpos($uri, '/api/media/') === 0) {
        $path = substr($uri, strlen('/api/media/'));
    }
}

$path = ltrim(explode('?', $path)[0], '/');

if (empty($path) || strpos($path, '..') !== false) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Invalid media target']);
    exit;
}

// 3. Phân tách subdomain và đường dẫn nội bộ
$segments = explode('/', $path, 2);
$subdomain = $segments[0] ?? '';
$internalPath = $segments[1] ?? '';

if (!in_array($subdomain, $allowedSubdomains) || empty($internalPath)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Unsupported media subdomain']);
    exit;
}

// 4. Mã hóa URL an toàn cho từng phân đoạn
$pathParts = explode('/', $internalPath);
$encodedParts = array_map(function($part) {
    return rawurlencode(rawurldecode($part));
}, $pathParts);
$encodedPath = implode('/', $encodedParts);

// Khởi tạo tên miền nguồn được mã hóa base64 để không lộ ký tự trong code
$sourceHost = $subdomain . '.' . base64_decode('dHJhbmd2YW5ndmlldG5hbS5jb20=');
$targetUrl = 'https://' . $sourceHost . '/' . $encodedPath;

// 5. Sử dụng cURL để kéo ảnh trực tiếp
$ch = curl_init($targetUrl);
$contentType = 'image/jpeg';

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => [
        'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Referer: https://' . base64_decode('dHJhbmd2YW5ndmlldG5hbS5jb20=') . '/',
        'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    ]
]);

$responseBody = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$detectedType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

if (!empty($detectedType) && strpos($detectedType, 'image/') === 0) {
    $contentType = $detectedType;
}

curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300 && !empty($responseBody)) {
    header('Content-Type: ' . $contentType);
    header('Cache-Control: public, max-age=2592000, s-maxage=2592000, immutable');
    header('X-Content-Type-Options: nosniff');
    header('Content-Length: ' . strlen($responseBody));
    echo $responseBody;
    exit;
}

// Fallback: nếu upstream lỗi hoặc 404, trả về ảnh trong suốt 1x1 GIF để không làm vỡ giao diện
http_response_code(404);
header('Content-Type: image/gif');
header('Cache-Control: public, max-age=86400');
echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
exit;
