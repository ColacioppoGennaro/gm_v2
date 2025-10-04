<?php
session_start();
require_once(__DIR__ . '/../config/config.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'error' => 'Not authenticated']);
  exit;
}

$uid = (int) $_SESSION['user_id'];
$pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

$stmt = $pdo->prepare("SELECT id, email, nickname, is_pro FROM users WHERE id = ?");
$stmt->execute([$uid]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
  http_response_code(404);
  echo json_encode(['success' => false, 'error' => 'User not found']);
  exit;
}

echo json_encode(['success' => true, 'user' => [
  'id' => (int)$user['id'],
  'email' => $user['email'],
  'nickname' => $user['nickname'] ?? null,
  'is_pro' => (bool)$user['is_pro']
]]);

