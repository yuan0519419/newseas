//导入 request.js
import request from "@/utils/request.js"
import Login from "@/views/Login.vue";

export const userRegisterService = (registerData) =>{
    const params = new URLSearchParams()
    //进行参数的传递
    for(let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/user/register',params);
}

export const userLoginService = (loginData)=>{
    const params = new URLSearchParams();
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/user/login',params)
}

//获取用户详细信息
export const userInfoService = ()=>{
    return request.get('/user/userInfo')
}

//修改个人信息
export const userInfoUpdateService = (userInfoData)=>{
   return request.put('/user/update',userInfoData)
}

//修改头像
export const userAvatarUpdateService = (avatarUrl)=>{
    const params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/user/updateAvatar',params)
}

export const userPasswordUpdateService = (passwordData)=>{
    const params = new URLSearchParams();
    params.append('old_pwd',passwordData.old_pwd)
    params.append('new_pwd',passwordData.new_pwd)
    params.append('re_pwd',passwordData.re_pwd)
    //return request.patch('/user/updatePwd',params)
    return request.patch('/user/updatePwd',params)
}

export const userPasswordUpdateService2 = (passwordData) =>{
    return request.patch('/user/updatePwd',passwordData)
}