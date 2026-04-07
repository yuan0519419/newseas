<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";

const selectedDate = ref(null);
//88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888

const sea = ref([
  {
     id: 163,
    o: 9.87,
    nh: 0.14,
    no: 0.07,
    temp: 33.65,
    salinity: 33.28,
    turbidity: 6.71,
    ph: 14.22,
    chl: 16.48,
    currVel: 16.78,
    orp:400,
    sampleTime: "2025-06-26 04:00:00"
  },
]);
//88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
//要等待结果同步返回，使用异步函数
/* import {
  articleCategoryListService,
  articleCategoryAddService,
  articleCategoryUpdateService,
  articleCategoryDeleteService,
} from "@/api/article";
const articleCategoryList = async () => {
  let result = await articleCategoryListService();
  categorys.value = result.data;
}; */




import {
  seaDataListService,
  seaDataAddService,
  seaDataUpdateService,
  seaDataDeleteService,
  seaDataByDateService
} from "@/api/sea";
const searchByDate = async () => {
  if (!selectedDate.value) {
    ElMessage.warning('请选择查询日期');
    return;
  }
  const date = selectedDate.value;
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  let result = await seaDataByDateService(formattedDate);
  sea.value = result.data;
};

const seaDataList = async () => {
  let result = await seaDataListService();
  sea.value = result.data;
};




seaDataList();

const title = ref("");
//控制添加分类弹窗
const dialogVisible = ref(false);

//8888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
const seaModel = ref({
    id:"",
    o: "",
    nh: "",
    no: "",
    temp: "",
    salinity: "",
    turbidity: "",
    ph: "",
    chl:"",
    currVel: "",
    orp:"",
    sampleTime: ""
});

//888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888
//添加分类数据模型
const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});
//添加分类表单校验
const rules = {
  categoryName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
  categoryAlias: [
    { required: true, message: "请输入分类别名", trigger: "blur" },
  ],
};





const rules1 = {
  o: [
    { required: true, message: "请输入溶解氧含量", trigger: "blur" },
  ],
    nh: [
    { required: true, message: "请输入氨氮含量", trigger: "blur" },
  ],
    no: [
    { required: true, message: "请输入亚硝酸氮含量", trigger: "blur" },
  ],
    temp: [
    { required: true, message: "请输入水温", trigger: "blur" },
  ],
    salinity:  [
    { required: true, message: "请输入盐度", trigger: "blur" },
  ],
    turbidity: [
    { required: true, message: "请输入浊度含量", trigger: "blur" },
  ],
    ph: [
    { required: true, message: "请输入ph含量", trigger: "blur" },
  ],
    chl: [
    { required: true, message: "请输入叶绿素含量", trigger: "blur" },
  ],
    currVel: [
    { required: true, message: "请输入洋流流速", trigger: "blur" },
  ],
  orp: [
    { required: true, message: "请输入氧化还原电位", trigger: "blur" },
  ],
    sampleTime:  [
    { required: true, message: "请输入采样时间", trigger: "blur" },
  ]
};


//访问后台，添加文章分类
import { ElMessage } from "element-plus";




