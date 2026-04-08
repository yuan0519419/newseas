<template>
  <div class="fish-monitoring-container">
    <!-- 标题区域 -->
    <el-card class="title-card">
      <template #header>
        <div class="header-content">
          <el-row :gutter="20">
            <el-col :span="16">
              <h1 class="title">PIT游泳动物跟踪遥测系统</h1>
            </el-col>
            <el-col :span="8" class="status-info">
              <el-tag type="success">在线</el-tag>
              <span class="update-time">最后更新: {{ lastUpdateTime }}</span>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-card>

    <!-- 海洋牧场名称和信号控制按钮 -->
    <div class="marine-ranch-container">
      <div class="marine-ranch-name">
        三亚蜈支洲岛国家级海洋牧场
      </div>
      <div class="signal-buttons">
        <el-button type="primary" @click="startSimulation">信号启动</el-button>
        <el-button type="warning" @click="stopSimulation">信号关闭</el-button>
      </div>
    </div>

    <!-- 监测区域：两个鱼礁图片 -->
    <div class="monitoring-area">
      <!-- 左上角鱼礁 -->
      <div class="reef-container reef-left-top">
        <div class="reef-image-wrapper">
          <!-- 指示灯 -->
          <div class="indicator-container">
            <el-icon class="indicator-icon" :class="{ 'indicator-active': reef1Indicator }">
              <Warning />
            </el-icon>
          </div>
        </div>
        <!-- 视频播放器：鱼礁一 -->
        <div class="video-container reef-video">
          <div class="video-title">一号鱼礁 实时监控</div>
          <div class="video-wrapper">
            <video
              ref="video1"
              class="monitoring-video"
              src="@/assets/pit1.mp4"
              controls
              preload="metadata"
              loop
              autoplay
              muted
              @click="togglePlay(1)"
            ></video>
          </div>
        </div>
        <div v-if="reef1Data.cardNo" class="reef-info">
          <h3>一号鱼礁</h3>
          <div class="fish-detection-info">
            <div class="fish-info">
              鱼体编号：石斑鱼{{ reef1Data.cardNo }}号
            </div>
            <div class="time-info">
              跟踪标记时间为{{ reef1Data.receiveTime }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右下角鱼礁 -->
      <div class="reef-container reef-right-bottom">
        <div v-if="reef2Data.cardNo" class="reef-info reef-info-top">
          <h3>二号鱼礁</h3>
          <div class="fish-detection-info">
            <div class="fish-info">
              鱼体编号：石斑鱼{{ reef2Data.cardNo }}号
            </div>
            <div class="time-info">
              跟踪标记时间为{{ reef2Data.receiveTime }}
            </div>
          </div>
        </div>
        <div class="reef-image-wrapper">
          <!-- 指示灯 -->
          <div class="indicator-container">
            <el-icon class="indicator-icon" :class="{ 'indicator-active': reef2Indicator }">
              <Warning />
            </el-icon>
          </div>
        </div>
        <!-- 视频播放器：鱼礁二 -->
        <div class="video-container reef-video">
          <div class="video-title">二号鱼礁 实时监控</div>
          <div class="video-wrapper">
            <video
              ref="video2"
              class="monitoring-video"
              src="@/assets/pit.mp4"
              controls
              preload="metadata"
              loop
              autoplay
              muted
              @click="togglePlay(2)"
            ></video>
          </div>
        </div>
      </div>
    </div>



    <!-- 查看个体追踪历史记录按钮 -->
    <div class="history-button-container">
      <el-button type="primary" size="large" @click="showHistoryRecord">
        查看个体追踪历史记录
      </el-button>
    </div>

    <!-- 历史记录模态窗口 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="个体追踪历史记录"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="history-records-container">
        <div v-if="historyRecords.length === 0" class="no-history">
          暂无历史记录
        </div>
        <div v-else>
          <el-table :data="historyRecords" style="width: 100%">
            <el-table-column prop="reefName" label="鱼礁" min-width="100" />
            <el-table-column prop="fishId" label="鱼体编号" min-width="100">
              <template #default="scope">
                石斑鱼{{ scope.row.fishId }}号
              </template>
            </el-table-column>
            <el-table-column prop="time" label="鱼体跟踪标记时间" min-width="200" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getLatestFishDataService, getAllFishTagsService } from '@/api/fishMonitoring.js';

