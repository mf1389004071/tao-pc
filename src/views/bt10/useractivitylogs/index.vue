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
        <el-form-item label="发生时间" prop="occurredTime">
          <el-date-picker clearable
            v-model="queryParams.occurredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发生时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="IP 地址" prop="ipAddress">
          <el-input
            v-model="queryParams.ipAddress"
            placeholder="请输入IP 地址"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="终端设备信息" prop="device">
          <el-input
            v-model="queryParams.device"
            placeholder="请输入终端设备信息"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="事件来源业务ID" prop="eventSourceId">
          <el-input
            v-model="queryParams.eventSourceId"
            placeholder="请输入事件来源业务ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="queryParams.eventType" placeholder="请选择事件类型" clearable filterable style="width: 160px">
            <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="事件来源业务类型" prop="eventSourceType">
          <el-select v-model="queryParams.eventSourceType" placeholder="请选择来源类型" clearable filterable style="width: 180px">
            <el-option v-for="item in eventSourceTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="pointChange">
          <template #label>
            本次积分变化
            <LabelHint content="可为空，无变更为NULL" />
          </template>
          <el-input-number v-model="queryParams.pointChange" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="变更前积分余额" prop="pointBalanceBefore">
          <el-input-number v-model="queryParams.pointBalanceBefore" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="变更后积分余额" prop="pointBalanceAfter">
          <el-input-number v-model="queryParams.pointBalanceAfter" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="本次贡献点变化" prop="contribChange">
          <el-input-number v-model="queryParams.contribChange" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="变更前贡献点余额" prop="contribBalanceBefore">
          <el-input-number v-model="queryParams.contribBalanceBefore" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="变更后贡献点余额" prop="contribBalanceAfter">
          <el-input-number v-model="queryParams.contribBalanceAfter" :min="0" controls-position="right" style="width: 180px" />
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
            v-hasPermi="['bt10:useractivitylogs:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:useractivitylogs:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:useractivitylogs:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:useractivitylogs:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="useractivitylogsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户" align="center" prop="userId" />
        <el-table-column label="发生时间" align="center" prop="occurredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.occurredTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="IP 地址" align="center" prop="ipAddress" />
      <el-table-column label="终端设备信息" align="center" prop="device" />
      <el-table-column label="事件类型" align="center" prop="eventType">
        <template #default="scope">
          {{ getOptionLabel(eventTypeOptions, scope.row.eventType) }}
        </template>
      </el-table-column>
      <el-table-column label="事件来源业务类型" align="center" prop="eventSourceType">
        <template #default="scope">
          {{ getOptionLabel(eventSourceTypeOptions, scope.row.eventSourceType) }}
        </template>
      </el-table-column>
      <el-table-column label="事件来源业务ID" align="center" prop="eventSourceId" />
      <el-table-column label="事件标签列表" align="center" prop="eventTags">
        <template #header>
          事件标签列表
          <LabelHint content="JSON" />
        </template>
      </el-table-column>
      <el-table-column label="本次积分变化" align="center" prop="pointChange">
        <template #header>
          本次积分变化
          <LabelHint content="可为空，无变更为NULL" />
        </template>
      </el-table-column>
      <el-table-column label="变更前积分余额" align="center" prop="pointBalanceBefore" />
      <el-table-column label="变更后积分余额" align="center" prop="pointBalanceAfter" />
      <el-table-column label="本次贡献点变化" align="center" prop="contribChange" />
      <el-table-column label="变更前贡献点余额" align="center" prop="contribBalanceBefore" />
      <el-table-column label="变更后贡献点余额" align="center" prop="contribBalanceAfter" />
      <el-table-column label="额外上下文" align="center" prop="extra">
        <template #header>
          额外上下文
          <LabelHint content="如停留时长、入口渠道等" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:useractivitylogs:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:useractivitylogs:remove']">删除</el-button>
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

    <!-- 添加或修改用户信息画像扩展表对话框 -->
    <el-dialog :title="title" v-model="open" width="980px" append-to-body>
      <el-form ref="useractivitylogsRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="用户" prop="userId"><UserSelect v-model="form.userId" placeholder="请选择用户" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="发生时间" prop="occurredTime"><el-date-picker clearable v-model="form.occurredTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择发生时间" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="IP 地址" prop="ipAddress"><el-input v-model="form.ipAddress" placeholder="请输入IP 地址" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="终端设备信息" prop="device"><el-input v-model="form.device" placeholder="请输入终端设备信息" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="事件类型" prop="eventType"><el-select v-model="form.eventType" placeholder="请选择事件类型" clearable filterable style="width: 100%"><el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="事件来源业务类型" prop="eventSourceType"><el-select v-model="form.eventSourceType" placeholder="请选择来源类型" clearable filterable style="width: 100%"><el-option v-for="item in eventSourceTypeOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="事件来源业务ID" prop="eventSourceId"><el-input v-model="form.eventSourceId" placeholder="请输入事件来源业务ID" /></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item prop="pointChange">
              <template #label>
                本次积分变化
                <LabelHint content="可为空，无变更为NULL" />
              </template>
              <el-input-number v-model="form.pointChange" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8"><el-form-item label="变更前积分余额" prop="pointBalanceBefore"><el-input-number v-model="form.pointBalanceBefore" :min="0" controls-position="right" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="变更后积分余额" prop="pointBalanceAfter"><el-input-number v-model="form.pointBalanceAfter" :min="0" controls-position="right" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="本次贡献点变化" prop="contribChange"><el-input-number v-model="form.contribChange" controls-position="right" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="变更前贡献点余额" prop="contribBalanceBefore"><el-input-number v-model="form.contribBalanceBefore" :min="0" controls-position="right" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="变更后贡献点余额" prop="contribBalanceAfter"><el-input-number v-model="form.contribBalanceAfter" :min="0" controls-position="right" style="width: 100%" /></el-form-item></el-col>
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

