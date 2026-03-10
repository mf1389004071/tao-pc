<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="${comment}" prop="sourceId">
          <el-input
            v-model="queryParams.sourceId"
            placeholder="请输入${comment}"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="${comment}" prop="createdAt">
          <el-date-picker clearable
            v-model="queryParams.createdAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="updatedAt">
          <el-date-picker clearable
            v-model="queryParams.updatedAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
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
            v-hasPermi="['bt10:aivectors:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:aivectors:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:aivectors:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:aivectors:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="aivectorsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="${comment}" align="center" prop="contentChunk" />
      <el-table-column label="${comment}" align="center" prop="embedding" />
      <el-table-column label="${comment}" align="center" prop="metadata" />
      <el-table-column label="${comment}" align="center" prop="sourceType" />
      <el-table-column label="${comment}" align="center" prop="sourceId" />
        <el-table-column label="${comment}" align="center" prop="createdAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="${comment}" align="center" prop="updatedAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:aivectors:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:aivectors:remove']">删除</el-button>
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

    <!-- 添加或修改AI向量对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="aivectorsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="contentChunk">
          <el-input v-model="form.contentChunk" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="${comment}" prop="sourceType">
          <el-select v-model="form.sourceType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择${comment}"
            :remote-method="remoteMethodSourceType"
            :loading="loadingSourceType"
          >
            <el-option v-for="item in optionsSourceType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="${comment}" prop="sourceId">
          <el-input v-model="form.sourceId" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="${comment}" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
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

<script setup name="Aivectors">
import { listAivectors, getAivectors, delAivectors, addAivectors, updateAivectors } from "@/api/bt10/aivectors";

const { proxy } = getCurrentInstance();

const aivectorsList = ref([]);
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
    contentChunk: null,
    embedding: null,
    metadata: null,
    sourceType: null,
    sourceId: null,
    createdAt: null,
    updatedAt: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询AI向量列表 */
function getList() {
  loading.value = true;
  listAivectors(queryParams.value).then(response => {
    aivectorsList.value = response.rows;
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
    contentChunk: null,
    embedding: null,
    metadata: null,
    sourceType: null,
    sourceId: null,
    createdAt: null,
    updatedAt: null
  };
  proxy.resetForm("aivectorsRef");
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
  title.value = "添加AI向量";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getAivectors(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改AI向量";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["aivectorsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAivectors(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAivectors(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除AI向量编号为"' + _ids + '"的数据项？').then(function() {
    return delAivectors(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/aivectors/export', {
    ...queryParams.value
  }, `aivectors_${new Date().getTime()}.xlsx`)
}

getList();
</script>
