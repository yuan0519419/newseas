<template>
  <div class="fish-monitoring-container">
    <!-- 标题区域 -->
    <el-card class="title-card">
      <template #header>
        <div class="header-content">
          <el-row :gutter="20">
            <el-col :span="16">
              <h1 class="title">鱼类监测系统</h1>
              <p class="subtitle">实时PIT游泳动物跟踪遥测</p>
            </el-col>
            <el-col :span="8" class="status-info">
              <el-tag type="success">在线</el-tag>
              <span class="update-time">最后更新: {{ lastUpdateTime }}</span>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-card>

    <!-- 主要内容区域：视频和图表左右布局 -->
    <el-row :gutter="20">
      <!-- 视频播放区域 -->
      <el-col :span="12">
        <el-card class="video-card">
          <template #header>
            <div class="card-header">
              <h3 class="video-title">实时监测视频</h3>
            </div>
          </template>
          <div class="video-wrapper">
            <div class="video-container">
              <video ref="videoRef" width="100%" height="auto" controls autoplay loop muted>
                <source src="../assets/pit.mp4" type="video/mp4">
                您的浏览器不支持视频播放。
              </video>
            </div>
          </div>
          
       
        </el-card>
      </el-col>

      <!-- 鱼的运动轨迹图表 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <h3 class="chart-title">鱼的运动轨迹</h3>
            </div>
          </template>
          <div ref="chart" class="chart-container"></div>
          <div class="card-footer">
            <button @click="refreshData" class="px-4 py-2 bg-blue-500 text-white rounded">刷新数据</button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import * as echarts from 'echarts';

const videoRef = ref(null);
const isPlaying = ref(false);
const volume = ref(0.8);
const playbackRate = ref(1.0);
const lastUpdateTime = ref('');

const chart = ref();
const state = reactive({
  seriesData: []
});

// 生成随机数据
const generateRandomData = () => {
  const series = [];
  const categories = ['鱼1', '鱼2', '鱼3', '鱼4', '鱼5'];
  
  for (let i = 0; i < 5; i++) {
    const dataPoints = [];
    for (let j = 0; j <= 100; j += 20) {
      // 生成0-700之间的随机数
      const value = Math.floor(Math.random() * 700);
      dataPoints.push([j, value]);
    }
    
    series.push({
      name: categories[i],
      data: dataPoints,
      type: 'line',
      smooth: true,
      showSymbol: false,  // 隐藏数据点标记
      symbolSize: 0       // 确保数据点不显示
    });
  }
  
  return series;
};

// 更新时间
const updateDateTime = () => {
  const now = new Date();
  lastUpdateTime.value = now.toLocaleString();
};



// 监听视频状态
const handleVideoPlay = () => {
  isPlaying.value = true;
};

const handleVideoPause = () => {
  isPlaying.value = false;
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 60000); // 每分钟更新一次时间

  setInterval(() => {
    refreshData();
  }, 5000);

  state.seriesData = generateRandomData();
  
  const myChart = echarts.init(chart.value);
  const option = {
    color: ['#37A2DA', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE'],
    grid: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 30,
      containLabel: true
    },
      xAxis: {
      show: false,  // 隐藏整个x轴（包括轴线、刻度、标签和网格线）
    },
    yAxis: {
      
      show: false,  // 隐藏整个y轴（包括轴线、刻度、标签和网格线）
    },
    series: state.seriesData,
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      data: ['鱼1', '鱼2', '鱼3', '鱼4', '鱼5']
    },
    tooltip: {
      show: false,  // 显示提示框，方便查看数据
      trigger: 'axis'
    }
  };
  
  myChart.setOption(option);
  
  // 刷新数据的方法
  const refreshChartData = () => {
    state.seriesData = generateRandomData();
    myChart.setOption({
      series: state.seriesData
    });
    updateDateTime(); // 刷新时更新时间
  };
  
  // 自动刷新数据
  setInterval(refreshChartData, 5000);
  
  window.addEventListener('resize', () => {
    myChart.resize();
  });

  if (videoRef.value) {
    videoRef.value.volume = volume.value;
    videoRef.value.playbackRate = playbackRate.value;
    
    // 监听视频事件
    videoRef.value.addEventListener('play', handleVideoPlay);
    videoRef.value.addEventListener('pause', handleVideoPause);
  }
});

// 刷新数据的函数
const refreshData = () => {
  const myChart = echarts.getInstanceByDom(chart.value);
  if (myChart) {
    state.seriesData = generateRandomData();
    myChart.setOption({
      series: state.seriesData
    });
    updateDateTime(); // 刷新时更新时间
  }
};

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.removeEventListener('play', handleVideoPlay);
    videoRef.value.removeEventListener('pause', handleVideoPause);
  }
});
</script>

<style scoped>
.fish-monitoring-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.title-card {
  margin-bottom: 20px;
  background-color: #1e88e5;
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
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
  font-size: 14px;
}

.video-card {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.video-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.video-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 比例 */
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
}

video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-controls {
  margin-top: 15px;
  padding: 10px 0;
}

.control-buttons {
  display: flex;
  justify-content: space-around;
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}

.chart-container {
  flex: 1;
  min-height: 400px;
}

.card-footer {
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}
</style>    