// 重新定义响应式数据模型
const lastUpdateTime = ref('');

// 鱼礁1的数据
const reef1Data = ref({
  id: null,
  reefNo: 1,
  cardNo: null,
  receiveTime: null
});

// 鱼礁2的数据
const reef2Data = ref({
  id: null,
  reefNo: 2,
  cardNo: null,
  receiveTime: null
});

// 控制指示灯状态
const reef1Indicator = ref(false); // false为蓝色，true为红色
const reef2Indicator = ref(false);

// 控制定时器
const reef1Timer = ref(null); // 鱼礁1的定时器引用
const reef2Timer = ref(null); // 鱼礁2的定时器引用
const detectionInterval = ref(null); // 模拟检测的定时器引用

// 视频播放控制
const video1 = ref(null);
const video2 = ref(null);

// 切换视频播放状态
const togglePlay = (videoIndex) => {
  const videoElement = videoIndex === 1 ? video1.value : video2.value;
  if (videoElement) {
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }
};

// 历史记录相关
const historyRecords = ref([]); // 历史记录数组
const historyDialogVisible = ref(false); // 控制历史记录模态窗口的显示

// 显示历史记录模态窗口
const showHistoryRecord = async () => {
  try {
    // 保存当前的本地模拟记录
    const localRecords = [...historyRecords.value];
    
    // 从后端获取所有历史记录
    const response = await getAllFishTagsService();
    
    // 打印完整响应，查看数据结构
    console.log('完整响应数据:', response);
    
    // 创建一个新的合并后的历史记录数组
    const mergedRecords = [];
    
    // 检查响应数据格式
    if (response.code === 0 && response.data) {
      // 处理后端返回的数据
      const backendData = response.data;
      
      // 打印后端数据，确认是否为数组
      console.log('后端返回的数据:', backendData);
      
      // 检查是否为数组
      if (Array.isArray(backendData)) {
        // 将后端数据转换为前端需要的格式
        backendData.forEach(record => {
          const historyRecord = {
            reef: record.reefNo,
            reefName: record.reefNo === 1 ? '一号鱼礁' : '二号鱼礁',
            fishId: record.cardNo,
            time: record.receiveTime,
            shortTime: formatTime(new Date(record.receiveTime))
          };
          console.log('转换后的历史记录:', historyRecord);
          mergedRecords.push(historyRecord);
        });
      } else {
        console.error('后端返回的数据不是数组:', typeof backendData);
      }
    } else {
      console.error('响应数据格式不符合预期:', response);
    }
    
    // 添加本地模拟记录（去重）
    localRecords.forEach(localRecord => {
      // 检查是否已存在相同的记录
      const isDuplicate = mergedRecords.some(record => 
        record.reef === localRecord.reef && 
        record.fishId === localRecord.fishId && 
        record.time === localRecord.time
      );
      
      if (!isDuplicate) {
        mergedRecords.push(localRecord);
      }
    });
    
    // 按时间倒序排序
    mergedRecords.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    // 更新历史记录数组
    historyRecords.value = mergedRecords;
    
    // 打印最终的历史记录数组
    console.log('最终的历史记录数组:', historyRecords.value);
    
    // 显示历史记录模态窗口
    historyDialogVisible.value = true;
  } catch (error) {
    console.error('获取历史记录失败:', error);
    // 即使获取失败也显示模态窗口
    historyDialogVisible.value = true;
    // 可以添加错误提示
    ElMessage.error('获取历史记录失败，请稍后重试');
  }
};

// 更新时间
const updateDateTime = () => {
  const now = new Date();
  lastUpdateTime.value = now.toLocaleString();
};

// 格式化时间为可读格式
const formatTime = (date) => {
  return date.toLocaleTimeString();
};

