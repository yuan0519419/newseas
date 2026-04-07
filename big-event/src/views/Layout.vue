<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  View,
  EditPen,
  SwitchButton,
  CaretBottom,
  Link,
  Cpu,
  CreditCard,
  Coin,
  VideoCamera,
  DataAnalysis,
  MostlyCloudy,
  Monitor,
  
} from "@element-plus/icons-vue";
import avatar from "@/assets/default.png";
import { userInfoService } from "@/api/user.js";
import useUserInfoStore from "@/stores/userInfo.js";
import { useTokenStore } from "@/stores/token.js";
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
//调用函数,获取用户详细信息
const getUserInfo = async () => {
  //先检查是否有token，有token才调用接口
  if (tokenStore.token) {
    try {
      //调用接口
      let result = await userInfoService();
      //数据存储到pinia中
      userInfoStore.setInfo(result.data);
    } catch (error) {
      //如果获取用户信息失败，可能是token过期，清除token并跳转到登录页面
      if (error.response && error.response.status === 401) {
        tokenStore.removeToken();
        userInfoStore.removeInfo();
        router.push('/login');
      }
    }
  }
};

getUserInfo();
//条目被点击后,调用的函数
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage, ElMessageBox } from "element-plus";
const handleCommand = (command) => {
  //判断指令
  if (command === "logout") {
    //退出登录
    ElMessageBox.confirm("您确认要退出吗?", "温馨提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        //退出登录
        //1.清空pinia中存储的token以及个人信息
        tokenStore.removeToken();
        userInfoStore.removeInfo();

        //2.跳转到登录页面
        router.push("/login");
        ElMessage({
          type: "success",
          message: "退出登录成功",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "用户取消了退出登录",
        });
      });
  } else {
    //路由
    router.push("/user/" + command);
  }
};
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        router
      >
        <el-menu-item index="/sea">
          <el-icon><Link /></el-icon>
          <span>水质数据同步</span>
        </el-menu-item>

        <el-menu-item index="/water">
          <el-icon><Monitor /></el-icon>
          <span>水质监测预测</span>
        </el-menu-item>

         <el-menu-item index="/fish">
          <el-icon><Coin /></el-icon>
          <span>水下鱼群智能估产</span>
        </el-menu-item>

        <el-menu-item index="/pit">
          <el-icon><CreditCard /></el-icon>
          <span>鱼类监测系统</span>
        </el-menu-item>

        <el-menu-item index="/pit3">
          <el-icon><CreditCard /></el-icon>
          <span>PIT游泳动物跟踪遥测</span>
        </el-menu-item>

     

        <el-sub-menu>
            <template #title>
            <el-icon><VideoCamera /></el-icon>
            <span>养殖监控</span>
          </template>

           <el-menu-item index="/cage">
            <el-icon><DataAnalysis /></el-icon>
            <span>网箱信息</span>
          </el-menu-item>

        

          <el-menu-item index="/weather">
            <el-icon><MostlyCloudy /></el-icon>
            <span>气象信息</span>
          </el-menu-item>
          <el-menu-item index="/eqp">
            <el-icon><Monitor /></el-icon>
            <span>设备维护</span>
          </el-menu-item>
          <el-menu-item index="/reserve">
            <el-icon><View /></el-icon>
            <span>养殖储备信息</span>
          </el-menu-item>
        </el-sub-menu>


        <!-- <el-menu-item index="/methods">
          <el-icon><Cpu /></el-icon>
          <span>算法库</span>
        </el-menu-item> -->


        <el-menu-item index="/chatModel">
          <el-icon><View /></el-icon>
          <span>视觉大模型</span>
        </el-menu-item>


        <el-sub-menu>
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User />
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetPassword">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
        <!--   用户：<strong>{{ userInfoStore.info.nickname }}</strong> -->
        <div class="system-title">南海智慧海上牧场数据监测平台</div>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar
              :src="
                userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar
              "
            />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="resetPassword" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>广东海洋大学®</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #2199d9e1;

    &__logo {
      height: 120px;
      background: url("@/assets/校徽.png") no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
      background-color: #439fe4c2;

      // 菜单项悬停时的背景颜色
      .el-menu-item:hover,
      .el-sub-menu__title:hover {
        background-color: #6bb6e5 !important; // 修改为你想要的悬停颜色
      }

      // 选中菜单项的背景颜色
      .el-menu-item.is-active {
        background-color: #439fe4c2 !important; // 保持原有的选中颜色
      }

      
    }

    
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;


 .system-title {
      font-size: 32px; // 放大字体
      font-weight: bold; // 加粗
      color: #1e3a8a; // 设置深蓝色文字颜色
      flex: 1; // 占据剩余空间
      text-align: center; // 文字居中
      margin: 0 auto; // 居中显示
    }

    
    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #409ce2c2;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>