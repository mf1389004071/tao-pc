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
        <el-form-item label="积分变动量" prop="pointsChange">
          <el-input
            v-model="queryParams.pointsChange"
            placeholder="请输入积分变动量"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变动前余额" prop="balanceBefore">
          <el-input
            v-model="queryParams.balanceBefore"
            placeholder="请输入变动前余额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变动后余额" prop="balanceAfter">
          <el-input
            v-model="queryParams.balanceAfter"
            placeholder="请输入变动后余额"
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
        <el-form-item label="操作人ID" prop="operatorId">
          <el-input
            v-model="queryParams.operatorId"
            placeholder="请输入操作人ID"
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
            v-hasPermi="['bt10:pointchangelogs:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:pointchangelogs:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:pointchangelogs:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:pointchangelogs:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="pointchangelogsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="类型：获得/消耗/过期/调整等" align="center" prop="changeType" />
      <el-table-column label="积分变动量" align="center" prop="pointsChange" />
      <el-table-column label="变动前余额" align="center" prop="balanceBefore" />
      <el-table-column label="变动后余额" align="center" prop="balanceAfter" />
      <el-table-column label="原因说明" align="center" prop="changeReason" />
      <el-table-column label="关联业务类型" align="center" prop="relatedType" />
      <el-table-column label="关联业务ID" align="center" prop="relatedId" />
      <el-table-column label="操作人ID" align="center" prop="operatorId" />
      <el-table-column label="操作人类型" align="center" prop="operatorType" />
        <el-table-column label="变更时间" align="center" prop="changedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.changedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="扩展信息" align="center" prop="metadata" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:pointchangelogs:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:pointchangelogs:remove']">删除</el-button>
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

    <!-- 添加或修改积分商城商品对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="pointchangelogsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="类型：获得/消耗/过期/调整等" prop="changeType">
          <el-select v-model="form.changeType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择类型：获得/消耗/过期/调整等"
            :remote-method="remoteMethodChangeType"
            :loading="loadingChangeType"
          >
            <el-option v-for="item in optionsChangeType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="积分变动量" prop="pointsChange">
          <el-input v-model="form.pointsChange" placeholder="请输入积分变动量" />
        </el-form-item>
        <el-form-item label="变动前余额" prop="balanceBefore">
          <el-input v-model="form.balanceBefore" placeholder="请输入变动前余额" />
        </el-form-item>
        <el-form-item label="变动后余额" prop="balanceAfter">
          <el-input v-model="form.balanceAfter" placeholder="请输入变动后余额" />
        </el-form-item>
        <el-form-item label="原因说明" prop="changeReason">
          <el-input v-model="form.changeReason" type="textarea" placeholder="请输入内容" />
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
        <el-form-item label="操作人ID" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入操作人ID" />
        </el-form-item>
        <el-form-item label="操作人类型" prop="operatorType">
          <el-select v-model="form.operatorType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择操作人类型"
            :remote-method="remoteMethodOperatorType"
            :loading="loadingOperatorType"
          >
            <el-option v-for="item in optionsOperatorType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="变更时间" prop="changedTime">
          <el-date-picker clearable
            v-model="form.changedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择变更时间">
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

<script setup name="Pointchangelogs">
import { listPointchangelogs, getPointchangelogs, delPointchangelogs, addPointchangelogs, updatePointchangelogs } from "@/api/bt10/pointchangelogs";

const { proxy } = getCurrentInstance();

const pointchangelogsList = ref([]);
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
    changeType: null,
    pointsChange: null,
    balanceBefore: null,
    balanceAfter: null,
    changeReason: null,
    relatedType: null,
    relatedId: null,
    operatorId: null,
    operatorType: null,
    changedTime: null,
    metadata: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询积分商城商品列表 */
function getList() {
  loading.value = true;
  listPointchangelogs(queryParams.value).then(response => {
    pointchangelogsList.value = response.rows;
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
    changeType: null,
    pointsChange: null,
    balanceBefore: null,
    balanceAfter: null,
    changeReason: null,
    relatedType: null,
    relatedId: null,
    operatorId: null,
    operatorType: null,
    changedTime: null,
    metadata: null,
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
  proxy.resetForm("pointchangelogsRef");
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
  title.value = "添加积分商城商品";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPointchangelogs(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改积分商城商品";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pointchangelogsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePointchangelogs(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPointchangelogs(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除积分商城商品编号为"' + _ids + '"的数据项？').then(function() {
    return delPointchangelogs(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/pointchangelogs/export', {
    ...queryParams.value
  }, `pointchangelogs_${new Date().getTime()}.xlsx`)
}

getList();
</script>
