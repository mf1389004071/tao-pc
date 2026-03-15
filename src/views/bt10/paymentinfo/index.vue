<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="业务订单号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入业务订单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="下单用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入下单用户ID"
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
        <el-form-item label="订单总金额" prop="totalAmount">
          <el-input
            v-model="queryParams.totalAmount"
            placeholder="请输入订单总金额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="贡献点支付额" prop="contribAmount">
          <el-input
            v-model="queryParams.contribAmount"
            placeholder="请输入贡献点支付额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="积分支付额" prop="pointsAmount">
          <el-input
            v-model="queryParams.pointsAmount"
            placeholder="请输入积分支付额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="现金支付额" prop="cashAmount">
          <el-input
            v-model="queryParams.cashAmount"
            placeholder="请输入现金支付额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付方式：微信/支付宝/贡献点/积分等" prop="paymentMethod">
          <el-input
            v-model="queryParams.paymentMethod"
            placeholder="请输入支付方式：微信/支付宝/贡献点/积分等"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="第三方支付单号" prop="paymentNo">
          <el-input
            v-model="queryParams.paymentNo"
            placeholder="请输入第三方支付单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付成功时间" prop="paidTime">
          <el-date-picker clearable
            v-model="queryParams.paidTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择支付成功时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input
            v-model="queryParams.refundAmount"
            placeholder="请输入退款金额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="退款时间" prop="refundedTime">
          <el-date-picker clearable
            v-model="queryParams.refundedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择退款时间">
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
            v-hasPermi="['bt10:paymentinfo:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:paymentinfo:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:paymentinfo:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:paymentinfo:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="paymentinfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="业务订单号" align="center" prop="orderNo" />
      <el-table-column label="下单用户ID" align="center" prop="userId" />
      <el-table-column label="订单类型：活动/商品/充值等" align="center" prop="orderType" />
      <el-table-column label="关联业务类型" align="center" prop="relatedType" />
      <el-table-column label="关联业务ID" align="center" prop="relatedId" />
      <el-table-column label="订单总金额" align="center" prop="totalAmount" />
      <el-table-column label="贡献点支付额" align="center" prop="contribAmount" />
      <el-table-column label="积分支付额" align="center" prop="pointsAmount" />
      <el-table-column label="现金支付额" align="center" prop="cashAmount" />
      <el-table-column label="支付状态：待付/已付/已退/失败/已取消" align="center" prop="paymentStatus" />
      <el-table-column label="支付方式：微信/支付宝/贡献点/积分等" align="center" prop="paymentMethod" />
      <el-table-column label="第三方支付单号" align="center" prop="paymentNo" />
        <el-table-column label="支付成功时间" align="center" prop="paidTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.paidTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="退款金额" align="center" prop="refundAmount" />
      <el-table-column label="退款原因" align="center" prop="refundReason" />
        <el-table-column label="退款时间" align="center" prop="refundedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.refundedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:paymentinfo:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:paymentinfo:remove']">删除</el-button>
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

    <!-- 添加或修改统一支付订单明细表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="paymentinfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="业务订单号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入业务订单号" />
        </el-form-item>
        <el-form-item label="下单用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入下单用户ID" />
        </el-form-item>
        <el-form-item label="订单类型：活动/商品/充值等" prop="orderType">
          <el-select v-model="form.orderType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择订单类型：活动/商品/充值等"
            :remote-method="remoteMethodOrderType"
            :loading="loadingOrderType"
          >
            <el-option v-for="item in optionsOrderType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务类型" prop="relatedType">
          <el-select v-model="form.relatedType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择关联业务类型"
            :remote-method="remoteMethodRelatedType"
            :loading="loadingRelatedType"
          >
            <el-option v-for="item in optionsRelatedType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务ID" prop="relatedId">
          <el-input v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </el-form-item>
        <el-form-item label="订单总金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入订单总金额" />
        </el-form-item>
        <el-form-item label="贡献点支付额" prop="contribAmount">
          <el-input v-model="form.contribAmount" placeholder="请输入贡献点支付额" />
        </el-form-item>
        <el-form-item label="积分支付额" prop="pointsAmount">
          <el-input v-model="form.pointsAmount" placeholder="请输入积分支付额" />
        </el-form-item>
        <el-form-item label="现金支付额" prop="cashAmount">
          <el-input v-model="form.cashAmount" placeholder="请输入现金支付额" />
        </el-form-item>
        <el-form-item label="支付方式：微信/支付宝/贡献点/积分等" prop="paymentMethod">
          <el-input v-model="form.paymentMethod" placeholder="请输入支付方式：微信/支付宝/贡献点/积分等" />
        </el-form-item>
        <el-form-item label="第三方支付单号" prop="paymentNo">
          <el-input v-model="form.paymentNo" placeholder="请输入第三方支付单号" />
        </el-form-item>
        <el-form-item label="支付成功时间" prop="paidTime">
          <el-date-picker clearable
            v-model="form.paidTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择支付成功时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input v-model="form.refundAmount" placeholder="请输入退款金额" />
        </el-form-item>
        <el-form-item label="退款原因" prop="refundReason">
          <el-input v-model="form.refundReason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="退款时间" prop="refundedTime">
          <el-date-picker clearable
            v-model="form.refundedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择退款时间">
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

<script setup name="Paymentinfo">
import { listPaymentinfo, getPaymentinfo, delPaymentinfo, addPaymentinfo, updatePaymentinfo } from "@/api/bt10/paymentinfo";

const { proxy } = getCurrentInstance();

const paymentinfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderNo: null,
    userId: null,
    orderType: null,
    relatedType: null,
    relatedId: null,
    totalAmount: null,
    contribAmount: null,
    pointsAmount: null,
    cashAmount: null,
    paymentStatus: null,
    paymentMethod: null,
    paymentNo: null,
    paidTime: null,
    refundAmount: null,
    refundReason: null,
    refundedTime: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询统一支付订单明细表列表 */
function getList() {
  loading.value = true;
  listPaymentinfo(queryParams.value).then(response => {
    paymentinfoList.value = response.rows;
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
    orderNo: null,
    userId: null,
    orderType: null,
    relatedType: null,
    relatedId: null,
    totalAmount: null,
    contribAmount: null,
    pointsAmount: null,
    cashAmount: null,
    paymentStatus: null,
    paymentMethod: null,
    paymentNo: null,
    paidTime: null,
    refundAmount: null,
    refundReason: null,
    refundedTime: null,
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
  proxy.resetForm("paymentinfoRef");
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
  title.value = "添加统一支付订单明细表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPaymentinfo(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改统一支付订单明细表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["paymentinfoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePaymentinfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPaymentinfo(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除统一支付订单明细表编号为"' + _ids + '"的数据项？').then(function() {
    return delPaymentinfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/paymentinfo/export', {
    ...queryParams.value
  }, `paymentinfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
