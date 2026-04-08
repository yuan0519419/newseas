<template>
  <div class="login-container">
    <!-- 科技背景效果 -->
    <div class="tech-background">
      <div class="grid-overlay"></div>
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="glow-orb orb-3"></div>
      <div class="floating-particles">
        <div class="particle" v-for="i in 20" :key="i" :style="{
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (5 + Math.random() * 10) + 's'
        }"></div>
      </div>
    </div>

    <!-- 左侧系统介绍 -->
    <div class="system-intro">
      <div class="intro-content">
        <!-- Logo 与标题水平布局 -->
        <div class="logo-title-wrapper">
          <div class="logo-icon">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M50 15 Q70 35 70 50 Q70 65 50 85 Q30 65 30 50 Q30 35 50 15" fill="none" stroke="currentColor" stroke-width="2"/>
              <circle cx="50" cy="50" r="8" fill="currentColor"/>
              <path d="M20 50 Q35 45 50 50 Q65 55 80 50" fill="none" stroke="currentColor" stroke-width="1.5"/>
              <path d="M25 60 Q40 55 50 60 Q60 65 75 60" fill="none" stroke="currentColor" stroke-width="1"/>
            </svg>
          </div>
          <div class="title-wrapper">
            <h1 class="system-title">
              海上牧场数据监测平台
            </h1>
            <p class="system-subtitle">
              Ocean Ranch Data Monitoring System
            </p>
          </div>
        </div>
        
        <div class="intro-divider"></div>
        
        <!-- 功能特性 -->
        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6l9-4 9 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6z"/>
                <path d="M3 6h18"/>
                <path d="M9 10h6"/>
                <path d="M9 14h6"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>水质监测预测</h3>
              <p>实时监测水温、盐度、pH 值、溶解氧等关键指标，AI 智能预测趋势</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>网箱智能管理</h3>
              <p>全方位监控网箱状态，实时跟踪鱼类生长，智能预警异常情况</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>气象环境监控</h3>
              <p>精准监测海洋气象数据，预测风暴潮、海浪等海洋灾害</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="feature-text">
              <h3>PIT 鱼类追踪</h3>
              <p>采用先进 PIT 技术，实现鱼类个体识别与行为轨迹追踪</p>
            </div>
          </div>
        </div>
        
        <!-- 技术支持 -->
        <div class="tech-support">
          <p>广东海洋大学 · 海洋科学与技术学院</p>
          <p class="version">Tech Vision System v2.0</p>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="form-section">
      <div class="form-wrapper">
        <!-- 登录表单 -->
        <div class="form-content" v-if="!isRegister">
          <div class="form-header">
            <h2 class="form-title">欢迎回来</h2>
            <p class="form-subtitle">请登录您的账户</p>
          </div>
          
          <el-form
            ref="form"
            size="large"
            autocomplete="off"
            :model="registerData"
            :rules="rules"
            class="tech-form"
          >
            <el-form-item prop="username">
              <el-input
                :prefix-icon="User"
                placeholder="请输入用户名"
                v-model="registerData.username"
                class="tech-input"
              ></el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                name="password"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入密码"
                v-model="registerData.password"
                class="tech-input"
                @keyup.enter="login"
              ></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button
                class="tech-button tech-button--primary"
                type="primary"
                auto-insert-space
                @click="login"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <span class="switch-text">还没有账户？</span>
            <el-link type="primary" :underline="false" @click="isRegister = true">
              立即注册
            </el-link>
          </div>
        </div>

        <!-- 注册表单 -->
        <div class="form-content" v-else>
          <div class="form-header">
            <h2 class="form-title">创建账户</h2>
            <p class="form-subtitle">加入海洋牧场监测系统</p>
          </div>
          
          <el-form
            ref="form"
            size="large"
            autocomplete="off"
            :model="registerData"
            :rules="rules"
            class="tech-form"
          >
            <el-form-item prop="username">
              <el-input
                :prefix-icon="User"
                placeholder="请输入用户名"
                v-model="registerData.username"
                class="tech-input"
              ></el-input>
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入密码"
                v-model="registerData.password"
                class="tech-input"
              ></el-input>
            </el-form-item>
            
            <el-form-item prop="rePassword">
              <el-input
                :prefix-icon="Lock"
                type="password"
                placeholder="请再次输入密码"
                v-model="registerData.rePassword"
                class="tech-input"
                @keyup.enter="register"
              ></el-input>
            </el-form-item>
            
            <el-form-item>
              <el-button
                class="tech-button tech-button--primary"
                type="primary"
                auto-insert-space
                @click="register"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <span class="switch-text">已有账户？</span>
            <el-link type="primary" :underline="false" @click="isRegister = false; clearRegisterData()">
              立即登录
            </el-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";

