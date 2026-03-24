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
            v-hasPermi="['bt10:eventinfotags:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventinfotags:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventinfotags:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventinfotags:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventinfotagsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="活动" align="center" min-width="220">
        <template #default="scope">
          {{ getEventLabel(scope.row.eventId) }}
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
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventinfotags:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventinfotags:remove']">删除</el-button>
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

    <!-- 添加或修改积分变动审计对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventinfotagsRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Eventinfotags">
import { listEventinfotags, getEventinfotags, delEventinfotags, addEventinfotags, updateEventinfotags } from "@/api/bt10/eventinfotags";
import { listEventinfo } from "@/api/bt10/eventinfo";
import { listTags } from "@/api/bt10/tags";

const { proxy } = getCurrentInstance();

const eventinfotagsList = ref([]);
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
    eventId: null,
    tagId: null,
    orderNum: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

function toEventOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.title || "活动"
  };
}
function toTagOption(item) {
  const id = item?.id == null ? "" : String(item.id);
  return {
    value: id,
    label: item?.name || item?.code || "标签"
  };
}

function ensureEventOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!eventOptions.value.some(item => item.value === v)) {
    eventOptions.value = [{ value: v, label: label || "未知活动" }, ...eventOptions.value];
  }
}
function ensureTagOption(value, label) {
  const v = value == null ? null : String(value);
  if (!v) return;
  if (!tagOptions.value.some(item => item.value === v)) {
    tagOptions.value = [{ value: v, label: label || "未知标签" }, ...tagOptions.value];
  }
}
function getEventLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  const hit = eventOptions.value.find(item => item.value === v);
  return hit?.label || "未知活动";
}
function getTagLabel(value) {
  const v = value == null ? "" : String(value);
  if (!v) return "—";
  const hit = tagOptions.value.find(item => item.value === v);
  return hit?.label || "未知标签";
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
function fetchTagOptions(reset = false) {
  if (loadingTagOptions.value) return Promise.resolve();
  loadingTagOptions.value = true;
  const params = {
    pageNum: tagOptionPage.value,
    pageSize: 20,
    tagType: "EVENT_TAG"
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

function remoteMethodEvent(query) {
  eventKeyword.value = String(query || "").trim();
  eventOptionPage.value = 1;
  eventOptionFinished.value = false;
  fetchEventOptions(true);
}
function remoteMethodTag(query) {
  tagKeyword.value = String(query || "").trim();
  tagOptionPage.value = 1;
  tagOptionFinished.value = false;
  fetchTagOptions(true);
}

function loadMoreEventOptions() {
  if (loadingEventOptions.value || eventOptionFinished.value) return;
  eventOptionPage.value += 1;
  fetchEventOptions(false);
}
function loadMoreTagOptions() {
  if (loadingTagOptions.value || tagOptionFinished.value) return;
  tagOptionPage.value += 1;
  fetchTagOptions(false);
}

function handleEventSelectVisibleChange(visible) {
  if (!visible) return;
  if (!eventOptions.value.length) {
    remoteMethodEvent("");
  }
}
function handleTagSelectVisibleChange(visible) {
  if (!visible) return;
  if (!tagOptions.value.length) {
    remoteMethodTag("");
  }
}

/** 查询积分变动审计列表 */
function getList() {
  loading.value = true;
  listEventinfotags(queryParams.value).then(response => {
    eventinfotagsList.value = response.rows;
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
    tagId: null,
    orderNum: null,
    createTime: null
  };
  proxy.resetForm("eventinfotagsRef");
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
  remoteMethodTag("");
  open.value = true;
  title.value = "添加积分变动审计";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getEventinfotags(_id).then(response => {
    form.value = response.data;
    form.value.eventId = form.value.eventId == null ? null : String(form.value.eventId);
    form.value.tagId = form.value.tagId == null ? null : String(form.value.tagId);
    ensureEventOption(form.value.eventId);
    ensureTagOption(form.value.tagId);
    open.value = true;
    title.value = "修改积分变动审计";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventinfotagsRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.eventId = payload.eventId == null || payload.eventId === "" ? null : String(payload.eventId);
      payload.tagId = payload.tagId == null || payload.tagId === "" ? null : String(payload.tagId);
      if (form.value.id != null) {
        updateEventinfotags(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventinfotags(payload).then(response => {
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
  proxy.$modal.confirm('是否确认删除积分变动审计编号为"' + _ids + '"的数据项？').then(function() {
    return delEventinfotags(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventinfotags/export', {
    ...queryParams.value
  }, `eventinfotags_${new Date().getTime()}.xlsx`)
}

Promise.all([remoteMethodEvent(""), remoteMethodTag("")]).finally(() => {
  getList();
});
</script>
