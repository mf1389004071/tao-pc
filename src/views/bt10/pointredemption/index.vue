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
        <el-form-item label="兑换商品ID" prop="productId">
          <el-input
            v-model="queryParams.productId"
            placeholder="请输入兑换商品ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="消耗积分" prop="pointsUsed">
          <el-input
            v-model="queryParams.pointsUsed"
            placeholder="请输入消耗积分"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="兑换码" prop="redemptionCode">
          <el-input
            v-model="queryParams.redemptionCode"
            placeholder="请输入兑换码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="使用/核销时间" prop="usedTime">
          <el-date-picker clearable
            v-model="queryParams.usedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择使用/核销时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="过期时间" prop="expiredTime">
          <el-date-picker clearable
            v-model="queryParams.expiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择过期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扩展文本1" prop="text1">
          <el-input
            v-model="queryParams.text1"
            placeholder="请输入扩展文本1"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本2" prop="text2">
          <el-input
            v-model="queryParams.text2"
            placeholder="请输入扩展文本2"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本3" prop="text3">
          <el-input
            v-model="queryParams.text3"
            placeholder="请输入扩展文本3"
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
            v-hasPermi="['bt10:pointredemption:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:pointredemption:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:pointredemption:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:pointredemption:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="pointredemptionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="兑换商品ID" align="center" prop="productId" />
      <el-table-column label="消耗积分" align="center" prop="pointsUsed" />
      <el-table-column label="状态：待发放/已完成/已取消/已过期" align="center" prop="bizStatus" />
      <el-table-column label="兑换码" align="center" prop="redemptionCode" />
        <el-table-column label="使用/核销时间" align="center" prop="usedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.usedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" prop="expiredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expiredTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="扩展文本1" align="center" prop="text1" />
      <el-table-column label="扩展文本2" align="center" prop="text2" />
      <el-table-column label="扩展文本3" align="center" prop="text3" />
      <el-table-column label="扩展JSON" align="center" prop="jsonData" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:pointredemption:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:pointredemption:remove']">删除</el-button>
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

    <!-- 添加或修改用户积分兑换记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="pointredemptionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="兑换商品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入兑换商品ID" />
        </el-form-item>
        <el-form-item label="消耗积分" prop="pointsUsed">
          <el-input v-model="form.pointsUsed" placeholder="请输入消耗积分" />
        </el-form-item>
        <el-form-item label="兑换码" prop="redemptionCode">
          <el-input v-model="form.redemptionCode" placeholder="请输入兑换码" />
        </el-form-item>
        <el-form-item label="使用/核销时间" prop="usedTime">
          <el-date-picker clearable
            v-model="form.usedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择使用/核销时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="过期时间" prop="expiredTime">
          <el-date-picker clearable
            v-model="form.expiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择过期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="扩展文本1" prop="text1">
          <el-input v-model="form.text1" placeholder="请输入扩展文本1" />
        </el-form-item>
        <el-form-item label="扩展文本2" prop="text2">
          <el-input v-model="form.text2" placeholder="请输入扩展文本2" />
        </el-form-item>
        <el-form-item label="扩展文本3" prop="text3">
          <el-input v-model="form.text3" placeholder="请输入扩展文本3" />
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

<script setup name="Pointredemption">
import { listPointredemption, getPointredemption, delPointredemption, addPointredemption, updatePointredemption } from "@/api/bt10/pointredemption";

const { proxy } = getCurrentInstance();

const pointredemptionList = ref([]);
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
    productId: null,
    pointsUsed: null,
    bizStatus: null,
    redemptionCode: null,
    usedTime: null,
    expiredTime: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户积分兑换记录列表 */
function getList() {
  loading.value = true;
  listPointredemption(queryParams.value).then(response => {
    pointredemptionList.value = response.rows;
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
    productId: null,
    pointsUsed: null,
    bizStatus: null,
    redemptionCode: null,
    usedTime: null,
    expiredTime: null,
    createId: null,
    updateId: null,
    createTime: null,
    updateTime: null,
    delFlag: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
    remark: null,
    status: null
  };
  proxy.resetForm("pointredemptionRef");
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
  title.value = "添加用户积分兑换记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPointredemption(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户积分兑换记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pointredemptionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePointredemption(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPointredemption(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户积分兑换记录编号为"' + _ids + '"的数据项？').then(function() {
    return delPointredemption(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/pointredemption/export', {
    ...queryParams.value
  }, `pointredemption_${new Date().getTime()}.xlsx`)
}

getList();
</script>