const addSeaData = async () => {
  //调用接口
  let result = await seaDataAddService(seaModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");

  //调用获取所有文章分类的函数
  seaDataList();
  dialogVisible.value = false;
};


















//修改分类回显
const updateSeaDAta = async () => {
  //调用接口
  let result = await seaDataUpdateService(seaModel.value);

  ElMessage.success(result.msg ? result.msg : "修改成功");

  //调用获取所有分类的函数
 seaDataList();

  //隐藏弹窗
  dialogVisible.value = false;
};

//展示编辑弹窗
const showDialog1 = (row) => {
  dialogVisible.value = true;
  title.value = "编辑数据";
  //数据拷贝
    seaModel.value.o = row.o;
    seaModel.value.nh = row.nh;
    seaModel.value.no = row.no;
    seaModel.value.temp = row.temp;
    seaModel.value.salinity = row.salinity;  
    seaModel.value.turbidity = row.turbidity;
    seaModel.value.ph = row.ph;
    seaModel.value.chl = row.chl;
    seaModel.value.currVel = row.currVel;
    seaModel.value.orp = row.orp;
    seaModel.value.sampleTime = row.sampleTime;
   

  //扩展id属性,将来需要传递给后台,完成分类的修改
  seaModel.value.id = row.id;
};



//清空模型数据
const clearCategoryModel = () => {
  (categoryModel.value.categoryName = ""),
    (categoryModel.value.categoryAlias = "");
};


const clearSeaModel = () => {
  (seaModel.value.o = ""),
    (seaModel.value.nh = ""),
    (seaModel.value.no = ""),
    (seaModel.value.temp = ""),
    (seaModel.value.salinity = ""),
    (seaModel.value.turbidity = ""),
    (seaModel.value.ph = ""),
    (seaModel.value.chl = ""),
    (seaModel.value.currVel = ""),
    (seaModel.value.orp = ""),
    (seaModel.value.sampleTime = "");
};






























//删除分类
import { ElMessageBox } from "element-plus";
const deleteSeaData = (row) => {
  //提示用户  确认框

  ElMessageBox.confirm("你确认要删除该数据吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      //调用接口
      let result = await seaDataDeleteService(row.id);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      //刷新列表
      seaDataList();
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
        <span>数据显示</span>
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
              clearSeaModel();
            "
            style="margin-left: 10px"
            >添加数据</el-button
          >
        </div>
      </div>
    </template>




    <el-table :data="sea" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="溶解氧" prop="o"></el-table-column>
      <el-table-column label="氨氮" prop="nh"></el-table-column>
     <el-table-column label="亚硝酸氨" prop="no"></el-table-column>
     <el-table-column label="水温" prop="temp"></el-table-column>
    <el-table-column label="盐度" prop="salinity"></el-table-column>
    <el-table-column label="浊度" prop="turbidity"></el-table-column>
    <el-table-column label="ph" prop="ph"></el-table-column>
    <el-table-column label="叶绿素" prop="chl"></el-table-column>
    <el-table-column label="洋流流速" prop="currVel"></el-table-column>
    <el-table-column label="氧化还原电位" prop="orp"></el-table-column>
    <el-table-column label="采样时间" prop="sampleTime"  width="100"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog1(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteSeaData(row)"
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
        :model="seaModel"
        :rules="rules1"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="溶解氧含量" prop="o">
          <el-input
            v-model="seaModel.o"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
          <el-form-item label="氨氮含量" prop="nh">
          <el-input
            v-model="seaModel.nh"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
          <el-form-item label="亚硝酸氮含量" prop="no">
          <el-input
            v-model="seaModel.no"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
          <el-form-item label="水温" prop="temp">
          <el-input
            v-model="seaModel.temp"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
         <el-form-item label="盐度" prop="salinity">
          <el-input
            v-model="seaModel.salinity"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
         <el-form-item label="浊度" prop="turbidity">
          <el-input
            v-model="seaModel.turbidity"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
         <el-form-item label="ph" prop="ph">
          <el-input
            v-model="seaModel.ph"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
         <el-form-item label="叶绿素含量" prop="chl">
          <el-input
            v-model="seaModel.chl"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>

        <el-form-item label="洋流流速" prop="currVel">
          <el-input
            v-model="seaModel.currVel"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>

        <el-form-item label="氧化还原电位" prop="orp">
          <el-input
            v-model="seaModel.orp"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>

         <el-date-picker 
        v-model="seaModel.sampleTime"
        type="datetime"
        placeholder="采样时间"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        date-format="MMM DD, YYYY"
        time-format="HH:mm"
      />
     
      </el-form>











      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="title == '添加数据' ? addSeaData() : updateSeaDAta()"
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