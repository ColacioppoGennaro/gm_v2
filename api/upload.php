<?php
// Riceve upload via multipart/form-data, valida, salva su disco, registra DB e chiama dockanalyzer
session_start();
require_once(__DIR__ . '/../config/config.php');
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success'=>false,'error'=>'Not authenticated']);
  exit;
}
$uid = (int) $_SESSION['user_id'];

$ALLOWED = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','image/png','image/jpeg'];
$MAX_SIZE = 10 * 1024 * 1024;

if (!isset($_FILES['file'])) {
  echo json_encode(['success'=>false,'error'=>'No file']);
  exit;
}
$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) {
  echo json_encode(['success'=>false,'error'=>'Upload error: '.$f['error']]);
  exit;
}
if ($f['size'] > $MAX_SIZE) {
  echo json_encode(['success'=>false,'error'=>'File too large']);
  exit;
}
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $f['tmp_name']);
finfo_close($finfo);
if (!in_array($mime, $ALLOWED)) {
  echo json_encode(['success'=>false,'error'=>'Type not allowed: '.$mime]);
  exit;
}

$baseDir = __DIR__ . '/../storage/uploads/';
$userDir = $baseDir . $uid . '/';
if (!is_dir($userDir)) mkdir($userDir, 0755, true);

$original = basename($f['name']);
$ext = pathinfo($original, PATHINFO_EXTENSION);
$storedName = time().'_'.bin2hex(random_bytes(6)).'.'.$ext;
$target = $userDir . $storedName;

if (!move_uploaded_file($f['tmp_name'], $target)) {
  echo json_encode(['success'=>false,'error'=>'Unable to save file']);
  exit;
}

try {
  $pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
  $category = trim($_POST['category'] ?? '');
  $stmt = $pdo->prepare("INSERT INTO uploads (user_id, original_name, stored_name, size, mime, category, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
  $stmt->execute([$uid, $original, $storedName, $f['size'], $mime, $category]);
  $uploadId = $pdo->lastInsertId();

  $stmtU = $pdo->prepare("SELECT is_pro FROM users WHERE id = ?");
  $stmtU->execute([$uid]);
  $u = $stmtU->fetch(PDO::FETCH_ASSOC);
  $is_pro = $u && $u['is_pro'];

  $label = $is_pro ? 'pro_label' : 'free_label';
  if ($is_pro && $category) {
    $label = $label . ',' . preg_replace('/[^a-z0-9_-]/i','_',substr($category,0,40));
  }

  $stmt2 = $pdo->prepare("UPDATE uploads SET label = ? WHERE id = ?");
  $stmt2->execute([$label, $uploadId]);

  // Call dockanalyzer stub (if available)
  $analyzerUrl = null;
  // If there's a local dockanalyzer.php, call it internally
  $dockPath = __DIR__ . '/dockanalyzer.php';
  if (is_file($dockPath)) {
    // include returns null; we'll attempt a simple curl to the local endpoint if reachable
    $base = dirname((isset($_SERVER['SCRIPT_URI'])?$_SERVER['SCRIPT_URI']:''));  
    // Best-effort: call via CLI using php if available
    // For now, call as include and if function exists, let it handle
    try {
      include_once $dockPath;
      if (function_exists('dockanalyze_file')) {
        // allow dockanalyzer to run (function should accept path and return array)
        @dockanalyze_file($target, $uploadId);
      }
    } catch (Exception $e) {
      // ignore analyzer errors
    }
  }

  echo json_encode(['success'=>true,'id'=>$uploadId,'label'=>$label]);
  exit;
} catch (Exception $e) {
  error_log('Upload error: '.$e->getMessage());
  echo json_encode(['success'=>false,'error'=>'Server error']);
  exit;
}