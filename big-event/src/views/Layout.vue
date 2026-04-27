<template>
  <el-container class="tech-layout">
    <!-- 科技风侧边栏 -->
    <el-aside width="240px" class="tech-aside">
      <div class="aside-header">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M50 15 Q70 35 70 50 Q70 65 50 85 Q30 65 30 50 Q30 35 50 15" fill="none" stroke="currentColor" stroke-width="2"/>
              <circle cx="50" cy="50" r="8" fill="currentColor"/>
              <path d="M20 50 Q35 45 50 50 Q65 55 80 50" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M25 60 Q40 55 50 60 Q60 65 75 60" fill="none" stroke="currentColor" stroke-width="1"/>
            </svg>
          </div>
          <div class="logo-text">
            <h1 class="system-name">南海智慧牧场</h1>
            <p class="system-name-en">Ocean Ranch Monitor</p>
          </div>
        </div>
      </div>

      <el-menu
        :default-active="$route.path"
        background-color="transparent"
        text-color="var(--tech-silver-400)"
        active-text-color="var(--tech-cyan-400)"
        router
        class="tech-menu"
      >
        <div class="menu-section">
          <div class="menu-section-title">
            <span class="section-icon">
              <DataAnalysis />
            </span>
            数据监测
          </div>
          
          <el-menu-item index="/sea">
            <el-icon class="menu-icon"><Link /></el-icon>
            <span>水质数据同步</span>
          </el-menu-item>

          <el-menu-item index="/water">
            <el-icon class="menu-icon"><Monitor /></el-icon>
            <span>水质监测预测</span>
          </el-menu-item>

          <el-menu-item index="/fish">
            <el-icon class="menu-icon"><Coin /></el-icon>
            <span>水下鱼群智能估产</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <div class="menu-section-title">
            <span class="section-icon">
              <VideoCamera />
            </span>
            养殖监控
          </div>
          
          <el-menu-item index="/cage">
            <el-icon class="menu-icon"><DataAnalysis /></el-icon>
            <span>网箱信息</span>
          </el-menu-item>

          <el-menu-item index="/weather">
            <el-icon class="menu-icon"><MostlyCloudy /></el-icon>
            <span>气象信息</span>
          </el-menu-item>

          <el-menu-item index="/eqp">
            <el-icon class="menu-icon"><Monitor /></el-icon>
            <span>设备维护</span>
          </el-menu-item>

          <el-menu-item index="/reserve">
            <el-icon class="menu-icon"><View /></el-icon>
            <span>养殖储备信息</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <div class="menu-section-title">
            <span class="section-icon">
              <CreditCard />
            </span>
            鱼类追踪
          </div>
          
          <el-menu-item index="/pit">
            <el-icon class="menu-icon"><CreditCard /></el-icon>
            <span>鱼类监测系统</span>
          </el-menu-item>

          <el-menu-item index="/pit3">
            <el-icon class="menu-icon"><CreditCard /></el-icon>
            <span>PIT游泳动物跟踪遥测</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <div class="menu-section-title">
            <span class="section-icon">
              <Cpu />
            </span>
            AI决策
          </div>
          
          <el-menu-item index="/ai">
            <el-icon class="menu-icon"><MagicStick /></el-icon>
            <span>AI决策</span>
          </el-menu-item>
        </div>
      </el-menu>

      <div class="aside-footer">
        <div class="university-info">
          <p>广东海洋大学</p>
          <p class="college">海大识鱼团队</p>
        </div>
      </div>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container class="main-container">
      <!-- 科技风头部 -->
      <el-header class="tech-header">
        <div class="header-left">
          <div class="breadcrumb">
            <span class="breadcrumb-item">首页</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item active">{{ $route.name || '数据监测' }}</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="user-info">
            <el-dropdown placement="bottom-end" @command="handleCommand">
              <span class="el-dropdown__box">
                <el-avatar
                  :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar"
                  class="user-avatar"
                />
                <div class="user-details">
                  <span class="user-name">{{ userInfoStore.info.nickname }}</span> 
                  <span class="user-role">研究员</span>
                </div>
                <el-icon class="dropdown-icon"><CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu class="tech-dropdown">
                  <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                  <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                  <el-dropdown-item command="resetPassword" :icon="EditPen">重置密码</el-dropdown-item>
                  <el-dropdown-item divided command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <!-- 中间主内容区 -->
      <el-main class="tech-main">
        <router-view></router-view>
      </el-main>

      <!-- 科技风页脚 -->
      <el-footer class="tech-footer">
        <div class="footer-content">
          <span>广东海洋大学 · 海大识鱼团队</span>
          <span class="footer-divider">|</span>
          <span>Tech Vision System v2.0</span>
        </div>
      </el-footer>
    </el-container>
    
    <!-- 智能助手组件 -->
    <SmartAssistant />
  </el-container>
