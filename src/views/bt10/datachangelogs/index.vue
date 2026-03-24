<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="被变更表名" prop="tableName">
          <el-input
            v-model="queryParams.tableName"
            placeholder="请输入被变更表名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="被变更记录ID" prop="recordId">
          <el-input
            v-model="queryParams.recordId"
            placeholder="请输入被变更记录ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="fieldName">
          <template #label>
            变更字段
            <LabelHint content="更新时" />
          </template>
          <el-input
            v-model="queryParams.fieldName"
            placeholder="请输入变更字段"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作人用户" prop="operatorId">
          <UserSelect
            v-model="queryParams.operatorId"
            placeholder="请选择操作人用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作IP" prop="ipAddress">
          <el-input
            v-model="queryParams.ipAddress"
            placeholder="请输入操作IP"
            clearable
            @keyup.enter="handleQuery"
          />
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
            v-hasPermi="['bt10:datachangelogs:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:datachangelogs:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:datachangelogs:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:datachangelogs:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="datachangelogsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="被变更表名" align="center" prop="tableName" />
      <el-table-column label="被变更记录ID" align="center" prop="recordId" />
      <el-table-column label="变更类型" align="center" prop="changeType">
        <template #default="scope">
          {{ getOptionLabel(changeTypeOptions, scope.row.changeType) }}
        </template>
      </el-table-column>
      <el-table-column label="变更字段" align="center" prop="fieldName">
        <template #header>
          变更字段
          <LabelHint content="更新时" />
        </template>
      </el-table-column>
      <el-table-column label="旧值" align="center" prop="oldValue" />
      <el-table-column label="新值" align="center" prop="newValue" />
      <el-table-column label="变更原因" align="center" prop="changeReason" />
      <el-table-column label="操作人用户" align="center" prop="operatorId" />
      <el-table-column label="操作人类型" align="center" prop="operatorType">
        <template #default="scope">
          {{ getOptionLabel(operatorTypeOptions, scope.row.operatorType) }}
        </template>
      </el-table-column>
      <el-table-column label="操作IP" align="center" prop="ipAddress" />
      <el-table-column label="UA" align="center" prop="userAgent" />
        <el-table-column label="变更时间" align="center" prop="changedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.changedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="扩展元数据" align="center" prop="metadata" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:datachangelogs:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:datachangelogs:remove']">删除</el-button>
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

    <!-- 添加或修改通知公告表对话框 -->
    <el-dialog :title="title" v-model="open" width="980px" append-to-body>
      <el-form ref="datachangelogsRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="被变更表名" prop="tableName"><el-input v-model="form.tableName" placeholder="请输入被变更表名" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="被变更记录ID" prop="recordId"><el-input v-model="form.recordId" placeholder="请输入被变更记录ID" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="变更类型" prop="changeType"><el-select v-model="form.changeType" placeholder="请选择变更类型" clearable filterable style="width: 100%"><el-option v-for="item in changeTypeOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item prop="fieldName">
              <template #label>
                变更字段
                <LabelHint content="更新时" />
              </template>
              <el-input v-model="form.fieldName" placeholder="请输入变更字段" />
            </el-form-item>
          </el-col>
          <el-col :span="24"><el-form-item label="旧值" prop="oldValue"><el-input v-model="form.oldValue" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="新值" prop="newValue"><el-input v-model="form.newValue" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="变更原因" prop="changeReason"><el-input v-model="form.changeReason" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="操作人用户" prop="operatorId"><UserSelect v-model="form.operatorId" placeholder="请选择操作人用户" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="操作人类型" prop="operatorType"><el-select v-model="form.operatorType" placeholder="请选择操作人类型" clearable filterable style="width: 100%"><el-option v-for="item in operatorTypeOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="操作IP" prop="ipAddress"><el-input v-model="form.ipAddress" placeholder="请输入操作IP" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="UA" prop="userAgent"><el-input v-model="form.userAgent" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="变更时间" prop="changedTime"><el-date-picker clearable v-model="form.changedTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择变更时间" style="width: 100%" /></el-form-item></el-col>
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

<script setup name="Datachangelogs">
import { listDatachangelogs, getDatachangelogs, delDatachangelogs, addDatachangelogs, updateDatachangelogs } from "@/api/bt10/datachangelogs";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";
import LabelHint from "@/components/LabelHint";

const { proxy } = getCurrentInstance();

const datachangelogsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const changeTypeOptions = ref([]);
const operatorTypeOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tableName: null,
    recordId: null,
    changeType: null,
    fieldName: null,
    oldValue: null,
    newValue: null,
    changeReason: null,
    operatorId: null,
    operatorType: null,
    ipAddress: null,
    userAgent: null,
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
  changeTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.CHANGE_TYPE);
  operatorTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.OPERATOR_TYPE);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    changeTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.CHANGE_TYPE);
    operatorTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.OPERATOR_TYPE);
  });
}

/** 查询通知公告表列表 */
function getList() {
  loading.value = true;
  listDatachangelogs(queryParams.value).then(response => {
    datachangelogsList.value = response.rows;
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
    tableName: null,
    recordId: null,
    changeType: null,
    fieldName: null,
    oldValue: null,
    newValue: null,
    changeReason: null,
    operatorId: null,
    operatorType: null,
    ipAddress: null,
    userAgent: null,
    changedTime: null,
    metadata: null,
    remark: null
  };
  proxy.resetForm("datachangelogsRef");
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
  title.value = "添加通知公告表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getDatachangelogs(_id).then(response => {
    form.value = response.data;
    form.value.operatorId = form.value.operatorId == null ? null : String(form.value.operatorId);
    open.value = true;
    title.value = "修改通知公告表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["datachangelogsRef"].validate(valid => {
    if (valid) {
      form.value.operatorId = form.value.operatorId == null || form.value.operatorId === '' ? null : String(form.value.operatorId);
      if (form.value.id != null) {
        updateDatachangelogs(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDatachangelogs(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除通知公告表编号为"' + _ids + '"的数据项？').then(function() {
    return delDatachangelogs(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/datachangelogs/export', {
    ...queryParams.value
  }, `datachangelogs_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
