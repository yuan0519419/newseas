<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";

const selectedDate = ref(null);


const weather=ref([{
    id: 1,
    wind: "东北风3-4级",
    rain:5.20 ,
    fog:"大雾",
    inspectTime: "2025-07-02"
  
}])



import {
  weatherListService,
  weatherAddService,
  weatherUpdateService,
  weatherDeleteService,
  seaDataByDateService
} from "@/api/weather";
const searchByDate = async () => {
  if (!selectedDate.value) {
    ElMessage.warning('请选择查询日期');
    return;
  }
  const date = selectedDate.value;
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  let result = await seaDataByDateService(formattedDate);
  weather.value = result.data;
};

const weatherList = async () => {
  let result = await weatherListService();
  weather.value = result.data;
};





weatherList();



const title = ref("");
//控制添加分类弹窗
const dialogVisible = ref(false);





const weatherModel=ref({
      id: 1,
    wind: "",
    rain:"" ,
    fog: "",
    inspectTime: ""
  
})





const rules = {
  wind: [
    { required: true, message: "请输入风场描述", trigger: "blur" },
  ],
     rain: [
    { required: true, message: "请输入降水量", trigger: "blur" },
  ],
   
    fog: [
    { required: true, message: "请输入海雾情况", trigger: "blur" },
  ],
    inspectTime: [
    { required: true, message: "请输入抽检时间", trigger: "blur" },
  ]
};






//访问后台，添加文章分类
import { ElMessage } from "element-plus";








const addWeather = async () => {
  //调用接口
  let result = await weatherAddService(weatherModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");

  //调用获取所有文章分类的函数
  weatherList();
  dialogVisible.value = false;
};

















//修改分类回显
const updateWeather = async () => {
  //调用接口
  let result = await weatherUpdateService(weatherModel.value);

  ElMessage.success(result.msg ? result.msg : "修改成功");

  //调用获取所有分类的函数
 weatherList();

  //隐藏弹窗
  dialogVisible.value = false;
};

//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true;
  title.value = "编辑数据";
  //数据拷贝
    weatherModel.value.wind = row.wind;
    weatherModel.value.rain = row.rain;
    weatherModel.value.fog = row.fog;
    weatherModel.value.inspectTime = row.inspectTime;
  
   

  //扩展id属性,将来需要传递给后台,完成分类的修改
  weatherModel.value.id = row.id;
};











//清空模型数据





const clearWeatherModel = () => {
  (weatherModel.value.wind = ""),
  (weatherModel.value.rain = ""),
  (weatherModel.value.fog = ""),
  (weatherModel.value.inspectTime = "");
};

























//删除分类
import { ElMessageBox } from "element-plus";




const deleteWeather = (row) => {
  //提示用户  确认框

  ElMessageBox.confirm("你确认要删除该数据吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //调用接口
      let result = await weatherDeleteService(row.id);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      //刷新列表
      weatherList();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "用户取消了删除",
      });
    });
};


</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>气象信息</span>
        <div class="extra">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            style="margin-right: 10px"
          />
          <el-button
            type="primary"
            @click="searchByDate"
          >查询</el-button
          >
          <el-button
            type="primary"
            @click="
              title = '添加数据';
              dialogVisible = true;
              clearWeatherModel();
            "
            style="margin-left: 10px"
            >添加数据</el-button
          >
        </div>
      </div>
    </template>




    <el-table :data="weather" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="风场描述" prop="wind"></el-table-column>
      <el-table-column label="降水量(mm)" prop="rain"></el-table-column>
      <el-table-column label="海雾情况" prop="fog"></el-table-column>
    <el-table-column label="抽检时间" prop="inspectTime"  width="100"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteWeather(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>



    <!-- 添加分类弹窗 -->
     <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form
        :model="weatherModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="风场描述" prop="wind">
          <el-input
            v-model="weatherModel.wind"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
          
          <el-form-item label="降水量" prop="rain">
          <el-input
           placeholder="(mm)"
            v-model="weatherModel.rain"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>

         <el-form-item label="海雾情况" prop="fog">
          <el-input
            v-model="weatherModel.fog"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>

        

      

         <el-date-picker 
        v-model="weatherModel.inspectTime"
        type="datetime"
        placeholder="抽检时间"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD "
        date-format="MMM DD, YYYY"

      />
     
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="title == '添加数据' ? addWeather() : updateWeather()"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>