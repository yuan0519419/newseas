import './assets/main.scss'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import {createPersistedState} from'pinia-persistedstate-plugin'

//状态器，使得请求携带后端返回的token

const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState()
//pinia使用持久化插件
pinia.use(persist)
app.use(pinia);
app.use(router);
app.use(ElementPlus,{locale});
app.mount('#app')