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
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showDialog(row)"
            size="small"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCage(row)"
            size="small"
            style="margin-left: 12px"
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
@use '@/assets/main.scss';

.page-container {
  min-height: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: var(--radius-lg);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #60A5FA, #3B82F6, #8B5CF6);
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(10, 14, 26, 0.3) 0%, transparent 50%);
    animation: wave 15s ease-in-out infinite;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(6, 182, 212, 0.3);
    position: relative;
    z-index: 1;
    
    span {
      font-size: 18px;
      font-weight: 600;
      color: #67e8f9;
    }
    
    .extra {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
  }
}

@keyframes wave {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-10%, -10%) rotate(180deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

// 表格容器样式
:deep(.el-table) {
  background: transparent !important;
  border: none;
  color: #93C5FD;
  position: relative;
  z-index: 1;
  
  .el-table__header {
    background: var(--tech-blue-800) !important;
    
    th {
      background: var(--tech-blue-800) !important;
      color: #67e8f9 !important;
      font-weight: 600;
      border-bottom: 1px solid rgba(6, 182, 212, 0.3);
      
      .cell {
        color: #67e8f9 !important;
        font-weight: 600;
      }
    }
  }
  
  .el-table__body {
    tr {
      background: rgba(17, 24, 39, 0.4) !important;
      color: #93C5FD !important;
      
      &:hover > td {
        background: rgba(59, 130, 246, 0.1) !important;
      }
      
      td {
        background: transparent !important;
        border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        color: #93C5FD !important;
        
        .cell {
          color: #93C5FD !important;
        }
      }
    }
  }
  
  .el-table__empty-block {
    background: rgba(17, 24, 39, 0.4) !important;
    color: #93C5FD;
  }
}

// 按钮样式优化
:deep(.el-button) {
  &.el-button--primary {
    background: var(--gradient-primary);
    border-color: transparent;
    color: var(--tech-blue-900);
    font-weight: 600;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--glow-md);
    }
  }
  
  &.el-button--danger {
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    border-color: transparent;
    color: white;
    font-weight: 600;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }
  }
  
  &.el-button--default {
    background: rgba(17, 24, 39, 0.6);
    border: var(--border-tech);
    color: var(--tech-blue-400);
    
    &:hover {
      border-color: var(--tech-blue-500);
      background: rgba(59, 130, 246, 0.1);
    }
  }
}

// 日期选择器样式优化
:deep(.el-date-editor) {
  .el-input__inner {
    background: rgba(10, 14, 26, 0.6);
    border: var(--border-tech);
    color: var(--tech-blue-400);
    
    &:hover {
      border-color: rgba(59, 130, 246, 0.4);
    }
    
    &:focus {
      border-color: var(--tech-blue-500);
      box-shadow: var(--glow-sm);
    }
  }
  
  .el-input__prefix {
    color: var(--tech-blue-400);
  }
}

// 对话框样式优化
:deep(.el-dialog) {
  background: var(--tech-blue-800);
  border: var(--border-tech);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  
  .el-dialog__header {
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(59, 130, 246, 0.3);
    
    .el-dialog__title {
      color: var(--tech-blue-600);
      font-weight: 600;
    }
  }
  
  .el-dialog__body {
    background: transparent;
    color: var(--tech-blue-300);
    
    .el-form-item__label {
      color: var(--tech-blue-400);
      font-weight: 500;
    }
    
    .el-input__inner {
      background: rgba(10, 14, 26, 0.6);
      border: var(--border-tech);
      color: var(--tech-blue-300);
      
      &:hover {
        border-color: rgba(59, 130, 246, 0.4);
      }
      
      &:focus {
        border-color: var(--tech-blue-500);
        box-shadow: var(--glow-sm);
      }
    }
  }
  
  .el-dialog__footer {
    background: rgba(17, 24, 39, 0.6);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(59, 130, 246, 0.3);
  }
}

// 空状态样式优化
:deep(.el-empty) {
  .el-empty__description {
    color: var(--tech-blue-400);
  }
}

// 操作按钮样式
:deep(.el-button--circle) {
  border-radius: 50%;
  padding: 8px;
  
  &.el-button--primary {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.4);
    color: var(--tech-blue-400);
    
    &:hover {
      background: rgba(59, 130, 246, 0.4);
      border-color: var(--tech-blue-500);
      color: white;
    }
  }
  
  &.el-button--danger {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: var(--tech-silver-400);
    
    &:hover {
      background: rgba(239, 68, 68, 0.4);
      border-color: #ef4444;
      color: white;
    }
  }
}
</style>