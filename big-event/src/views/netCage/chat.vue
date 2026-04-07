<template>
  <div class="chat-app">
    <h1>南海智能化牧场数据监测平台助手</h1>
    
    <!-- 后端返回数据显示区域 -->
    <div class="response-box">
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
      ></textarea>
      <button @click="submitQuestion" class="submit-btn" :disabled="!userQuestion.trim()">
        提交问题
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 用户输入的问题
const userQuestion = ref('');

// 存储问题和对应的回答
const responses = ref([]);

// 提交问题处理函数
const submitQuestion = () => {
  const question = userQuestion.value.trim();
  if (!question) return;
  
  // 模拟后端处理和返回数据
  simulateBackendResponse(question);
  
  // 清空输入框
  userQuestion.value = '';
};

// 模拟后端响应
const simulateBackendResponse = (question) => {
  // 简单的模拟回答
  const answers = [
    "这是一个很好的问题，根据相关信息，答案是...",
    "经过分析，我认为...",
    "关于这个问题，我的理解是...",
    "抱歉，我暂时无法回答这个问题。请尝试其他问题。",
    "根据提供的信息，我可以告诉你..."
  ];
  
  // 随机选择一个回答
  const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
  
  // 添加到响应列表
  responses.value.push({
    question: question,
    answer: randomAnswer
  });
};
</script>

<style>
.chat-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #555;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-top: 0;
}

.response-box, .input-box {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.response-box {
  min-height: 300px;
}

.response-content {
  margin-top: 15px;
}

.response-item {
  padding: 12px;
  border-radius: 6px;
  background-color: #f9f9f9;
  margin-bottom: 15px;
}

.response-question {
  margin-bottom: 8px;
  color: #333;
}

.response-answer {
  color: #666;
}

.empty-state {
  color: #999;
  text-align: center;
  padding: 50px 0;
  font-style: italic;
}

.question-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.question-input:focus {
  outline: none;
  border-color: #66afe9;
  box-shadow: 0 0 0 3px rgba(102, 175, 233, 0.1);
}

.submit-btn {
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #3367d6;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
    