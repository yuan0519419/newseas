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
      @keyup.enter="submitQuestion"
    ></textarea>
    <button @click="submitQuestion" class="submit-btn" :disabled="!userQuestion.trim()">
      提交问题
    </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAnswerService } from '@/api/methods';
// 用户输入的问题
const userQuestion = ref('');

// 存储问题和对应的回答
const responses = ref([]);

// 提交问题处理函数
const submitQuestion = async () => {


  
  const question = userQuestion.value.trim();
  if (!question) return;
 userQuestion.value = '';
let result= await getAnswerService(question);


  // 添加到响应列表
  responses.value.push({
    question: question,
    answer: result.data
  });



  
 
  // 清空输入框
 
};


</script>

<style>
.chat-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  /* 确保页面不会出现不必要的滚动 */
  box-sizing: border-box;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px; /* 减少标题下方间距 */
  font-size: 1.8rem; /* 适当减小标题大小 */
}

h2 {
  color: #555;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  margin-top: 0;
  font-size: 1.3rem;
}

.response-box, .input-box {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 15px; /* 减少内边距 */
  margin-bottom: 15px; /* 减少框之间的间距 */
  box-sizing: border-box;
}

.response-box {
  /* 适当减小响应区域高度 */
  height: 300px;
  /* 溢出内容显示滚动条 */
  overflow-y: auto;
}

.response-content {
  margin-top: 10px;
}

.response-item {
  padding: 10px;
  border-radius: 6px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
}

.response-question {
  margin-bottom: 6px;
  color: #333;
}

.response-answer {
  color: #666;
  line-height: 1.5;
}

.empty-state {
  color: #999;
  text-align: center;
  padding: 40px 0;
  font-style: italic;
}

.question-input {
  width: 100%;
  min-height: 80px; /* 减小输入框高度 */
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
  padding: 8px 16px; /* 减小按钮大小 */
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
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
