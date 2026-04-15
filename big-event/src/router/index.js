import {createRouter,createWebHistory} from 'vue-router'
import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import  watervue  from '@/views/water/water.vue';
import sea from '@/views/water/sea.vue'
import cage from '@/views/netCage/cage.vue'
import eqp from '@/views/netCage/eqp.vue'
import reserve from '@/views/netCage/reserve.vue'
import weather from '@/views/netCage/weather.vue'
import t from '@/views/netCage/t.vue'
import pit from '@/views/pit.vue'
import pit2 from '@/views/pit2.vue'
import fish from '@/views/netCage/fish_ai_yield.vue'

import chatVue from '@/views/netCage/chat.vue'
// import methods from '@/views/netCage/methods.vue'
import pit3 from '@/views/pit3.vue'
//路由关系的定义
const routers = [
    { path: '/login', component: LoginVue },
    {path: '/',component: LayoutVue,redirect: '/water',children: [
        { path: '/user/info', component: UserInfoVue },
        { path: '/user/avatar', component: UserAvatarVue },
        { path: '/user/resetPassword', component: UserResetPasswordVue },
        { path: '/water', component: watervue },
        { path: '/sea', component: sea },
        { path: '/pit', component: pit },
        { path: '/pit2', component: pit2 },
        { path: '/cage', component: cage },
        { path: '/eqp', component: eqp },
        { path: '/reserve', component: reserve },
        { path: '/weather', component: weather },
        { path: '/t', component: t },
        { path: '/fish', component: fish },

        { path: '/chat', component: chatVue },
        // { path: '/methods', component: methods },
        { path: '/pit3', component: pit3 },
    ]}
]

//创建路由
const router = createRouter({
    history:createWebHistory(),
    routes: routers
})

//导出
export default router;
