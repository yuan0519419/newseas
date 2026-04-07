<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";

const selectedDate = ref(null);


const cage=ref([{
    id: 1,
    loc: "遂溪",
    size:500 ,
    breed: "金鲳鱼",
    placeDate: "2025-07-02"
  
}])



import {
  cageListService,
  cageAddService,
  cageUpdateService,
  cageDeleteService,
  seaDataByDateService
} from "@/api/cage";
const searchByDate = async () => {
  if (!selectedDate.value) {
    ElMessage.warning('请选择查询日期');
    return;
  }
  const date = selectedDate.value;
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  let result = await seaDataByDateService(formattedDate);
  cage.value = result.data;
};

const cageList = async () => {
  let result = await cageListService();
  cage.value = result.data;
};





cageList();



const title = ref("");
//控制添加分类弹窗
const dialogVisible = ref(false);





const cageModel=ref({
    id: "",
    loc: "",
    size:"" ,
    breed: "",
    placeDate: ""
  
})





const rules = {
  loc: [
    { required: true, message: "请输入网箱地理位置", trigger: "blur" },
  ],
    size: [
    { required: true, message: "请输入网箱规格", trigger: "blur" },
  ],
    breed: [
    { required: true, message: "请输入养殖品种名称", trigger: "blur" },
  ],
    placeDate: [
    { required: true, message: "请输入鱼苗投放日期", trigger: "blur" },
  ]
};






//访问后台，添加文章分类
import { ElMessage } from "element-plus";








const addCage = async () => {
  //调用接口
  let result = await cageAddService(cageModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");

  //调用获取所有文章分类的函数
  cageList();
  dialogVisible.value = false;
};

















//修改分类回显
const updateCage = async () => {
  //调用接口
  let result = await cageUpdateService(cageModel.value);

  ElMessage.success(result.msg ? result.msg : "修改成功");

  //调用获取所有分类的函数
 cageList();

  //隐藏弹窗
  dialogVisible.value = false;
};

//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true;
  title.value = "编辑数据";
  //数据拷贝
    cageModel.value.loc = row.loc;
   cageModel.value.size = row.size;
   cageModel.value.breed = row.breed;
   cageModel.value.placeDate = row.placeDate;
   

  //扩展id属性,将来需要传递给后台,完成分类的修改
  cageModel.value.id = row.id;
};











//清空模型数据





const clearCageModel = () => {
  (cageModel.value.loc = ""),
  (cageModel.value.size = ""),
  (cageModel.value.breed = ""),
  (cageModel.value.placeDate = "");
};


























//删除分类
import { ElMessageBox } from "element-plus";





const deleteCage = (row) => {
  //提示用户  确认框

  ElMessageBox.confirm("你确认要删除该数据吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //调用接口
      let result = await cageDeleteService(row.id);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      //刷新列表
      cageList();
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
        <span>网箱数据显示</span>
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
              clearCageModel();
            "
            style="margin-left: 10px"
            >添加数据</el-button
          >
        </div>
      </div>
    </template>




    <el-table :data="cage" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="位置" prop="loc"></el-table-column>
      <el-table-column label="网箱容量(m³)" prop="size"></el-table-column>
      <el-table-column label="养殖种类" prop="breed"></el-table-column>
    <el-table-column label="放苗时间" prop="placeDate"  width="100"></el-table-column>
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
            @click="deleteCage(row)"
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
        :model="cageModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="位置" prop="loc">
          <el-input
            v-model="cageModel.loc"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
          
          <el-form-item label="网箱规格" prop="size">
          <el-input
          placeholder="(m³)"
            v-model="cageModel.size"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>

          <el-form-item label="养殖品种" prop="breed">
          <el-input
            v-model="cageModel.breed"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>

        

      

         <el-date-picker 
        v-model="cageModel.placeDate"
        type="datetime"
        placeholder="采样时间"
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
            @click="title == '添加数据' ? addCage() : updateCage()"
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