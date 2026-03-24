<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变更字段" prop="changeField">
          <el-select v-model="queryParams.changeField" placeholder="请选择变更字段" clearable filterable style="width: 180px">
            <el-option v-for="item in changeFieldOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="operatorId">
          <UserSelect
            v-model="queryParams.operatorId"
            placeholder="请选择操作人"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作人类型" prop="operatorType">
          <el-select v-model="queryParams.operatorType" placeholder="请选择操作人类型" clearable filterable style="width: 160px">
            <el-option v-for="item in operatorTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更时间" prop="changedTime">
          <el-date-picker clearable
            v-model="queryParams.changedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择变更时间">
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
            v-hasPermi="['bt10:userchangelog:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:userchangelog:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:userchangelog:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:userchangelog:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userchangelogList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户" align="center" prop="userId" />
      <el-table-column label="变更字段" align="center" prop="changeField">
        <template #default="scope">
          {{ getOptionLabel(changeFieldOptions, scope.row.changeField) }}
        </template>
      </el-table-column>
      <el-table-column label="旧值" align="center" prop="oldValue" />
      <el-table-column label="新值" align="center" prop="newValue" />
      <el-table-column label="变更原因" align="center" prop="changeReason" />
      <el-table-column label="操作人" align="center" prop="operatorId" />
      <el-table-column label="操作人类型" align="center" prop="operatorType">
        <template #default="scope">
          {{ getOptionLabel(operatorTypeOptions, scope.row.operatorType) }}
        </template>
      </el-table-column>
        <el-table-column label="变更时间" align="center" prop="changedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.changedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="扩展信息" align="center" prop="metadata" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:userchangelog:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:userchangelog:remove']">删除</el-button>
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

    <!-- 添加或修改用户贡献点收支流水对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userchangelogRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <UserSelect v-model="form.userId" placeholder="请选择用户" />
        </el-form-item>
        <el-form-item label="变更字段" prop="changeField">
          <el-select v-model="form.changeField" placeholder="请选择变更字段" clearable filterable style="width: 100%">
            <el-option v-for="item in changeFieldOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="旧值" prop="oldValue">
          <el-input v-model="form.oldValue" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="新值" prop="newValue">
          <el-input v-model="form.newValue" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="变更原因" prop="changeReason">
          <el-input v-model="form.changeReason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="操作人" prop="operatorId">
          <UserSelect v-model="form.operatorId" placeholder="请选择操作人" />
        </el-form-item>
        <el-form-item label="操作人类型" prop="operatorType">
          <el-select v-model="form.operatorType" placeholder="请选择操作人类型" clearable filterable style="width: 100%">
            <el-option v-for="item in operatorTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更时间" prop="changedTime">
          <el-date-picker clearable
            v-model="form.changedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择变更时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
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

<script setup name="Userchangelog">
import { listUserchangelog, getUserchangelog, delUserchangelog, addUserchangelog, updateUserchangelog } from "@/api/bt10/userchangelog";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const userchangelogList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const operatorTypeOptions = ref([]);
const changeFieldOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    changeField: null,
    oldValue: null,
    newValue: null,
    changeReason: null,
    operatorId: null,
    operatorType: null,
    changedTime: null,
    metadata: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function getOptionLabel(options, value) {
  if (value == null || value === '') return value;
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  operatorTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.OPERATOR_TYPE);
  changeFieldOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.USER_CHANGE_FIELD);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    operatorTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.OPERATOR_TYPE);
    changeFieldOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.USER_CHANGE_FIELD);
  });
}

/** 查询用户贡献点收支流水列表 */
function getList() {
  loading.value = true;
  listUserchangelog(queryParams.value).then(response => {
    userchangelogList.value = response.rows;
    total.value = response.total;
    loading.value = false;
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
    userId: null,
    changeField: null,
    oldValue: null,
    newValue: null,
    changeReason: null,
    operatorId: null,
    operatorType: null,
    changedTime: null,
    metadata: null,
    remark: null
  };
  proxy.resetForm("userchangelogRef");
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
  title.value = "添加用户贡献点收支流水";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getUserchangelog(_id).then(response => {
    form.value = response.data;
    form.value.userId = form.value.userId == null ? null : String(form.value.userId);
    form.value.operatorId = form.value.operatorId == null ? null : String(form.value.operatorId);
    open.value = true;
    title.value = "修改用户贡献点收支流水";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userchangelogRef"].validate(valid => {
    if (valid) {
      form.value.userId = form.value.userId == null || form.value.userId === '' ? null : String(form.value.userId);
      form.value.operatorId = form.value.operatorId == null || form.value.operatorId === '' ? null : String(form.value.operatorId);
      if (form.value.id != null) {
        updateUserchangelog(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUserchangelog(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户贡献点收支流水编号为"' + _ids + '"的数据项？').then(function() {
    return delUserchangelog(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/userchangelog/export', {
    ...queryParams.value
  }, `userchangelog_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
