<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="优先级1-10" prop="priority">
          <el-input
            v-model="queryParams.priority"
            placeholder="请输入优先级1-10"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关联业务ID" prop="relatedId">
          <el-input
            v-model="queryParams.relatedId"
            placeholder="请输入关联业务ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="queryParams.taskType" placeholder="请选择任务类型" clearable filterable style="width: 160px">
            <el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务类型" prop="relatedType">
          <el-select v-model="queryParams.relatedType" placeholder="请选择关联业务类型" clearable filterable style="width: 180px">
            <el-option v-for="item in relatedTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="进度0-100" prop="progressPercentage">
          <el-input
            v-model="queryParams.progressPercentage"
            placeholder="请输入进度0-100"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="费用" prop="costAmount">
          <el-input
            v-model="queryParams.costAmount"
            placeholder="请输入费用"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="消耗token数" prop="tokensUsed">
          <el-input
            v-model="queryParams.tokensUsed"
            placeholder="请输入消耗token数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="使用模型" prop="modelUsed">
          <el-input
            v-model="queryParams.modelUsed"
            placeholder="请输入使用模型"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="queryParams.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间" prop="completeTime">
          <el-date-picker clearable
            v-model="queryParams.completeTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择完成时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt10">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['bt10:aitasks:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:aitasks:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:aitasks:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:aitasks:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="aitasksList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="任务类型" align="center" prop="taskType">
        <template #default="scope">
          {{ getOptionLabel(taskTypeOptions, scope.row.taskType) }}
        </template>
      </el-table-column>
      <el-table-column label="业务状态" align="center" prop="bizStatus" />
      <el-table-column label="优先级1-10" align="center" prop="priority" />
      <el-table-column label="关联业务类型" align="center" prop="relatedType">
        <template #default="scope">
          {{ getOptionLabel(relatedTypeOptions, scope.row.relatedType) }}
        </template>
      </el-table-column>
      <el-table-column label="关联业务ID" align="center" prop="relatedId" />
      <el-table-column label="任务配置" align="center" prop="config" />
      <el-table-column label="任务结果" align="center" prop="result" />
      <el-table-column label="进度0-100" align="center" prop="progressPercentage" />
      <el-table-column label="失败原因" align="center" prop="errorMessage" />
      <el-table-column label="费用" align="center" prop="costAmount" />
      <el-table-column label="消耗token数" align="center" prop="tokensUsed" />
      <el-table-column label="使用模型" align="center" prop="modelUsed" />
        <el-table-column label="开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" align="center" prop="completeTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.completeTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:aitasks:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:aitasks:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 添加或修改AI异步任务对话框 -->
    <el-dialog :title="title" v-model="open" width="960px" append-to-body>
      <el-form ref="aitasksRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="任务类型" prop="taskType"><el-select v-model="form.taskType" placeholder="请选择任务类型" clearable filterable style="width: 100%"><el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="优先级1-10" prop="priority"><el-input v-model="form.priority" placeholder="请输入优先级1-10" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="关联业务类型" prop="relatedType"><el-select v-model="form.relatedType" placeholder="请选择关联业务类型" clearable filterable style="width: 100%"><el-option v-for="item in relatedTypeOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="关联业务ID" prop="relatedId"><el-input v-model="form.relatedId" placeholder="请输入关联业务ID" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="进度0-100" prop="progressPercentage"><el-input v-model="form.progressPercentage" placeholder="请输入进度0-100" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="失败原因" prop="errorMessage"><el-input v-model="form.errorMessage" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="费用" prop="costAmount"><el-input v-model="form.costAmount" placeholder="请输入费用" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="消耗token数" prop="tokensUsed"><el-input v-model="form.tokensUsed" placeholder="请输入消耗token数" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="使用模型" prop="modelUsed"><el-input v-model="form.modelUsed" placeholder="请输入使用模型" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="开始时间" prop="startTime"><el-date-picker clearable v-model="form.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始时间" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="完成时间" prop="completeTime"><el-date-picker clearable v-model="form.completeTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择完成时间" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="备注" prop="remark"><el-input v-model="form.remark" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Aitasks">
import { listAitasks, getAitasks, delAitasks, addAitasks, updateAitasks } from "@/api/bt10/aitasks";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const aitasksList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);
const taskTypeOptions = ref([]);
const relatedTypeOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskType: null,
    bizStatus: null,
    priority: null,
    relatedType: null,
    relatedId: null,
    config: null,
    result: null,
    progressPercentage: null,
    errorMessage: null,
    costAmount: null,
    tokensUsed: null,
    modelUsed: null,
    startTime: null,
    completeTime: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询AI异步任务列表 */
function getList() {
  loading.value = true;
  listAitasks(queryParams.value).then(response => {
    aitasksList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getOptionLabel(options, value) {
  if (value == null || value === '') return value;
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  taskTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.TASK_TYPE);
  relatedTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.RELATED_TYPE);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    taskTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.TASK_TYPE);
    relatedTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.RELATED_TYPE);
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    taskType: null,
    bizStatus: null,
    priority: null,
    relatedType: null,
    relatedId: null,
    config: null,
    result: null,
    progressPercentage: null,
    errorMessage: null,
    costAmount: null,
    tokensUsed: null,
    modelUsed: null,
    startTime: null,
    completeTime: null,
    createId: null,
    createBy: null,
    createTime: null,
    updateId: null,
    updateBy: null,
    updateTime: null,
    deleteId: null,
    deleteTime: null,
    status: null,
    delFlag: null,
    remark: null
  };
  proxy.resetForm("aitasksRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加AI异步任务";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getAitasks(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改AI异步任务";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["aitasksRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAitasks(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAitasks(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row?.id ?? ids.value;
  proxy.$modal.confirm('是否确认删除AI异步任务编号为"' + _ids + '"的数据项？').then(function() {
    return delAitasks(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/aitasks/export', {
    ...queryParams.value
  }, `aitasks_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
