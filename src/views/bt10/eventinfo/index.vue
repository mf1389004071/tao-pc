<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="活动标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入活动标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="活动分类" prop="category">
          <el-input
            v-model="queryParams.category"
            placeholder="请输入活动分类"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="queryParams.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="queryParams.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="joinDeadline">
          <el-date-picker clearable
            v-model="queryParams.joinDeadline"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择报名截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最大参与人数" prop="maxParticipants">
          <el-input
            v-model="queryParams.maxParticipants"
            placeholder="请输入最大参与人数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="已报名人数" prop="registeredCount">
          <el-input
            v-model="queryParams.registeredCount"
            placeholder="请输入已报名人数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="已签到人数" prop="checkedInCount">
          <el-input
            v-model="queryParams.checkedInCount"
            placeholder="请输入已签到人数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="乐观锁版本号" prop="version">
          <el-input
            v-model="queryParams.version"
            placeholder="请输入乐观锁版本号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input
            v-model="queryParams.city"
            placeholder="请输入城市"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参与奖励积分" prop="basePointsReward">
          <el-input
            v-model="queryParams.basePointsReward"
            placeholder="请输入参与奖励积分"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="父活动ID(周期活动)" prop="parentEventId">
          <el-input
            v-model="queryParams.parentEventId"
            placeholder="请输入父活动ID(周期活动)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="活动价格" prop="eventPrice">
          <el-input
            v-model="queryParams.eventPrice"
            placeholder="请输入活动价格"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="主办方" prop="organizer">
          <el-input
            v-model="queryParams.organizer"
            placeholder="请输入主办方"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input
            v-model="queryParams.contact"
            placeholder="请输入联系方式"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="负责人ID" prop="pmUserId">
          <el-input
            v-model="queryParams.pmUserId"
            placeholder="请输入负责人ID"
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
            v-hasPermi="['bt10:eventinfo:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventinfo:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventinfo:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventinfo:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventinfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="活动标题" align="center" prop="title" />
      <el-table-column label="参与方式：线上/线下/混合" align="center" prop="joinType" />
      <el-table-column label="活动分类" align="center" prop="category" />
        <el-table-column label="开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名截止时间" align="center" prop="joinDeadline" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.joinDeadline, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="最大参与人数" align="center" prop="maxParticipants" />
      <el-table-column label="已报名人数" align="center" prop="registeredCount" />
      <el-table-column label="已签到人数" align="center" prop="checkedInCount" />
      <el-table-column label="乐观锁版本号" align="center" prop="version" />
      <el-table-column label="地点简述" align="center" prop="location" />
      <el-table-column label="会议/直播链接" align="center" prop="meetingUrl" />
      <el-table-column label="详细地址" align="center" prop="address" />
      <el-table-column label="城市" align="center" prop="city" />
      <el-table-column label="封面图" align="center" prop="coverImageUrl" />
      <el-table-column label="列表图" align="center" prop="listImageUrl" />
      <el-table-column label="详情图" align="center" prop="detailImageUrl" />
      <el-table-column label="海报图" align="center" prop="posterImageUrl" />
      <el-table-column label="状态：草稿/已发布/报名中/已满/进行中/已结束/已取消" align="center" prop="bizStatus" />
      <el-table-column label="是否公开可见" align="center" prop="isPublic" />
      <el-table-column label="参与奖励积分" align="center" prop="basePointsReward" />
      <el-table-column label="RRule周期规则" align="center" prop="recurrenceRule" />
      <el-table-column label="是否周期活动" align="center" prop="isRecurring" />
      <el-table-column label="父活动ID(周期活动)" align="center" prop="parentEventId" />
      <el-table-column label="活动价格" align="center" prop="eventPrice" />
      <el-table-column label="活动类型" align="center" prop="eventType" />
      <el-table-column label="目标学员画像" align="center" prop="targetAudience" />
      <el-table-column label="学习目标" align="center" prop="learningObjectives" />
      <el-table-column label="活动结构" align="center" prop="eventStructure" />
      <el-table-column label="活动内容大纲" align="center" prop="curriculum" />
      <el-table-column label="转化策略" align="center" prop="conversionStrategy" />
      <el-table-column label="跟进计划" align="center" prop="followUpPlan" />
      <el-table-column label="风险管理" align="center" prop="riskManagement" />
      <el-table-column label="活动标签" align="center" prop="eventTags" />
      <el-table-column label="主办方" align="center" prop="organizer" />
      <el-table-column label="联系方式" align="center" prop="contact" />
      <el-table-column label="负责人ID" align="center" prop="pmUserId" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventinfo:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventinfo:remove']">删除</el-button>
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

    <!-- 添加或修改活动或线下课程主表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventinfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="参与方式：线上/线下/混合" prop="joinType">
          <el-select v-model="form.joinType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择参与方式：线上/线下/混合"
            :remote-method="remoteMethodJoinType"
            :loading="loadingJoinType"
          >
            <el-option v-for="item in optionsJoinType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入活动分类" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="joinDeadline">
          <el-date-picker clearable
            v-model="form.joinDeadline"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择报名截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最大参与人数" prop="maxParticipants">
          <el-input v-model="form.maxParticipants" placeholder="请输入最大参与人数" />
        </el-form-item>
        <el-form-item label="已报名人数" prop="registeredCount">
          <el-input v-model="form.registeredCount" placeholder="请输入已报名人数" />
        </el-form-item>
        <el-form-item label="已签到人数" prop="checkedInCount">
          <el-input v-model="form.checkedInCount" placeholder="请输入已签到人数" />
        </el-form-item>
        <el-form-item label="乐观锁版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入乐观锁版本号" />
        </el-form-item>
        <el-form-item label="地点简述" prop="location">
          <el-input v-model="form.location" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="会议/直播链接" prop="meetingUrl">
          <el-input v-model="form.meetingUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="封面图" prop="coverImageUrl">
          <el-input v-model="form.coverImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="列表图" prop="listImageUrl">
          <el-input v-model="form.listImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="详情图" prop="detailImageUrl">
          <el-input v-model="form.detailImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="海报图" prop="posterImageUrl">
          <el-input v-model="form.posterImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="参与奖励积分" prop="basePointsReward">
          <el-input v-model="form.basePointsReward" placeholder="请输入参与奖励积分" />
        </el-form-item>
        <el-form-item label="RRule周期规则" prop="recurrenceRule">
          <el-input v-model="form.recurrenceRule" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="父活动ID(周期活动)" prop="parentEventId">
          <el-input v-model="form.parentEventId" placeholder="请输入父活动ID(周期活动)" />
        </el-form-item>
        <el-form-item label="活动价格" prop="eventPrice">
          <el-input v-model="form.eventPrice" placeholder="请输入活动价格" />
        </el-form-item>
        <el-form-item label="活动类型" prop="eventType">
          <el-select v-model="form.eventType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择活动类型"
            :remote-method="remoteMethodEventType"
            :loading="loadingEventType"
          >
            <el-option v-for="item in optionsEventType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标学员画像" prop="targetAudience">
          <el-input v-model="form.targetAudience" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="学习目标" prop="learningObjectives">
          <el-input v-model="form.learningObjectives" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="转化策略" prop="conversionStrategy">
          <el-input v-model="form.conversionStrategy" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="跟进计划" prop="followUpPlan">
          <el-input v-model="form.followUpPlan" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="风险管理" prop="riskManagement">
          <el-input v-model="form.riskManagement" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="活动标签" prop="eventTags">
          <el-input v-model="form.eventTags" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="主办方" prop="organizer">
          <el-input v-model="form.organizer" placeholder="请输入主办方" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="负责人ID" prop="pmUserId">
          <el-input v-model="form.pmUserId" placeholder="请输入负责人ID" />
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

