<template>
  <!-- 新增视频展示区域 -->
  <div class="w-[80%] mx-auto p-4">
    <!-- 外层容器 -->
    <div class="bg-tech-dark rounded-xl shadow-lg p-4 h-[15vh]">
      <!-- 视频容器，使用水平排列样式 -->
      <div class="video-container">
        <!-- 左侧视频 - 使用card容器包裹 -->
        <el-card class="video-card">
          <div class="video-item relative bg-tech-darker rounded-lg overflow-hidden">
            <video 
              ref="videoRef1" width="100%" height="auto" controls autoplay loop muted
            >
              <source src="/src/assets/fish.mp4" type="video/mp4">
              您的浏览器不支持视频播放
            </video>
          </div>
        </el-card>
        
        <!-- 右侧视频 - 使用card容器包裹 -->
        <el-card class="video-card">
          <div class="video-item relative bg-tech-darker rounded-lg overflow-hidden">
            <video 
              ref="videoRef2" 
               width="100%" height="auto" controls autoplay loop muted
            >
              <source src="/src/assets/fish.mp4" type="video/mp4">
              您的浏览器不支持视频播放
            </video>
          </div>
        </el-card>
      </div>
    </div>
  </div>

  <!-- 底部数据展示区域 -->
  <div class="h-1/2 p-4 space-y-4">
    <!-- 鱼类品种和数量统计 - 增高高度 -->
    <div class="bg-tech-dark rounded-xl shadow-lg p-4 h-[50%]">
      <h2 class="text-xl font-bold text-tech-blue-600 mb-4">鱼类品种和数量统计</h2>
      <div class="overflow-y-auto h-[calc(100%-40px)]">
        <el-table :data="fishStatistics" stripe style="width: 100%">
          <el-table-column prop="species" label="鱼类品种"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column label="占比">
            <template #default="scope">
              <el-progress :percentage="scope.row.percentage" :stroke-width="18"></el-progress>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 总体重图表 - 降低高度 -->
    <div class="bg-tech-dark rounded-xl shadow-lg p-4 h-[45%]">
      <h2 class="text-xl font-bold text-tech-blue-600 mb-4">总体重统计</h2>
      <div class="h-[calc(100%-40px)]">
        <div class="bg-tech-darker rounded-lg p-4 h-full flex flex-col">
          <h3 class="text-lg font-semibold text-tech-blue-400 mb-2">预估总体重 (kg)</h3>
          <div class="flex-1 flex justify-center items-center">
            <canvas ref="totalWeightChartRef" style="height: 300px;width: 100% !important;"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { ElTable, ElTableColumn, ElProgress, ElCard } from 'element-plus';
import 'element-plus/dist/index.css';
import Chart from 'chart.js/auto';

const videoRef1 = ref(null);
const videoRef2 = ref(null);
const totalWeightChartRef = ref(null);

const fishStatistics = ref([
  { species: '鲈鱼', count: 120, percentage: 40 },
  { species: '鲤鱼', count: 85, percentage: 28 },
  { species: '鲫鱼', count: 60, percentage: 20 },
  { species: '草鱼', count: 35, percentage: 12 }
]);

const totalWeightData = ref({
  labels: ['总体重'],
  datasets: [
    {
      label: '预估总体重',
      data: [9.3],
      backgroundColor: ['rgba(59, 130, 246, 0.6)'],
      borderColor: ['rgb(59, 130, 246)'],
      borderWidth: 1
    }
  ]
});

const placeholderImage1 = ref('https://picsum.photos/800/600?random=1');
const placeholderImage2 = ref('https://picsum.photos/800/600?random=2');

let totalWeightChart = null;

const initCharts = () => {
  if (totalWeightChartRef.value && !totalWeightChart) {
    totalWeightChart = new Chart(totalWeightChartRef.value, {
      type: 'bar',
      data: totalWeightData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '千克(kg)',
              font: {
                size: 14,
                weight: 'bold'
              },
              color: 'rgba(147, 197, 253, 0.8)'
            },
            grid: {
              color: 'rgba(59, 130, 246, 0.1)'
            },
            ticks: {
              color: 'rgba(147, 197, 253, 0.6)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'rgba(147, 197, 253, 0.6)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleFont: {
              size: 14,
              weight: 'bold',
              color: 'rgba(147, 197, 253, 1)'
            },
            bodyFont: {
              size: 13,
              color: 'rgba(147, 197, 253, 0.8)'
            },
            padding: 10,
            cornerRadius: 4
          }
        },
        barThickness: 80,
        barPercentage: 0.6
      }
    });
  }
};

// 页面加载完成后确保视频自动播放
onMounted(() => {
  initCharts();
  
  // 处理浏览器自动播放策略限制
  const playVideos = async () => {
    try {
      if (videoRef1.value) await videoRef1.value.play();
      if (videoRef2.value) await videoRef2.value.play();
    } catch (err) {
      console.log('自动播放需要用户交互，将在用户操作后播放:', err);
    }
  };
  
  playVideos();
});

watchEffect(() => {
  if (totalWeightChart) {
    totalWeightChart.data = totalWeightData.value;
    totalWeightChart.update();
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

/* 视频容器相关样式 */
video {
  background-color: #000;
  position: relative;
  z-index: 1;
}

.video-container {
  display: flex;
  gap: 8px;
  width: 100%;
  height: 100%;
  position: relative;
}

/* 视频卡片样式 */
.video-card {
  width: 50%;
  height: 100%;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  background: rgba(17, 24, 39, 0.6) !important;
  border: var(--border-tech) !important;
}

/* 单个视频容器 */
.video-item {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}

/* 防止视频控件重叠问题 */
.video-item video::-webkit-media-controls {
  z-index: 2;
}

/* 容器样式 */
.bg-tech-dark {
  background: var(--tech-blue-900);
  border: var(--border-tech);
}

.bg-tech-darker {
  background: rgba(17, 24, 39, 0.4);
  border: var(--border-tech);
}

.text-tech-blue-600 {
  color: var(--tech-blue-600);
}

.text-tech-blue-400 {
  color: var(--tech-blue-400);
}

/* 表格样式 */
:deep(.el-table) {
  background: transparent !important;
  border: none;
  color: var(--tech-blue-400);
  
  .el-table__header {
    background: var(--tech-blue-800) !important;
    
    th {
      background: var(--tech-blue-800) !important;
      color: var(--tech-blue-600) !important;
      font-weight: 600;
      border-bottom: 1px solid rgba(59, 130, 246, 0.3);
      
      .cell {
        color: var(--tech-blue-600) !important;
        font-weight: 600;
      }
    }
  }
  
  .el-table__body {
    tr {
      background: rgba(17, 24, 39, 0.4) !important;
      color: var(--tech-blue-400) !important;
      
      &:hover > td {
        background: rgba(59, 130, 246, 0.1) !important;
      }
      
      td {
        background: transparent !important;
        border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        color: var(--tech-blue-300) !important;
        
        .cell {
          color: var(--tech-blue-300) !important;
        }
      }
    }
  }
  
  .el-table__empty-block {
    background: rgba(17, 24, 39, 0.4) !important;
  }
}

/* 进度条样式 */
:deep(.el-progress__bar) {
  background: var(--gradient-primary) !important;
}

:deep(.el-progress__track) {
  background: rgba(59, 130, 246, 0.2) !important;
}

/* 响应式设计调整 */
@media (max-width: 768px) {
  .video-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .video-card {
    width: 100%;
    height: 50%;
  }
}
</style>
