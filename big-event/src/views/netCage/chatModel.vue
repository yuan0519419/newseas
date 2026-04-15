<template>
  <div class="chat-app">
    <h1>南海智能化牧场数据监测平台助手</h1>
    
    <!-- 后端返回数据显示区域 -->
    <div class="response-box" ref="responseBox">
      <h2>小海智能助手</h2>
      <div class="response-content">
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
      </div>
    </div>
    
    <!-- 用户输入区域 -->
    <div class="input-box">
      <h2>用户输入</h2>
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
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { getAnswerService } from '@/api/methods';
// 用户输入的问题
const userQuestion = ref('');

// 存储消息列表
const messages = ref([]);

// 响应框引用
const responseBox = ref(null);

// 自动滚动到响应框底部
const scrollToBottom = async () => {
  await nextTick();
  if (responseBox.value) {
    responseBox.value.scrollTop = responseBox.value.scrollHeight;
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
  }
};

</script>

<style lang="scss" scoped>
@use '@/assets/main.scss';

.chat-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  min-height: 100vh;
  background: var(--tech-blue-900);
}

h1 {
  text-align: center;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

h2 {
  color: var(--tech-blue-600);
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  padding-bottom: 8px;
  margin-top: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.response-box, .input-box {
  background: rgba(17, 24, 39, 0.6);
  border: var(--border-tech);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 15px;
  margin-bottom: 15px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

.response-box {
  height: 300px;
  overflow-y: auto;
  
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

.response-content {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
    color: var(--tech-blue-300);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-bottom-left-radius: 4px;
  }
}

.empty-state {
  color: var(--tech-blue-400);
  text-align: center;
  padding: 40px 0;
  font-style: italic;
}

.question-input {
  width: 100%;
  min-height: 80px;
  padding: 10px;
  background: rgba(10, 14, 26, 0.6);
  border: var(--border-tech);
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 10px;
  box-sizing: border-box;
  color: var(--tech-blue-300);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--tech-blue-500);
    box-shadow: var(--glow-sm);
  }
  
  &::placeholder {
    color: var(--tech-blue-500);
    opacity: 0.6;
  }
}

.submit-btn {
  background: var(--gradient-primary);
  color: var(--tech-blue-900);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--glow-md);
  }
  
  &:disabled {
    background: rgba(107, 114, 128, 0.3);
    color: var(--tech-blue-500);
    cursor: not-allowed;
  }
}
</style>
