<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="知识内容" prop="contentId">
          <el-select
            v-model="queryParams.contentId"
            placeholder="请选择知识内容"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodContent"
            :loading="loadingContentOptions"
            style="width: 260px"
            @visible-change="handleContentSelectVisibleChange"
          >
            <el-option v-for="item in contentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="行为类型" prop="actionType">
          <el-select v-model="queryParams.actionType" placeholder="请选择行为类型" clearable filterable style="width: 160px">
            <el-option v-for="item in actionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
            v-hasPermi="['bt10:knowledgeaction:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:knowledgeaction:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:knowledgeaction:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:knowledgeaction:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="knowledgeactionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="知识内容" align="center" min-width="240">
        <template #default="scope">{{ getContentLabel(scope.row.contentId) }}</template>
      </el-table-column>
      <el-table-column label="行为类型" align="center" prop="actionType">
        <template #default="scope">
          {{ getOptionLabel(actionTypeOptions, scope.row.actionType) }}
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center" prop="userId" />
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:knowledgeaction:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:knowledgeaction:remove']">删除</el-button>
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

    <!-- 添加或修改用户成长阶段变更历史对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="knowledgeactionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="知识内容" prop="contentId">
          <el-select
            v-model="form.contentId"
            placeholder="请选择知识内容"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodContent"
            :loading="loadingContentOptions"
            style="width: 100%"
            @visible-change="handleContentSelectVisibleChange"
          >
            <el-option v-for="item in contentOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="行为类型" prop="actionType">
          <el-select v-model="form.actionType" placeholder="请选择行为类型" clearable filterable style="width: 100%">
            <el-option v-for="item in actionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户" prop="userId">
          <UserSelect v-model="form.userId" placeholder="请选择用户" />
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

<script setup name="Knowledgeaction">
import { listKnowledgeaction, getKnowledgeaction, delKnowledgeaction, addKnowledgeaction, updateKnowledgeaction } from "@/api/bt10/knowledgeaction";
import { listKnowledgecontent } from "@/api/bt10/knowledgecontent";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const knowledgeactionList = ref([]);
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
const contentOptions = ref([]);
const loadingContentOptions = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contentId: null,
    actionType: null,
    userId: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
function toContentOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return { value: id, label: item?.title || "知识内容" };
}
function ensureContentOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!contentOptions.value.some(item => item.value === v)) {
    contentOptions.value = [{ value: v, label: label || "未知知识内容" }, ...contentOptions.value];
  }
}
function getContentLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  return contentOptions.value.find(item => item.value === v)?.label || "未知知识内容";
}
function remoteMethodContent(query) {
  if (loadingContentOptions.value) return;
  loadingContentOptions.value = true;
  const params = { pageNum: 1, pageSize: 50 };
  const keyword = String(query || "").trim();
  if (keyword) params.title = keyword;
  listKnowledgecontent(params).then(res => {
    contentOptions.value = (res.rows || []).map(toContentOption);
  }).finally(() => {
    loadingContentOptions.value = false;
  });
}
function handleContentSelectVisibleChange(visible) {
  if (visible && !contentOptions.value.length) {
    remoteMethodContent("");
  }
}

/** 查询用户成长阶段变更历史列表 */
function getList() {
  loading.value = true;
  listKnowledgeaction(queryParams.value).then(response => {
    knowledgeactionList.value = response.rows;
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
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    actionTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.ACTION_TYPE);
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
    contentId: null,
    actionType: null,
    userId: null,
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
  proxy.resetForm("knowledgeactionRef");
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
  remoteMethodContent("");
  open.value = true;
  title.value = "添加用户成长阶段变更历史";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getKnowledgeaction(_id).then(response => {
    form.value = response.data;
    form.value.contentId = form.value.contentId == null ? null : String(form.value.contentId);
    ensureContentOption(form.value.contentId);
    open.value = true;
    title.value = "修改用户成长阶段变更历史";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["knowledgeactionRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.contentId = payload.contentId == null || payload.contentId === "" ? null : String(payload.contentId);
      payload.userId = payload.userId == null || payload.userId === "" ? null : String(payload.userId);
      if (form.value.id != null) {
        updateKnowledgeaction(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addKnowledgeaction(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户成长阶段变更历史编号为"' + _ids + '"的数据项？').then(function() {
    return delKnowledgeaction(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/knowledgeaction/export', {
    ...queryParams.value
  }, `knowledgeaction_${new Date().getTime()}.xlsx`)
}

Promise.all([loadBt10Enums(), remoteMethodContent("")]).finally(() => {
  getList();
});
</script>
