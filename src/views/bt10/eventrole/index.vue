<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="活动" prop="eventId">
          <el-select
            v-model="queryParams.eventId"
            placeholder="请选择活动"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodEvent"
            :loading="loadingEventOptions"
            style="width: 260px"
            @visible-change="handleEventSelectVisibleChange"
          >
            <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingEventOptions || eventOptionFinished" @click="loadMoreEventOptions">
                  {{ eventOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-select v-model="queryParams.roleName" placeholder="请选择角色名" clearable filterable style="width: 180px">
            <el-option v-for="item in roleNameOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="该角色最大人数" prop="maxParticipants">
          <el-input-number v-model="queryParams.maxParticipants" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="当前已分配人数" prop="currentParticipants">
          <el-input-number v-model="queryParams.currentParticipants" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="担任该角色奖励积分" prop="pointsReward">
          <el-input-number v-model="queryParams.pointsReward" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="担任该角色奖励贡献点" prop="contribReward">
          <el-input-number v-model="queryParams.contribReward" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="queryParams.orderNum" :min="0" controls-position="right" style="width: 180px" />
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
            v-hasPermi="['bt10:eventrole:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventrole:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventrole:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventrole:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventroleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="活动" align="center" prop="eventId" />
      <el-table-column label="角色名" align="center" prop="roleName">
        <template #default="scope">
          {{ getOptionLabel(roleNameOptions, scope.row.roleName) }}
        </template>
      </el-table-column>
      <el-table-column label="角色说明" align="center" prop="roleDescription" />
      <el-table-column label="该角色最大人数" align="center" prop="maxParticipants" />
      <el-table-column label="当前已分配人数" align="center" prop="currentParticipants" />
      <el-table-column label="角色权限配置" align="center" prop="permissions" />
      <el-table-column label="担任该角色奖励积分" align="center" prop="pointsReward" />
      <el-table-column label="担任该角色奖励贡献点" align="center" prop="contribReward" />
      <el-table-column label="职责说明" align="center" prop="responsibilities" />
      <el-table-column label="任职要求" align="center" prop="requirements" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          {{ getOptionLabel(statusOptions, scope.row.status) }}
        </template>
      </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventrole:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventrole:remove']">删除</el-button>
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

    <!-- 添加或修改活动与标签多对多关联对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventroleRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动" prop="eventId">
          <el-select
            v-model="form.eventId"
            placeholder="请选择活动"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodEvent"
            :loading="loadingEventOptions"
            style="width: 100%"
            @visible-change="handleEventSelectVisibleChange"
          >
            <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingEventOptions || eventOptionFinished" @click="loadMoreEventOptions">
                  {{ eventOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-select v-model="form.roleName" placeholder="请选择角色名" clearable filterable style="width: 100%">
            <el-option v-for="item in roleNameOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色说明" prop="roleDescription">
          <el-input v-model="form.roleDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="该角色最大人数" prop="maxParticipants">
          <el-input-number v-model="form.maxParticipants" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="当前已分配人数" prop="currentParticipants">
          <el-input-number v-model="form.currentParticipants" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="担任该角色奖励积分" prop="pointsReward">
          <el-input-number v-model="form.pointsReward" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="担任该角色奖励贡献点" prop="contribReward">
          <el-input-number v-model="form.contribReward" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="职责说明" prop="responsibilities">
          <el-input v-model="form.responsibilities" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="任职要求" prop="requirements">
          <el-input v-model="form.requirements" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" controls-position="right" style="width: 100%" />
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

<script setup name="Eventrole">
import { listEventrole, getEventrole, delEventrole, addEventrole, updateEventrole } from "@/api/bt10/eventrole";
import { listEventinfo } from "@/api/bt10/eventinfo";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const eventroleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const eventOptions = ref([]);
const loadingEventOptions = ref(false);
const eventOptionPage = ref(1);
const eventOptionFinished = ref(false);
const eventKeyword = ref("");
const statusOptions = ref([]);
const roleNameOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    eventId: null,
    roleName: null,
    roleDescription: null,
    maxParticipants: null,
    currentParticipants: null,
    permissions: null,
    pointsReward: null,
    contribReward: null,
    responsibilities: null,
    requirements: null,
    orderNum: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function getOptionLabel(options, value) {
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  roleNameOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.EVENT_ROLE_NAME);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    roleNameOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.EVENT_ROLE_NAME);
  });
}

function toEventOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.title || "活动"
  };
}

function ensureEventOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!eventOptions.value.some(item => item.value === v)) {
    eventOptions.value = [{ value: v, label: label || "未知活动" }, ...eventOptions.value];
  }
}

function fetchEventOptions(reset = false) {
  if (loadingEventOptions.value) return Promise.resolve();
  loadingEventOptions.value = true;
  const params = {
    pageNum: eventOptionPage.value,
    pageSize: 20
  };
  if (eventKeyword.value) {
    params.title = eventKeyword.value;
  }
  return listEventinfo(params).then(res => {
    const rows = res.rows || [];
    const mapped = rows.map(toEventOption);
    if (reset) {
      eventOptions.value = mapped;
    } else {
      const seen = new Set(eventOptions.value.map(item => item.value));
      eventOptions.value = eventOptions.value.concat(mapped.filter(item => !seen.has(item.value)));
    }
    eventOptionFinished.value = rows.length < params.pageSize;
  }).finally(() => {
    loadingEventOptions.value = false;
  });
}

function remoteMethodEvent(query) {
  eventKeyword.value = String(query || "").trim();
  eventOptionPage.value = 1;
  eventOptionFinished.value = false;
  fetchEventOptions(true);
}

function loadMoreEventOptions() {
  if (loadingEventOptions.value || eventOptionFinished.value) return;
  eventOptionPage.value += 1;
  fetchEventOptions(false);
}

function handleEventSelectVisibleChange(visible) {
  if (!visible) return;
  if (!eventOptions.value.length) {
    remoteMethodEvent("");
  }
}

/** 查询活动与标签多对多关联列表 */
function getList() {
  loading.value = true;
  listEventrole(queryParams.value).then(response => {
    eventroleList.value = response.rows;
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
    eventId: null,
    roleName: null,
    roleDescription: null,
    maxParticipants: null,
    currentParticipants: null,
    permissions: null,
    pointsReward: null,
    contribReward: null,
    responsibilities: null,
    requirements: null,
    orderNum: null,
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
  proxy.resetForm("eventroleRef");
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
  remoteMethodEvent("");
  open.value = true;
  title.value = "添加活动与标签多对多关联";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getEventrole(_id).then(response => {
    form.value = response.data;
    form.value.eventId = form.value.eventId == null ? null : String(form.value.eventId);
    ensureEventOption(form.value.eventId);
    open.value = true;
    title.value = "修改活动与标签多对多关联";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventroleRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.eventId = payload.eventId == null || payload.eventId === "" ? null : String(payload.eventId);
      if (form.value.id != null) {
        updateEventrole(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventrole(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除活动与标签多对多关联编号为"' + _ids + '"的数据项？').then(function() {
    return delEventrole(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventrole/export', {
    ...queryParams.value
  }, `eventrole_${new Date().getTime()}.xlsx`)
}

remoteMethodEvent("");
loadBt10Enums().finally(() => {
  getList();
});
</script>
