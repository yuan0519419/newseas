-- 数据库初始化脚本

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS fish_monitoring_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE fish_monitoring_system;

-- 创建鱼礁表
CREATE TABLE IF NOT EXISTS reefs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '鱼礁名称，如"鱼礁一"、"鱼礁二"',
  location VARCHAR(255) COMMENT '鱼礁位置描述',
  status ENUM('online', 'offline', 'maintenance') DEFAULT 'online' COMMENT '鱼礁状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建鱼类表
CREATE TABLE IF NOT EXISTS fishes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fish_id INT NOT NULL UNIQUE COMMENT '鱼的编号，前端显示的ID',
  species VARCHAR(100) COMMENT '鱼类物种',
  description TEXT COMMENT '鱼类描述信息',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fish_id (fish_id)
);

-- 创建检测记录表
CREATE TABLE IF NOT EXISTS detection_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reef_id INT NOT NULL COMMENT '关联的鱼礁ID',
  fish_id INT NOT NULL COMMENT '关联的鱼类ID',
  detection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '检测到的时间',
  detection_data JSON COMMENT '额外的检测数据，如水温、流速等',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reef_id (reef_id),
  INDEX idx_fish_id (fish_id),
  INDEX idx_detection_time (detection_time),
  FOREIGN KEY (reef_id) REFERENCES reefs(id) ON DELETE CASCADE,
  FOREIGN KEY (fish_id) REFERENCES fishes(fish_id) ON DELETE CASCADE
);

-- 插入初始数据
-- 插入鱼礁数据
INSERT INTO reefs (name, location) VALUES 
('鱼礁一', '监测区域左上角'),
('鱼礁二', '监测区域右下角')
ON DUPLICATE KEY UPDATE location=VALUES(location);

-- 插入一些示例鱼类数据
INSERT INTO fishes (fish_id, species) VALUES 
(1, '未知鱼类'),
(2, '未知鱼类'),
(3, '未知鱼类'),
(4, '未知鱼类'),
(5, '未知鱼类')
ON DUPLICATE KEY UPDATE species=VALUES(species);

-- 插入一些示例检测记录
INSERT INTO detection_records (reef_id, fish_id, detection_time) VALUES
(1, 1, NOW() - INTERVAL 2 HOUR),
(2, 2, NOW() - INTERVAL 90 MINUTE),
(1, 3, NOW() - INTERVAL 60 MINUTE),
(2, 1, NOW() - INTERVAL 30 MINUTE),
(1, 4, NOW() - INTERVAL 15 MINUTE)
ON DUPLICATE KEY UPDATE detection_time=VALUES(detection_time);

-- 创建用户（如果需要）
-- 注意：在生产环境中，应该使用更安全的密码策略
-- CREATE USER 'fish_monitor'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON fish_monitoring_system.* TO 'fish_monitor'@'localhost';
-- FLUSH PRIVILEGES;