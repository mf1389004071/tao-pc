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
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingContentOptions || contentOptionFinished" @click="loadMoreContentOptions">
                  {{ contentOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
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
            v-hasPermi="['bt10:knowledgecontenttags:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:knowledgecontenttags:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:knowledgecontenttags:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:knowledgecontenttags:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="knowledgecontenttagsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="知识内容" align="center" min-width="240">
        <template #default="scope">
          {{ getContentLabel(scope.row.contentId) }}
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" min-width="220">
        <template #default="scope">
          {{ getTagLabel(scope.row.tagId) }}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="orderNum" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:knowledgecontenttags:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:knowledgecontenttags:remove']">删除</el-button>
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

    <!-- 添加或修改知识内容与标签多对多关联对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="knowledgecontenttagsRef" :model="form" :rules="rules" label-width="80px">
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
            <template #footer>
              <div style="display:flex;justify-content:center;padding:6px 0;">
                <el-button link :disabled="loadingContentOptions || contentOptionFinished" @click="loadMoreContentOptions">
                  {{ contentOptionFinished ? '已加载全部' : '加载更多' }}
                </el-button>
              </div>
            </template>
          </el-select>
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
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" controls-position="right" style="width: 100%" />
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

<script setup name="Knowledgecontenttags">
import { listKnowledgecontenttags, getKnowledgecontenttags, delKnowledgecontenttags, addKnowledgecontenttags, updateKnowledgecontenttags } from "@/api/bt10/knowledgecontenttags";
import { listKnowledgecontent } from "@/api/bt10/knowledgecontent";
import { listTags } from "@/api/bt10/tags";

const { proxy } = getCurrentInstance();

const knowledgecontenttagsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const contentOptions = ref([]);
const loadingContentOptions = ref(false);
const contentOptionPage = ref(1);
const contentOptionFinished = ref(false);
const contentKeyword = ref("");
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
    contentId: null,
    tagId: null,
    orderNum: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
function toContentOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.title || "知识内容"
  };
}
function toTagOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.name || item?.code || "标签"
  };
}
function ensureContentOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!contentOptions.value.some(item => item.value === v)) {
    contentOptions.value = [{ value: v, label: label || "未知知识内容" }, ...contentOptions.value];
  }
}
function ensureTagOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!tagOptions.value.some(item => item.value === v)) {
    tagOptions.value = [{ value: v, label: label || "未知标签" }, ...tagOptions.value];
  }
}
function getContentLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  const hit = contentOptions.value.find(item => item.value === v);
  return hit?.label || "未知知识内容";
}
function getTagLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  const hit = tagOptions.value.find(item => item.value === v);
  return hit?.label || "未知标签";
}
function fetchContentOptions(reset = false) {
  if (loadingContentOptions.value) return Promise.resolve();
  loadingContentOptions.value = true;
  const params = {
    pageNum: contentOptionPage.value,
    pageSize: 20
  };
  if (contentKeyword.value) {
    params.title = contentKeyword.value;
  }
  return listKnowledgecontent(params).then(res => {
    const rows = res.rows || [];
    const mapped = rows.map(toContentOption);
    if (reset) {
      contentOptions.value = mapped;
    } else {
      const seen = new Set(contentOptions.value.map(item => item.value));
      contentOptions.value = contentOptions.value.concat(mapped.filter(item => !seen.has(item.value)));
    }
    contentOptionFinished.value = rows.length < params.pageSize;
  }).finally(() => {
    loadingContentOptions.value = false;
  });
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
function remoteMethodContent(query) {
  contentKeyword.value = String(query || "").trim();
  contentOptionPage.value = 1;
  contentOptionFinished.value = false;
  fetchContentOptions(true);
}
function remoteMethodTag(query) {
  tagKeyword.value = String(query || "").trim();
  tagOptionPage.value = 1;
  tagOptionFinished.value = false;
  fetchTagOptions(true);
}
function loadMoreContentOptions() {
  if (loadingContentOptions.value || contentOptionFinished.value) return;
  contentOptionPage.value += 1;
  fetchContentOptions(false);
}
function loadMoreTagOptions() {
  if (loadingTagOptions.value || tagOptionFinished.value) return;
  tagOptionPage.value += 1;
  fetchTagOptions(false);
}
function handleContentSelectVisibleChange(visible) {
  if (!visible) return;
  if (!contentOptions.value.length) {
    remoteMethodContent("");
  }
}
function handleTagSelectVisibleChange(visible) {
  if (!visible) return;
  if (!tagOptions.value.length) {
    remoteMethodTag("");
  }
}

/** 查询知识内容与标签多对多关联列表 */
function getList() {
  loading.value = true;
  listKnowledgecontenttags(queryParams.value).then(response => {
    knowledgecontenttagsList.value = response.rows;
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
    contentId: null,
    tagId: null,
    orderNum: null,
    createTime: null
  };
  proxy.resetForm("knowledgecontenttagsRef");
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
  remoteMethodTag("");
  open.value = true;
  title.value = "添加知识内容与标签多对多关联";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getKnowledgecontenttags(_id).then(response => {
    form.value = response.data;
    form.value.contentId = form.value.contentId == null ? null : String(form.value.contentId);
    form.value.tagId = form.value.tagId == null ? null : String(form.value.tagId);
    ensureContentOption(form.value.contentId);
    ensureTagOption(form.value.tagId);
    open.value = true;
    title.value = "修改知识内容与标签多对多关联";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["knowledgecontenttagsRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.contentId = payload.contentId == null || payload.contentId === "" ? null : String(payload.contentId);
      payload.tagId = payload.tagId == null || payload.tagId === "" ? null : String(payload.tagId);
      if (form.value.id != null) {
        updateKnowledgecontenttags(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addKnowledgecontenttags(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除知识内容与标签多对多关联编号为"' + _ids + '"的数据项？').then(function() {
    return delKnowledgecontenttags(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/knowledgecontenttags/export', {
    ...queryParams.value
  }, `knowledgecontenttags_${new Date().getTime()}.xlsx`)
}

Promise.all([remoteMethodContent(""), remoteMethodTag("")]).finally(() => {
  getList();
});
</script>
