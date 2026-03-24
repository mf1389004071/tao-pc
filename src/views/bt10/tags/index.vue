<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="88px">
        <el-form-item label="标签类型" prop="tagType">
          <el-select
            v-model="queryParams.tagType"
            placeholder="请选择标签类型"
            clearable
            filterable
            style="width: 180px"
            @keyup.enter="handleQuery"
          >
            <el-option
              v-for="item in tagTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签编码" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="同类型内唯一"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入标签名称"
            clearable
            style="width: 160px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="父标签" prop="parentId">
          <el-input
            v-model="queryParams.parentId"
            placeholder="父标签ID（可选）"
            clearable
            style="width: 140px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="queryParams.orderNum" :min="0" controls-position="right" style="width: 120px" />
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
            v-hasPermi="['bt10:tags:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:tags:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:tags:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:tags:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="tagsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id"/>
        <el-table-column label="标签类型" align="center" prop="tagType" min-width="90">
          <template #default="scope">
            {{ tagTypeLabel(scope.row.tagType) || scope.row.tagType || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="标签编码" align="center" prop="code" min-width="120" />
        <el-table-column label="标签名称" align="center" prop="name" min-width="120" />
        <el-table-column label="父标签" align="center" prop="parentId" width="90" />
        <el-table-column label="排序" align="center" prop="orderNum" width="80" />
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:tags:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:tags:remove']">删除</el-button>
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

    <!-- 添加或修改标签对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body @opened="onDialogOpened">
      <el-form ref="tagsRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标签类型" prop="tagType">
          <el-select
            v-model="form.tagType"
            placeholder="请选择标签类型"
            clearable
            filterable
            style="width: 100%"
            @change="onTagTypeChange"
          >
            <el-option
              v-for="item in tagTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签编码" prop="code">
          <el-input v-model="form.code" placeholder="同类型内唯一，仅支持英文大小写和数字" maxlength="64" show-word-limit />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" maxlength="64" show-word-limit />
        </el-form-item>
        <el-form-item label="父标签" prop="parentId">
          <el-select
            v-model="form.parentId"
            placeholder="请选择父标签（可选）"
            clearable
            filterable
            style="width: 100%"
            :loading="loadingParentTags"
          >
            <el-option
              v-for="item in parentTagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
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

<script setup name="Tags">
import { listTags, getTags, delTags, addTags, updateTags } from "@/api/bt10/tags";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const tagsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);

// 标签类型枚举（按描述配置，用于可搜索下拉与列表展示；按用途补齐活动等场景）
const tagTypeOptions = [
  { value: 'ABILITY', label: '能力' },
  { value: 'INTEREST', label: '兴趣' },
  { value: 'INDUSTRY', label: '行业' },
  { value: 'RESOURCE', label: '资源' },
  { value: 'NEED', label: '需求' },
  { value: 'EVENT_TARGET_AUDIENCE', label: '目标学员画像（活动）' },
  { value: 'EVENT_TAG', label: '活动标签' }
];

/** 根据标签类型 value 取展示用 label */
function tagTypeLabel(value) {
  if (value == null || value === '') return '';
  const item = tagTypeOptions.find(o => o.value === value);
  return item ? item.label : '';
}

const parentTagOptions = ref([]);
const loadingParentTags = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tagType: null,
    code: null,
    name: null,
    parentId: null,
    orderNum: null,
    status: null,
  },
  rules: {
    tagType: [{ required: true, message: '请选择标签类型', trigger: 'change' }],
    code: [
      { required: true, message: '请输入标签编码', trigger: 'blur' },
      { pattern: /^[A-Za-z0-9]+$/, message: '标签编码仅支持英文大小写和数字', trigger: 'blur' }
    ],
    name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
    orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 加载父标签选项（按当前标签类型过滤，排除自身） */
function loadParentTagOptions() {
  const type = form.value.tagType;
  if (!type) {
    parentTagOptions.value = [];
    return;
  }
  loadingParentTags.value = true;
  listTags({ tagType: type, pageNum: 1, pageSize: 500 }).then(response => {
    const rows = response.rows || [];
    const selfId = form.value.id;
    parentTagOptions.value = rows
      .filter(item => item.id !== selfId)
      .map(item => ({ value: item.id, label: `${item.name}（${item.code}）` }));
    loadingParentTags.value = false;
  }).catch(() => {
    loadingParentTags.value = false;
  });
}

function onTagTypeChange() {
  form.value.parentId = null;
  loadParentTagOptions();
}

function onDialogOpened() {
  loadParentTagOptions();
}

/** 查询标签列表 */
function getList() {
  loading.value = true;
  listTags(queryParams.value).then(response => {
    tagsList.value = response.rows;
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
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
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
    tagType: null,
    code: null,
    name: null,
    parentId: null,
    orderNum: 0,
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
  parentTagOptions.value = [];
  proxy.resetForm("tagsRef");
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
  title.value = "新增标签";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getTags(_id).then(response => {
    form.value = { ...response.data, orderNum: response.data.orderNum ?? 0 };
    open.value = true;
    title.value = "修改标签";
    nextTick(loadParentTagOptions);
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["tagsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTags(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTags(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除所选标签？').then(function() {
    return delTags(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/tags/export', {
    ...queryParams.value
  }, `tags_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
