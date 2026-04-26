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
            <el-button type="primary" @click="refreshData">刷新数据</el-button>
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
    color: ['#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE'],
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
      data: ['鱼1', '鱼2', '鱼3', '鱼4', '鱼5'],
      textStyle: {
        color: 'rgba(147, 197, 253, 0.8)'
      }
    },
    tooltip: {
      show: true,  // 显示提示框，方便查看数据
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      borderColor: 'rgba(59, 130, 246, 0.4)',
      textStyle: {
        color: 'rgba(147, 197, 253, 1)'
      }
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

<style lang="scss" scoped>
@use '@/assets/main.scss';

.fish-monitoring-container {
  padding: 20px;
  background: var(--tech-blue-900);
  min-height: 100vh;
}

.title-card {
  margin-bottom: 20px;
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
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.status-info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.update-time {
  margin-left: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.video-card {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(17, 24, 39, 0.6) !important;
  border: var(--border-tech) !important;
  box-shadow: var(--shadow-md);
  
  .el-card__header {
    border-bottom: 1px solid rgba(6, 182, 212, 0.3) !important;
  }
}

.video-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #67e8f9;
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
  border: 1px solid rgba(6, 182, 212, 0.3);
}

video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.chart-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(17, 24, 39, 0.6) !important;
  border: var(--border-tech) !important;
  box-shadow: var(--shadow-md);
  
  .el-card__header {
    border-bottom: 1px solid rgba(6, 182, 212, 0.3) !important;
  }
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
  color: #67e8f9;
}

.chart-container {
  flex: 1;
  min-height: 400px;
  background: rgba(10, 14, 26, 0.6);
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  padding: 10px;
}

.card-footer {
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

// 按钮样式
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
</style>    