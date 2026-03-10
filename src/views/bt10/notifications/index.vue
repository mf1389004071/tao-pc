<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="接收用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入接收用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关联业务ID" prop="relatedId">
          <el-input
            v-model="queryParams.relatedId"
            placeholder="请输入关联业务ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="阅读时间" prop="readTime">
          <el-date-picker clearable
            v-model="queryParams.readTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择阅读时间">
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
            v-hasPermi="['bt10:notifications:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:notifications:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:notifications:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:notifications:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="notificationsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="接收用户ID" align="center" prop="userId" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="正文" align="center" prop="content" />
      <el-table-column label="类型：系统/互动/订阅等" align="center" prop="notificationType" />
      <el-table-column label="关联业务类型" align="center" prop="relatedType" />
      <el-table-column label="关联业务ID" align="center" prop="relatedId" />
      <el-table-column label="是否已读" align="center" prop="isRead" />
        <el-table-column label="阅读时间" align="center" prop="readTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.readTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:notifications:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:notifications:remove']">删除</el-button>
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

    <!-- 添加或修改用户站内通知对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="notificationsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="接收用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入接收用户ID" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="正文">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="类型：系统/互动/订阅等" prop="notificationType">
          <el-select v-model="form.notificationType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择类型：系统/互动/订阅等"
            :remote-method="remoteMethodNotificationType"
            :loading="loadingNotificationType"
          >
            <el-option v-for="item in optionsNotificationType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务类型" prop="relatedType">
          <el-select v-model="form.relatedType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择关联业务类型"
            :remote-method="remoteMethodRelatedType"
            :loading="loadingRelatedType"
          >
            <el-option v-for="item in optionsRelatedType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联业务ID" prop="relatedId">
          <el-input v-model="form.relatedId" placeholder="请输入关联业务ID" />
        </el-form-item>
        <el-form-item label="阅读时间" prop="readTime">
          <el-date-picker clearable
            v-model="form.readTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择阅读时间">
          </el-date-picker>
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

<script setup name="Notifications">
import { listNotifications, getNotifications, delNotifications, addNotifications, updateNotifications } from "@/api/bt10/notifications";

const { proxy } = getCurrentInstance();

const notificationsList = ref([]);
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
    userId: null,
    title: null,
    content: null,
    notificationType: null,
    relatedType: null,
    relatedId: null,
    isRead: null,
    readTime: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户站内通知列表 */
function getList() {
  loading.value = true;
  listNotifications(queryParams.value).then(response => {
    notificationsList.value = response.rows;
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
    userId: null,
    title: null,
    content: null,
    notificationType: null,
    relatedType: null,
    relatedId: null,
    isRead: [],
    readTime: null,
    createTime: null,
    remark: null,
    status: null
  };
  proxy.resetForm("notificationsRef");
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
  title.value = "添加用户站内通知";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getNotifications(_id).then(response => {
    form.value = response.data;
    form.value.isRead = form.value.isRead.split(",");
    open.value = true;
    title.value = "修改用户站内通知";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["notificationsRef"].validate(valid => {
    if (valid) {
      form.value.isRead = form.value.isRead.join(",");
      if (form.value.id != null) {
        updateNotifications(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addNotifications(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户站内通知编号为"' + _ids + '"的数据项？').then(function() {
    return delNotifications(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/notifications/export', {
    ...queryParams.value
  }, `notifications_${new Date().getTime()}.xlsx`)
}

getList();
</script>
