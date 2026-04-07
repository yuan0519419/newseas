# 鱼类监测系统后端设计

## 技术栈推荐

- **框架**: Spring Boot 2.7+
- **ORM**: Spring Data JPA
- **数据库**: MySQL 8.0+
- **API文档**: Swagger/OpenAPI
- **消息队列**: 可选，用于处理大量检测数据（如RabbitMQ）

## 后端类结构

### 1. 实体类 (Entity)

#### Reef.java
```java
package com.example.fishmonitoring.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "reefs")
public class Reef {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    private String location;
    
    @Enumerated(EnumType.STRING)
    private ReefStatus status = ReefStatus.online;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public enum ReefStatus {
        online, offline, maintenance
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

#### Fish.java
```java
package com.example.fishmonitoring.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "fishes")
public class Fish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "fish_id", unique = true, nullable = false)
    private Integer fishId;
    
    private String species;
    private String description;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

#### DetectionRecord.java
```java
package com.example.fishmonitoring.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.databind.JsonNode;

@Data
@Entity
@Table(name = "detection_records")
public class DetectionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @ManyToOne
    @JoinColumn(name = "reef_id", nullable = false)
    private Reef reef;
    
    @Column(name = "fish_id", nullable = false)
    private Integer fishId;
    
    @Column(name = "detection_time", nullable = false)
    private LocalDateTime detectionTime;
    
    @Column(columnDefinition = "JSON")
    private JsonNode detectionData;
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

### 2. 数据传输对象 (DTO)

#### DetectionRequest.java
```java
package com.example.fishmonitoring.dto;

import lombok.Data;

@Data
public class DetectionRequest {
    private Integer reef;
    private Integer fishId;
    private Object additionalData;
}
```

#### DetectionResponse.java
```java
package com.example.fishmonitoring.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DetectionResponse {
    private Integer id;
    private Integer reefId;
    private String reefName;
    private Integer fishId;
    private LocalDateTime detectionTime;
    private String formattedTime;
}
```

### 3. 仓库接口 (Repository)

#### ReefRepository.java
```java
package com.example.fishmonitoring.repository;

import com.example.fishmonitoring.entity.Reef;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReefRepository extends JpaRepository<Reef, Integer> {
    Reef findByName(String name);
}
```

#### FishRepository.java
```java
package com.example.fishmonitoring.repository;

import com.example.fishmonitoring.entity.Fish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FishRepository extends JpaRepository<Fish, Integer> {
    Fish findByFishId(Integer fishId);
    boolean existsByFishId(Integer fishId);
}
```

#### DetectionRecordRepository.java
```java
package com.example.fishmonitoring.repository;

import com.example.fishmonitoring.entity.DetectionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DetectionRecordRepository extends JpaRepository<DetectionRecord, Integer> {
    
    List<DetectionRecord> findByReefIdOrderByDetectionTimeDesc(Integer reefId);
    
    List<DetectionRecord> findByFishIdOrderByDetectionTimeDesc(Integer fishId);
    
    @Query("SELECT d FROM DetectionRecord d WHERE d.detectionTime BETWEEN :startTime AND :endTime ORDER BY d.detectionTime DESC")
    List<DetectionRecord> findByDetectionTimeBetweenOrderByDetectionTimeDesc(
            @Param("startTime") LocalDateTime startTime, 
            @Param("endTime") LocalDateTime endTime);
    
    List<DetectionRecord> findTop100ByOrderByDetectionTimeDesc();
}
```

### 4. 服务层 (Service)

#### ReefService.java
```java
package com.example.fishmonitoring.service;

import com.example.fishmonitoring.entity.Reef;
import com.example.fishmonitoring.repository.ReefRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReefService {
    @Autowired
    private ReefRepository reefRepository;
    
    public Reef getReefById(Integer id) {
        return reefRepository.findById(id).orElse(null);
    }
    
    public Reef getReefByName(String name) {
        return reefRepository.findByName(name);
    }
    
    public List<Reef> getAllReefs() {
        return reefRepository.findAll();
    }
    
    public Reef saveReef(Reef reef) {
        return reefRepository.save(reef);
    }
}
```

#### FishService.java
```java
package com.example.fishmonitoring.service;

import com.example.fishmonitoring.entity.Fish;
import com.example.fishmonitoring.repository.FishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FishService {
    @Autowired
    private FishRepository fishRepository;
    
    public Fish getFishByFishId(Integer fishId) {
        return fishRepository.findByFishId(fishId);
    }
    
    public Fish saveFishIfNotExists(Integer fishId) {
        Fish fish = fishRepository.findByFishId(fishId);
        if (fish == null) {
            fish = new Fish();
            fish.setFishId(fishId);
            fish.setSpecies("未知鱼类");
            fishRepository.save(fish);
        }
        return fish;
    }
    
    public List<Fish> getAllFishes() {
        return fishRepository.findAll();
    }
}
```

#### DetectionRecordService.java
```java
package com.example.fishmonitoring.service;

