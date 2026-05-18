# 南海智能化牧场数据监测平台

Ocean Ranch Monitor System - 面向南海海域的智能化水产养殖监测与管理平台

## 项目概述

南海智能化牧场数据监测平台是一套基于 Vue 3 + Vite 构建的现代化水产养殖管理系统。平台整合了水质监测、鱼群估产、网箱管理、气象预警、设备维护等多功能模块，为海洋牧场提供全方位的数据可视化与智能决策支持。

## 核心功能

### 数据监测模块
- **水质数据同步** - 实时采集与展示水温、pH值、溶氧量、氨氮等关键水质指标
- **水质监测预测** - 基于历史数据的水质趋势分析与预警
- **水下鱼群智能估产** - 利用AI技术对网箱内鱼群数量与重量进行估算

### 养殖监控模块
- **网箱信息管理** - 网箱设备信息维护与状态监控
- **气象信息服务** - 海域气象数据集成与极端天气预警
- **设备维护管理** - 养殖设备台账管理与维护计划制定
- **养殖储备信息** - 养殖品种、存量、饲料等物资管理

### 智能决策模块
- **关键因子多协同研判** - 多维度环境因子综合分析，辅助养殖决策
- **智能助手** - AI驱动的养殖知识问答与建议系统

## 技术栈

### 前端框架
- **Vue 3** - 渐进式JavaScript框架，采用 Composition API
- **Vite 5** - 新一代前端构建工具，开发体验优异
- **Vue Router 4** - 官方路由管理
- **Pinia** - 新一代状态管理库，支持状态持久化

### UI 组件
- **Element Plus** - 基于 Vue 3 的组件库，提供丰富的企业级UI组件
- **SCSS** - 强大的CSS预处理器，支持变量、混入等高级特性

### 数据可视化
- **ECharts 5** - 百度开源的可视化图表库，支持丰富的图表类型
- **Chart.js 4** - 简洁而强大的HTML5图表库

### 网络与工具
- **Axios** - Promise HTTP 客户端，用于API请求
- **vform3-builds** - 表单设计与渲染解决方案

## 项目结构

```
big-event/
├── public/                 # 静态公共资源
├── src/
│   ├── api/               # API 接口封装
│   │   ├── cage.js        # 网箱相关接口
│   │   ├── eqp.js         # 设备相关接口
│   │   ├── fishMonitoring.js # 鱼类监测接口
│   │   ├── methods.js      # 通用方法接口
│   │   ├── reserve.js      # 储备信息接口
│   │   ├── sea.js          # 海洋数据接口
│   │   ├── user.js         # 用户相关接口
│   │   └── weather.js      # 气象数据接口
│   ├── assets/            # 应用资源（图片、样式、视频）
│   ├── router/             # 路由配置
│   │   └── index.js
│   ├── stores/             # Pinia 状态管理
│   │   ├── token.js        # Token 状态管理
│   │   └── userInfo.js      # 用户信息状态
│   ├── utils/              # 工具函数
│   │   └── request.js       # Axios 请求封装
│   ├── views/              # 页面组件
│   │   ├── netCage/         # 网箱模块页面
│   │   │   ├── ai.vue       # AI决策分析
│   │   │   ├── cage.vue     # 网箱信息
│   │   │   ├── chat.vue     # 智能助手
│   │   │   ├── eqp.vue      # 设备管理
│   │   │   ├── fish_ai_yield.vue  # 鱼群估产
│   │   │   ├── methods.vue  # 方法记录
│   │   │   ├── reserve.vue  # 储备信息
│   │   │   ├── t.vue        # 测试页面
│   │   │   └── weather.vue  # 气象信息
│   │   ├── user/            # 用户模块
│   │   ├── water/           # 水质监测模块
│   │   ├── Layout.vue       # 主布局组件
│   │   └── Login.vue        # 登录页面
│   ├── App.vue              # 根组件
│   └── main.js              # 应用入口
├── index.html               # HTML 入口文件
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── jsconfig.json            # JavaScript 配置
```

## 环境要求

- **Node.js**: >= 16.x
- **npm**: >= 8.x 或 **pnpm** >= 8.x

## 安装与配置

### 1. 克隆项目
```bash
git clone <repository-url>
cd big-event
```

### 2. 安装依赖
```bash
npm install
# 或使用 pnpm
pnpm install
```

### 3. 启动开发服务器
```bash
npm run dev
```
访问地址：http://localhost:5173

### 4. 生产构建
```bash
npm run build
```

### 5. 预览生产构建
```bash
npm run preview
```

## 页面路由

| 路由 | 页面名称 | 描述 |
|------|---------|------|
| `/` | Login | 登录页面 |
| `/sea` | 水质数据同步 | 实时水质数据展示 |
| `/water` | 水质监测预测 | 水质趋势分析图表 |
| `/fish` | 水下鱼群智能估产 | AI鱼群数量估算 |
| `/cage` | 网箱信息 | 网箱设备管理 |
| `/weather` | 气象信息 | 气象数据展示 |
| `/eqp` | 设备维护 | 设备台账与维护 |
| `/reserve` | 养殖储备信息 | 物资库存管理 |
| `/chat` | 智能助手 | AI问答系统 |

## API 接口规范

项目 API 请求基于 Axios 封装，统一拦截器处理请求与响应。

### 请求示例
```javascript
import { cageListService } from '@/api/cage'

// 获取网箱列表
const result = await cageListService()
```

### 响应格式
```javascript
{
  code: 200,      // 状态码
  message: '',   // 消息
  data: {}       // 数据
}
```

## 状态管理

项目使用 Pinia 进行状态管理，并配置了持久化插件：

- **token.js** - 用户认证 Token 状态
- **userInfo.js** - 用户信息状态

状态自动持久化到 localStorage，保证页面刷新后登录状态不丢失。

## 开发规范

### 组件规范
- 使用 `<script setup>` 语法糖
- 组件文件使用 PascalCase 命名
- 样式使用 SCSS，遵循 BEM 命名规范

### API 接口规范
- 接口按模块拆分到 `src/api` 目录
- 使用 RESTful API 设计规范
- 统一错误处理与 Loading 状态

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

## 浏览器兼容

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 贡献规范

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目仅供内部使用，如需商用请联系相关授权。

## 联系方式

- **项目维护**: 南海智能化牧场开发团队
- **技术邮箱**: support@oceanranch.example.com

---

© 2024 南海智能化牧场数据监测平台 All Rights Reserved
