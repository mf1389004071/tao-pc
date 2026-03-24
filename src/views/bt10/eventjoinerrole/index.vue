<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="报名记录" prop="joinId">
          <el-select
            v-model="queryParams.joinId"
            placeholder="请选择报名记录"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodJoin"
            :loading="loadingJoinOptions"
            style="width: 260px"
            @visible-change="handleJoinSelectVisibleChange"
          >
            <el-option v-for="item in joinOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动角色" prop="roleId">
          <el-select
            v-model="queryParams.roleId"
            placeholder="请选择活动角色"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodRole"
            :loading="loadingRoleOptions"
            style="width: 260px"
            @visible-change="handleRoleSelectVisibleChange"
          >
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分配时间" prop="assignedTime">
          <el-date-picker clearable
            v-model="queryParams.assignedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择分配时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认时间" prop="confirmedTime">
          <el-date-picker clearable
            v-model="queryParams.confirmedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择确认时间">
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
            v-hasPermi="['bt10:eventjoinerrole:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventjoinerrole:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventjoinerrole:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventjoinerrole:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventjoinerroleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="报名记录" align="center" min-width="240">
        <template #default="scope">{{ getJoinLabel(scope.row.joinId) }}</template>
      </el-table-column>
      <el-table-column label="活动角色" align="center" min-width="220">
        <template #default="scope">{{ getRoleLabel(scope.row.roleId) }}</template>
      </el-table-column>
        <el-table-column label="分配时间" align="center" prop="assignedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.assignedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="确认时间" align="center" prop="confirmedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.confirmedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="业务状态" align="center" prop="bizStatus" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          {{ getOptionLabel(statusOptions, scope.row.status) }}
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventjoinerrole:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventjoinerrole:remove']">删除</el-button>
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

    <!-- 添加或修改报名记录与活动角色的分配关系对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventjoinerroleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="报名记录" prop="joinId">
          <el-select
            v-model="form.joinId"
            placeholder="请选择报名记录"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodJoin"
            :loading="loadingJoinOptions"
            style="width: 100%"
            @visible-change="handleJoinSelectVisibleChange"
          >
            <el-option v-for="item in joinOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动角色" prop="roleId">
          <el-select
            v-model="form.roleId"
            placeholder="请选择活动角色"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodRole"
            :loading="loadingRoleOptions"
            style="width: 100%"
            @visible-change="handleRoleSelectVisibleChange"
          >
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="分配时间" prop="assignedTime">
          <el-date-picker clearable
            v-model="form.assignedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择分配时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认时间" prop="confirmedTime">
          <el-date-picker clearable
            v-model="form.confirmedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择确认时间">
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

<script setup name="Eventjoinerrole">
import { listEventjoinerrole, getEventjoinerrole, delEventjoinerrole, addEventjoinerrole, updateEventjoinerrole } from "@/api/bt10/eventjoinerrole";
import { listEventjoin } from "@/api/bt10/eventjoin";
import { listEventrole } from "@/api/bt10/eventrole";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const eventjoinerroleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const statusOptions = ref([]);
const joinOptions = ref([]);
const loadingJoinOptions = ref(false);
const roleOptions = ref([]);
const loadingRoleOptions = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    joinId: null,
    roleId: null,
    assignedTime: null,
    confirmedTime: null,
    bizStatus: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
function toJoinOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  const label = item?.userNickName || item?.userName || item?.userId ? `报名用户:${item?.userNickName || item?.userName || item?.userId}` : "报名记录";
  return { value: id, label };
}
function toRoleOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return { value: id, label: item?.roleName || "活动角色" };
}
function ensureJoinOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!joinOptions.value.some(item => item.value === v)) {
    joinOptions.value = [{ value: v, label: label || "未知报名记录" }, ...joinOptions.value];
  }
}
function ensureRoleOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!roleOptions.value.some(item => item.value === v)) {
    roleOptions.value = [{ value: v, label: label || "未知活动角色" }, ...roleOptions.value];
  }
}
function getJoinLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  return joinOptions.value.find(item => item.value === v)?.label || "未知报名记录";
}
function getRoleLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  return roleOptions.value.find(item => item.value === v)?.label || "未知活动角色";
}
function remoteMethodJoin(query) {
  if (loadingJoinOptions.value) return;
  loadingJoinOptions.value = true;
  const params = { pageNum: 1, pageSize: 50 };
  const keyword = String(query || "").trim();
  if (keyword) params.paymentNo = keyword;
  listEventjoin(params).then(res => {
    joinOptions.value = (res.rows || []).map(toJoinOption);
  }).finally(() => { loadingJoinOptions.value = false; });
}
function remoteMethodRole(query) {
  if (loadingRoleOptions.value) return;
  loadingRoleOptions.value = true;
  const params = { pageNum: 1, pageSize: 50 };
  const keyword = String(query || "").trim();
  if (keyword) params.roleName = keyword;
  listEventrole(params).then(res => {
    roleOptions.value = (res.rows || []).map(toRoleOption);
  }).finally(() => { loadingRoleOptions.value = false; });
}
function handleJoinSelectVisibleChange(visible) {
  if (visible && !joinOptions.value.length) remoteMethodJoin("");
}
function handleRoleSelectVisibleChange(visible) {
  if (visible && !roleOptions.value.length) remoteMethodRole("");
}

function getOptionLabel(options, value) {
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  });
}

/** 查询报名记录与活动角色的分配关系列表 */
function getList() {
  loading.value = true;
  listEventjoinerrole(queryParams.value).then(response => {
    eventjoinerroleList.value = response.rows;
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
    joinId: null,
    roleId: null,
    assignedTime: null,
    confirmedTime: null,
    bizStatus: null,
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
  proxy.resetForm("eventjoinerroleRef");
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
  remoteMethodJoin("");
  remoteMethodRole("");
  open.value = true;
  title.value = "添加报名记录与活动角色的分配关系";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getEventjoinerrole(_id).then(response => {
    form.value = response.data;
    form.value.joinId = form.value.joinId == null ? null : String(form.value.joinId);
    form.value.roleId = form.value.roleId == null ? null : String(form.value.roleId);
    ensureJoinOption(form.value.joinId);
    ensureRoleOption(form.value.roleId);
    open.value = true;
    title.value = "修改报名记录与活动角色的分配关系";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventjoinerroleRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.joinId = payload.joinId == null || payload.joinId === "" ? null : String(payload.joinId);
      payload.roleId = payload.roleId == null || payload.roleId === "" ? null : String(payload.roleId);
      if (form.value.id != null) {
        updateEventjoinerrole(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventjoinerrole(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除报名记录与活动角色的分配关系编号为"' + _ids + '"的数据项？').then(function() {
    return delEventjoinerrole(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventjoinerrole/export', {
    ...queryParams.value
  }, `eventjoinerrole_${new Date().getTime()}.xlsx`)
}

Promise.all([loadBt10Enums(), remoteMethodJoin(""), remoteMethodRole("")]).finally(() => {
  getList();
});
</script>