// 添加检测记录到历史记录
const addDetectionLog = (reefNo, cardNo, receiveTime) => {
  if (!cardNo || !reefNo) return;
  
  const detectionTime = receiveTime ? new Date(receiveTime) : new Date();
  const reefName = reefNo === 1 ? '一号鱼礁' : '二号鱼礁';
  
  // 检查是否已经有相同的记录，如果没有则添加
  const isDuplicate = historyRecords.value.some(record => 
    record.reef === reefNo && 
    record.fishId === cardNo && 
    Math.abs(new Date(record.time) - detectionTime) < 1000 // 1秒内的重复记录不添加
  );
  
  if (!isDuplicate) {
    historyRecords.value.unshift({
      id: Date.now(),
      reef: reefNo,
      reefName: reefName,
      fishId: cardNo,
      time: detectionTime.toLocaleString(), // 完整的时间日期
      shortTime: formatTime(detectionTime) // 只有时间部分
    });
    
    // 只保留最新的50条记录
    if (historyRecords.value.length > 50) {
      historyRecords.value.pop();
    }
  }
};

// 处理鱼经过鱼礁事件
const handleFishDetection = (detectionData) => {
  if (!detectionData) return;
  
  const { id, reefNo, cardNo, receiveTime } = detectionData;
  
  // 只处理有效的检测数据
  if (cardNo && reefNo) {
    const eventTime = receiveTime ? new Date(receiveTime) : new Date();
    
    if (reefNo === 1) {
      // 更新鱼礁1的数据
      reef1Data.value = {
        id,
        reefNo,
        cardNo,
        receiveTime
      };
      reef1Indicator.value = true; // 指示灯变红
      
      // 清除旧定时器
      if (reef1Timer.value) {
        clearTimeout(reef1Timer.value);
      }
      
      // 5秒后恢复指示灯并清除数据
      reef1Timer.value = setTimeout(() => {
        reef1Indicator.value = false; // 恢复蓝色
        reef1Data.value.cardNo = null; // 清除cardNo，小卡片不显示
      }, 5000);
    } else if (reefNo === 2) {
      // 更新鱼礁2的数据
      reef2Data.value = {
        id,
        reefNo,
        cardNo,
        receiveTime
      };
      reef2Indicator.value = true; // 指示灯变红
      
      // 清除旧定时器
      if (reef2Timer.value) {
        clearTimeout(reef2Timer.value);
      }
      
      // 5秒后恢复指示灯并清除数据
      reef2Timer.value = setTimeout(() => {
        reef2Indicator.value = false; // 恢复蓝色
        reef2Data.value.cardNo = null; // 清除cardNo，小卡片不显示
      }, 5000);
    }
    
    // 添加到历史记录
    addDetectionLog(reefNo, cardNo, receiveTime);
    updateDateTime();
  }
};

// 随机间隔时间模拟鱼的经过
const startSimulation = () => {
  // 清除可能存在的旧定时器
  if (detectionInterval.value) {
    clearInterval(detectionInterval.value);
  }
  
  // 初始随机延迟
  setTimeout(() => {
    const randomizeNextInterval = () => {
      // 随机选择鱼礁1或2
      const reef = Math.random() > 0.5 ? 1 : 2;
      simulateFishPassing(reef);
      
      // 随机间隔1-10秒
      const nextInterval = Math.floor(Math.random() * 9000) + 1000;
      detectionInterval.value = setTimeout(randomizeNextInterval, nextInterval);
    };
    
    randomizeNextInterval();
  }, Math.floor(Math.random() * 3000) + 1000);
};

// 停止模拟鱼经过鱼礁的函数
const stopSimulation = () => {
  // 清除模拟检测的定时器
  if (detectionInterval.value) {
    clearTimeout(detectionInterval.value);
    detectionInterval.value = null;
    ElMessage.success('已停止鱼礁信号接收');
  }
};

// 模拟鱼经过鱼礁的函数
const simulateFishPassing = (reefNo = null) => {
  // 如果没有提供鱼礁号，则随机选择鱼礁1或2
  const selectedReefNo = reefNo || (Math.random() > 0.5 ? 1 : 2);
  
  // 生成随机的鱼体编号 (1-100)
  const cardNo = Math.floor(Math.random() * 100) + 1;
  const now = new Date();
  const receiveTime = now.toLocaleString();
  
  // 构建检测数据
  const detectionData = {
    id: null,
    reefNo: selectedReefNo,
    cardNo: cardNo,
    receiveTime: receiveTime
  };
  
  // 处理检测事件
  handleFishDetection(detectionData);
  
  // 显示提示信息
  ElMessage.success(`已接收${selectedReefNo === 1 ? '一号' : '二号'}鱼礁信号，鱼体编号：${cardNo}号`);
};

