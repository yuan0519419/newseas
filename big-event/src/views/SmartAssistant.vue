<template>
  <div class="smart-assistant">
    <!-- 助手图标 -->
    <div class="assistant-icon" @click="toggleDialog">
      <el-icon><Cpu /></el-icon>
    </div>
    
    <!-- 聊天弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :show-close="true"
      custom-class="tech-dialog"
      center
    >
      <div class="tech-assistant-container">
        <h1 class="assistant-title">南海智能化牧场数据监测平台助手</h1>
        
        <!-- 聊天记录区域 -->
        <div class="chat-card">
          <h2 class="chat-card-title">小海智能助手</h2>
          <div class="chat-messages" ref="chatMessages">
            <div v-if="messages.length === 0" class="empty-state">
              等待您输入问题...
            </div>
            <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
              <div class="message-content">
                <div v-if="message.role === 'user'" class="message-text user-message">
                  {{ message.content }}
                </div>
                <div v-else class="message-text ai-message">
                  {{ message.content }}
                </div>
              </div>
            </div>
            <div v-if="isLoading" class="loading-container">
              <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 输入区域 -->
        <div class="input-card">
          <h2 class="input-card-title">用户输入</h2>
          <textarea 
            v-model="userQuestion" 
            placeholder="请输入您的问题..."
            class="question-input"
            @keyup.enter="submitQuestion"
          ></textarea>
          <button @click="submitQuestion" class="submit-btn" :disabled="!userQuestion.trim()">
            提交问题
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { Cpu, ChatLineSquare } from '@element-plus/icons-vue';
import { getAnswerService } from '@/api/methods';

// 弹窗可见性
const dialogVisible = ref(false);

// 用户输入的问题
const userQuestion = ref('');

// 存储消息列表
const messages = ref([]);

// 加载状态
const isLoading = ref(false);

// 聊天记录区域引用
const chatMessages = ref(null);

// 切换弹窗显示状态
const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};

// 自动滚动到聊天记录底部
const scrollToBottom = async () => {
  await nextTick();
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// 提交问题处理函数
const submitQuestion = async () => {
  try {
    const question = userQuestion.value.trim();
    if (!question) return;
    
    // 清空输入框
    userQuestion.value = '';
    
    // 添加用户消息到列表
    messages.value.push({
      role: 'user',
      content: question
    });
    
    // 自动滚动到最底部
    scrollToBottom();
    
    // 设置加载状态
    isLoading.value = true;
    
    // 调用API获取回答
    let result = await getAnswerService(question);
    
    // 添加AI回答到列表
    messages.value.push({
      role: 'ai',
      content: result.data
    });
    
    // 自动滚动到最底部
    scrollToBottom();
  } catch (error) {
    console.error('提交问题失败:', error);
    // 可以添加错误提示
  } finally {
    // 无论成功失败，都设置加载状态为false
    isLoading.value = false;
  }
};

// 组件挂载后初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑
});
</script>

<style lang="scss" scoped>
.smart-assistant {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

.assistant-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: rotate(45deg);
    animation: techPulse 2s infinite;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(59, 130, 246, 0.8);
  }
  
  .el-icon {
    font-size: 32px;
    color: white;
    position: relative;
    z-index: 1;
  }
}

@keyframes techPulse {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

// 对话框样式
:deep(.el-dialog) {
  border-radius: 12px !important;
  overflow: hidden !important;
  background: #0a0e1a !important;
  
  .el-dialog__header {
    background: #0a0e1a !important;
    border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
    
    .el-dialog__title {
      color: #3b82f6 !important;
      font-weight: 600 !important;
    }
    
    .el-dialog__headerbtn .el-icon {
      color: #3b82f6 !important;
    }
  }
  
  .el-dialog__body {
    padding: 20px !important;
    background: #0a0e1a !important;
  }
  
  .el-dialog__footer {
    background: #0a0e1a !important;
    border-top: 1px solid rgba(59, 130, 246, 0.3) !important;
  }
}

.tech-assistant-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.assistant-title {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #3b82f6;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  margin: 0 0 10px 0;
}

.chat-card, .input-card {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.chat-card-title, .input-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  padding-bottom: 8px;
  margin-top: 0;
  margin-bottom: 15px;
}

.chat-messages {
  height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(10, 14, 26, 0.6);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.4);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.6);
  }
}

.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  
  &.user {
    justify-content: flex-end;
  }
  
  &.ai {
    justify-content: flex-start;
  }
}

.message-content {
  max-width: 70%;
  
  .user & {
    text-align: right;
  }
  
  .ai & {
    text-align: left;
  }
}

.message-text {
  padding: 10px 15px;
  border-radius: 18px;
  line-height: 1.5;
  word-wrap: break-word;
  
  &.user-message {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    border-bottom-right-radius: 4px;
  }
  
  &.ai-message {
    background: rgba(10, 14, 26, 0.6);
    color: #e2e8f0;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-bottom-left-radius: 4px;
  }
}

.empty-state {
  color: #94a3b8;
  text-align: center;
  padding: 40px 0;
  font-style: italic;
}

.loading-container {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0;
}

.loading-dots {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  animation: loadingPulse 1.4s ease-in-out infinite;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes loadingPulse {
  0%, 60%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  30% {
    transform: scale(1);
    opacity: 1;
  }
}

.question-input {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  background: rgba(10, 14, 26, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
  color: #e2e8f0;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  
  &::placeholder {
    color: #94a3b8;
    opacity: 0.6;
  }
}

.submit-btn {
  background: rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.5);
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.4);
    border-color: #3b82f6;
  }
  
  &:disabled {
    background: rgba(107, 114, 128, 0.3);
    color: #94a3b8;
    cursor: not-allowed;
  }
}
</style>