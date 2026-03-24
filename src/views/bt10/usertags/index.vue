<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="用户" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标签" prop="tagId">
          <el-select
            v-model="queryParams.tagId"
            placeholder="请选择标签"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodTag"
            :loading="loadingTagOptions"
            style="width: 260px"
            @visible-change="handleTagSelectVisibleChange"
          >
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingTagOptions || tagOptionFinished" @click="loadMoreTagOptions">
                  {{ tagOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="weight">
          <template #label>
            权重
            <LabelHint content="0-1或0-100，越大代表相关性越高" />
          </template>
          <el-input-number v-model="queryParams.weight" :min="0" controls-position="right" style="width: 180px" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="queryParams.source" placeholder="请选择来源" clearable filterable style="width: 180px">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
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
            v-hasPermi="['bt10:usertags:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:usertags:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:usertags:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:usertags:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="usertagsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="用户" align="center" prop="userId" />
      <el-table-column label="标签" align="center" min-width="220">
        <template #default="scope">
          {{ getTagLabel(scope.row.tagId) }}
        </template>
      </el-table-column>
      <el-table-column label="权重" align="center" prop="weight" />
      <el-table-column label="来源" align="center" prop="source" />
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:usertags:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:usertags:remove']">删除</el-button>
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

    <!-- 添加或修改用户行为轨迹日志对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="usertagsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <UserSelect v-model="form.userId" placeholder="请选择用户" />
        </el-form-item>
        <el-form-item label="标签" prop="tagId">
          <el-select
            v-model="form.tagId"
            placeholder="请选择标签"
            clearable
            filterable
            remote
            reserve-keyword
            :remote-method="remoteMethodTag"
            :loading="loadingTagOptions"
            style="width: 100%"
            @visible-change="handleTagSelectVisibleChange"
          >
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingTagOptions || tagOptionFinished" @click="loadMoreTagOptions">
                  {{ tagOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="weight">
          <template #label>
            权重
            <LabelHint content="0-1或0-100，越大代表相关性越高" />
          </template>
          <el-input-number v-model="form.weight" :min="0" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="form.source" placeholder="请选择来源" clearable filterable style="width: 100%">
            <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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

<script setup name="Usertags">
import { listUsertags, getUsertags, delUsertags, addUsertags, updateUsertags } from "@/api/bt10/usertags";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";
import { listTags } from "@/api/bt10/tags";
import LabelHint from "@/components/LabelHint";

const { proxy } = getCurrentInstance();

const usertagsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);
const sourceOptions = ref([]);
const tagOptions = ref([]);
const loadingTagOptions = ref(false);
const tagOptionPage = ref(1);
const tagOptionFinished = ref(false);
const tagKeyword = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    tagId: null,
    weight: null,
    source: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户行为轨迹日志列表 */
function getList() {
  loading.value = true;
  listUsertags(queryParams.value).then(response => {
    usertagsList.value = response.rows;
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
  sourceOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.USER_TAG_SOURCE);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    sourceOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.USER_TAG_SOURCE);
  });
}
function toTagOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.name || item?.code || "标签"
  };
}
function ensureTagOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!tagOptions.value.some(item => item.value === v)) {
    tagOptions.value = [{ value: v, label: label || "未知标签" }, ...tagOptions.value];
  }
}
function getTagLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  const hit = tagOptions.value.find(item => item.value === v);
  return hit?.label || "未知标签";
}
function fetchTagOptions(reset = false) {
  if (loadingTagOptions.value) return Promise.resolve();
  loadingTagOptions.value = true;
  const params = {
    pageNum: tagOptionPage.value,
    pageSize: 20
  };
  if (tagKeyword.value) {
    params.name = tagKeyword.value;
  }
  return listTags(params).then(res => {
    const rows = res.rows || [];
    const mapped = rows.map(toTagOption);
    if (reset) {
      tagOptions.value = mapped;
    } else {
      const seen = new Set(tagOptions.value.map(item => item.value));
      tagOptions.value = tagOptions.value.concat(mapped.filter(item => !seen.has(item.value)));
    }
    tagOptionFinished.value = rows.length < params.pageSize;
  }).finally(() => {
    loadingTagOptions.value = false;
  });
}
function remoteMethodTag(query) {
  tagKeyword.value = String(query || "").trim();
  tagOptionPage.value = 1;
  tagOptionFinished.value = false;
  fetchTagOptions(true);
}
function loadMoreTagOptions() {
  if (loadingTagOptions.value || tagOptionFinished.value) return;
  tagOptionPage.value += 1;
  fetchTagOptions(false);
}
function handleTagSelectVisibleChange(visible) {
  if (!visible) return;
  if (!tagOptions.value.length) {
    remoteMethodTag("");
  }
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
    tagId: null,
    weight: null,
    source: null,
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
  proxy.resetForm("usertagsRef");
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
  remoteMethodTag("");
  open.value = true;
  title.value = "添加用户行为轨迹日志";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getUsertags(_id).then(response => {
    form.value = response.data;
    form.value.tagId = form.value.tagId == null ? null : String(form.value.tagId);
    ensureTagOption(form.value.tagId);
    open.value = true;
    title.value = "修改用户行为轨迹日志";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["usertagsRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.tagId = payload.tagId == null || payload.tagId === "" ? null : String(payload.tagId);
      if (form.value.id != null) {
        updateUsertags(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUsertags(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户行为轨迹日志编号为"' + _ids + '"的数据项？').then(function() {
    return delUsertags(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/usertags/export', {
    ...queryParams.value
  }, `usertags_${new Date().getTime()}.xlsx`)
}

Promise.all([loadBt10Enums(), remoteMethodTag("")]).finally(() => {
  getList();
});
</script>
