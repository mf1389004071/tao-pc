<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="标签编码(同类型内唯一)" prop="code">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入标签编码(同类型内唯一)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入标签名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="父标签ID(可选)" prop="parentId">
          <el-input
            v-model="queryParams.parentId"
            placeholder="请输入父标签ID(可选)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input
            v-model="queryParams.orderNum"
            placeholder="请输入排序"
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
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="标签类型：ABILITY/INTEREST/INDUSTRY/RESOURCE/NEED等" align="center" prop="tagType" />
      <el-table-column label="标签编码(同类型内唯一)" align="center" prop="code" />
      <el-table-column label="标签名称" align="center" prop="name" />
      <el-table-column label="标签说明" align="center" prop="remark" />
      <el-table-column label="父标签ID(可选)" align="center" prop="parentId" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status" />
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

    <!-- 添加或修改通用标签定义表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="tagsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签类型：ABILITY/INTEREST/INDUSTRY/RESOURCE/NEED等" prop="tagType">
          <el-select v-model="form.tagType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择标签类型：ABILITY/INTEREST/INDUSTRY/RESOURCE/NEED等"
            :remote-method="remoteMethodTagType"
            :loading="loadingTagType"
          >
            <el-option v-for="item in optionsTagType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签编码(同类型内唯一)" prop="code">
          <el-input v-model="form.code" placeholder="请输入标签编码(同类型内唯一)" />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="标签说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="父标签ID(可选)" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父标签ID(可选)" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序" />
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
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通用标签定义表列表 */
function getList() {
  loading.value = true;
  listTags(queryParams.value).then(response => {
    tagsList.value = response.rows;
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
    tagType: null,
    code: null,
    name: null,
    remark: null,
    parentId: null,
    orderNum: null,
    createId: null,
    updateId: null,
    createTime: null,
    updateTime: null,
    status: null
  };
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
  title.value = "添加通用标签定义表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getTags(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改通用标签定义表";
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除通用标签定义表编号为"' + _ids + '"的数据项？').then(function() {
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

getList();
</script>
