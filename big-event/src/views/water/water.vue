<template>
  <div v-if="dataLoaded">
    <div class="button-container">
      <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            style="margin-right: 10px"
          />
          <el-button
            type="primary"
            size="default"
            @click="searchByDate"
          >查询</el-button
          >
      <el-button type="success" size="default" @click="DataRefresh">
        刷新数据
      </el-button>
    </div>
    <div class="chart-container">
      <div id="o-chart"></div>
      <div id="nh-chart"></div>
      <div id="no-chart"></div>
      <div id="temp-chart"></div>
      <div id="salinity-chart"></div>
      <div id="turbidity-chart"></div>
      <div id="ph-chart"></div>
      <div id="chl-chart"></div>
      <div id="currVel-chart"></div>
      <div id="orp-chart"></div>
    </div>
  </div>
  <div v-else>
    <p>正在加载数据...</p>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue';
  import * as echarts from 'echarts';
  import { format } from 'echarts';
  import request from '@/utils/request.js';
  import { ElMessage } from 'element-plus';
import {
  seaDataByDateService
} from "@/api/sea";
const dataLoaded = ref(false); // 用于跟踪数据是否加载完成
const hasShowedWarning = ref(false); // 用于控制提示框只显示一次






// 金鲳鱼养殖水质阈值配置
const thresholds = {
  o: { normal: [6.5, 8], warning: [5.85, 6.5, 8, 8.8], danger: [0, 5.85, 8.8, 15] },      // 溶解氧
  nh: { normal: [0, 0.2], warning: [0.2, 0.22], danger: [0.22, 1] },                      // 氨氮
  no: { normal: [0, 0.1], warning: [0.1, 0.3], danger: [0.3, 0.5] },                      // 亚硝酸氮
  temp: { normal: [25, 30], warning: [24, 25, 30, 31], danger: [0, 24, 31, 40] },        // 水温
  salinity: { normal: [20, 30], warning: [15, 20, 30, 35], danger: [10, 15, 35, 40] },    // 盐度
  turbidity: { normal: [0, 10], warning: [10, 11], danger: [11, 25] },                    // 浊度
  ph: { normal: [6.5, 9.0], warning: [6.5, 7.5, 8.5, 9.0], danger: [0, 6.5, 9.0, 14] },   // pH值
  chl: { normal: [5, 20], warning: [0, 5, 20, 50], danger: [50, 100] },                  // 叶绿素a
  currVel: { normal: [5, 20], warning: [0, 5, 20, 30], danger: [30, 50] },                // 洋流流速
  orp: { normal: [300, 500], warning: [200, 300, 500, 600], danger: [100, 200, 600, 700] } // 氧化还原电位
}

// 获取参数的y轴范围配置
const getAxisRange = (dataKey) => {
  const ranges = {
    o: { min: 0, max: 15 },           // 溶解氧
    nh: { min: 0, max: 0.5 },         // 氨氮
    no: { min: 0, max: 0.5 },         // 亚硝酸氮
    temp: { min: 20, max: 40 },       // 水温
    salinity: { min: 10, max: 40 },   // 盐度
    turbidity: { min: 0, max: 25 },   // 浊度
    ph: { min: 0, max: 14 },          // pH值（最大值为14）
    chl: { min: 0, max: 100 },        // 叶绿素a
    currVel: { min: 0, max: 50 },     // 洋流流速
    orp: { min: 100, max: 700 }       // 氧化还原电位
  }
  return ranges[dataKey] || { min: 0, max: 100 }
}

// 获取数据点颜色状态
const getPointColor = (value, dataKey) => {
  const config = thresholds[dataKey]
  if (!config) return '#34D399' // 默认绿色
  
  // 危险范围：超出最大/最小值边界
  if (config.danger) {
    if (config.danger.length === 4) {
      if (value < config.danger[0] || value > config.danger[3]) return '#ef4444' // 红色-危险
    } else if (config.danger.length === 2) {
      if (value > config.danger[0]) return '#ef4444' // 红色-危险（只有上限）
    }
  }
  
  // 预警范围：超出最优范围但未超出危险范围
  if (config.warning) {
    if (config.warning.length === 4) {
      if ((value >= config.warning[0] && value < config.warning[1]) || 
          (value > config.warning[2] && value <= config.warning[3])) {
        return '#eab308' // 黄色-预警
      }
    } else if (config.warning.length === 2) {
      if (value >= config.warning[0] && value <= config.warning[1]) {
        return '#eab308' // 黄色-预警
      }
    }
  }
  
  return '#34D399' // 绿色-正常
}

const sea = ref([
  {
    id: 163,
    o: 9.87,
    nh: 0.14,
    no: 0.07,
    temp: 33.65,
    salinity: 33.28,
    turbidity: 6.71,
    ph: 14.22,
    chl: 16.48,
    currVel: 16.78,
    orp:456,
    sampleTime: "2025-06-26 04:00:00"
  },
]);

