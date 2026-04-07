<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";

const selectedDate = ref(null);
const cage = ref([{
  id: 1,
  loc: "遂溪",
  size: 500,
  breed: "金鲳鱼",
  placeDate: "2025-07-02"
}]);

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
const dialogVisible = ref(false);
const cageModel = ref({
  id: "",
  loc: "",
  size: "",
  breed: "",
  placeDate: ""
});

const rules = {
  loc: [{ required: true, message: "请输入网箱地理位置", trigger: "blur" }],
  size: [{ required: true, message: "请输入网箱规格", trigger: "blur" }],
  breed: [{ required: true, message: "请输入养殖品种名称", trigger: "blur" }],
  placeDate: [{ required: true, message: "请输入鱼苗投放日期", trigger: "blur" }]
};

import { ElMessage } from "element-plus";

const addCage = async () => {
  let result = await cageAddService(cageModel.value);
  ElMessage.success(result.msg ? result.msg : "添加成功");
  cageList();
  dialogVisible.value = false;
};

const updateCage = async () => {
  let result = await cageUpdateService(cageModel.value);
  ElMessage.success(result.msg ? result.msg : "修改成功");
  cageList();
  dialogVisible.value = false;
};

const showDialog = (row) => {
  dialogVisible.value = true;
  title.value = "编辑数据";
  cageModel.value.loc = row.loc;
  cageModel.value.size = row.size;
  cageModel.value.breed = row.breed;
  cageModel.value.placeDate = row.placeDate;
  cageModel.value.id = row.id;
};

const clearCageModel = () => {
  cageModel.value.loc = "";
  cageModel.value.size = "";
  cageModel.value.breed = "";
  cageModel.value.placeDate = "";
};

import { ElMessageBox } from "element-plus";

const deleteCage = (row) => {
  ElMessageBox.confirm("你确认要删除该数据吗?", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await cageDeleteService(row.id);
      ElMessage({ type: "success", message: "删除成功" });
      cageList();
    })
    .catch(() => {
      ElMessage({ type: "info", message: "用户取消了删除" });
    });
};
</script>

<template>
  <el-card class="page-container" shadow="hover">
    <template #header>
      <div class="header flex justify-between items-center pb-4">
        <h3 class="text-lg font-semibold text-gray-800">网箱数据显示</h3>
        <div class="extra flex items-center space-x-3">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            size="small"
            class="w-48"
          />
          <el-button
            type="primary"
            size="small"
            @click="searchByDate"
            class="px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md flex items-center"
          >
            <i class="el-icon-search mr-2"></i> 查询
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleAddClick"
            class="px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md flex items-center"
          >
            <i class="el-icon-plus mr-2"></i> 添加数据
          </el-button>
        </div>
      </div>
    </template>

    <el-table :data="cage" style="width: 100%" stripe border>
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="位置" prop="loc"></el-table-column>
      <el-table-column label="网箱容量" prop="size"></el-table-column>
      <el-table-column label="养殖种类" prop="breed"></el-table-column>
      <el-table-column label="放苗时间" prop="placeDate" width="100"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            size="small"
            type="primary"
            @click="showDialog(row)"
            class="transition-all duration-300 hover:scale-110"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            size="small"
            type="danger"
            @click="deleteCage(row)"
            class="transition-all duration-300 hover:scale-110"
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
          type="date"
          placeholder="采样时间"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          date-format="MMM DD, YYYY"
        />
     
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button 
            @click="dialogVisible = false"
            size="small"
            class="px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="title == '添加数据' ? addCage() : updateCage()"
            class="px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md"
          >确认</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  padding: 16px;
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  // 按钮样式优化
  .el-button {
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
    }
    
    &--primary {
      background-color: #3b82f6;
      border-color: #3b82f6;
      
      &:hover {
        background-color: #2563eb;
        border-color: #2563eb;
      }
    }
    
    &--danger {
      background-color: #ef4444;
      border-color: #ef4444;
      
      &:hover {
        background-color: #dc2626;
        border-color: #dc2626;
      }
    }
    
    &--text {
      color: #3b82f6;
      
      &:hover {
        color: #2563eb;
        background-color: rgba(59, 130, 246, 0.08);
      }
    }
  }
  
  // 表格行内按钮优化
  .el-table .el-button {
    width: 32px;
    height: 32px;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>