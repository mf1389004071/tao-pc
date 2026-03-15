<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份编码" prop="identityCode">
          <el-input
            v-model="queryParams.identityCode"
            placeholder="请输入身份编码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="获得时间" prop="acquiredTime">
          <el-date-picker clearable
            v-model="queryParams.acquiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择获得时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间(可为空)" prop="expiredTime">
          <el-date-picker clearable
            v-model="queryParams.expiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择到期时间(可为空)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来源业务ID(如支付订单ID)" prop="sourceId">
          <el-input
            v-model="queryParams.sourceId"
            placeholder="请输入来源业务ID(如支付订单ID)"
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
            v-hasPermi="['bt10:useridentities:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:useridentities:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:useridentities:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:useridentities:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="useridentitiesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="身份编码" align="center" prop="identityCode" />
      <el-table-column label="是否当前主身份" align="center" prop="isPrimary" />
      <el-table-column label="状态：ACTIVE/EXPIRED/REVOKED" align="center" prop="bizStatus" />
        <el-table-column label="获得时间" align="center" prop="acquiredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.acquiredTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间(可为空)" align="center" prop="expiredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expiredTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="来源类型：PAYMENT/EVENT/MANUAL等" align="center" prop="sourceType" />
      <el-table-column label="来源业务ID(如支付订单ID)" align="center" prop="sourceId" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:useridentities:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:useridentities:remove']">删除</el-button>
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

    <!-- 添加或修改用户身份关系表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="useridentitiesRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="身份编码" prop="identityCode">
          <el-input v-model="form.identityCode" placeholder="请输入身份编码" />
        </el-form-item>
        <el-form-item label="获得时间" prop="acquiredTime">
          <el-date-picker clearable
            v-model="form.acquiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择获得时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间(可为空)" prop="expiredTime">
          <el-date-picker clearable
            v-model="form.expiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择到期时间(可为空)">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="来源类型：PAYMENT/EVENT/MANUAL等" prop="sourceType">
          <el-select v-model="form.sourceType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择来源类型：PAYMENT/EVENT/MANUAL等"
            :remote-method="remoteMethodSourceType"
            :loading="loadingSourceType"
          >
            <el-option v-for="item in optionsSourceType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="来源业务ID(如支付订单ID)" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="请输入来源业务ID(如支付订单ID)" />
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

<script setup name="Useridentities">
import { listUseridentities, getUseridentities, delUseridentities, addUseridentities, updateUseridentities } from "@/api/bt10/useridentities";

const { proxy } = getCurrentInstance();

const useridentitiesList = ref([]);
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
    identityCode: null,
    isPrimary: null,
    bizStatus: null,
    acquiredTime: null,
    expiredTime: null,
    sourceType: null,
    sourceId: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户身份关系表列表 */
function getList() {
  loading.value = true;
  listUseridentities(queryParams.value).then(response => {
    useridentitiesList.value = response.rows;
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
    identityCode: null,
    isPrimary: [],
    bizStatus: null,
    acquiredTime: null,
    expiredTime: null,
    sourceType: null,
    sourceId: null,
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
  proxy.resetForm("useridentitiesRef");
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
  title.value = "添加用户身份关系表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getUseridentities(_id).then(response => {
    form.value = response.data;
    form.value.isPrimary = form.value.isPrimary.split(",");
    open.value = true;
    title.value = "修改用户身份关系表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["useridentitiesRef"].validate(valid => {
    if (valid) {
      form.value.isPrimary = form.value.isPrimary.join(",");
      if (form.value.id != null) {
        updateUseridentities(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUseridentities(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户身份关系表编号为"' + _ids + '"的数据项？').then(function() {
    return delUseridentities(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/useridentities/export', {
    ...queryParams.value
  }, `useridentities_${new Date().getTime()}.xlsx`)
}

getList();
</script>
