import request from '@/utils/request.js'
import { useTokenStore } from '@/stores/token.js'
import axios from 'axios'


 export const getAnswerService = (question) => {
    return request.post('/ai/simple/chat',{question})
} 


/* export const getAnswerService = (question) => {
  // 创建一个新的axios实例，绕过原有的响应拦截器
  const streamInstance = axios.create({
    baseURL: '/api',
    responseType: 'stream', // 关键：指定响应类型为流
    headers: {
      'Accept': 'text/html', // 明确指定接受text/html类型
    }
  })

  // 添加token（如果需要）

  const tokenStore = useTokenStore()
  if (tokenStore.token) {
    streamInstance.defaults.headers.common['Authorization'] = tokenStore.token
  }

  // 发送GET请求，参数作为查询字符串
  return streamInstance.get('/ai/chat/stream', {
    params: { question }, // 将参数放在params中，会自动转为查询字符串
  }).then(response => {
    // 直接返回流数据，不进行任何处理
    return response.data
  }).catch(error => {
    // 处理错误
    console.error('流式请求错误:', error)
    throw error
  })
}
 */