// 接收后端接口数据的函数
const receiveFromBackend = (data) => {
  // 后端数据格式: { code: 0, message: "操作成功", data: { id: null, reefNo: 1, cardNo: 49, receiveTime: "2025-11-28 17:07:08" } }
  if (data && data.code === 0 && data.data) {
    handleFishDetection(data.data);
  }
};

// 从API获取最新鱼类检测数据的函数
const fetchFishDataFromAPI = async () => {
  try {
    const response = await getLatestFishDataService();
    console.log('从API获取的最新数据:', response);
    receiveFromBackend(response); // 注意：由于响应拦截器已经处理了数据，直接传递response
  } catch (error) {
    console.error('获取鱼类检测数据失败:', error);
  }
};

// 设置定时从后端获取数据
const setupBackendDataFetching = () => {
  // 每5秒从后端获取一次数据
  setInterval(fetchFishDataFromAPI, 5000);
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 60000); // 每分钟更新一次时间
  setupBackendDataFetching(); // 设置后端数据获取
});

onUnmounted(() => {
  // 清理所有定时器
  if (reef1Timer.value) clearTimeout(reef1Timer.value);
  if (reef2Timer.value) clearTimeout(reef2Timer.value);
  if (detectionInterval.value) clearTimeout(detectionInterval.value);
});
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

.fish-monitoring-container {
  padding: 20px;
  min-height: 100vh;
  background: var(--tech-blue-900);
}

