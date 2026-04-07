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

  // 排序和截取数据
  const sortedRealData = realData.sort((a, b) => new Date(a.sampleTime) - new Date(b.sampleTime));
  const sortedPredictedData = predictedData.sort((a, b) => new Date(a.sampleTime) - new Date(b.sampleTime));

  // 指定图表的配置项和数据
  const option = {
    title: {
      text: title,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a56db'
      },
      padding: [0, 0, 15, 0]
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#1a56db',
      borderWidth: 1,
      padding: 10,
      textStyle: { color: '#333' },
      formatter: function(params) {
        return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].data.toFixed(2)}<br/>${params[1].seriesName}: ${params[1].data.toFixed(2)}`;
      }
    },
    legend: {
      data: ['真实值', '预测值'],
      top: 30,
      textStyle: { color: '#666' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      data: sortedRealData.map(item => item.sampleTime),
      axisLabel: {
        formatter: (value) => format.formatTime('MM-dd hh:mm', value),
        color: '#666',
        rotate: 30,
        interval: 2
      },
      axisLine: { lineStyle: { color: '#e0e0e0' } }
    },
    yAxis: {
      axisLabel: { color: '#666' },
      axisLine: { lineStyle: { color: '#e0e0e0' } },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '真实值',
        type: 'line',
        data: sortedRealData.map(item => item[dataKey]),
        lineStyle: { 
          color: '#1a56db',
          width: 2
        },
        itemStyle: {
          color: '#1a56db',
          borderWidth: 2,
          borderColor: '#fff'
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          symbolSize: 8
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(26, 86, 219, 0.3)' },
            { offset: 1, color: 'rgba(26, 86, 219, 0)' }
          ])
        }
      },
      {
        name: '预测值',
        type: 'line',
        data: sortedPredictedData.map(item => item[dataKey]),
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
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 30px;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.chart-container > div {
  width: 90%;
  margin: 0 auto;
  height: 350px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  transition: transform 0.2s ease;
}

.chart-container > div:hover {
  transform: translateY(-5px);
}

@media (max-width: 1200px) {
  .chart-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
    padding: 10px;
  }
  
  .chart-container > div {
    height: 300px;
  }
}
</style>