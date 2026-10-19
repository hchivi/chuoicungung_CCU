<?php
// Zalo OAuth v4 Login Initiator for ChuoiCungUng.com
$app_id = '3500129788309602073';
$site = 'https://chuoicungung.com';
$callback_url = $site . '/zalo-callback.php';

// Tạo code_verifier (chuỗi ngẫu nhiên 43 ký tự)
$charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
$verifier = '';
$max = strlen($charset) - 1;
for ($i = 0; $i < 43; $i++) {
    $verifier .= $charset[random_int(0, $max)];
}

// Tính code_challenge (Base64URL(SHA256(verifier)))
$hash = hash('sha256', $verifier, true);
$challenge = rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');

// Lưu code_verifier vào cookie (10 phút)
setcookie('zalo_verifier', $verifier, [
    'expires' => time() + 600,
    'path' => '/',
    'domain' => 'chuoicungung.com',
    'secure' => true,
    'httponly' => false,
    'samesite' => 'Lax'
]);

$state = 'zalo_' . time();

$auth_url = 'https://oauth.zaloapp.com/v4/permission?' . http_build_query([
    'app_id' => $app_id,
    'redirect_uri' => $callback_url,
    'code_challenge' => $challenge,
    'state' => $state
]);

header('Location: ' . $auth_url);
exit;
