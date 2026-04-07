<script lang="ts" setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from 'element-plus'
import {userPasswordUpdateService ,userPasswordUpdateService2} from "@/api/user.js";
import {useRouter} from 'vue-router'
import {useTokenStore} from '@/stores/token.js'
const tokenStore = useTokenStore();
const input = ref("");
const passwordData = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
}) 
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    } else if (value !== passwordData.value.new_pwd) {
        callback(new Error('请确保两次输入的密码一样'))
    } else {
        callback()
    }
}
const rules = ref({
    new_pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
    ],
    re_pwd: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
})
const router = useRouter();
const updatePassword = async () => {
    
     let result = await userPasswordUpdateService2(passwordData.value)
    ElMessage.success(  '修改密码成功')
    router.push('/login') 
}
</script>
<template>
    <el-row class="login-page">
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off"  :model="passwordData" :rules="rules">
                <el-form-item>
                    <h1>修改密码</h1>
                </el-form-item>
                <el-form-item class="flex" prop="old_pwd">
                    <el-input class="flex-grow" :prefix-icon="Lock" placeholder="请输入原密码"  v-model="passwordData.old_pwd"></el-input>
                </el-form-item>
                <el-form-item class="flex" prop="new_pwd">
                    <el-input class="flex-grow" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="passwordData.new_pwd"></el-input>
                </el-form-item>
                <el-form-item class="flex" prop="re_pwd">
                    <el-input class="flex-grow" :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="passwordData.re_pwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space  @click="updatePassword">
                        修改密码
                    </el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;
}
</style>

  
  