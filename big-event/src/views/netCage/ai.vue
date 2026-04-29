<template>
  <div class="ai-decision-container">
    <div class="header">
      <h1>关键因子多协同研判</h1>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="toggleDataRange">
          {{ dataRange === 'recent10' ? '近10条数据' : '最新1条数据' }}
        </el-button>
      </div>
    </div>

    <div class="main-grid">
      <!-- 左侧图表区域 -->
      <div class="chart-section">
        <div v-if="dataRange === 'recent10'" class="charts-grid-line">
          <div v-for="(item, index) in chartDataList" :key="index" class="chart-item">
            <div :id="'chart-' + index" class="chart-box-small"></div>
            <div class="chart-title" :style="{ color: item.color }">{{ item.name }}</div>
          </div>
        </div>
        <div v-else class="charts-grid-gauge">
          <div v-for="(item, index) in chartDataList" :key="index" class="gauge-card" :style="{ borderColor: item.color + '40' }">
            <div class="gauge-icon" v-html="getIconSvg(index)"></div>
            <div class="gauge-title" :style="{ color: item.color }">{{ item.name }}</div>
            <div :id="'gauge-' + index" class="gauge-chart"></div>
            <div class="gauge-value" :style="{ color: item.color }">
              {{ item.data[0] }}{{ item.unit }}
            </div>
            <div class="gauge-status" :class="getStatusClass(item.data[0], index)">
              {{ getStatusText(item.data[0], index) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-section">
        <!-- 视频监控 -->
        <div class="video-panel">
          <div class="video-header">
            <span class="video-time">Real-Time: {{ currentTime }}</span>
            <button class="rec-btn" :class="{ recording: isRecording }" @click="toggleRecording">
              <span class="rec-dot"></span>
              REC
            </button>
          </div>
          <div class="video-content">
            <video 
              ref="videoPlayer" 
              class="video-player" 
              :src="oceanVideoUrl"
              autoplay 
              muted 
              loop
              playsinline
              preload="auto"
              @loadeddata="handleVideoReady"
              @canplay="handleVideoReady"
              @playing="handleVideoReady"
              @error="handleVideoError"
            >
            </video>
            <div v-if="videoStatus === 'loading'" class="video-placeholder">
              <svg class="loading-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <p>视频加载中...</p>
            </div>
            <div v-else-if="videoStatus === 'error'" class="video-placeholder video-error">
              <svg class="error-svg-icon" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <p>视频加载失败</p>
              <button class="retry-btn" @click="initVideo">重新加载</button>
            </div>
          </div>
          <div class="video-footer">
            <span class="live-badge">
              <span class="live-dot"></span>
              Live Online
            </span>
            <span class="live-time">Real-Time: {{ currentTime }}</span>
          </div>
        </div>

        <!-- AI决策建议 -->
        <div class="decision-panel" :class="{ disabled: !aiEnabled }">
          <div class="decision-header">
            <div class="decision-title-wrapper">
              <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="13" x2="13" y2="13"/>
                <line x1="9" y1="17" x2="11" y2="17"/>
              </svg>
              <h3>智能协同研判结果</h3>
            </div>
            <div class="status-indicators">
              <span class="status-item good" :class="{ active: decisionStatus === 'good' }">
                <span class="status-dot"></span>良好
              </span>
              <span class="status-item warning" :class="{ active: decisionStatus === 'warning' }">
                <span class="status-dot"></span>预警
              </span>
              <span class="status-item danger" :class="{ active: decisionStatus === 'danger' }">
                <span class="status-dot"></span>异常
              </span>
            </div>
            <el-switch
              v-model="aiEnabled"
              active-text="开启"
              inactive-text="关闭"
              inline-prompt
              style="--el-switch-on-color: #06b6d4; --el-switch-off-color: #4b5563;"
            />
          </div>

          <div v-if="aiEnabled" class="decision-content">
            <div class="decision-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <h4>大模型建议：</h4>
              </div>
              <p>{{ aiSuggestion.mainAdvice }}</p>
            </div>

            <div class="decision-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <h4>分析摘要：</h4>
              </div>
              <p>{{ aiSuggestion.analysisSummary }}</p>
            </div>

            <div class="decision-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <h4>操作建议：</h4>
              </div>
              <p>{{ aiSuggestion.operationAdvice }}</p>
            </div>

            <div class="decision-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <h4>未来12小时预警：</h4>
              </div>
              <p>{{ aiSuggestion.futureWarning }}</p>
            </div>

            <div class="decision-section">
              <div class="section-header">
                <svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <h4>依据：</h4>
              </div>
              <p>{{ aiSuggestion.basis }}</p>
            </div>
          </div>

          <div v-else class="decision-disabled">
            <svg class="disabled-icon" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <p>AI决策模块已关闭</p>
            <p class="disabled-hint">点击右上角开关启用智能分析</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-info">
      <span>广东海洋大学 - 海大识鱼团队</span>
      <span>Tech Vision System v2.0</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import oceanVideoUrl from '@/assets/ocean-video.mp4'
import { seaDataLatestTenService, seaDataLatestService } from '@/api/sea.js'

const dataRange = ref('recent10')
const isRecording = ref(false)
const videoStatus = ref('loading')
const aiEnabled = ref(true)
const decisionStatus = ref('good')
const currentTime = ref('')
const videoPlayer = ref(null)

// 后端数据
const seaDataList = ref([]) // 最新十条数据
const latestSeaData = ref(null) // 最新一条数据

let charts = []
let timeInterval = null

const chartDataList = [
  { name: '温度', key: 'temp', unit: '°C', color: '#60A5FA', data: [], min: 20, max: 35, optimalMin: 25, optimalMax: 30 },
  { name: '氨氮', key: 'nh', unit: 'mg/L', color: '#34D399', data: [], min: 0, max: 0.5, optimalMin: 0, optimalMax: 0.2 },
  { name: '溶解氧 (DO)', key: 'do', unit: 'mg/L', color: '#F87171', data: [], min: 5, max: 10, optimalMin: 6.5, optimalMax: 8 },
  { name: 'pH值', key: 'ph', unit: '', color: '#FBBF24', data: [], min: 0, max: 14, optimalMin: 6.5, optimalMax: 8.5 },
  { name: '浊度', key: 'turbidity', unit: 'NTU', color: '#A78BFA', data: [], min: 0, max: 25, optimalMin: 0, optimalMax: 10 }
]

const iconSvgs = [
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0-6v6m18-6v6"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2m4-4a4 4 0 0 1 8 0m4 4h2M12 2v4m0 12v4m-8-8a4 4 0 0 1 0-8m8 8a4 4 0 0 1 0-8"/></svg>`
]

const getIconSvg = (index) => {
  return iconSvgs[index] || iconSvgs[0]
}

const aiSuggestion = ref({
  mainAdvice: '基于水质数据和鱼群监测，当前状态良好。',
  analysisSummary: 'DO和pH处于最佳水平，鱼群活动正常',
  operationAdvice: '维持当前投喂计划和运维',
  futureWarning: 'pH值有轻微上升趋势，建议加强监测',
  basis: 'DO最佳，pH良好，视频无异常'
})

const getStatusText = (value, index) => {
  const item = chartDataList[index]
  if (!item) return '正常'
  
  if (value >= item.optimalMin && value <= item.optimalMax) {
    return '正常'
  } else if (value < item.optimalMin * 0.9 || value > item.optimalMax * 1.1) {
    return '异常'
  } else {
    return '偏高/偏低'
  }
}

const getStatusClass = (value, index) => {
  const status = getStatusText(value, index)
  if (status === '正常') return 'status-good'
  if (status === '异常') return 'status-danger'
  return 'status-warning'
}

// 获取最新十条数据
const getLatestTenData = async () => {
  try {
    const response = await seaDataLatestTenService()
    console.log('后端响应:', response)
    // axios拦截器已经返回了result.data，所以response直接就是{code, message, data}
    // response.data才是数据数组
    if (response && response.data && Array.isArray(response.data)) {
      seaDataList.value = response.data
      console.log('获取到的数据:', response.data)
      updateChartDataFromBackend(response.data)
      console.log('更新后的时间:', window.seaDataTimes)
      console.log('更新后的温度数据:', chartDataList[0].data)
    } else {
      console.log('响应数据格式不正确:', response)
      generateMockData(10)
    }
  } catch (error) {
    console.error('获取最新十条数据失败:', error)
    generateMockData(10)
  }
}

// 获取最新一条数据（用于仪表盘显示，不覆盖图表数据）
const getLatestData = async () => {
  try {
    const response = await seaDataLatestService()
    // axios拦截器已经返回了result.data
    if (response && response.data) {
      const data = response.data
      latestSeaData.value = Array.isArray(data) ? data[0] : data
      // 如果还没有后端数据，才更新图表
      if (!window.seaDataTimes || window.seaDataTimes.length === 0) {
        updateChartDataFromBackend(Array.isArray(data) ? data : [data])
      }
    }
  } catch (error) {
    console.error('获取最新一条数据失败:', error)
    if (!window.seaDataTimes || window.seaDataTimes.length === 0) {
      generateMockData(1)
    }
  }
}

// 从后端数据更新图表数据（温度、盐度、溶解氧、pH值、浊度）
const updateChartDataFromBackend = (data) => {
  if (!data || data.length === 0) return

  // 确保数据按时间正序排列（最早的数据在前，最新的数据在后），使最新数据显示在图表最右边
  const sortedData = [...data].sort((a, b) => {
    const timeA = a.sampleTime ? new Date(a.sampleTime) : new Date(0)
    const timeB = b.sampleTime ? new Date(b.sampleTime) : new Date(0)
    return timeA - timeB
  })

  const times = sortedData.map(item => {
    if (item.sampleTime) {
      const timeStr = item.sampleTime.toString()
      if (timeStr.includes('T')) {
        return timeStr.split('T')[1]?.substring(0, 5) || timeStr
      }
      if (timeStr.length >= 16) {
        return timeStr.substring(11, 16)
      }
      return timeStr
    }
    return ''
  }).filter(t => t)

  if (times.length === 0) {
    const now = new Date()
    for (let i = reversedData.length - 1; i >= 0; i--) {
      const time = new Date(now - i * 3600000)
      times.push(time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'))
    }
  }

  // 映射后端数据到图表：温度、氨氮、溶解氧、pH值、浊度
  chartDataList[0].data = sortedData.map(item => parseFloat(item.temp) || 28)
  chartDataList[1].data = sortedData.map(item => parseFloat(item.nh) || 0.1)
  chartDataList[2].data = sortedData.map(item => parseFloat(item.o) || 7)
  chartDataList[3].data = sortedData.map(item => parseFloat(item.ph) || 6.7)
  chartDataList[4].data = sortedData.map(item => parseFloat(item.turbidity) || 1)

  window.seaDataTimes = times
}

const generateMockData = (count) => {
  const times = []
  const now = new Date()
  
  if (count === 1) {
    times.push(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'))
  } else {
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now - i * 3600000)
      times.push(time.getHours().toString().padStart(2, '0') + ':' + time.getMinutes().toString().padStart(2, '0'))
    }
  }

  chartDataList.forEach((item, index) => {
    let baseValue, variance
    switch(index) {
      case 0:
        baseValue = 28
        variance = 2
        break
      case 1:
        baseValue = 30
        variance = 0.5
        break
      case 2:
        baseValue = 7
        variance = 1
        break
      case 3:
        baseValue = 6.7
        variance = 0.2
        break
      case 4:
        baseValue = 1
        variance = 0.5
        break
    }

    item.data = times.map((_, i) => {
      return +(baseValue + (Math.random() - 0.5) * variance).toFixed(2)
    })
  })

  return times
}

const initLineCharts = () => {
  const count = 10
  // 优先使用后端数据的时间，否则使用模拟数据
  const times = window.seaDataTimes && window.seaDataTimes.length > 0 
    ? window.seaDataTimes 
    : generateMockData(count)

  charts.forEach(chart => chart.dispose())
  charts = []

  chartDataList.forEach((item, index) => {
    const dom = document.getElementById('chart-' + index)
    if (!dom) return

    const chart = echarts.init(dom)
    charts.push(chart)

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        textStyle: { color: '#93C5FD' },
        formatter: (params) => {
          const param = params[0]
          return `${param.name}<br/>${param.marker} ${param.value}${item.unit || ''}`
        }
      },
      grid: {
        left: '10%',
        right: '5%',
        bottom: '15%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: item.data.map((_, i) => times[i] || `${i}:00`),
        axisLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.3)' } },
        axisLabel: { 
          color: '#93C5FD', 
          fontSize: 9,
          interval: Math.floor(count / 3)
        }
      },
      yAxis: {
        type: 'value',
        min: item.min,
        max: item.max,
        name: item.unit || '',
        nameTextStyle: {
          color: '#93C5FD',
          fontSize: 10,
          padding: [0, 40, 0, 0]
        },
        axisLine: { show: true, lineStyle: { color: 'rgba(59, 130, 246, 0.3)' } },
        axisLabel: { 
          color: '#93C5FD', 
          fontSize: 9,
          formatter: (value) => {
            // 根据数据类型设置不同精度
            const key = item.key
            if (key === 'nh') {
              // 氨氮：保留3位小数
              return value.toFixed(3)
            } else if (key === 'temp' || key === 'o') {
              // 温度、溶解氧：保留1位小数
              return value.toFixed(1)
            } else if (key === 'turbidity') {
              // 浊度：保留1位小数
              return value.toFixed(1)
            } else if (key === 'ph') {
              // pH值：保留1位小数
              return value.toFixed(1)
            }
            return value.toString()
          },
          margin: 10
        },
        axisTick: { show: true },
        splitLine: { lineStyle: { color: 'rgba(59, 130, 246, 0.1)' } }
      },
      series: [{
        type: 'line',
        smooth: true,
        data: item.data,
        lineStyle: { width: 2, color: item.color },
        itemStyle: { 
          color: item.color,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: item.color + '40' },
            { offset: 1, color: item.color + '05' }
          ])
        },
        symbol: 'circle',
        symbolSize: 6
      }],
      animationDuration: 800
    }

    chart.setOption(option)
  })
}

const initGaugeCharts = () => {
  // 如果没有后端数据，使用模拟数据
  if (!latestSeaData.value && !window.seaDataTimes) {
    generateMockData(1)
  }

  charts.forEach(chart => chart.dispose())
  charts = []

  chartDataList.forEach((item, index) => {
    const dom = document.getElementById('gauge-' + index)
    if (!dom) return

    const chart = echarts.init(dom)
    charts.push(chart)

    const currentValue = parseFloat(item.data[0])
    
    let gaugeColor = '#34d399'
    if (currentValue < item.optimalMin || currentValue > item.optimalMax) {
      gaugeColor = '#fbbf24'
    }
    if (currentValue < item.min * 1.05 || currentValue > item.max * 0.95) {
      gaugeColor = '#f87171'
    }

    const option = {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: item.min,
        max: item.max,
        splitNumber: 5,
        radius: '90%',
        center: ['50%', '70%'],
        itemStyle: {
          color: gaugeColor
        },
        progress: {
          show: true,
          width: 12,
          roundCap: true,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: item.color + '80' },
              { offset: 1, color: item.color }
            ])
          }
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(59, 130, 246, 0.1)']]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          show: false
        },
        data: [{
          value: currentValue
        }]
      }],
      animationDuration: 1000,
      animationEasingUpdate: 'cubicInOut'
    }

    chart.setOption(option)
  })
}

const initCharts = () => {
  if (dataRange.value === 'recent10') {
    initLineCharts()
  } else {
    initGaugeCharts()
  }
}

const toggleDataRange = async () => {
  dataRange.value = dataRange.value === 'recent10' ? 'latest1' : 'recent10'
  await nextTick()
  initCharts()
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0')
}

const handleVideoReady = () => {
  videoStatus.value = 'playing'
}

const handleVideoError = () => {
  videoStatus.value = 'error'
}

const initVideo = async () => {
  videoStatus.value = 'loading'

  await nextTick()

  const video = videoPlayer.value
  if (!video) return

  video.pause()
  video.currentTime = 0
  video.load()

  if (video.readyState >= 2) {
    videoStatus.value = 'playing'
  }

  try {
    await video.play()
    videoStatus.value = 'playing'
  } catch (error) {
    if (video.readyState < 2) {
      videoStatus.value = 'error'
    }
  }
}

watch(aiEnabled, (newVal) => {
  if (!newVal) {
    decisionStatus.value = ''
  } else {
    const statuses = ['good', 'warning', 'danger']
    decisionStatus.value = statuses[Math.floor(Math.random() * 3)]
  }
})

onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  // 获取后端数据（温度、盐度、溶解氧、pH值、浊度）
  await getLatestTenData()
  await getLatestData()

  await nextTick()
  initCharts()
  initVideo()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  charts.forEach(chart => chart.dispose())
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  charts.forEach(chart => chart.resize())
}
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

.ai-decision-container {
  min-height: calc(100vh - 120px);
  padding: 20px;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #60A5FA, #3B82F6, #8B5CF6);
    opacity: 0.8;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(6, 182, 212, 0.3);
    margin-bottom: 20px;
    border-radius: var(--radius-md);

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: #67e8f9;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    min-height: calc(100vh - 250px);
  }
}

.chart-section {
  background: rgba(17, 24, 39, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: var(--radius-lg);
  padding: 16px;
  display: flex;
  flex-direction: column;

  .charts-grid-line {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 16px;
    flex: 1;

    .chart-item {
      background: rgba(10, 14, 26, 0.6);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-md);
      padding: 12px;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(59, 130, 246, 0.4);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
        transform: translateY(-2px);
      }

      &:first-child {
        grid-column: 1 / -1;
      }

      .chart-box-small {
        flex: 1;
        min-height: 120px;
      }

      .chart-title {
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(59, 130, 246, 0.2);
      }
    }
  }

  .charts-grid-gauge {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 16px;
    flex: 1;

    .gauge-card {
      background: linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%);
      border: 2px solid;
      border-radius: var(--radius-lg);
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: currentColor;
        opacity: 0.3;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }

      .gauge-icon {
        width: 40px;
        height: 40px;
        margin-bottom: 8px;
        
        svg {
          width: 100%;
          height: 100%;
          color: #93C5FD;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          transition: all 0.3s ease;
        }
      }

      &:hover .gauge-icon svg {
        transform: scale(1.1);
        filter: drop-shadow(0 4px 8px rgba(147, 197, 253, 0.4));
      }

      .gauge-title {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin-bottom: 8px;
      }

      .gauge-chart {
        width: 140px;
        height: 100px;
        flex-shrink: 0;
      }

      .gauge-value {
        font-size: 28px;
        font-weight: 900;
        font-family: 'Courier New', monospace;
        margin: 12px 0 8px 0;
        text-shadow: 0 0 20px currentColor;
        letter-spacing: -1px;
      }

      .gauge-status {
        font-size: 13px;
        font-weight: 600;
        padding: 4px 16px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;

        &.status-good {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        &.status-warning {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        &.status-danger {
          background: rgba(248, 113, 113, 0.15);
          color: #f87171;
          border: 1px solid rgba(248, 113, 113, 0.3);
          animation: pulse-warning 2s infinite;
        }
      }
    }
  }
}

.right-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-panel {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: var(--radius-lg);
  overflow: hidden;
  flex: 1;

  .video-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(10, 14, 26, 0.8);
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);

    .video-time {
      color: #67e8f9;
      font-size: 13px;
      font-family: monospace;
    }

    .rec-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
      border-radius: 20px;
      color: #f87171;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: scale(1.05);
      }

      &.recording {
        background: rgba(239, 68, 68, 0.6);
        animation: pulse-recording 1.5s infinite;
      }

      .rec-dot {
        width: 8px;
        height: 8px;
        background: #f87171;
        border-radius: 50%;
      }
    }
  }

  .video-content {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
    overflow: hidden;

    .video-player {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-placeholder {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(180deg, #0c1929 0%, #082f49 100%);

      .loading-icon {
        width: 64px;
        height: 64px;
        color: #06b6d4;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
      }

      .error-svg-icon {
        width: 72px;
        height: 72px;
        margin-bottom: 16px;
      }

      p {
        color: #67e8f9;
        font-size: 14px;
      }

      &.video-error {
        background: linear-gradient(180deg, #1a0a0a 0%, #2d1010 100%);

        p {
          color: #f87171;
          font-size: 16px;
          font-weight: 600;
        }

        .retry-btn {
          margin-top: 16px;
          padding: 8px 24px;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 20px;
          color: #f87171;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(239, 68, 68, 0.4);
            transform: scale(1.05);
          }
        }
      }
    }
  }

  .video-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    background: rgba(10, 14, 26, 0.8);
    border-top: 1px solid rgba(59, 130, 246, 0.2);

    .live-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #34d399;
      font-size: 13px;
      font-weight: 600;

      .live-dot {
        width: 8px;
        height: 8px;
        background: #34d399;
        border-radius: 50%;
        animation: pulse-live 2s infinite;
      }
    }

    .live-time {
      color: #67e8f9;
      font-size: 12px;
      font-family: monospace;
    }
  }
}

.decision-panel {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: var(--radius-lg);
  overflow: hidden;
  flex: 1;
  transition: all 0.3s ease;

  &.disabled {
    opacity: 0.6;
    filter: grayscale(50%);
  }

  .decision-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    background: rgba(10, 14, 26, 0.8);
    border-bottom: 1px solid rgba(59, 130, 246, 0.2);

    .decision-title-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      .ai-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
      }

      h3 {
        color: #67e8f9;
        font-size: 15px;
        font-weight: 600;
        margin: 0;
      }
    }

    .status-indicators {
      display: flex;
      gap: 16px;

      .status-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #9ca3af;
        transition: all 0.3s ease;
        opacity: 0.5;

        &.active {
          opacity: 1;
          transform: scale(1.05);
        }

        &.good.active {
          color: #34d399;
        }

        &.warning.active {
          color: #fbbf24;
        }

        &.danger.active {
          color: #f87171;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }
      }
    }
  }

  .decision-content {
    padding: 16px;
    max-height: 300px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(10, 14, 26, 0.4);
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(59, 130, 246, 0.4);
      border-radius: 3px;
    }

    .decision-section {
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(59, 130, 246, 0.1);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;

        .section-icon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        h4 {
          color: #67e8f9;
          font-size: 13px;
          font-weight: 600;
          margin: 0;
        }
      }

      p {
        color: #93c5fd;
        font-size: 13px;
        line-height: 1.6;
        margin: 0;
        padding-left: 26px;
      }
    }
  }

  .decision-disabled {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;

    .disabled-icon {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    p {
      color: #9ca3af;
      font-size: 14px;
      margin: 4px 0;

      &.disabled-hint {
        font-size: 12px;
        color: #6b7280;
      }
    }
  }
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  color: #6b7280;
  font-size: 12px;
}

@keyframes pulse-recording {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
  }
}

@keyframes pulse-live {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-warning {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr !important;
  }

  .charts-grid-line {
    grid-template-columns: 1fr !important;

    .chart-item:first-child {
      grid-column: auto !important;
    }
  }

  .charts-grid-gauge {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