<script setup name="Useractivitylogs">
import { listUseractivitylogs, getUseractivitylogs, delUseractivitylogs, addUseractivitylogs, updateUseractivitylogs } from "@/api/bt10/useractivitylogs";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";
import LabelHint from "@/components/LabelHint";

const { proxy } = getCurrentInstance();

const useractivitylogsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);
const eventTypeOptions = ref([]);
const eventSourceTypeOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    occurredTime: null,
    ipAddress: null,
    device: null,
    eventType: null,
    eventSourceType: null,
    eventSourceId: null,
    eventTags: null,
    pointChange: null,
    pointBalanceBefore: null,
    pointBalanceAfter: null,
    contribChange: null,
    contribBalanceBefore: null,
    contribBalanceAfter: null,
    extra: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户信息画像扩展表列表 */
function getList() {
  loading.value = true;
  listUseractivitylogs(queryParams.value).then(response => {
    useractivitylogsList.value = response.rows;
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
  eventTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTIVITY_EVENT_TYPE);
  eventSourceTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTIVITY_EVENT_SOURCE_TYPE);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    eventTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTIVITY_EVENT_TYPE);
    eventSourceTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTIVITY_EVENT_SOURCE_TYPE);
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
    occurredTime: null,
    ipAddress: null,
    device: null,
    eventType: null,
    eventSourceType: null,
    eventSourceId: null,
    eventTags: null,
    pointChange: null,
    pointBalanceBefore: null,
    pointBalanceAfter: null,
    contribChange: null,
    contribBalanceBefore: null,
    contribBalanceAfter: null,
    extra: null,
    createId: null,
    createBy: null,
    createTime: null,
    status: null,
    delFlag: null,
    remark: null
  };
  proxy.resetForm("useractivitylogsRef");
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
  title.value = "添加用户信息画像扩展表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getUseractivitylogs(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户信息画像扩展表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["useractivitylogsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUseractivitylogs(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUseractivitylogs(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户信息画像扩展表编号为"' + _ids + '"的数据项？').then(function() {
    return delUseractivitylogs(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/useractivitylogs/export', {
    ...queryParams.value
  }, `useractivitylogs_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
