<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="报名记录ID" prop="joinId">
          <el-input
            v-model="queryParams.joinId"
            placeholder="请输入报名记录ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="sessionId">
          <template #label>
            场次
            <LabelHint content="周期活动时用" />
          </template>
          <el-input
            v-model="queryParams.sessionId"
            placeholder="请输入场次"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkInTime">
          <el-date-picker clearable
            v-model="queryParams.checkInTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择签到时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签到方式" prop="checkInMethod">
          <el-select v-model="queryParams.checkInMethod" placeholder="请选择签到方式" clearable filterable style="width: 180px">
            <el-option v-for="item in checkInMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="operatorId">
          <template #label>
            操作人
            <LabelHint content="手动签到时" />
          </template>
          <UserSelect
            v-model="queryParams.operatorId"
            placeholder="请选择操作人"
            clearable
            @keyup.enter="handleQuery"
          />
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
            v-hasPermi="['bt10:eventcheckin:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventcheckin:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventcheckin:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventcheckin:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventcheckinList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="报名记录ID" align="center" prop="joinId" />
      <el-table-column label="场次" align="center" prop="sessionId" />
        <el-table-column label="签到时间" align="center" prop="checkInTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.checkInTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="签到方式" align="center" prop="checkInMethod">
        <template #default="scope">
          {{ getOptionLabel(checkInMethodOptions, scope.row.checkInMethod) }}
        </template>
      </el-table-column>
      <el-table-column label="签到位置" align="center" prop="checkInLocation" />
      <el-table-column label="操作人" align="center" prop="operatorId" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          {{ getOptionLabel(statusOptions, scope.row.status) }}
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventcheckin:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventcheckin:remove']">删除</el-button>
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

    <!-- 添加或修改单次签到记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventcheckinRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报名记录ID" prop="joinId">
          <el-input v-model="form.joinId" placeholder="请输入报名记录ID" />
        </el-form-item>
        <el-form-item prop="sessionId">
          <template #label>
            场次
            <LabelHint content="周期活动时用" />
          </template>
          <el-input v-model="form.sessionId" placeholder="请输入场次" />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkInTime">
          <el-date-picker clearable
            v-model="form.checkInTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择签到时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签到方式" prop="checkInMethod">
          <el-select v-model="form.checkInMethod" placeholder="请选择签到方式" clearable filterable style="width: 100%">
            <el-option v-for="item in checkInMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="operatorId">
          <template #label>
            操作人
            <LabelHint content="手动签到时" />
          </template>
          <UserSelect v-model="form.operatorId" placeholder="请选择操作人" />
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

<script setup name="Eventcheckin">
import { listEventcheckin, getEventcheckin, delEventcheckin, addEventcheckin, updateEventcheckin } from "@/api/bt10/eventcheckin";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";
import LabelHint from "@/components/LabelHint";

const { proxy } = getCurrentInstance();

const eventcheckinList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const checkInMethodOptions = ref([]);
const statusOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    joinId: null,
    sessionId: null,
    checkInTime: null,
    checkInMethod: null,
    checkInLocation: null,
    operatorId: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function getOptionLabel(options, value) {
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  checkInMethodOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.CHECK_IN_METHOD);
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    checkInMethodOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.CHECK_IN_METHOD);
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  });
}

/** 查询单次签到记录列表 */
function getList() {
  loading.value = true;
  listEventcheckin(queryParams.value).then(response => {
    eventcheckinList.value = response.rows;
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
    joinId: null,
    sessionId: null,
    checkInTime: null,
    checkInMethod: null,
    checkInLocation: null,
    operatorId: null,
    createId: null,
    createBy: null,
    createTime: null,
    updateId: null,
    updateBy: null,
    updateTime: null,
    status: null,
    delFlag: null,
    remark: null
  };
  proxy.resetForm("eventcheckinRef");
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
  title.value = "添加单次签到记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getEventcheckin(_id).then(response => {
    form.value = response.data;
    form.value.operatorId = form.value.operatorId == null ? null : String(form.value.operatorId);
    open.value = true;
    title.value = "修改单次签到记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventcheckinRef"].validate(valid => {
    if (valid) {
      form.value.operatorId = form.value.operatorId == null || form.value.operatorId === '' ? null : String(form.value.operatorId);
      if (form.value.id != null) {
        updateEventcheckin(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventcheckin(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除单次签到记录编号为"' + _ids + '"的数据项？').then(function() {
    return delEventcheckin(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventcheckin/export', {
    ...queryParams.value
  }, `eventcheckin_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
