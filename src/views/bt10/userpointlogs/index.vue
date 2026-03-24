<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择用户(sys_user.user_id)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="points">
          <template #label>
            本次变动积分
            <LabelHint content="正获得负消耗" />
          </template>
          <el-input-number v-model="queryParams.points" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="变动前积分余额" prop="balanceBefore">
          <el-input-number v-model="queryParams.balanceBefore" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="变动后积分余额" prop="balanceAfter">
          <el-input-number v-model="queryParams.balanceAfter" :min="0" controls-position="right" style="width: 180px" />
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
        <el-form-item label="行为类型" prop="actionType">
          <el-select v-model="queryParams.actionType" placeholder="请选择行为类型" clearable filterable style="width: 160px">
            <el-option v-for="item in actionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务类型" prop="relatedType">
          <el-select v-model="queryParams.relatedType" placeholder="请选择关联业务类型" clearable filterable style="width: 180px">
            <el-option v-for="item in relatedTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      <el-table-column label="用户" align="center" prop="userId" />
      <el-table-column label="行为类型" align="center" prop="actionType">
        <template #default="scope">
          {{ getOptionLabel(actionTypeOptions, scope.row.actionType) }}
        </template>
      </el-table-column>
      <el-table-column label="本次变动积分" align="center" prop="points">
        <template #header>
          本次变动积分
          <LabelHint content="正获得负消耗" />
        </template>
      </el-table-column>
      <el-table-column label="变动前积分余额" align="center" prop="balanceBefore" />
      <el-table-column label="变动后积分余额" align="center" prop="balanceAfter" />
      <el-table-column label="关联业务类型" align="center" prop="relatedType">
        <template #default="scope">
          {{ getOptionLabel(relatedTypeOptions, scope.row.relatedType) }}
        </template>
      </el-table-column>
      <el-table-column label="关联业务主键" align="center" prop="relatedId" />
        <el-table-column label="该笔积分过期时间" align="center" prop="expiredTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expiredTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
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
        <el-form-item label="用户" prop="userId">
          <UserSelect v-model="form.userId" placeholder="请选择用户" />
        </el-form-item>
        <el-form-item label="行为类型" prop="actionType">
          <el-select v-model="form.actionType" placeholder="请选择行为类型" clearable filterable style="width: 100%">
            <el-option v-for="item in actionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="points">
          <template #label>
            本次变动积分
            <LabelHint content="正获得负消耗" />
          </template>
          <el-input-number v-model="form.points" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="变动前积分余额" prop="balanceBefore">
          <el-input-number v-model="form.balanceBefore" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="变动后积分余额" prop="balanceAfter">
          <el-input-number v-model="form.balanceAfter" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="关联业务类型" prop="relatedType">
          <el-select v-model="form.relatedType" placeholder="请选择关联业务类型" clearable filterable style="width: 100%">
            <el-option v-for="item in relatedTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";
import LabelHint from "@/components/LabelHint";

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

const statusOptions = ref([]);
const actionTypeOptions = ref([]);
const relatedTypeOptions = ref([]);

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

function getOptionLabel(options, value) {
  if (value == null || value === '') return value;
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  actionTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTION_TYPE);
  relatedTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.RELATED_TYPE);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    actionTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTION_TYPE);
    relatedTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.RELATED_TYPE);
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
  const _id = row?.id ?? ids.value?.[0];
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
  const _ids = row?.id ?? ids.value;
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

loadBt10Enums().finally(() => {
  getList();
});
</script>
