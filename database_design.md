# 鱼类监测系统数据库设计

## 数据库表结构

### 1. 鱼礁表 (reefs)

```sql
CREATE TABLE reefs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '鱼礁名称，如"鱼礁一"、"鱼礁二"',
  location VARCHAR(255) COMMENT '鱼礁位置描述',
  status ENUM('online', 'offline', 'maintenance') DEFAULT 'online' COMMENT '鱼礁状态',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. 鱼类表 (fishes)

```sql
CREATE TABLE fishes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fish_id INT NOT NULL UNIQUE COMMENT '鱼的编号，前端显示的ID',
  species VARCHAR(100) COMMENT '鱼类物种',
  description TEXT COMMENT '鱼类描述信息',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_fish_id (fish_id)
);
```

### 3. 检测记录表 (detection_records)

```sql
CREATE TABLE detection_records (
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
```

## 表关系说明

- **reefs** 表存储所有鱼礁的基本信息
- **fishes** 表存储所有被监测鱼类的信息
- **detection_records** 表记录鱼经过鱼礁的检测事件，通过外键关联到 reefs 和 fishes 表

## 索引设计

- 为常用查询字段创建索引，如 fish_id、reef_id 和 detection_time
- 对可能作为查询条件的字段添加索引，提高查询性能

## 数据示例

### 插入示例数据

```sql
-- 插入鱼礁数据
INSERT INTO reefs (name, location) VALUES 
('鱼礁一', '监测区域左上角'),
('鱼礁二', '监测区域右下角');

-- 插入鱼类数据（示例）
INSERT INTO fishes (fish_id, species) VALUES 
(1, '未知鱼类'),
(2, '未知鱼类'),
(3, '未知鱼类');

-- 插入检测记录示例
INSERT INTO detection_records (reef_id, fish_id, detection_time) VALUES
(1, 1, NOW() - INTERVAL 1 HOUR),
(2, 2, NOW() - INTERVAL 30 MINUTE),
(1, 3, NOW() - INTERVAL 15 MINUTE);
```