<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="88px">
        <el-form-item label="活动" prop="eventId">
          <el-select
            v-model="queryParams.eventId"
            placeholder="请选择活动"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodEvent"
            :loading="loadingEventOptions"
            style="width: 260px"
            @visible-change="handleEventSelectVisibleChange"
          >
            <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingEventOptions || eventOptionFinished" @click="loadMoreEventOptions">
                  {{ eventOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="报名用户" prop="userId">
          <UserSelect v-model="queryParams.userId" placeholder="请选择报名用户" style="width: 260px" />
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input-number v-model="queryParams.paymentAmount" :min="0" :precision="2" :step="0.1" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="报名状态" prop="bizStatus">
          <el-select v-model="queryParams.bizStatus" placeholder="请选择报名状态" clearable filterable style="width: 180px">
            <el-option v-for="item in bizStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付状态" prop="paymentStatus">
          <el-select v-model="queryParams.paymentStatus" placeholder="请选择支付状态" clearable filterable style="width: 180px">
            <el-option v-for="item in paymentStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="queryParams.paymentMethod" placeholder="请选择支付方式" clearable filterable style="width: 180px">
            <el-option v-for="item in paymentMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付单号" prop="paymentNo">
          <el-input
            v-model="queryParams.paymentNo"
            placeholder="请输入支付单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkedInTime">
          <el-date-picker clearable
            v-model="queryParams.checkedInTime"
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
        <el-form-item label="转化状态" prop="conversionStatus">
          <el-select v-model="queryParams.conversionStatus" placeholder="请选择转化状态" clearable filterable style="width: 180px">
            <el-option v-for="item in conversionStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="转化产品ID" prop="conversionProductId">
          <el-input
            v-model="queryParams.conversionProductId"
            placeholder="请输入转化产品ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="转化金额" prop="conversionAmount">
          <el-input-number v-model="queryParams.conversionAmount" :min="0" :precision="2" :step="0.1" controls-position="right" style="width: 180px" />
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
            v-hasPermi="['bt10:eventjoin:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventjoin:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventjoin:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventjoin:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventjoinList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="活动" align="center" prop="eventId" />
      <el-table-column label="报名用户" align="center" prop="userId" />
      <el-table-column label="报名状态" align="center" prop="bizStatus">
        <template #default="scope">
          {{ getOptionLabel(bizStatusOptions, scope.row.bizStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="报名表单填写数据" align="center" prop="joinForm" />
      <el-table-column label="支付状态" align="center" prop="paymentStatus">
        <template #default="scope">
          {{ getOptionLabel(paymentStatusOptions, scope.row.paymentStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="paymentAmount" />
      <el-table-column label="支付方式" align="center" prop="paymentMethod">
        <template #default="scope">
          {{ getOptionLabel(paymentMethodOptions, scope.row.paymentMethod) }}
        </template>
      </el-table-column>
      <el-table-column label="支付单号" align="center" prop="paymentNo" />
        <el-table-column label="签到时间" align="center" prop="checkedInTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.checkedInTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="签到方式" align="center" prop="checkInMethod">
        <template #default="scope">
          {{ getOptionLabel(checkInMethodOptions, scope.row.checkInMethod) }}
        </template>
      </el-table-column>
      <el-table-column label="签到位置信息" align="center" prop="checkInLocation" />
      <el-table-column label="转化状态" align="center" prop="conversionStatus">
        <template #default="scope">
          {{ getOptionLabel(conversionStatusOptions, scope.row.conversionStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="转化产品ID" align="center" prop="conversionProductId" />
      <el-table-column label="转化金额" align="center" prop="conversionAmount" />
      <el-table-column label="转化备注" align="center" prop="conversionNotes" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          {{ getOptionLabel(statusOptions, scope.row.status) }}
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventjoin:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventjoin:remove']">删除</el-button>
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

    <!-- 添加或修改用户活动报名记录对话框 -->
    <el-dialog :title="title" v-model="open" width="860px" append-to-body>
      <el-form ref="eventjoinRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="活动" prop="eventId">
              <el-select
                v-model="form.eventId"
                placeholder="请选择活动"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="remoteMethodEvent"
                :loading="loadingEventOptions"
                style="width: 100%"
                @visible-change="handleEventSelectVisibleChange"
              >
                <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
                <template #footer>
                  <div style="display:flex;justify-content:center;padding:6px 0;">
                    <el-button link :disabled="loadingEventOptions || eventOptionFinished" @click="loadMoreEventOptions">
                      {{ eventOptionFinished ? '已加载全部' : '加载更多' }}
                    </el-button>
                  </div>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名用户" prop="userId">
              <UserSelect ref="joinUserSelectRef" v-model="form.userId" placeholder="请选择报名用户" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名状态" prop="bizStatus">
              <el-select v-model="form.bizStatus" placeholder="请选择报名状态" clearable filterable style="width: 100%">
                <el-option v-for="item in bizStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付状态" prop="paymentStatus">
              <el-select v-model="form.paymentStatus" placeholder="请选择支付状态" clearable filterable style="width: 100%">
                <el-option v-for="item in paymentStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="form.paymentMethod" placeholder="请选择支付方式" clearable filterable style="width: 100%">
                <el-option v-for="item in paymentMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input-number v-model="form.paymentAmount" :min="0" :precision="2" :step="0.1" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付单号" prop="paymentNo">
              <el-input v-model="form.paymentNo" placeholder="请输入支付单号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签到时间" prop="checkedInTime">
              <el-date-picker clearable v-model="form.checkedInTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择签到时间" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签到方式" prop="checkInMethod">
              <el-select v-model="form.checkInMethod" placeholder="请选择签到方式" clearable filterable style="width: 100%">
                <el-option v-for="item in checkInMethodOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转化状态" prop="conversionStatus">
              <el-select v-model="form.conversionStatus" placeholder="请选择转化状态" clearable filterable style="width: 100%">
                <el-option v-for="item in conversionStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转化产品ID" prop="conversionProductId">
              <el-input v-model="form.conversionProductId" placeholder="请输入转化产品ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转化金额" prop="conversionAmount">
              <el-input-number v-model="form.conversionAmount" :min="0" :precision="2" :step="0.1" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="转化备注" prop="conversionNotes">
              <el-input v-model="form.conversionNotes" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
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

<script setup name="Eventjoin">
import { listEventjoin, getEventjoin, delEventjoin, addEventjoin, updateEventjoin } from "@/api/bt10/eventjoin";
import { listEventinfo } from "@/api/bt10/eventinfo";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS, BT10_STATUS_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const bizStatusOptions = ref([]);
const paymentStatusOptions = ref([]);
const paymentMethodOptions = ref([]);
const checkInMethodOptions = ref([]);
const conversionStatusOptions = ref([]);
const statusOptions = ref([]);

const eventjoinList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const joinUserSelectRef = ref(null);
const eventOptions = ref([]);
const loadingEventOptions = ref(false);
const eventOptionPage = ref(1);
const eventOptionFinished = ref(false);
const eventKeyword = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    eventId: null,
    userId: null,
    bizStatus: null,
    joinForm: null,
    paymentStatus: null,
    paymentAmount: null,
    paymentMethod: null,
    paymentNo: null,
    checkedInTime: null,
    checkInMethod: null,
    checkInLocation: null,
    conversionStatus: null,
    conversionProductId: null,
    conversionAmount: null,
    conversionNotes: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function getOptionLabel(options, value) {
  return options.find(item => item.value === value)?.label ?? value;
}

function toEventOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.title || "活动"
  };
}

function ensureEventOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!eventOptions.value.some(item => item.value === v)) {
    eventOptions.value = [{ value: v, label: label || "未知活动" }, ...eventOptions.value];
  }
}

function fetchEventOptions(reset = false) {
  if (loadingEventOptions.value) return Promise.resolve();
  loadingEventOptions.value = true;
  const params = {
    pageNum: eventOptionPage.value,
    pageSize: 20
  };
  if (eventKeyword.value) {
    params.title = eventKeyword.value;
  }
  return listEventinfo(params).then(res => {
    const rows = res.rows || [];
    const mapped = rows.map(toEventOption);
    if (reset) {
      eventOptions.value = mapped;
    } else {
      const seen = new Set(eventOptions.value.map(item => item.value));
      eventOptions.value = eventOptions.value.concat(mapped.filter(item => !seen.has(item.value)));
    }
    eventOptionFinished.value = rows.length < params.pageSize;
  }).finally(() => {
    loadingEventOptions.value = false;
  });
}

function remoteMethodEvent(query) {
  eventKeyword.value = String(query || "").trim();
  eventOptionPage.value = 1;
  eventOptionFinished.value = false;
  fetchEventOptions(true);
}

function loadMoreEventOptions() {
  if (loadingEventOptions.value || eventOptionFinished.value) return;
  eventOptionPage.value += 1;
  fetchEventOptions(false);
}

function handleEventSelectVisibleChange(visible) {
  if (!visible) return;
  if (!eventOptions.value.length) {
    remoteMethodEvent("");
  }
}

function loadBt10Enums() {
  bizStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.EVENT_JOIN, true);
  paymentStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.PAYMENT, true);
  conversionStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.CONVERSION, true);
  paymentMethodOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.PAYMENT_METHOD);
  checkInMethodOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.CHECK_IN_METHOD);
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);

  return ensureBt10EnumsAndStatusLoaded().then(() => {
    bizStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.EVENT_JOIN, true);
    paymentStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.PAYMENT, true);
    conversionStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.CONVERSION, true);
    paymentMethodOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.PAYMENT_METHOD);
    checkInMethodOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.CHECK_IN_METHOD);
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  });
}

