<?php
session_start();
require_once(__DIR__ . '/../config/config.php');

header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true) ?? [];

function getUserIP() {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Brute force protection: max 20 fail/hour per email o IP
function isBruteForce($email, $ip, $pdo) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE (email = ? OR ip = ?) AND success=0 AND attempt_time > (NOW() - INTERVAL 1 HOUR)");
    $stmt->execute([$email, $ip]);
    return ($stmt->fetchColumn() >= 20);
}

function logAttempt($email, $ip, $success, $pdo) {
    $stmt = $pdo->prepare("INSERT INTO login_attempts (email, ip, success) VALUES (?, ?, ?)");
    $stmt->execute([$email, $ip, $success ? 1 : 0]);
}

try {
    $pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB connection error']);
    exit;
}

$action = $input['action'] ?? $_POST['action'] ?? '';

if($action === 'login') {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $ip = getUserIP();

    if (isBruteForce($email, $ip, $pdo)) {
        echo json_encode(['success'=>false,'error'=>'Troppi tentativi falliti. Riprova tra 1 ora.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email=?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    $ok = $user && verifyPassword($password, $user['password_hash']);
    logAttempt($email, $ip, $ok, $pdo);

    if($ok) {
        // Rigenera id sessione per sicurezza
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['success'=>true]);
    } else {
        echo json_encode(['success'=>false,'error'=>'Email o password errate']);
    }
    exit;
}

if($action === 'register') {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $nickname = trim($input['nickname'] ?? '');
    if(!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password)<6) {
        echo json_encode(['success'=>false,'error'=>'Email non valida o password troppo corta']);
        exit;
    }
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email=?");
    $stmt->execute([$email]);
    if($stmt->fetch()) {
        echo json_encode(['success'=>false,'error'=>'Email già registrata']);
        exit;
    }
    $hash = hashPassword($password);
    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)");
    $stmt->execute([$email, $hash, $nickname]);
    $_SESSION['user_id'] = $pdo->lastInsertId();
    echo json_encode(['success'=>true]);
    exit;
}

if($action === 'logout') {
    session_destroy();
    echo json_encode(['success'=>true]);
    exit;
}

echo json_encode(['success'=>false,'error'=>'Azione non valida']);