</template>

<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  View,
  EditPen,
  SwitchButton,
  CaretBottom,
  Link,
  Cpu,
  CreditCard,
  Coin,
  VideoCamera,
  DataAnalysis,
  MostlyCloudy,
  Monitor,
  ChatDotRound,
  MagicStick,
} from "@element-plus/icons-vue";
import avatar from "@/assets/default.png";
import { userInfoService } from "@/api/user.js";
import useUserInfoStore from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token.js";
import SmartAssistant from "@/views/SmartAssistant.vue";

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();

//调用函数,获取用户详细信息
const getUserInfo = async () => {
  //先检查是否有token，有token才调用接口
  if (tokenStore.token) {
    try {
      //调用接口
      let result = await userInfoService();
      //数据存储到pinia中
      userInfoStore.setInfo(result.data);
    } catch (error) {
      //如果获取用户信息失败，可能是token过期，清除token并跳转到登录页面
      if (error.response && error.response.status === 401) {
        tokenStore.removeToken();
        userInfoStore.removeInfo();
        router.push('/login');
      }
    }
  }
};

getUserInfo();

//条目被点击后,调用的函数
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage, ElMessageBox } from "element-plus";

const handleCommand = (command) => {
  //判断指令
  if (command === "logout") {
    //退出登录
    ElMessageBox.confirm("您确认要退出吗?", "温馨提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        //退出登录
        //1.清空pinia中存储的token以及个人信息
        tokenStore.removeToken();
        userInfoStore.removeInfo();

        //2.跳转到登录页面
        router.push("/login");
        ElMessage({
          type: "success",
          message: "退出登录成功",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "用户取消了退出登录",
        });
      });
  } else {
    //路由
    router.push("/user/" + command);
  }
};
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

.tech-layout {
  height: 100vh;
  background: var(--tech-blue-900);
  overflow: hidden;
}

// 科技风侧边栏
.tech-aside {
  background: linear-gradient(180deg, #0a0e1a 0%, #050810 100%);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--gradient-primary);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(180deg, 
      rgba(59, 130, 246, 0.4) 0%, 
      rgba(59, 130, 246, 0.1) 50%, 
      rgba(59, 130, 246, 0.4) 100%
    );
    box-shadow: 1px 0 8px rgba(59, 130, 246, 0.2);
  }
}

.aside-header {
  padding: var(--spacing-xl);
  border-bottom: var(--border-tech);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo-icon {
  width: 48px;
  height: 48px;
  color: var(--tech-cyan-400);
  
  .logo-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 15px rgba(6, 182, 212, 0.6));
  }
}

.logo-text {
  .system-name {
    font-size: 18px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 2px;
  }
  
  .system-name-en {
    font-size: 12px;
    color: var(--tech-silver-400);
    letter-spacing: 0.05em;
  }
}

.tech-menu {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  border-right: none;
  
  .menu-section {
    margin-bottom: var(--spacing-xl);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .menu-section-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--tech-silver-400);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: var(--spacing-sm) var(--spacing-md);
    margin-bottom: var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    
    .section-icon {
      font-size: 14px;
      color: var(--tech-cyan-400);
    }
  }
  
  .el-menu-item {
    height: 44px;
    padding: 0 var(--spacing-md);
    margin-bottom: var(--spacing-xs);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: 100%;
      background: var(--gradient-primary);
      opacity: 0;
      transition: opacity var(--transition-base);
    }
    
    &:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
      
      &::before {
        opacity: 0.5;
      }
    }
    
    &.is-active {
      background: rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      color: var(--tech-cyan-400);
      
      &::before {
        opacity: 1;
      }
      
      .menu-icon {
        color: var(--tech-cyan-400);
        filter: drop-shadow(0 0 8px rgba(6, 182, 212, 0.6));
      }
    }
    
    .menu-icon {
      font-size: 18px;
      color: var(--tech-blue-400);
      margin-right: var(--spacing-sm);
      transition: all var(--transition-base);
    }
    
    span {
      font-size: 14px;
      font-weight: 500;
    }
  }
}