.title-card {
  margin-bottom: 10px;
  background: var(--gradient-primary) !important;
  border: var(--border-tech) !important;
  box-shadow: var(--shadow-md);
  
  .el-card__header {
    border-bottom: none !important;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.marine-ranch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 0;
  padding: 10px;
  background: rgba(17, 24, 39, 0.6);
  border: var(--border-tech);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.marine-ranch-name {
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  color: var(--tech-blue-600);
  padding: 10px;
  background: rgba(10, 14, 26, 0.6);
  border-radius: 8px;
  flex-grow: 1;
  margin-right: 10px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.signal-buttons {
  display: flex;
  gap: 10px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.status-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.update-time {
  margin-left: 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

/* 监测区域样式 */
.monitoring-area {
  position: relative;
  min-height: 700px; /* 增加高度以完全展示背景图片 */
  height: auto;
  background-image: url('../assets/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  margin-bottom: 10px;
  overflow: hidden;
  position: relative;
  border: var(--border-tech);
  box-shadow: var(--shadow-md);
  
  /* 添加科技风覆盖层 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(10, 14, 26, 0.3);
    z-index: 0;
  }
}

.reef-container {
  position: absolute;
  z-index: 1;
  display: block; /* 改为块级布局，避免flex影响位置 */
  width: 350px; /* 增加容器宽度，使卡片更宽 */
}

.reef-left-top {
  position: absolute;
  top: -51px; /* 调整位置到冲脚池左侧的红色圆圈 */
  left: 650px;
}

.reef-right-bottom {
  position: absolute;
  top: -50px; /* 调整位置到冲脚池右侧的红色圆圈 */
  right: 250px;
}

.reef-image-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  /* 固定指示灯容器位置，不随信息卡片变化 */
}

.reef-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.indicator-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background: rgba(17, 24, 39, 0.8);
  border: 2px solid rgba(59, 130, 246, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  z-index: 10;
}

.indicator-icon {
  font-size: 36px;
  color: #3B82F6; /* 蓝色 - 默认状态 */
  transition: color 0.3s ease, transform 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
}

.indicator-icon.indicator-active {
  color: #EF4444; /* 红色 - 激活状态 */
  animation: pulse 0.8s infinite;
  filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.8)); /* 添加红色辉光效果 */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.reef-info {
  background: rgba(17, 24, 39, 0.8); /* 深色背景 */
  color: var(--tech-blue-300); /* 浅蓝色文字 */
  padding: 10px 20px; /* 增加内边距，使卡片更宽 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  text-align: center;
  width: 250px;
  /* 独立定位信息卡片，不影响指示灯 */
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid rgba(59, 130, 246, 0.4);
  backdrop-filter: blur(10px);
}

/* 鱼礁1的信息卡片 - 固定在指示灯右侧，进一步调近距离 */
.reef-left-top .reef-info {
  left: 150px;
}

/* 鱼礁2的信息卡片 - 固定在指示灯左侧，进一步调近距离 */
.reef-right-bottom .reef-info {
  left: -220px; /* 向左偏移，考虑卡片宽度250px + 更小的间距 */
}

.reef-info h3 {
  margin: 0 0 10px 0;
  color: var(--tech-blue-600);
  font-size: 18px;
  text-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
}

.fish-detection-info {
  margin: 0;
  text-align: center;
}

.reef-info .fish-info {
  color: var(--tech-blue-400);
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}

.reef-info .time-info {
  color: var(--tech-blue-500);
  font-size: 14px;
}

.no-detection {
  margin: 0;
  color: #999;
  font-size: 14px;
}

/* 保留鱼礁信息样式 */
.fish-info {
  color: var(--tech-blue-400);
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

.time-info {
  color: var(--tech-blue-500);
  font-size: 14px;
}

/* 历史记录按钮样式 */
.history-button-container {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  position: relative;
  z-index: 2; /* 确保按钮在背景图上方 */
}

.history-button-container .el-button:first-child {
  min-width: 180px;
  font-size: 16px;
}

.history-button-container .el-button:last-child {
  min-width: 80px;
  font-size: 14px;
}

/* 历史记录模态窗口样式 */
.history-records-container {
  max-height: 500px;
  overflow-y: auto;
}

.no-history {
  text-align: center;
  padding: 40px 0;
  color: var(--tech-blue-400);
  font-size: 14px;
}

/* 表格样式优化 */
.history-records-container .el-table {
  font-size: 14px;
  background: rgba(17, 24, 39, 0.6) !important;
  border: var(--border-tech) !important;
  
  th {
    background: var(--tech-blue-800) !important;
    color: var(--tech-blue-600) !important;
    font-weight: 600;
    border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
    
    .cell {
      color: var(--tech-blue-600) !important;
      font-weight: 600;
    }
  }
  
  tr {
    background: rgba(17, 24, 39, 0.4) !important;
    color: var(--tech-blue-400) !important;
    
    &:hover > td {
      background: rgba(59, 130, 246, 0.1) !important;
    }
    
    td {
      background: transparent !important;
      border-bottom: 1px solid rgba(59, 130, 246, 0.1) !important;
      color: var(--tech-blue-300) !important;
      
      .cell {
        color: var(--tech-blue-300) !important;
      }
    }
  }
}

/* 鱼礁视频播放器样式 */
.video-container.reef-video {
  margin-top: 20px;
  text-align: center;
  width: 150px;
}

.video-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--tech-blue-600);
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
}

.video-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.monitoring-video {
  width: 100%;
  height: auto;
  display: block;
  background: #000;
}

/* 调整鱼礁一的布局 */
.reef-left-top .reef-video {
  position: absolute;
  top: 120px;
  left: 50px;
  /* 移除transform居中，使用固定像素定位 */
}

/* 调整鱼礁二的布局 */
.reef-right-bottom .reef-video {
  position: absolute;
  top: 120px;
  left: -10px;
  /* 移除transform居中，使用固定像素定位 */
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: var(--gradient-primary);
  border-color: transparent;
  color: var(--tech-blue-900);
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--glow-md);
  }
}

:deep(.el-button--warning) {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  border-color: transparent;
  color: var(--tech-blue-900);
  font-weight: 600;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  background: var(--tech-blue-900) !important;
  border: var(--border-tech) !important;
  box-shadow: var(--shadow-lg) !important;
  border-radius: var(--radius-lg) !important;
  
  .el-dialog__header {
    background: rgba(17, 24, 39, 0.6) !important;
    border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
    
    .el-dialog__title {
      color: var(--tech-blue-600) !important;
      font-weight: 600 !important;
    }
  }
  
  .el-dialog__body {
    background: transparent !important;
    color: var(--tech-blue-300) !important;
  }
  
  .el-dialog__footer {
    background: rgba(17, 24, 39, 0.6) !important;
    border-top: 1px solid rgba(59, 130, 246, 0.3) !important;
  }
}
</style>