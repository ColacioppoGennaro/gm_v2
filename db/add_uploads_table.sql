-- Esegui questo SQL sul DB per creare la tabella uploads
CREATE TABLE IF NOT EXISTS uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL,
  mime VARCHAR(100) NOT NULL,
  label VARCHAR(255) DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  created_at DATETIME NOT NULL,
  INDEX (user_id)
);