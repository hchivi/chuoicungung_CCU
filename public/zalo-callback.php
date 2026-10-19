<?php
// Zalo OAuth v4 Callback Handler for ChuoiCungUng.com
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$app_id = getenv('ZALO_APP_ID') ?: '3500129788309602073';
$app_secret = getenv('ZALO_APP_SECRET') ?: '';
$supabase_url = getenv('SUPABASE_URL') ?: 'https://fcllkddudeslshqwldeb.supabase.co';
$supabase_service_key = getenv('SUPABASE_SECRET_KEY') ?: getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '';

// Load credentials from local .env file if available
if ((empty($supabase_service_key) || empty($app_secret)) && file_exists(__DIR__ . '/../.env')) {
    $envLines = @file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    foreach ($envLines as $line) {
        $line = trim($line);
        if (strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v, " \t\n\r\0\x0B\"'");
            if (($k === 'SUPABASE_SECRET_KEY' || $k === 'SUPABASE_SERVICE_ROLE_KEY') && empty($supabase_service_key)) {
                $supabase_service_key = $v;
            }
            if ($k === 'ZALO_APP_SECRET' && empty($app_secret)) {
                $app_secret = $v;
            }
            if ($k === 'ZALO_APP_ID' && !empty($v)) {
                $app_id = $v;
            }
        }
    }
}

$input_data = [];
$raw_input = file_get_contents('php://input');
if (!empty($raw_input)) {
    $input_data = json_decode($raw_input, true) ?: [];
}

$code = isset($input_data['code']) ? $input_data['code'] : (isset($_GET['code']) ? $_GET['code'] : '');
$verifier = isset($input_data['verifier']) ? $input_data['verifier'] : (isset($_GET['verifier']) ? $_GET['verifier'] : (isset($_COOKIE['zalo_verifier']) ? $_COOKIE['zalo_verifier'] : ''));
$is_ajax = !empty($input_data) || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) || isset($_GET['format']);

if (empty($code)) {
    if ($is_ajax) {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => ['message' => 'Thiếu authorization code từ Zalo.']]);
        exit;
    }
    header('Location: /dang-nhap?oauth_error=missing_code');
    exit;
}

// 1. Gửi request đổi access_token tới Zalo API
$ch = curl_init('https://oauth.zaloapp.com/v4/access_token');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'secret_key: ' . $app_secret,
    'Content-Type: application/x-www-form-urlencoded'
]);

$post_fields = [
    'code' => $code,
    'app_id' => $app_id,
    'grant_type' => 'authorization_code'
];
if (!empty($verifier)) {
    $post_fields['code_verifier'] = $verifier;
}

curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_fields));
$token_res = curl_exec($ch);
curl_close($ch);

$token_data = json_decode($token_res, true);
$access_token = isset($token_data['access_token']) ? $token_data['access_token'] : '';

if (empty($access_token)) {
    $error_msg = isset($token_data['error_description']) ? $token_data['error_description'] : (isset($token_data['message']) ? $token_data['message'] : 'Không lấy được access_token từ Zalo.');
    if ($is_ajax) {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => ['message' => $error_msg, 'zalo_response' => $token_data]]);
        exit;
    }
    header('Location: /dang-nhap?oauth_error=zalo_token_failed');
    exit;
}

// 2. Lấy thông tin hồ sơ người dùng từ Zalo Graph API
$ch2 = curl_init('https://graph.zalo.me/v2.0/me?fields=id,name,picture');
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_TIMEOUT, 10);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'access_token: ' . $access_token
]);
$profile_res = curl_exec($ch2);
curl_close($ch2);

$profile = json_decode($profile_res, true);
$zalo_id = isset($profile['id']) ? $profile['id'] : 'zalo_' . time();
$zalo_name = isset($profile['name']) ? $profile['name'] : 'Thành viên Zalo';
$zalo_avatar = isset($profile['picture']['data']['url']) ? $profile['picture']['data']['url'] : '';

$user_profile = [
    'id' => 'zalo_' . $zalo_id,
    'email' => $zalo_id . '@zalo.me',
    'fullName' => $zalo_name,
    'companyName' => '',
    'avatar' => $zalo_avatar,
    'roles' => ['supplier'],
    'role' => 'supplier'
];

$identity = [
    'user' => $user_profile,
    'role' => null
];

// 3. Đồng bộ với Supabase (tạo hoặc cập nhật user ngầm)
try {
    $sb_ch = curl_init($supabase_url . '/auth/v1/admin/users');
    curl_setopt($sb_ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($sb_ch, CURLOPT_POST, true);
    curl_setopt($sb_ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($sb_ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $supabase_service_key,
        'Authorization: Bearer ' . $supabase_service_key,
        'Content-Type: application/json'
    ]);
    curl_setopt($sb_ch, CURLOPT_POSTFIELDS, json_encode([
        'email' => $zalo_id . '@zalo.me',
        'email_confirm' => true,
        'user_metadata' => [
            'full_name' => $zalo_name,
            'avatar_url' => $zalo_avatar,
            'provider' => 'zalo',
            'zalo_id' => $zalo_id,
            'role' => 'supplier',
            'roles' => ['supplier']
        ]
    ]));
    curl_exec($sb_ch);
    curl_close($sb_ch);
} catch (Exception $e) {
    // Không làm gián đoạn đăng nhập nếu Supabase admin API timeout
}

// 4. Trả kết quả
if ($is_ajax) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'data' => $identity
    ]);
    exit;
}

// Nếu redirect thẳng bằng trình duyệt: ghi vào localStorage và chuyển về /tai-khoan
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <title>Đăng nhập Zalo thành công</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0b1f14; color: #fff;">
    <div style="text-align: center;">
        <h2>Đăng nhập thành công!</h2>
        <p>Đang chuyển hướng tới tài khoản của bạn...</p>
    </div>
    <script>
        try {
            const identity = <?php echo json_encode($identity); ?>;
            localStorage.setItem('ccu_session_data', JSON.stringify(identity));
        } catch (err) {}
        window.location.replace('/tai-khoan');
    </script>
</body>
</html>