<script setup name="Eventinfo">
import { listEventinfo, getEventinfo, delEventinfo, addEventinfo, updateEventinfo } from "@/api/bt10/eventinfo";

const { proxy } = getCurrentInstance();

const eventinfoList = ref([]);
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
    title: null,
    joinType: null,
    category: null,
    startTime: null,
    endTime: null,
    joinDeadline: null,
    maxParticipants: null,
    registeredCount: null,
    checkedInCount: null,
    version: null,
    location: null,
    meetingUrl: null,
    address: null,
    city: null,
    coverImageUrl: null,
    listImageUrl: null,
    detailImageUrl: null,
    posterImageUrl: null,
    bizStatus: null,
    isPublic: null,
    basePointsReward: null,
    recurrenceRule: null,
    isRecurring: null,
    parentEventId: null,
    eventPrice: null,
    eventType: null,
    targetAudience: null,
    learningObjectives: null,
    eventStructure: null,
    curriculum: null,
    conversionStrategy: null,
    followUpPlan: null,
    riskManagement: null,
    eventTags: null,
    organizer: null,
    contact: null,
    pmUserId: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询活动或线下课程主表列表 */
function getList() {
  loading.value = true;
  listEventinfo(queryParams.value).then(response => {
    eventinfoList.value = response.rows;
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
    title: null,
    joinType: null,
    category: null,
    startTime: null,
    endTime: null,
    joinDeadline: null,
    maxParticipants: null,
    registeredCount: null,
    checkedInCount: null,
    version: null,
    location: null,
    meetingUrl: null,
    address: null,
    city: null,
    coverImageUrl: null,
    listImageUrl: null,
    detailImageUrl: null,
    posterImageUrl: null,
    bizStatus: null,
    isPublic: [],
    basePointsReward: null,
    recurrenceRule: null,
    isRecurring: [],
    parentEventId: null,
    eventPrice: null,
    eventType: null,
    targetAudience: null,
    learningObjectives: null,
    eventStructure: null,
    curriculum: null,
    conversionStrategy: null,
    followUpPlan: null,
    riskManagement: null,
    eventTags: null,
    organizer: null,
    contact: null,
    pmUserId: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
    createId: null,
    createBy: null,
    createTime: null,
    updateId: null,
    updateBy: null,
    updateTime: null,
    deleteId: null,
    deleteTime: null,
    status: null,
    delFlag: null,
    remark: null
  };
  proxy.resetForm("eventinfoRef");
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
  title.value = "添加活动或线下课程主表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEventinfo(_id).then(response => {
    form.value = response.data;
    form.value.isPublic = form.value.isPublic.split(",");
    form.value.isRecurring = form.value.isRecurring.split(",");
    open.value = true;
    title.value = "修改活动或线下课程主表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventinfoRef"].validate(valid => {
    if (valid) {
      form.value.isPublic = form.value.isPublic.join(",");
      form.value.isRecurring = form.value.isRecurring.join(",");
      if (form.value.id != null) {
        updateEventinfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventinfo(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除活动或线下课程主表编号为"' + _ids + '"的数据项？').then(function() {
    return delEventinfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventinfo/export', {
    ...queryParams.value
  }, `eventinfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
