<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="所属活动ID" prop="eventId">
          <el-input
            v-model="queryParams.eventId"
            placeholder="请输入所属活动ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="场次日期" prop="sessionDate">
          <el-date-picker clearable
            v-model="queryParams.sessionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择场次日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="queryParams.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择场次开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="queryParams.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择场次结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="本场签到人数" prop="checkInCount">
          <el-input
            v-model="queryParams.checkInCount"
            placeholder="请输入本场签到人数"
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
            v-hasPermi="['bt10:eventsession:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventsession:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventsession:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventsession:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventsessionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="所属活动ID" align="center" prop="eventId" />
        <el-table-column label="场次日期" align="center" prop="sessionDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.sessionDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="场次开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="场次结束时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="状态：已排期/进行中/已结束/已取消" align="center" prop="bizStatus" />
      <el-table-column label="本场签到人数" align="center" prop="checkInCount" />
      <el-table-column label="AI生成场次总结" align="center" prop="summaryText" />
      <el-table-column label="本场会议链接" align="center" prop="meetingUrl" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventsession:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventsession:remove']">删除</el-button>
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

    <!-- 添加或修改周期活动的单场次对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventsessionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属活动ID" prop="eventId">
          <el-input v-model="form.eventId" placeholder="请输入所属活动ID" />
        </el-form-item>
        <el-form-item label="场次日期" prop="sessionDate">
          <el-date-picker clearable
            v-model="form.sessionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择场次日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择场次开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="场次结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择场次结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="本场签到人数" prop="checkInCount">
          <el-input v-model="form.checkInCount" placeholder="请输入本场签到人数" />
        </el-form-item>
        <el-form-item label="AI生成场次总结" prop="summaryText">
          <el-input v-model="form.summaryText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="本场会议链接" prop="meetingUrl">
          <el-input v-model="form.meetingUrl" type="textarea" placeholder="请输入内容" />
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

<script setup name="Eventsession">
import { listEventsession, getEventsession, delEventsession, addEventsession, updateEventsession } from "@/api/bt10/eventsession";

const { proxy } = getCurrentInstance();

const eventsessionList = ref([]);
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
    sessionDate: null,
    startTime: null,
    endTime: null,
    bizStatus: null,
    checkInCount: null,
    summaryText: null,
    meetingUrl: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询周期活动的单场次列表 */
function getList() {
  loading.value = true;
  listEventsession(queryParams.value).then(response => {
    eventsessionList.value = response.rows;
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
    sessionDate: null,
    startTime: null,
    endTime: null,
    bizStatus: null,
    checkInCount: null,
    summaryText: null,
    meetingUrl: null,
    createId: null,
    updateId: null,
    createTime: null,
    updateTime: null,
    delFlag: null,
    status: null
  };
  proxy.resetForm("eventsessionRef");
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
  title.value = "添加周期活动的单场次";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEventsession(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改周期活动的单场次";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventsessionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEventsession(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventsession(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除周期活动的单场次编号为"' + _ids + '"的数据项？').then(function() {
    return delEventsession(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventsession/export', {
    ...queryParams.value
  }, `eventsession_${new Date().getTime()}.xlsx`)
}

getList();
</script>
