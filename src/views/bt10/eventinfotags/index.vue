<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="活动ID" prop="eventId">
          <el-input
            v-model="queryParams.eventId"
            placeholder="请输入活动ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标签ID" prop="tagId">
          <el-input
            v-model="queryParams.tagId"
            placeholder="请输入标签ID"
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
      <el-table-column label="活动ID" align="center" prop="eventId" />
      <el-table-column label="标签ID" align="center" prop="tagId" />
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

    <!-- 添加或修改活动与标签多对多关联对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventinfotagsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动ID" prop="eventId">
          <el-input v-model="form.eventId" placeholder="请输入活动ID" />
        </el-form-item>
        <el-form-item label="标签ID" prop="tagId">
          <el-input v-model="form.tagId" placeholder="请输入标签ID" />
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

<script setup name="Eventinfotags">
import { listEventinfotags, getEventinfotags, delEventinfotags, addEventinfotags, updateEventinfotags } from "@/api/bt10/eventinfotags";

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

/** 查询活动与标签多对多关联列表 */
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
  open.value = true;
  title.value = "添加活动与标签多对多关联";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEventinfotags(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改活动与标签多对多关联";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventinfotagsRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEventinfotags(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventinfotags(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除活动与标签多对多关联编号为"' + _ids + '"的数据项？').then(function() {
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

getList();
</script>
