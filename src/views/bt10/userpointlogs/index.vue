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
        <el-form-item label="本次变动积分(正获得负消耗)" prop="points">
          <el-input
            v-model="queryParams.points"
            placeholder="请输入本次变动积分(正获得负消耗)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变动前积分余额" prop="balanceBefore">
          <el-input
            v-model="queryParams.balanceBefore"
            placeholder="请输入变动前积分余额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="变动后积分余额" prop="balanceAfter">
          <el-input
            v-model="queryParams.balanceAfter"
            placeholder="请输入变动后积分余额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关联业务主键" prop="relatedId">
          <el-input
            v-model="queryParams.relatedId"
            placeholder="请输入关联业务主键"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="该笔积分过期时间" prop="expiredTime">
          <el-date-picker clearable
            v-model="queryParams.expiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择该笔积分过期时间">
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
            v-hasPermi="['bt10:userpointlogs:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:userpointlogs:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:userpointlogs:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:userpointlogs:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userpointlogsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户ID(sys_user.user_id)" align="center" prop="userId" />
      <el-table-column label="行为类型：签到/发内容/邀请等" align="center" prop="actionType" />
      <el-table-column label="本次变动积分(正获得负消耗)" align="center" prop="points" />
      <el-table-column label="变动前积分余额" align="center" prop="balanceBefore" />
      <el-table-column label="变动后积分余额" align="center" prop="balanceAfter" />
      <el-table-column label="关联业务类型如EVENT/CONTENT" align="center" prop="relatedType" />
      <el-table-column label="关联业务主键" align="center" prop="relatedId" />
        <el-table-column label="该笔积分过期时间" align="center" prop="expiredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expiredTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:userpointlogs:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:userpointlogs:remove']">删除</el-button>
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

    <!-- 添加或修改用户积分收支流水对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userpointlogsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID(sys_user.user_id)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID(sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="行为类型：签到/发内容/邀请等" prop="actionType">
          <el-select v-model="form.actionType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择行为类型：签到/发内容/邀请等"
            :remote-method="remoteMethodActionType"
            :loading="loadingActionType"
          >
            <el-option v-for="item in optionsActionType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="本次变动积分(正获得负消耗)" prop="points">
          <el-input v-model="form.points" placeholder="请输入本次变动积分(正获得负消耗)" />
        </el-form-item>
        <el-form-item label="变动前积分余额" prop="balanceBefore">
          <el-input v-model="form.balanceBefore" placeholder="请输入变动前积分余额" />
        </el-form-item>
        <el-form-item label="变动后积分余额" prop="balanceAfter">
          <el-input v-model="form.balanceAfter" placeholder="请输入变动后积分余额" />
        </el-form-item>
        <el-form-item label="关联业务类型如EVENT/CONTENT" prop="relatedType">
          <el-select v-model="form.relatedType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择关联业务类型如EVENT/CONTENT"
            :remote-method="remoteMethodRelatedType"
            :loading="loadingRelatedType"
          >
            <el-option v-for="item in optionsRelatedType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务主键" prop="relatedId">
          <el-input v-model="form.relatedId" placeholder="请输入关联业务主键" />
        </el-form-item>
        <el-form-item label="该笔积分过期时间" prop="expiredTime">
          <el-date-picker clearable
            v-model="form.expiredTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择该笔积分过期时间">
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

<script setup name="Userpointlogs">
import { listUserpointlogs, getUserpointlogs, delUserpointlogs, addUserpointlogs, updateUserpointlogs } from "@/api/bt10/userpointlogs";

const { proxy } = getCurrentInstance();

const userpointlogsList = ref([]);
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
    points: null,
    balanceBefore: null,
    balanceAfter: null,
    relatedType: null,
    relatedId: null,
    expiredTime: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户积分收支流水列表 */
function getList() {
  loading.value = true;
  listUserpointlogs(queryParams.value).then(response => {
    userpointlogsList.value = response.rows;
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
    points: null,
    balanceBefore: null,
    balanceAfter: null,
    relatedType: null,
    relatedId: null,
    expiredTime: null,
    remark: null,
    delFlag: null,
    status: null,
    createTime: null
  };
  proxy.resetForm("userpointlogsRef");
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
  title.value = "添加用户积分收支流水";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getUserpointlogs(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户积分收支流水";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userpointlogsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUserpointlogs(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUserpointlogs(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户积分收支流水编号为"' + _ids + '"的数据项？').then(function() {
    return delUserpointlogs(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/userpointlogs/export', {
    ...queryParams.value
  }, `userpointlogs_${new Date().getTime()}.xlsx`)
}

getList();
</script>
