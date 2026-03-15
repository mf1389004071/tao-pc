<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="关联活动ID" prop="eventId">
          <el-input
            v-model="queryParams.eventId"
            placeholder="请输入关联活动ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关联场次ID" prop="sessionId">
          <el-input
            v-model="queryParams.sessionId"
            placeholder="请输入关联场次ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="原始音视频文件ID" prop="fileId">
          <el-input
            v-model="queryParams.fileId"
            placeholder="请输入原始音视频文件ID"
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
            v-hasPermi="['bt10:aimeetingtranscripts:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:aimeetingtranscripts:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:aimeetingtranscripts:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:aimeetingtranscripts:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="aimeetingtranscriptsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="关联活动ID" align="center" prop="eventId" />
      <el-table-column label="关联场次ID" align="center" prop="sessionId" />
      <el-table-column label="原始音视频文件ID" align="center" prop="fileId" />
      <el-table-column label="转写JSON(时间戳与说话人)" align="center" prop="transcriptJson" />
      <el-table-column label="完整文本" align="center" prop="fullText" />
      <el-table-column label="AI摘要" align="center" prop="summary" />
      <el-table-column label="关键点" align="center" prop="keyPoints" />
      <el-table-column label="行动清单" align="center" prop="actionItems" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:aimeetingtranscripts:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:aimeetingtranscripts:remove']">删除</el-button>
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

    <!-- 添加或修改活动关键信息变更记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="aimeetingtranscriptsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="关联活动ID" prop="eventId">
          <el-input v-model="form.eventId" placeholder="请输入关联活动ID" />
        </el-form-item>
        <el-form-item label="关联场次ID" prop="sessionId">
          <el-input v-model="form.sessionId" placeholder="请输入关联场次ID" />
        </el-form-item>
        <el-form-item label="原始音视频文件ID" prop="fileId">
          <el-input v-model="form.fileId" placeholder="请输入原始音视频文件ID" />
        </el-form-item>
        <el-form-item label="完整文本" prop="fullText">
          <el-input v-model="form.fullText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="AI摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
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

<script setup name="Aimeetingtranscripts">
import { listAimeetingtranscripts, getAimeetingtranscripts, delAimeetingtranscripts, addAimeetingtranscripts, updateAimeetingtranscripts } from "@/api/bt10/aimeetingtranscripts";

const { proxy } = getCurrentInstance();

const aimeetingtranscriptsList = ref([]);
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
    eventId: null,
    sessionId: null,
    fileId: null,
    transcriptJson: null,
    fullText: null,
    summary: null,
    keyPoints: null,
    actionItems: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询活动关键信息变更记录列表 */
function getList() {
  loading.value = true;
  listAimeetingtranscripts(queryParams.value).then(response => {
    aimeetingtranscriptsList.value = response.rows;
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
    sessionId: null,
    fileId: null,
    transcriptJson: null,
    fullText: null,
    summary: null,
    keyPoints: null,
    actionItems: null,
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
  proxy.resetForm("aimeetingtranscriptsRef");
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
  title.value = "添加活动关键信息变更记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getAimeetingtranscripts(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改活动关键信息变更记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["aimeetingtranscriptsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAimeetingtranscripts(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addAimeetingtranscripts(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除活动关键信息变更记录编号为"' + _ids + '"的数据项？').then(function() {
    return delAimeetingtranscripts(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/aimeetingtranscripts/export', {
    ...queryParams.value
  }, `aimeetingtranscripts_${new Date().getTime()}.xlsx`)
}

getList();
</script>
