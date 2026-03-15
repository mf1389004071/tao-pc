<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="支付订单ID" prop="paymentId">
          <el-input
            v-model="queryParams.paymentId"
            placeholder="请输入支付订单ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="明细名称(商品/服务/身份等)" prop="itemName">
          <el-input
            v-model="queryParams.itemName"
            placeholder="请输入明细名称(商品/服务/身份等)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="原价(单价)" prop="originalAmount">
          <el-input
            v-model="queryParams.originalAmount"
            placeholder="请输入原价(单价)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="实际计价金额(单价，可为0表示赠送)" prop="amount">
          <el-input
            v-model="queryParams.amount"
            placeholder="请输入实际计价金额(单价，可为0表示赠送)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input
            v-model="queryParams.quantity"
            placeholder="请输入数量"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发放方式：AUTO/MANUAL/COUPON等" prop="grantMethod">
          <el-input
            v-model="queryParams.grantMethod"
            placeholder="请输入发放方式：AUTO/MANUAL/COUPON等"
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
            v-hasPermi="['bt10:paymentitems:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:paymentitems:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:paymentitems:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:paymentitems:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="paymentitemsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="支付订单ID" align="center" prop="paymentId" />
      <el-table-column label="明细类型：PRODUCT/SERVICE/COUPON/IDENTITY等" align="center" prop="itemType" />
      <el-table-column label="明细名称(商品/服务/身份等)" align="center" prop="itemName" />
      <el-table-column label="原价(单价)" align="center" prop="originalAmount" />
      <el-table-column label="实际计价金额(单价，可为0表示赠送)" align="center" prop="amount" />
      <el-table-column label="数量" align="center" prop="quantity" />
      <el-table-column label="是否赠品" align="center" prop="isGift" />
      <el-table-column label="是否可转让" align="center" prop="isTransferable" />
      <el-table-column label="是否可帮买(代他人购买)" align="center" prop="canBuyForOthers" />
      <el-table-column label="使用状态：PENDING/USED/EXPIRED/CANCELLED" align="center" prop="usageStatus" />
      <el-table-column label="发放方式：AUTO/MANUAL/COUPON等" align="center" prop="grantMethod" />
      <el-table-column label="关联业务类型：EVENT/COURSE/IDENTITY/POINT_PRODUCT等" align="center" prop="relatedType" />
      <el-table-column label="关联业务ID" align="center" prop="relatedId" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:paymentitems:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:paymentitems:remove']">删除</el-button>
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

    <!-- 添加或修改用户站内通知对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="paymentitemsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="支付订单ID" prop="paymentId">
          <el-input v-model="form.paymentId" placeholder="请输入支付订单ID" />
        </el-form-item>
        <el-form-item label="明细类型：PRODUCT/SERVICE/COUPON/IDENTITY等" prop="itemType">
          <el-select v-model="form.itemType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择明细类型：PRODUCT/SERVICE/COUPON/IDENTITY等"
            :remote-method="remoteMethodItemType"
            :loading="loadingItemType"
          >
            <el-option v-for="item in optionsItemType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="明细名称(商品/服务/身份等)" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入明细名称(商品/服务/身份等)" />
        </el-form-item>
        <el-form-item label="原价(单价)" prop="originalAmount">
          <el-input v-model="form.originalAmount" placeholder="请输入原价(单价)" />
        </el-form-item>
        <el-form-item label="实际计价金额(单价，可为0表示赠送)" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入实际计价金额(单价，可为0表示赠送)" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="发放方式：AUTO/MANUAL/COUPON等" prop="grantMethod">
          <el-input v-model="form.grantMethod" placeholder="请输入发放方式：AUTO/MANUAL/COUPON等" />
        </el-form-item>
        <el-form-item label="关联业务类型：EVENT/COURSE/IDENTITY/POINT_PRODUCT等" prop="relatedType">
          <el-select v-model="form.relatedType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择关联业务类型：EVENT/COURSE/IDENTITY/POINT_PRODUCT等"
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

<script setup name="Paymentitems">
import { listPaymentitems, getPaymentitems, delPaymentitems, addPaymentitems, updatePaymentitems } from "@/api/bt10/paymentitems";

const { proxy } = getCurrentInstance();

const paymentitemsList = ref([]);
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
    paymentId: null,
    itemType: null,
    itemName: null,
    originalAmount: null,
    amount: null,
    quantity: null,
    isGift: null,
    isTransferable: null,
    canBuyForOthers: null,
    usageStatus: null,
    grantMethod: null,
    relatedType: null,
    relatedId: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户站内通知列表 */
function getList() {
  loading.value = true;
  listPaymentitems(queryParams.value).then(response => {
    paymentitemsList.value = response.rows;
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
    paymentId: null,
    itemType: null,
    itemName: null,
    originalAmount: null,
    amount: null,
    quantity: null,
    isGift: [],
    isTransferable: [],
    canBuyForOthers: [],
    usageStatus: null,
    grantMethod: null,
    relatedType: null,
    relatedId: null,
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
  proxy.resetForm("paymentitemsRef");
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
  title.value = "添加用户站内通知";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPaymentitems(_id).then(response => {
    form.value = response.data;
    form.value.isGift = form.value.isGift.split(",");
    form.value.isTransferable = form.value.isTransferable.split(",");
    form.value.canBuyForOthers = form.value.canBuyForOthers.split(",");
    open.value = true;
    title.value = "修改用户站内通知";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["paymentitemsRef"].validate(valid => {
    if (valid) {
      form.value.isGift = form.value.isGift.join(",");
      form.value.isTransferable = form.value.isTransferable.join(",");
      form.value.canBuyForOthers = form.value.canBuyForOthers.join(",");
      if (form.value.id != null) {
        updatePaymentitems(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPaymentitems(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户站内通知编号为"' + _ids + '"的数据项？').then(function() {
    return delPaymentitems(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/paymentitems/export', {
    ...queryParams.value
  }, `paymentitems_${new Date().getTime()}.xlsx`)
}

getList();
</script>
