<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="小鹅通订单号" prop="xiaoeOrderNo">
          <el-input
            v-model="queryParams.xiaoeOrderNo"
            placeholder="请输入小鹅通订单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关联本平台用户" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择关联本平台用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="小鹅通订单状态" prop="orderState">
          <el-input
            v-model="queryParams.orderState"
            placeholder="请输入小鹅通订单状态"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="实际支付金额" prop="actualFee">
          <el-input
            v-model="queryParams.actualFee"
            placeholder="请输入实际支付金额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付状态" prop="payState">
          <el-input
            v-model="queryParams.payState"
            placeholder="请输入支付状态"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="第三方交易号" prop="tradeNo">
          <el-input
            v-model="queryParams.tradeNo"
            placeholder="请输入第三方交易号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="小鹅通侧创建时间" prop="xiaoeCreateTime">
          <el-date-picker clearable
            v-model="queryParams.xiaoeCreateTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择小鹅通侧创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最近同步时间" prop="lastSyncTime">
          <el-date-picker clearable
            v-model="queryParams.lastSyncTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择最近同步时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="本地订单号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入本地订单号"
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
            v-hasPermi="['bt10:xiaoeorders:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:xiaoeorders:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:xiaoeorders:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:xiaoeorders:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="xiaoeordersList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="小鹅通订单号" align="center" prop="xiaoeOrderNo" />
      <el-table-column label="关联本平台用户" align="center" prop="userId" />
      <el-table-column label="小鹅通订单状态" align="center" prop="orderState" />
      <el-table-column label="实际支付金额" align="center" prop="actualFee" />
      <el-table-column label="商品名称" align="center" prop="goodsName" />
      <el-table-column label="商品类型" align="center" prop="goodsType" />
      <el-table-column label="SPU类型" align="center" prop="spuType" />
      <el-table-column label="支付状态" align="center" prop="payState" />
      <el-table-column label="支付方式" align="center" prop="payType" />
      <el-table-column label="第三方交易号" align="center" prop="tradeNo" />
        <el-table-column label="小鹅通侧创建时间" align="center" prop="xiaoeCreateTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.xiaoeCreateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="学员信息快照" align="center" prop="studentInfo" />
      <el-table-column label="发票信息" align="center" prop="invoiceInfo" />
      <el-table-column label="同步状态" align="center" prop="syncStatus" />
        <el-table-column label="最近同步时间" align="center" prop="lastSyncTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastSyncTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="本地订单号" align="center" prop="orderNo" />
      <el-table-column label="处理状态" align="center" prop="processStatus" />
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:xiaoeorders:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:xiaoeorders:remove']">删除</el-button>
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

    <!-- 添加或修改小鹅通订单同步表对话框 -->
    <el-dialog :title="title" v-model="open" width="980px" append-to-body>
      <el-form ref="xiaoeordersRef" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="16">
          <el-col :span="8"><el-form-item label="小鹅通订单号" prop="xiaoeOrderNo"><el-input v-model="form.xiaoeOrderNo" placeholder="请输入小鹅通订单号" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="关联本平台用户" prop="userId"><UserSelect v-model="form.userId" placeholder="请选择关联本平台用户" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="小鹅通订单状态" prop="orderState"><el-input v-model="form.orderState" placeholder="请输入小鹅通订单状态" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="实际支付金额" prop="actualFee"><el-input v-model="form.actualFee" placeholder="请输入实际支付金额" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="商品名称" prop="goodsName"><el-input v-model="form.goodsName" type="textarea" placeholder="请输入内容" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="商品类型" prop="goodsType"><el-select v-model="form.goodsType" multiple filterable reserve-keyword remote-show-suffix placeholder="请选择商品类型" :loading="loadingGoodsType" style="width: 100%"><el-option v-for="item in optionsGoodsType" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="SPU类型" prop="spuType"><el-select v-model="form.spuType" multiple filterable reserve-keyword remote-show-suffix placeholder="请选择SPU类型" :loading="loadingSpuType" style="width: 100%"><el-option v-for="item in optionsSpuType" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="支付状态" prop="payState"><el-input v-model="form.payState" placeholder="请输入支付状态" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="支付方式" prop="payType"><el-select v-model="form.payType" multiple filterable reserve-keyword remote-show-suffix placeholder="请选择支付方式" :loading="loadingPayType" style="width: 100%"><el-option v-for="item in optionsPayType" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="第三方交易号" prop="tradeNo"><el-input v-model="form.tradeNo" placeholder="请输入第三方交易号" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="小鹅通侧创建时间" prop="xiaoeCreateTime"><el-date-picker clearable v-model="form.xiaoeCreateTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择小鹅通侧创建时间" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="最近同步时间" prop="lastSyncTime"><el-date-picker clearable v-model="form.lastSyncTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择最近同步时间" style="width: 100%" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="本地订单号" prop="orderNo"><el-input v-model="form.orderNo" placeholder="请输入本地订单号" /></el-form-item></el-col>
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

<script setup name="Xiaoeorders">
import { listXiaoeorders, getXiaoeorders, delXiaoeorders, addXiaoeorders, updateXiaoeorders } from "@/api/bt10/xiaoeorders";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const xiaoeordersList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    xiaoeOrderNo: null,
    userId: null,
    orderState: null,
    actualFee: null,
    goodsName: null,
    goodsType: null,
    spuType: null,
    payState: null,
    payType: null,
    tradeNo: null,
    xiaoeCreateTime: null,
    studentInfo: null,
    invoiceInfo: null,
    syncStatus: null,
    lastSyncTime: null,
    orderNo: null,
    processStatus: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询小鹅通订单同步表列表 */
function getList() {
  loading.value = true;
  listXiaoeorders(queryParams.value).then(response => {
    xiaoeordersList.value = response.rows;
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
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
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
    xiaoeOrderNo: null,
    userId: null,
    orderState: null,
    actualFee: null,
    goodsName: null,
    goodsType: null,
    spuType: null,
    payState: null,
    payType: null,
    tradeNo: null,
    xiaoeCreateTime: null,
    studentInfo: null,
    invoiceInfo: null,
    syncStatus: null,
    lastSyncTime: null,
    orderNo: null,
    processStatus: null,
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
  proxy.resetForm("xiaoeordersRef");
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
  title.value = "添加小鹅通订单同步表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getXiaoeorders(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改小鹅通订单同步表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["xiaoeordersRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateXiaoeorders(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addXiaoeorders(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除小鹅通订单同步表编号为"' + _ids + '"的数据项？').then(function() {
    return delXiaoeorders(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/xiaoeorders/export', {
    ...queryParams.value
  }, `xiaoeorders_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
