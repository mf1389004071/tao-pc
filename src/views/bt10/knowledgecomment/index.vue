<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="知识内容ID" prop="contentId">
          <el-input
            v-model="queryParams.contentId"
            placeholder="请输入知识内容ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="评论人" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择评论人"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="parentId">
          <template #label>
            父评论
            <LabelHint content="回复时填写" />
          </template>
          <el-input
            v-model="queryParams.parentId"
            placeholder="请输入父评论"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input
            v-model="queryParams.likeCount"
            placeholder="请输入点赞数"
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
            v-hasPermi="['bt10:knowledgecomment:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:knowledgecomment:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:knowledgecomment:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:knowledgecomment:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="knowledgecommentList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="知识内容ID" align="center" prop="contentId" />
      <el-table-column label="评论人" align="center" prop="userId" />
      <el-table-column label="父评论" align="center" prop="parentId" />
      <el-table-column label="评论正文" align="center" prop="content" />
      <el-table-column label="点赞数" align="center" prop="likeCount" />
      <el-table-column label="是否置顶" align="center" prop="isPinned" />
      <el-table-column label="业务状态" align="center" prop="bizStatus" />
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:knowledgecomment:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:knowledgecomment:remove']">删除</el-button>
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

    <!-- 添加或修改知识内容评论与回复对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="knowledgecommentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="知识内容ID" prop="contentId">
          <el-input v-model="form.contentId" placeholder="请输入知识内容ID" />
        </el-form-item>
        <el-form-item label="评论人" prop="userId">
          <UserSelect v-model="form.userId" placeholder="请选择评论人" />
        </el-form-item>
        <el-form-item prop="parentId">
          <template #label>
            父评论
            <LabelHint content="回复时填写" />
          </template>
          <el-input v-model="form.parentId" placeholder="请输入父评论" />
        </el-form-item>
        <el-form-item label="评论正文">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input v-model="form.likeCount" placeholder="请输入点赞数" />
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

<script setup name="Knowledgecomment">
import { listKnowledgecomment, getKnowledgecomment, delKnowledgecomment, addKnowledgecomment, updateKnowledgecomment } from "@/api/bt10/knowledgecomment";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";
import LabelHint from "@/components/LabelHint";

const { proxy } = getCurrentInstance();

const knowledgecommentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    contentId: null,
    userId: null,
    parentId: null,
    content: null,
    likeCount: null,
    isPinned: null,
    bizStatus: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询知识内容评论与回复列表 */
function getList() {
  loading.value = true;
  listKnowledgecomment(queryParams.value).then(response => {
    knowledgecommentList.value = response.rows;
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
    contentId: null,
    userId: null,
    parentId: null,
    content: null,
    likeCount: null,
    isPinned: [],
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
  proxy.resetForm("knowledgecommentRef");
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
  title.value = "添加知识内容评论与回复";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getKnowledgecomment(_id).then(response => {
    form.value = response.data;
    form.value.isPinned = form.value.isPinned.split(",");
    open.value = true;
    title.value = "修改知识内容评论与回复";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["knowledgecommentRef"].validate(valid => {
    if (valid) {
      form.value.isPinned = form.value.isPinned.join(",");
      if (form.value.id != null) {
        updateKnowledgecomment(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addKnowledgecomment(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除知识内容评论与回复编号为"' + _ids + '"的数据项？').then(function() {
    return delKnowledgecomment(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/knowledgecomment/export', {
    ...queryParams.value
  }, `knowledgecomment_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