/** 查询用户活动报名记录列表 */
function getList() {
  loading.value = true;
  listEventjoin(queryParams.value).then(response => {
    eventjoinList.value = response.rows;
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
    eventId: null,
    userId: null,
    bizStatus: null,
    joinForm: null,
    paymentStatus: null,
    paymentAmount: null,
    paymentMethod: null,
    paymentNo: null,
    checkedInTime: null,
    checkInMethod: null,
    checkInLocation: null,
    conversionStatus: null,
    conversionProductId: null,
    conversionAmount: null,
    conversionNotes: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
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
  proxy.resetForm("eventjoinRef");
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
  remoteMethodEvent("");
  open.value = true;
  title.value = "添加用户活动报名记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getEventjoin(_id).then(response => {
    form.value = response.data;
    form.value.eventId = form.value.eventId == null ? null : String(form.value.eventId);
    form.value.userId = form.value.userId == null ? null : String(form.value.userId);
    ensureEventOption(form.value.eventId);
    open.value = true;
    nextTick(() => {
      if (form.value.userId != null && joinUserSelectRef.value) {
        joinUserSelectRef.value.setOption("用户" + form.value.userId, form.value.userId);
      }
    });
    title.value = "修改用户活动报名记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventjoinRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.eventId = payload.eventId == null || payload.eventId === "" ? null : String(payload.eventId);
      payload.userId = payload.userId == null || payload.userId === "" ? null : String(payload.userId);
      payload.conversionProductId = payload.conversionProductId == null || payload.conversionProductId === "" ? null : String(payload.conversionProductId);
      if (form.value.id != null) {
        updateEventjoin(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventjoin(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户活动报名记录编号为"' + _ids + '"的数据项？').then(function() {
    return delEventjoin(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventjoin/export', {
    ...queryParams.value
  }, `eventjoin_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