import com.example.fishmonitoring.entity.DetectionRecord;
import com.example.fishmonitoring.entity.Reef;
import com.example.fishmonitoring.dto.DetectionRequest;
import com.example.fishmonitoring.dto.DetectionResponse;
import com.example.fishmonitoring.repository.DetectionRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DetectionRecordService {
    @Autowired
    private DetectionRecordRepository detectionRecordRepository;
    
    @Autowired
    private ReefService reefService;
    
    @Autowired
    private FishService fishService;
    
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public DetectionResponse saveDetection(DetectionRequest request) {
        // 确保鱼记录存在
        fishService.saveFishIfNotExists(request.getFishId());
        
        // 获取鱼礁信息
        Reef reef = reefService.getReefById(request.getReef());
        if (reef == null) {
            return null;
        }
        
        // 创建检测记录
        DetectionRecord record = new DetectionRecord();
        record.setReef(reef);
        record.setFishId(request.getFishId());
        record.setDetectionTime(LocalDateTime.now());
        
        // 保存记录
        record = detectionRecordRepository.save(record);
        
        // 转换为响应DTO
        return convertToResponse(record, reef);
    }
    
    public List<DetectionResponse> getAllDetectionRecords() {
        List<DetectionRecord> records = detectionRecordRepository.findTop100ByOrderByDetectionTimeDesc();
        return records.stream().map(record -> {
            Reef reef = reefService.getReefById(record.getReef().getId());
            return convertToResponse(record, reef);
        }).collect(Collectors.toList());
    }
    
    public List<DetectionResponse> getRecordsByReef(Integer reefId) {
        List<DetectionRecord> records = detectionRecordRepository.findByReefIdOrderByDetectionTimeDesc(reefId);
        Reef reef = reefService.getReefById(reefId);
        return records.stream().map(record -> convertToResponse(record, reef)).collect(Collectors.toList());
    }
    
    private DetectionResponse convertToResponse(DetectionRecord record, Reef reef) {
        DetectionResponse response = new DetectionResponse();
        response.setId(record.getId());
        response.setReefId(reef.getId());
        response.setReefName(reef.getName());
        response.setFishId(record.getFishId());
        response.setDetectionTime(record.getDetectionTime());
        response.setFormattedTime(record.getDetectionTime().format(formatter));
        return response;
    }
}
```

### 5. 控制器 (Controller)

#### FishMonitoringController.java
```java
package com.example.fishmonitoring.controller;

import com.example.fishmonitoring.dto.DetectionRequest;
import com.example.fishmonitoring.dto.DetectionResponse;
import com.example.fishmonitoring.service.DetectionRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fish-monitoring")
public class FishMonitoringController {
    
    @Autowired
    private DetectionRecordService detectionRecordService;
    
    /**
     * 接收前端的鱼检测数据
     */
    @PostMapping("/detections")
    public ResponseEntity<DetectionResponse> addDetection(@RequestBody DetectionRequest request) {
        DetectionResponse response = detectionRecordService.saveDetection(request);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * 获取最新的检测记录，用于前端显示历史记录
     */
    @GetMapping("/detections")
    public ResponseEntity<List<DetectionResponse>> getAllDetections() {
        List<DetectionResponse> records = detectionRecordService.getAllDetectionRecords();
        return ResponseEntity.ok(records);
    }
    
    /**
     * 根据鱼礁ID获取检测记录
     */
    @GetMapping("/detections/reef/{reefId}")
    public ResponseEntity<List<DetectionResponse>> getDetectionsByReef(@PathVariable Integer reefId) {
        List<DetectionResponse> records = detectionRecordService.getRecordsByReef(reefId);
        return ResponseEntity.ok(records);
    }
    
    /**
     * 检查系统状态
     */
    @GetMapping("/status")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("系统运行正常");
    }
}
```

## API接口设计

| API路径 | 方法 | 描述 | 请求体 (JSON) | 成功响应 (200 OK) |
|---------|------|------|---------------|-------------------|
| `/api/fish-monitoring/detections` | POST | 添加鱼检测记录 | `{"reef": 1, "fishId": 123}` | `{"id": 1, "reefId": 1, "reefName": "鱼礁一", "fishId": 123, "detectionTime": "2023-07-01T12:00:00", "formattedTime": "2023-07-01 12:00:00"}` |
| `/api/fish-monitoring/detections` | GET | 获取所有检测记录 | N/A | `[{"id": 1, "reefId": 1, "reefName": "鱼礁一", "fishId": 123, "detectionTime": "2023-07-01T12:00:00", "formattedTime": "2023-07-01 12:00:00"}]` |
| `/api/fish-monitoring/detections/reef/{reefId}` | GET | 获取指定鱼礁的检测记录 | N/A | `[{"id": 1, "reefId": 1, "reefName": "鱼礁一", "fishId": 123, "detectionTime": "2023-07-01T12:00:00", "formattedTime": "2023-07-01 12:00:00"}]` |
| `/api/fish-monitoring/status` | GET | 检查系统状态 | N/A | `"系统运行正常"` |

## 前端集成说明

前端可以通过修改 `fetchFishDataFromAPI` 函数来调用后端API：

```javascript
const fetchFishDataFromAPI = async () => {
  try {
    const response = await fetch('/api/fish-monitoring/detections');
    const data = await response.json();
    // 处理返回的历史记录数据
  } catch (error) {
    console.error('获取鱼类检测数据失败:', error);
  }
};

// 发送检测数据到后端
const sendDetectionToBackend = async (reef, fishId) => {
  try {
    const response = await fetch('/api/fish-monitoring/detections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reef, fishId })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('发送检测数据失败:', error);
  }
};
```