// 侧边栏底部
.aside-footer {
  padding: var(--spacing-lg);
  border-top: var(--border-tech);
  text-align: center;
  
  .university-info {
    p {
      font-size: 13px;
      color: var(--tech-silver-400);
      margin-bottom: 2px;
    }
    
    .college {
      font-size: 12px;
      color: rgba(156, 163, 175, 0.6);
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: linear-gradient(135deg, 
    #1a1f2e 0%, 
    #151a28 20%, 
    #121622 100%
  );
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 100%;
    background: linear-gradient(90deg, 
      rgba(59, 130, 246, 0.1) 0%, 
      rgba(59, 130, 246, 0.05) 50%, 
      transparent 100%
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #3B82F6, #60A5FA, #3B82F6);
    opacity: 0.8;
  }
  
  // 滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(17, 24, 39, 0.6);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #3B82F6, #60A5FA);
    border-radius: 4px;
    border: 2px solid rgba(17, 24, 39, 0.8);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #2563EB, #3B82F6);
  }
  
  // Firefox 滚动条样式
  scrollbar-width: thin;
  scrollbar-color: #3B82F6 rgba(17, 24, 39, 0.6);
}

// 科技风头部
.tech-header {
  background: linear-gradient(180deg, #1a1f2e 0%, #151a28 100%);
  border-bottom: var(--border-tech);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xl);
  height: 60px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(59, 130, 246, 0.5) 50%, 
      transparent 100%
    );
  }
  
  .header-left {
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 14px;
      
      .breadcrumb-item {
        color: var(--tech-silver-400);
        transition: color var(--transition-fast);
        
        &.active {
          color: var(--tech-cyan-400);
          font-weight: 600;
        }
      }
      
      .breadcrumb-separator {
        color: var(--tech-silver-400);
        opacity: 0.5;
      }
    }
  }
  
  .header-right {
    .user-info {
      .el-dropdown__box {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        cursor: pointer;
        padding: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--radius-lg);
        border: 1px solid rgba(59, 130, 246, 0.2);
        background: rgba(59, 130, 246, 0.05);
        transition: all var(--transition-base);
        
        &:hover {
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(59, 130, 246, 0.1);
          box-shadow: var(--glow-sm);
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border: 2px solid var(--tech-blue-500);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--tech-silver-400);
        }
        
        .user-role {
          font-size: 12px;
          color: var(--tech-cyan-400);
        }
        
        .dropdown-icon {
          font-size: 14px;
          color: var(--tech-blue-400);
        }
      }
    }
  }
}

.tech-dropdown {
  background: var(--tech-blue-800);
  backdrop-filter: blur(20px);
  border: var(--border-tech);
  box-shadow: var(--shadow-xl);
  
  .el-dropdown-menu__item {
    color: var(--tech-silver-400);
    font-size: 14px;
    
    &:hover {
      background: rgba(59, 130, 246, 0.1);
      color: var(--tech-cyan-400);
    }
  }
}

// 主内容区
.tech-main {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
  background: linear-gradient(180deg, #1a1f2e 0%, #151a28 100%);
}

// 科技风页脚
.tech-footer {
  background: linear-gradient(180deg, #1a1f2e 0%, #151a28 100%);
  backdrop-filter: blur(20px);
  border-top: var(--border-tech);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-xl);
  height: 50px;
  
  .footer-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    font-size: 13px;
    color: var(--tech-silver-400);
    
    .footer-divider {
      color: var(--tech-silver-400);
      opacity: 0.3;
    }
  }
}

// 滚动条美化
.tech-menu::-webkit-scrollbar {
  width: 6px;
}

.tech-menu::-webkit-scrollbar-track {
  background: transparent;
}

.tech-menu::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: var(--radius-full);
  
  &:hover {
    background: rgba(59, 130, 246, 0.5);
  }
}

// 响应式优化
@media (max-width: 768px) {
  .tech-aside {
    width: 200px !important;
  }
  
  .tech-header {
    padding: 0 var(--spacing-lg);
    
    .breadcrumb {
      font-size: 13px;
    }
    
    .user-info .el-dropdown__box {
      padding: var(--spacing-xs) var(--spacing-sm);
    }
  }
  
  .tech-main {
    padding: var(--spacing-lg);
  }
}
</style>