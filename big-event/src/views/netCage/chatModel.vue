<template>
  <div class="chat-app">
    <h1>南海智能化牧场数据监测平台助手</h1>
    
    <!-- 后端返回数据显示区域 -->
    <div class="response-box" ref="responseBox">
      <h2>小海智能助手</h2>
      <div class="response-content">
        <div v-if="responses.length === 0" class="empty-state">
          等待您输入问题...
        </div>
        <div v-for="(response, index) in responses" :key="index" class="response-item">
          <div class="response-question">
            <strong>问题:</strong> {{ response.question }}
          </div>
          <div class="response-answer">
            <strong>回答:</strong> {{ response.answer }}
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

// 存储问题和对应的回答
const responses = ref([]);

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
    
    // 调用API获取回答
    let result = await getAnswerService(question);
    
    // 添加到响应列表
    responses.value.push({
      question: question,
      answer: result.data
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
}

.response-item {
  padding: 10px;
  border-radius: 6px;
  background: rgba(10, 14, 26, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
  }
}

.response-question {
  margin-bottom: 6px;
  color: var(--tech-blue-400);
  font-weight: 600;
}

.response-answer {
  color: var(--tech-blue-300);
  line-height: 1.5;
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
