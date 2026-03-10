<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入分类名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="URL/唯一标识" prop="slug">
          <el-input
            v-model="queryParams.slug"
            placeholder="请输入URL/唯一标识"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="父分类ID" prop="parentId">
          <el-input
            v-model="queryParams.parentId"
            placeholder="请输入父分类ID"
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
        <el-form-item label="图标" prop="icon">
          <el-input
            v-model="queryParams.icon"
            placeholder="请输入图标"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="主题色" prop="color">
          <el-input
            v-model="queryParams.color"
            placeholder="请输入主题色"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="可见权限等级1-5" prop="permissionLevel">
          <el-input
            v-model="queryParams.permissionLevel"
            placeholder="请输入可见权限等级1-5"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本1" prop="text1">
          <el-input
            v-model="queryParams.text1"
            placeholder="请输入扩展文本1"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本2" prop="text2">
          <el-input
            v-model="queryParams.text2"
            placeholder="请输入扩展文本2"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本3" prop="text3">
          <el-input
            v-model="queryParams.text3"
            placeholder="请输入扩展文本3"
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
            v-hasPermi="['bt10:knowledgecategory:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:knowledgecategory:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:knowledgecategory:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:knowledgecategory:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="knowledgecategoryList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="分类名称" align="center" prop="name" />
      <el-table-column label="URL/唯一标识" align="center" prop="slug" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="父分类ID" align="center" prop="parentId" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="图标" align="center" prop="icon" />
      <el-table-column label="主题色" align="center" prop="color" />
      <el-table-column label="可见权限等级1-5" align="center" prop="permissionLevel" />
      <el-table-column label="扩展文本1" align="center" prop="text1" />
      <el-table-column label="扩展文本2" align="center" prop="text2" />
      <el-table-column label="扩展文本3" align="center" prop="text3" />
      <el-table-column label="扩展JSON" align="center" prop="jsonData" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:knowledgecategory:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:knowledgecategory:remove']">删除</el-button>
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

    <!-- 添加或修改知识库分类对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="knowledgecategoryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="URL/唯一标识" prop="slug">
          <el-input v-model="form.slug" placeholder="请输入URL/唯一标识" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="父分类ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父分类ID" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="主题色" prop="color">
          <el-input v-model="form.color" placeholder="请输入主题色" />
        </el-form-item>
        <el-form-item label="可见权限等级1-5" prop="permissionLevel">
          <el-input v-model="form.permissionLevel" placeholder="请输入可见权限等级1-5" />
        </el-form-item>
        <el-form-item label="扩展文本1" prop="text1">
          <el-input v-model="form.text1" placeholder="请输入扩展文本1" />
        </el-form-item>
        <el-form-item label="扩展文本2" prop="text2">
          <el-input v-model="form.text2" placeholder="请输入扩展文本2" />
        </el-form-item>
        <el-form-item label="扩展文本3" prop="text3">
          <el-input v-model="form.text3" placeholder="请输入扩展文本3" />
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

<script setup name="Knowledgecategory">
import { listKnowledgecategory, getKnowledgecategory, delKnowledgecategory, addKnowledgecategory, updateKnowledgecategory } from "@/api/bt10/knowledgecategory";

const { proxy } = getCurrentInstance();

const knowledgecategoryList = ref([]);
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
    name: null,
    slug: null,
    parentId: null,
    orderNum: null,
    status: null,
    icon: null,
    color: null,
    permissionLevel: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询知识库分类列表 */
function getList() {
  loading.value = true;
  listKnowledgecategory(queryParams.value).then(response => {
    knowledgecategoryList.value = response.rows;
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
    name: null,
    slug: null,
    remark: null,
    parentId: null,
    orderNum: null,
    status: null,
    icon: null,
    color: null,
    permissionLevel: null,
    createId: null,
    updateId: null,
    deleteId: null,
    createTime: null,
    updateTime: null,
    deleteTime: null,
    delFlag: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null
  };
  proxy.resetForm("knowledgecategoryRef");
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
  title.value = "添加知识库分类";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getKnowledgecategory(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改知识库分类";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["knowledgecategoryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateKnowledgecategory(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addKnowledgecategory(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除知识库分类编号为"' + _ids + '"的数据项？').then(function() {
    return delKnowledgecategory(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/knowledgecategory/export', {
    ...queryParams.value
  }, `knowledgecategory_${new Date().getTime()}.xlsx`)
}

getList();
</script>