const preSea = ref([
  {
    id: 163,
    o: 9.87,
    nh: 0.14,
    no: 0.07,
    temp: 33.65,
    salinity: 33.28,
    turbidity: 6.71,
    ph: 14.22,
    chl: 16.48,
    currVel: 16.78,
    orp:456,
    sampleTime: "2025-06-26 04:00:00"
  },
]);
const selectedDate = ref(null);
const searchByDate = async () => {
  if (!selectedDate.value) {
    ElMessage.warning('请选择查询日期');
    return;
  }
  const date = selectedDate.value;
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  let result = await seaDataByDateService(formattedDate);
  sea.value = result.data;
  hasShowedWarning.value = false;
  refreshCharts();
  
};






const initChart = (domId, title, dataKey, realData, predictedData) => {
  if (sea.value && sea.value.length > 0) {
    dataLoaded.value = true; // 先更新数据加载状态，确保DOM已渲染
    nextTick(() => {
      initData(realData, predictedData, domId, title, dataKey);
    });
  } else {
    console.error('没有可用数据');
    if (!hasShowedWarning.value) {
      ElMessage({
        type: 'warning',
        message: '没有找到数据，请先查询'
      });
      hasShowedWarning.value = true;
    }
  }
};

const initData = (realData, predictedData, domId, title, dataKey) => {
  let lineDom = document.getElementById(domId);
  if (!lineDom) {
    console.error(`未找到 ID 为 ${domId} 的 DOM 元素`);
    return;
  }
  let myChart;
  if (echarts.getInstanceByDom(lineDom)) {
    myChart = echarts.getInstanceByDom(lineDom);
  } else {
    myChart = echarts.init(lineDom);
  }

  // 排序和截取数据（先复制数组避免修改原数据）
  // 预测值和真实值都按时间降序排序，取相同条数的最新数据
  const sortedRealData = [...realData].sort((a, b) => new Date(b.sampleTime) - new Date(a.sampleTime));
  const sortedPredictedData = [...predictedData].sort((a, b) => new Date(b.sampleTime) - new Date(a.sampleTime));
  
  // 取两者中较小的长度，确保数据条数一致
  const dataLength = Math.min(sortedRealData.length, sortedPredictedData.length);
  const latestRealData = sortedRealData.slice(0, dataLength);
  const latestPredictedData = sortedPredictedData.slice(0, dataLength);
  
  // 再按时间升序排列用于图表显示（从旧到新）
  latestRealData.sort((a, b) => new Date(a.sampleTime) - new Date(b.sampleTime));
  latestPredictedData.sort((a, b) => new Date(a.sampleTime) - new Date(b.sampleTime));

  // 指定图表的配置项和数据
  const option = {
    title: {
      text: title,
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#67e8f9'
      },
      padding: [0, 0, 20, 0]
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(10, 14, 26, 0.95)',
      borderColor: '#67e8f9',
      borderWidth: 1,
      padding: 12,
      textStyle: { color: '#fff', fontSize: 14 },
      formatter: function(params) {
        let result = `<div style="font-weight: bold; margin-bottom: 8px; color: #67e8f9;">${params[0].name}</div>`;
        params.forEach(param => {
          const value = typeof param.data === 'object' ? param.data.value : param.data;
          const color = typeof param.data === 'object' && param.data.itemStyle ? param.data.itemStyle.color : '#34D399';
          result += `<div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color}; margin-right: 8px;"></span>
            <span style="color: ${color};">${param.seriesName}: ${value.toFixed(2)}</span>
          </div>`;
        });
        return result;
      }
    },
    legend: {
      data: ['真实值', '预测值'],
      top: 35,
      textStyle: { color: '#67e8f9', fontSize: 14 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      data: latestRealData.map(item => item.sampleTime),
      axisLabel: {
        formatter: (value) => format.formatTime('MM-dd hh:mm', value),
        color: '#67e8f9',
        rotate: 30,
        interval: 2,
        fontSize: 14
      },
      axisLine: { lineStyle: { color: '#67e8f9', width: 2 } },
      axisTick: { lineStyle: { color: '#67e8f9', width: 2 } }
    },
    yAxis: {
      min: getAxisRange(dataKey).min,
      max: getAxisRange(dataKey).max,
      axisLabel: { color: '#67e8f9', fontSize: 14 },
      axisLine: { lineStyle: { color: '#67e8f9', width: 2 } },
      axisTick: { lineStyle: { color: '#67e8f9', width: 2 } },
      splitLine: { lineStyle: { color: 'rgba(6, 182, 212, 0.2)', width: 2 } }
    },
    series: [
      {
        name: '真实值',
        type: 'line',
        data: latestRealData.map(item => {
          const value = item[dataKey]
          const color = getPointColor(value, dataKey)
          const isWarning = color === '#eab308'
          const isDanger = color === '#ef4444'
          return {
            value: value,
            itemStyle: {
              color: color,
              borderWidth: isWarning || isDanger ? 3 : 2,
              borderColor: '#fff',
              shadowBlur: isDanger ? 15 : (isWarning ? 10 : 0),
              shadowColor: color,
              shadowOffsetY: 0
            }
          }
        }),
        lineStyle: { 
          color: '#0e7490',
          width: 2
        },
        symbol: 'circle',
        symbolSize: function(params) {
          const itemStyle = params.data && params.data.itemStyle
          if (itemStyle && itemStyle.color === '#ef4444') return 12
          if (itemStyle && itemStyle.color === '#eab308') return 10
          return 6
        },
        emphasis: {
          symbolSize: 14
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(14, 116, 144, 0.3)' },
            { offset: 1, color: 'rgba(14, 116, 144, 0)' }
          ])
        }
      },
      {
        name: '预测值',
        type: 'line',
        data: latestPredictedData.map(item => item[dataKey]),
        lineStyle: { 
          color: '#00c4ff',
          type: 'dashed',
          width: 2
        },
        itemStyle: {
          color: '#00c4ff',
          borderWidth: 2,
          borderColor: '#fff'
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          symbolSize: 8
        }
      }
    ],
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
};

