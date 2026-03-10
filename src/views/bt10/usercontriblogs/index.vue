<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户ID(sys_user.user_id)" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID(sys_user.user_id)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="本次变动金额" prop="amount">
          <el-input
            v-model="queryParams.amount"
            placeholder="请输入本次变动金额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变动前贡献点余额" prop="balanceBefore">
          <el-input
            v-model="queryParams.balanceBefore"
            placeholder="请输入变动前贡献点余额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变动后贡献点余额" prop="balanceAfter">
          <el-input
            v-model="queryParams.balanceAfter"
            placeholder="请输入变动后贡献点余额"
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
        <el-form-item label="支付单号" prop="paymentNo">
          <el-input
            v-model="queryParams.paymentNo"
            placeholder="请输入支付单号"
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
            v-hasPermi="['bt10:usercontriblogs:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:usercontriblogs:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:usercontriblogs:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:usercontriblogs:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="usercontriblogsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户ID(sys_user.user_id)" align="center" prop="userId" />
      <el-table-column label="类型：充值/购买/退款/奖励等" align="center" prop="actionType" />
      <el-table-column label="本次变动金额" align="center" prop="amount" />
      <el-table-column label="变动前贡献点余额" align="center" prop="balanceBefore" />
      <el-table-column label="变动后贡献点余额" align="center" prop="balanceAfter" />
      <el-table-column label="说明" align="center" prop="remark" />
      <el-table-column label="关联业务类型" align="center" prop="relatedType" />
      <el-table-column label="关联业务ID" align="center" prop="relatedId" />
      <el-table-column label="支付单号" align="center" prop="paymentNo" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:usercontriblogs:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:usercontriblogs:remove']">删除</el-button>
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
      <el-form ref="usercontriblogsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID(sys_user.user_id)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID(sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="类型：充值/购买/退款/奖励等" prop="actionType">
          <el-select v-model="form.actionType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择类型：充值/购买/退款/奖励等"
            :remote-method="remoteMethodActionType"
            :loading="loadingActionType"
          >
            <el-option v-for="item in optionsActionType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="本次变动金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入本次变动金额" />
        </el-form-item>
        <el-form-item label="变动前贡献点余额" prop="balanceBefore">
          <el-input v-model="form.balanceBefore" placeholder="请输入变动前贡献点余额" />
        </el-form-item>
        <el-form-item label="变动后贡献点余额" prop="balanceAfter">
          <el-input v-model="form.balanceAfter" placeholder="请输入变动后贡献点余额" />
        </el-form-item>
        <el-form-item label="说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
        <el-form-item label="支付单号" prop="paymentNo">
          <el-input v-model="form.paymentNo" placeholder="请输入支付单号" />
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

<script setup name="Usercontriblogs">
import { listUsercontriblogs, getUsercontriblogs, delUsercontriblogs, addUsercontriblogs, updateUsercontriblogs } from "@/api/bt10/usercontriblogs";

const { proxy } = getCurrentInstance();

const usercontriblogsList = ref([]);
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
    userId: null,
    actionType: null,
    amount: null,
    balanceBefore: null,
    balanceAfter: null,
    relatedType: null,
    relatedId: null,
    paymentNo: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户贡献点收支流水列表 */
function getList() {
  loading.value = true;
  listUsercontriblogs(queryParams.value).then(response => {
    usercontriblogsList.value = response.rows;
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
    actionType: null,
    amount: null,
    balanceBefore: null,
    balanceAfter: null,
    remark: null,
    relatedType: null,
    relatedId: null,
    paymentNo: null,
    delFlag: null,
    createTime: null,
    status: null
  };
  proxy.resetForm("usercontriblogsRef");
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
  const _id = row.id || ids.value
  getUsercontriblogs(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户贡献点收支流水";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["usercontriblogsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUsercontriblogs(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUsercontriblogs(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户贡献点收支流水编号为"' + _ids + '"的数据项？').then(function() {
    return delUsercontriblogs(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/usercontriblogs/export', {
    ...queryParams.value
  }, `usercontriblogs_${new Date().getTime()}.xlsx`)
}

getList();
</script>
