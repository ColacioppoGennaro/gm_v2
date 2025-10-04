<?php
session_start();
require_once(__DIR__ . '/../config/config.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'error'=>'Not authenticated']);
  exit;
}
$uid = (int) $_SESSION['user_id'];

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $input['action'] ?? $_POST['action'] ?? '';

try {
  $pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  if ($action === 'toggle_demo') {
    // toggle is_pro for demo purposes
    $stmt = $pdo->prepare('SELECT is_pro FROM users WHERE id = ?');
    $stmt->execute([$uid]);
    $u = $stmt->fetch(PDO::FETCH_ASSOC);
    $cur = $u ? (int)$u['is_pro'] : 0;
    $new = $cur ? 0 : 1;
    $up = $pdo->prepare('UPDATE users SET is_pro = ? WHERE id = ?');
    $up->execute([$new, $uid]);
    echo json_encode(['success'=>true,'is_pro'=>$new,'message'=>'Demo toggled']);
    exit;
  }

  echo json_encode(['success'=>false,'error'=>'Unknown action']);
  exit;
} catch (Exception $e) {
  error_log('Subscription error: '.$e->getMessage());
  echo json_encode(['success'=>false,'error'=>'Server error']);
  exit;
}