const refreshCharts = () => {
  initChart('o-chart', '溶解氧(mg/L)', 'o', sea.value, preSea.value);
  initChart('nh-chart', '氨氮(mg/L)', 'nh', sea.value, preSea.value);
  initChart('no-chart', '亚硝酸氮(mg/L)', 'no', sea.value, preSea.value);
  initChart('temp-chart', '水温(℃)', 'temp', sea.value, preSea.value);
  initChart('salinity-chart', '盐度(PSU)', 'salinity', sea.value, preSea.value);
  initChart('turbidity-chart', '浊度(NTU)', 'turbidity', sea.value, preSea.value);
  initChart('ph-chart', 'pH值', 'ph', sea.value, preSea.value);
  initChart('chl-chart', '叶绿素a(μg/L)', 'chl', sea.value, preSea.value);
  initChart('currVel-chart', '洋流流速(cm/s)', 'currVel', sea.value, preSea.value);
  initChart('orp-chart', '氧化还原电位（mv）', 'orp', sea.value, preSea.value);
};

onMounted(async () => {
  // 页面加载时自动查询今天的数据
  let result = await request.get('/seaData/today');
  let result2 = await request.get('/seaData/preToday');
  sea.value = result.data;
  preSea.value = result2.data;
  hasShowedWarning.value = false;
  refreshCharts();
  dataLoaded.value = true;
});

const DataRefresh = async () => {
  try {
   
    ElMessage({
      type: 'success',
      message: '刷新成功',
    });
    hasShowedWarning.value = false;
    // 重新初始化图表
    refreshCharts();
  } catch (error) {
    console.error('错误:', error);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-2xl);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  border: var(--border-tech);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    opacity: 0.5;
  }
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl);
  max-width: 1800px;
  margin: 0 auto;
}

.chart-container > div {
  background: var(--tech-blue-800);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  border: var(--border-tech);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
  height: 450px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    opacity: 0.5;
    transition: opacity var(--transition-base);
  }
  
  &:hover {
    border-color: var(--tech-blue-500);
    box-shadow: var(--shadow-lg), var(--glow-sm);
    transform: translateY(-4px);
    
    &::before {
      opacity: 1;
    }
  }
}

// 图表标题样式 - 青色
:deep(.echarts-title) {
  color: #67e8f9 !important;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

// 图表数据样式 - 浅蓝色
:deep(.echarts-series) {
  color: var(--tech-blue-400) !important;
}

// 图表轴线样式
:deep(.echarts-axis-line) {
  stroke: var(--tech-blue-500) !important;
}

// 图表网格线样式
:deep(.echarts-grid-line) {
  stroke: rgba(59, 130, 246, 0.2) !important;
}

// 图表标签样式
:deep(.echarts-label) {
  color: var(--tech-blue-400) !important;
  fill: var(--tech-blue-400) !important;
}

// 按钮样式优化
:deep(.el-button) {
  &.el-button--primary {
    background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
    border: 1px solid rgba(6, 182, 212, 0.5);
    color: #0e4a55;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
    
    &:hover {
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
      border-color: rgba(6, 182, 212, 0.8);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
    }
  }
  
  &.el-button--success {
    background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%);
    border: 1px solid rgba(6, 182, 212, 0.5);
    color: #0e4a55;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
    
    &:hover {
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
      border-color: rgba(6, 182, 212, 0.8);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.6);
    }
  }
}

// 日期选择器样式优化
:deep(.el-date-editor) {
  .el-input__inner {
    background: rgba(10, 14, 26, 0.6);
    border: var(--border-tech);
    color: var(--tech-blue-400);
    
    &:hover {
      border-color: rgba(59, 130, 246, 0.4);
    }
    
    &:focus {
      border-color: var(--tech-blue-500);
      box-shadow: var(--glow-sm);
    }
  }
  
  .el-input__prefix {
    color: var(--tech-blue-400);
  }
}

@media (max-width: 1200px) {
  .chart-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .chart-container > div {
    height: 300px;
  }
  
  .button-container {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>