//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false);

//表单校验规则
const registerData = ref({
  username: "",
  password: "",
  rePassword: "",
});

//密码校验
const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次确认密码"));
  } else if (value !== registerData.value.password) {
    callback(new Error("请确保两次输入的密码一样"));
  } else {
    callback();
  }
};

//定义表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5~16位非空字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "长度为5~16位非空字符", trigger: "blur" },
  ],
  rePassword: [{ validator: checkRePassword, trigger: "blur" }],
};

//后台接口的调用
import { userRegisterService, userLoginService } from "@/api/user.js";
const register = async () => {
  //registerData是一个响应式对象,如果要获取值,需要.value
  let result = await userRegisterService(registerData.value);
  ElMessage.success(result.msg ? result.msg : "注册成功");
};

//表单登录数据与注册数据复用
//绑定,编写函数
import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/token.js";
const tokenStore = useTokenStore();
const router = useRouter();
const login = async () => {
  //调用接口,完成登录
  let result = await userLoginService(registerData.value);
  ElMessage.success(result.message ? result.message : "登录成功");
  //把得到的token存储到pinia中
  tokenStore.setToken(result.data);
  //
  router.push("/");
};

//清空表单数据
const clearRegisterData = () => {
  registerData.value = {
    username: "",
    password: "",
    rePassword: "",
  };
};
</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

.login-container {
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
}

.system-intro {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  position: relative;
  z-index: 1;
}

.intro-content {
  max-width: 600px;
  width: 100%;
}

.logo-title-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.logo-icon {
  width: 80px;
  height: 80px;
  color: var(--tech-cyan-400);
  
  .logo-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.6));
  }
}

.title-wrapper {
  .system-title {
    font-size: 32px;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--spacing-xs);
    letter-spacing: -0.02em;
  }
  
  .system-subtitle {
    font-size: 16px;
    color: var(--tech-silver-400);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}

.intro-divider {
  height: 2px;
  background: var(--gradient-primary);
  margin: var(--spacing-2xl) 0;
  opacity: 0.5;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all var(--transition-base);
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateX(4px);
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
    color: var(--tech-cyan-400);
    flex-shrink: 0;
    
    svg {
      width: 100%;
      height: 100%;
    }
  }
  
  .feature-text {
    flex: 1;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--tech-cyan-400);
      margin-bottom: var(--spacing-xs);
    }
    
    p {
      font-size: 14px;
      color: var(--tech-silver-400);
      line-height: 1.5;
      margin: 0;
    }
  }
}

.tech-support {
  text-align: center;
  
  p {
    font-size: 14px;
    color: var(--tech-silver-400);
    margin-bottom: var(--spacing-xs);
  }
  
  .version {
    font-size: 12px;
    color: rgba(156, 163, 175, 0.6);
  }
}

.form-section {
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  position: relative;
  z-index: 1;
}

.form-wrapper {
  width: 100%;
  max-width: 360px;
}

.form-content {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: var(--border-tech);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-2xl);
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
  }
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  .form-title {
    font-size: 28px;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--spacing-sm);
  }
  
  .form-subtitle {
    font-size: 14px;
    color: var(--tech-silver-400);
  }
}

.tech-form {
  .el-form-item {
    margin-bottom: var(--spacing-lg);
  }
}

.tech-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.form-footer {
  text-align: center;
  margin-top: var(--spacing-lg);
  
  .switch-text {
    font-size: 14px;
    color: var(--tech-silver-400);
    margin-right: var(--spacing-xs);
  }
  
  .el-link {
    font-size: 14px;
    font-weight: 600;
  }
}

// 响应式优化
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }
  
  .system-intro {
    padding: var(--spacing-xl);
    flex: none;
    height: auto;
  }
  
  .form-section {
    width: 100%;
    flex: 1;
  }
  
  .logo-title-wrapper {
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .feature-list {
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .system-intro {
    padding: var(--spacing-lg);
  }
  
  .form-section {
    padding: var(--spacing-lg);
  }
  
  .form-content {
    padding: var(--spacing-xl);
  }
  
  .system-title {
    font-size: 24px !important;
  }
  
  .form-title {
    font-size: 24px !important;
  }
}
</style>