<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="queryParams.title" placeholder="请输入活动标题" clearable @keyup.enter="handleQuery" style="width: 180px" />
        </el-form-item>
        <el-form-item label="活动分类" prop="category">
          <el-select v-model="queryParams.category" placeholder="请选择" clearable filterable style="width: 140px">
            <el-option v-for="dict in eventCategoryDict" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="参与方式" prop="joinType">
          <el-select v-model="queryParams.joinType" placeholder="请选择" clearable style="width: 100px">
            <el-option v-for="item in joinTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型" prop="eventType">
          <el-select v-model="queryParams.eventType" placeholder="请选择" clearable style="width: 100px">
            <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务状态" prop="bizStatus">
          <el-select v-model="queryParams.bizStatus" placeholder="请选择" clearable style="width: 110px">
            <el-option v-for="item in bizStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="queryParams.startTime" type="date" value-format="YYYY-MM-DD" placeholder="开始日期" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="queryParams.endTime" type="date" value-format="YYYY-MM-DD" placeholder="结束日期" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="主办方" prop="organizer">
          <el-input v-model="queryParams.organizer" placeholder="请输入主办方" clearable @keyup.enter="handleQuery" style="width: 140px" />
        </el-form-item>
        <el-form-item label="负责人" prop="pmUserId">
          <UserSelect v-model="queryParams.pmUserId" placeholder="请选择负责人" style="width: 200px" />
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
            type="primary"
            plain
            :disabled="!canPublish"
            @click="handleBizStatus('publish')"
            v-hasPermi="['bt10:eventinfo:edit']"
          >发布</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            :disabled="!canEnd"
            @click="handleBizStatus('end')"
            v-hasPermi="['bt10:eventinfo:edit']"
          >结束</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="info"
            plain
            :disabled="!canCancel"
            @click="handleBizStatus('cancel')"
            v-hasPermi="['bt10:eventinfo:edit']"
          >取消</el-button>
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

      <div class="table-scroll-wrapper">
      <el-table v-loading="loading" :data="eventinfoList" @selection-change="handleSelectionChange" style="min-width: 1600px">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" width="70" />
        <el-table-column label="封面" align="center" width="72" fixed="left">
          <template #default="scope">
            <ImagePreview v-if="scope.row.coverImageUrl" :src="scope.row.coverImageUrl" width="48" height="48" />
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="活动标题" align="center" prop="title" min-width="140" show-overflow-tooltip />
        <el-table-column label="参与方式" align="center" prop="joinType" width="88">
          <template #default="scope">
            {{ joinTypeOptions.find(o => o.value === scope.row.joinType)?.label ?? scope.row.joinType }}
          </template>
        </el-table-column>
        <el-table-column label="活动分类" align="center" prop="category" width="100">
          <template #default="scope">
            <dict-tag :options="eventCategoryDict" :value="scope.row.category" />
          </template>
        </el-table-column>
        <el-table-column label="活动类型" align="center" prop="eventType" width="88">
          <template #default="scope">
            {{ eventTypeOptions.find(o => o.value === scope.row.eventType)?.label ?? scope.row.eventType }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" prop="startTime" width="108">
          <template #default="scope">{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="108">
          <template #default="scope">{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column label="报名截止" align="center" prop="joinDeadline" width="108">
          <template #default="scope">{{ parseTime(scope.row.joinDeadline, '{y}-{m}-{d}') }}</template>
        </el-table-column>
        <el-table-column label="人数" align="center" width="88">
          <template #default="scope">{{ scope.row.registeredCount ?? 0 }}/{{ scope.row.maxParticipants ?? 0 }}</template>
        </el-table-column>
        <el-table-column label="城市" align="center" width="100" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.city ? scope.row.city.split(',').map(c => codeToText[c] || c).filter(Boolean).join(' / ') : '—' }}
          </template>
        </el-table-column>
        <el-table-column label="列表图" align="center" width="72">
          <template #default="scope">
            <ImagePreview v-if="scope.row.listImageUrl" :src="scope.row.listImageUrl" width="48" height="48" />
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="详情图" align="center" width="72">
          <template #default="scope">
            <ImagePreview v-if="scope.row.detailImageUrl" :src="scope.row.detailImageUrl" width="48" height="48" />
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="海报图" align="center" width="72">
          <template #default="scope">
            <ImagePreview v-if="scope.row.posterImageUrl" :src="scope.row.posterImageUrl" width="48" height="48" />
            <span v-else class="text-muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="业务状态" align="center" prop="bizStatus" width="88">
          <template #default="scope">
            {{ bizStatusOptions.find(o => o.value === scope.row.bizStatus)?.label ?? scope.row.bizStatus }}
          </template>
        </el-table-column>
        <el-table-column label="公开" align="center" prop="isPublic" width="64">
          <template #default="scope">
            {{ isPublicMap[String(scope.row.isPublic)] ?? '—' }}
          </template>
        </el-table-column>
        <el-table-column label="积分" align="center" prop="basePointsReward" width="70" />
        <el-table-column label="价格" align="center" prop="eventPrice" width="80" />
        <el-table-column label="主办方" align="center" prop="organizer" width="100" show-overflow-tooltip />
        <el-table-column label="负责人" align="center" width="100" show-overflow-tooltip>
          <template #header>
            负责人
            <LabelHint content="昵称" />
          </template>
          <template #default="scope">{{ scope.row.pmUserNickName ?? scope.row.pmUserName ?? scope.row.pmUserId ?? '—' }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template #default="scope">
            <span v-if="scope.row.status != null && scope.row.status !== ''">
              {{ statusOptions.find(o => o.value === scope.row.status)?.label ?? scope.row.status }}
            </span>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="140" fixed="right">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventinfo:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventinfo:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>
    
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 业务状态变更（发布/结束/取消）二次确认 -->
    <el-dialog v-model="bizStatusDialogVisible" :title="bizStatusDialogTitle" width="560px" append-to-body>
      <p class="mb8">{{ bizStatusConfirmIntro }}</p>
      <el-table :data="bizStatusConfirmRows" border max-height="300">
        <el-table-column label="ID" prop="id" width="90" align="center" />
        <el-table-column label="活动名称" prop="title" min-width="180" show-overflow-tooltip />
        <el-table-column label="业务状态" width="100" align="center">
          <template #default="scope">
            {{ bizStatusOptions.find(o => o.value === scope.row.bizStatus)?.label ?? scope.row.bizStatus }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="bizStatusDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBizStatus">确认</el-button>
      </template>
    </el-dialog>

    <!-- 添加或修改活动或线下课程主表对话框（三列布局） -->
    <el-dialog :title="title" v-model="open" width="960px" append-to-body>
      <el-form ref="eventinfoRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="活动标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入活动标题" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参与方式" prop="joinType">
              <el-select v-model="form.joinType" placeholder="请选择参与方式" clearable filterable style="width: 100%">
                <el-option v-for="item in joinTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择活动分类" clearable filterable style="width: 100%">
                <el-option v-for="dict in eventCategoryDict" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择开始时间"
                clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD" placeholder="请选择结束时间"
                clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报名截止时间" prop="joinDeadline">
              <el-date-picker v-model="form.joinDeadline" type="date" value-format="YYYY-MM-DD" placeholder="请选择报名截止时间"
                clearable style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大参与人数" prop="maxParticipants">
              <el-input-number v-model="form.maxParticipants" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已报名人数" prop="registeredCount">
              <el-input-number v-model="form.registeredCount" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已签到人数" prop="checkedInCount">
              <el-input-number v-model="form.checkedInCount" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地点简述" prop="location">
              <el-input v-model="form.location" type="textarea" :rows="2" placeholder="请输入地点简述" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="会议/直播链接" prop="meetingUrl">
              <el-input v-model="form.meetingUrl" placeholder="请输入会议/直播链接" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="城市" prop="cityCode">
              <el-cascader v-model="form.cityCode" :options="regionOptions" :props="regionProps" clearable filterable
                placeholder="请选择省/市/区" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="form.address" type="textarea" :rows="2" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="封面图" prop="coverImageUrl">
              <ImageUpload v-model="form.coverImageUrl" :limit="1" :fileSize="10" isShowTip tipAsTooltip :card-size="80" :uploadImgUrl="uploadUrl"
                :fileType="['jpg', 'jpeg', 'png', 'gif', 'webp']" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="列表图" prop="listImageUrl">
              <ImageUpload v-model="form.listImageUrl" :limit="1" :fileSize="10" isShowTip tipAsTooltip :card-size="80" :uploadImgUrl="uploadUrl"
                :fileType="['jpg', 'jpeg', 'png', 'gif', 'webp']" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详情图" prop="detailImageUrl">
              <ImageUpload v-model="form.detailImageUrl" :limit="9" :fileSize="10" isShowTip tipAsTooltip :card-size="80" :uploadImgUrl="uploadUrl"
                :fileType="['jpg', 'jpeg', 'png', 'gif', 'webp']" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="海报图" prop="posterImageUrl">
              <ImageUpload v-model="form.posterImageUrl" :limit="9" :fileSize="10" isShowTip tipAsTooltip :card-size="80" :uploadImgUrl="uploadUrl"
                :fileType="['jpg', 'jpeg', 'png', 'gif', 'webp']" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参与奖励积分" prop="basePointsReward">
              <el-input-number v-model="form.basePointsReward" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="RRule周期规则" prop="recurrenceRule">
              <el-input v-model="form.recurrenceRule" placeholder="请输入RRule周期规则" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="parentEventId">
              <template #label>
                父活动
                <LabelHint content="周期活动时可选择父活动" />
              </template>
              <el-select v-model="form.parentEventId" placeholder="请选择父活动（选填）" clearable filterable remote
                :remote-method="remoteMethodParentEvent" :loading="loadingParentEvent" style="width: 100%">
                <el-option v-for="item in parentEventOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动价格" prop="eventPrice">
              <el-input-number v-model="form.eventPrice" :min="0" :precision="2" :step="0.1" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动类型" prop="eventType">
              <el-select v-model="form.eventType" placeholder="请选择活动类型" clearable filterable style="width: 100%">
                <el-option v-for="item in eventTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="目标学员画像" prop="targetAudience">
              <el-select v-model="form.targetAudienceIds" multiple filterable placeholder="请选择目标学员画像标签" collapse-tags collapse-tags-tooltip style="width: 100%">
                <el-option v-for="item in targetAudienceTagOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="活动标签" prop="eventTags">
              <el-select v-model="form.eventTagIds" multiple filterable placeholder="请选择活动标签" collapse-tags collapse-tags-tooltip style="width: 100%">
                <el-option v-for="item in eventTagOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学习目标" prop="learningObjectives">
              <el-input v-model="form.learningObjectives" type="textarea" :rows="2" placeholder="选填" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="转化策略" prop="conversionStrategy">
              <el-input v-model="form.conversionStrategy" type="textarea" :rows="2" placeholder="选填" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="跟进计划" prop="followUpPlan">
              <el-input v-model="form.followUpPlan" type="textarea" :rows="2" placeholder="选填" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="风险管理" prop="riskManagement">
              <el-input v-model="form.riskManagement" type="textarea" :rows="2" placeholder="选填" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主办方" prop="organizer">
              <el-input v-model="form.organizer" placeholder="请输入主办方" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" prop="pmUserId">
              <UserSelect ref="pmUserSelectRef" v-model="form.pmUserId" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="选填" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="活动详情" prop="eventDetail">
              <Editor v-model="form.eventDetail" :min-height="200" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { listEventinfo, getEventinfo, delEventinfo, addEventinfo, updateEventinfo, updateBizStatus } from "@/api/bt10/eventinfo";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS, BT10_STATUS_KEYS } from "@/utils/Bt10Helper";
import { listTags } from "@/api/bt10/tags";
import LabelHint from "@/components/LabelHint";
import Editor from "@/components/Editor";
import { regionData, codeToText } from "element-china-area-data";

const { proxy } = getCurrentInstance();
const { event_category: eventCategoryDict } = proxy.useDict("event_category");

const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/file/upload";

// 参与方式枚举（必填）——从后端 Enums.EventJoinType 接口动态获取
const joinTypeOptions = ref([]);
// 活动类型枚举（必填）——从后端 Enums.EventType 接口动态获取，并做本地缓存
const eventTypeOptions = ref([]);
// 业务状态（Status.Event：草稿/已发布/报名中/已满/进行中/已结束/已取消）
const bizStatusOptions = ref([]);
// 通用状态（Enums.Status：0正常/1停用/2删除）
const statusOptions = ref([]);
const isPublicMap = { true: '是', false: '否', '1': '是', '0': '否' };

// 省市区级联（element-china-area-data，值为区域码；存储为逗号分隔 code，展示用 codeToText）
const regionOptions = regionData;
const regionProps = { value: 'value', label: 'label', children: 'children' };

const parentEventOptions = ref([]);
const loadingParentEvent = ref(false);
const pmUserSelectRef = ref(null);
const targetAudienceTagOptions = ref([]);
const eventTagOptions = ref([]);

const eventinfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const selectedRows = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

// 业务状态变更弹窗
const bizStatusDialogVisible = ref(false);
const bizStatusDialogTitle = ref("");
const bizStatusConfirmIntro = ref("");
const bizStatusConfirmRows = ref([]);
const bizStatusConfirmIds = ref([]);
const bizStatusTarget = ref("");
const BIZ_STATUS_DRAFT = "DRAFT";
const BIZ_STATUS_PUBLISHED = "PUBLISHED";
const BIZ_STATUS_ENDED = "ENDED";
const BIZ_STATUS_CANCELLED = "CANCELLED";

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    category: null,
    joinType: null,
    eventType: null,
    bizStatus: null,
    startTime: null,
    endTime: null,
    organizer: null,
    pmUserId: null,
  },
  rules: {
    title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }, { max: 100, message: '最多100字', trigger: 'blur' }],
    joinType: [{ required: true, message: '请选择参与方式', trigger: 'change' }],
    category: [{ required: true, message: '请选择活动分类', trigger: 'change' }],
    startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
    endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
    joinDeadline: [{ required: true, message: '请选择报名截止时间', trigger: 'change' }],
    maxParticipants: [{ required: true, message: '请输入最大参与人数', trigger: 'blur' }],
    registeredCount: [{ required: true, message: '请输入已报名人数', trigger: 'blur' }],
    checkedInCount: [{ required: true, message: '请输入已签到人数', trigger: 'blur' }],
    basePointsReward: [{ required: true, message: '请输入参与奖励积分', trigger: 'blur' }],
    eventPrice: [{ required: true, message: '请输入活动价格', trigger: 'blur' }],
    eventType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
    pmUserId: [{ required: true, message: '请选择负责人', trigger: 'change' }]
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

// 加载 bt10 枚举（参与方式、活动类型、通用状态）与业务状态，并缓存到当前页面
function loadBt10Enums() {
  // 第一步：优先从本地缓存按 key 读取（页面不刷新情况下效果最好）
  joinTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.EVENT_JOIN_TYPE);
  eventTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.EVENT_TYPE);
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  bizStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.EVENT, true);

  // 第二步：确保后端枚举 / 状态已加载并写入本地缓存，然后再按 key 读一遍，刷新为最新值
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    joinTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.EVENT_JOIN_TYPE);
    eventTypeOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.EVENT_TYPE);
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
    bizStatusOptions.value = getBt10OptionsFromCache(BT10_STATUS_KEYS.EVENT, true);
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

const defaultDate = () => new Date().toISOString().slice(0, 10);

// 表单重置
function reset() {
  form.value = {
    id: null,
    title: null,
    joinType: null,
    category: null,
    startTime: defaultDate(),
    endTime: defaultDate(),
    joinDeadline: defaultDate(),
    maxParticipants: 0,
    registeredCount: 0,
    checkedInCount: 0,
    location: null,
    meetingUrl: null,
    address: null,
    city: null,
    cityCode: null,
    coverImageUrl: null,
    listImageUrl: null,
    detailImageUrl: null,
    posterImageUrl: null,
    bizStatus: null,
    isPublic: [],
    basePointsReward: 0,
    recurrenceRule: null,
    isRecurring: [],
    parentEventId: null,
    eventPrice: 0,
    eventType: null,
    targetAudience: null,
    targetAudienceIds: [],
    learningObjectives: null,
    eventStructure: null,
    curriculum: null,
    conversionStrategy: null,
    followUpPlan: null,
    riskManagement: null,
    eventTags: null,
    eventTagIds: [],
    organizer: null,
    contact: null,
    pmUserId: null,
    text1: null,
    eventDetail: null,
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
  selectedRows.value = selection;
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

// 发布：仅当勾选行均为 DRAFT 时可点
const canPublish = computed(() => {
  const rows = selectedRows.value;
  return rows.length > 0 && rows.every(r => r.bizStatus === BIZ_STATUS_DRAFT);
});
// 结束：仅当勾选行均为 PUBLISHED 时可点
const canEnd = computed(() => {
  const rows = selectedRows.value;
  return rows.length > 0 && rows.every(r => r.bizStatus === BIZ_STATUS_PUBLISHED);
});
// 取消：仅当勾选行均为 PUBLISHED 时可点
const canCancel = computed(() => {
  const rows = selectedRows.value;
  return rows.length > 0 && rows.every(r => r.bizStatus === BIZ_STATUS_PUBLISHED);
});

/** 打开业务状态变更确认弹窗（发布/结束/取消） */
function handleBizStatus(action) {
  const rows = selectedRows.value;
  if (!rows.length) return;
  bizStatusConfirmRows.value = rows.map(r => ({ id: r.id, title: r.title, bizStatus: r.bizStatus }));
  bizStatusConfirmIds.value = ids.value.slice();
  if (action === "publish") {
    bizStatusDialogTitle.value = "发布活动";
    bizStatusConfirmIntro.value = "待发布活动列表如下，是否确认发布？";
    bizStatusTarget.value = BIZ_STATUS_PUBLISHED;
  } else if (action === "end") {
    bizStatusDialogTitle.value = "结束活动";
    bizStatusConfirmIntro.value = "以下已发布活动将结束，列表如下，是否确认？";
    bizStatusTarget.value = BIZ_STATUS_ENDED;
  } else {
    bizStatusDialogTitle.value = "取消活动";
    bizStatusConfirmIntro.value = "以下已发布活动将取消，列表如下，是否确认？";
    bizStatusTarget.value = BIZ_STATUS_CANCELLED;
  }
  bizStatusDialogVisible.value = true;
}

/** 确认业务状态变更：再次校验状态后调用接口 */
function confirmBizStatus() {
  const rows = bizStatusConfirmRows.value;
  const target = bizStatusTarget.value;
  const requiredCurrent = target === BIZ_STATUS_PUBLISHED ? BIZ_STATUS_DRAFT : BIZ_STATUS_PUBLISHED;
  const invalid = rows.filter(r => r.bizStatus !== requiredCurrent);
  if (invalid.length) {
    proxy.$modal.msgError("所选数据状态已变化，请刷新列表后重试");
    bizStatusDialogVisible.value = false;
    return;
  }
  updateBizStatus(bizStatusConfirmIds.value, target).then(() => {
    proxy.$modal.msgSuccess("操作成功");
    bizStatusDialogVisible.value = false;
    getList();
  }).catch(() => {});
}

/** 标签 id 统一用字符串，避免大 id（>2^53-1）在 JS 中精度丢失导致选项无法匹配、只显示 id */
function toTagOption(item) {
  const id = item.id == null ? '' : String(item.id);
  return { value: id, label: item.name || item.code || id };
}
/** 加载目标学员画像、活动标签选项（按标签类型过滤），返回 Promise 便于修改时先等选项再赋表单 */
function loadTagOptions() {
  return Promise.all([
    listTags({ tagType: 'EVENT_TARGET_AUDIENCE', pageNum: 1, pageSize: 500 }).then(res => {
      targetAudienceTagOptions.value = (res.rows || []).map(toTagOption);
    }),
    listTags({ tagType: 'EVENT_TAG', pageNum: 1, pageSize: 500 }).then(res => {
      eventTagOptions.value = (res.rows || []).map(toTagOption);
    })
  ]);
}

/** 父活动远程搜索 */
function remoteMethodParentEvent(query) {
  loadingParentEvent.value = true;
  const params = { pageNum: 1, pageSize: 50 };
  if (query) {
    params.title = query;
  }
  listEventinfo(params).then(res => {
    parentEventOptions.value = (res.rows || []).map(item => ({ value: item.id, label: item.title || '未命名活动' }));
    loadingParentEvent.value = false;
  }).catch(() => { loadingParentEvent.value = false; });
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  loadTagOptions();
  open.value = true;
  title.value = "添加活动或线下课程主表";
}

/** 修改按钮操作：先加载标签选项再拉详情并赋表单，保证目标学员画像/活动标签的 id 能按选项返显为标签名 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  loadTagOptions().then(() => getEventinfo(_id)).then(response => {
    form.value = { ...response.data };
    if (form.value.isPublic != null && typeof form.value.isPublic === 'string') {
      form.value.isPublic = form.value.isPublic.split(",");
    }
    if (form.value.isRecurring != null && typeof form.value.isRecurring === 'string') {
      form.value.isRecurring = form.value.isRecurring.split(",");
    }
    form.value.cityCode = form.value.city ? form.value.city.split(',').filter(Boolean) : null;
    form.value.eventDetail = form.value.text1 != null ? form.value.text1 : null;
    form.value.targetAudienceIds = form.value.targetAudience ? String(form.value.targetAudience).split(',').map(s => String(s).trim()).filter(Boolean) : [];
    form.value.eventTagIds = form.value.eventTags ? String(form.value.eventTags).split(',').map(s => String(s).trim()).filter(Boolean) : [];
    open.value = true;
    nextTick(() => {
      if (form.value.pmUserId != null && pmUserSelectRef.value) {
        pmUserSelectRef.value.setOption(form.value.pmUserNickName || form.value.pmUserName || ('用户' + form.value.pmUserId), form.value.pmUserId);
      }
    });
    title.value = "修改活动或线下课程主表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventinfoRef"].validate(valid => {
    if (valid) {
      const payload = { ...form.value };
      payload.city = Array.isArray(payload.cityCode) && payload.cityCode.length ? payload.cityCode.join(',') : (payload.city || '');
      payload.text1 = payload.eventDetail != null ? payload.eventDetail : payload.text1;
      payload.targetAudience = Array.isArray(payload.targetAudienceIds) ? payload.targetAudienceIds.join(',') : '';
      payload.eventTags = Array.isArray(payload.eventTagIds) ? payload.eventTagIds.join(',') : '';
      if (payload.isPublic && Array.isArray(payload.isPublic)) {
        payload.isPublic = payload.isPublic.join(",");
      }
      if (payload.isRecurring && Array.isArray(payload.isRecurring)) {
        payload.isRecurring = payload.isRecurring.join(",");
      }
      delete payload.cityCode;
      delete payload.eventDetail;
      delete payload.targetAudienceIds;
      delete payload.eventTagIds;
      if (form.value.id != null) {
        updateEventinfo(payload).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventinfo(payload).then(response => {
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

// 页面初始化：先加载枚举，再拉列表，保证活动类型等下拉/展示有 label
loadBt10Enums().finally(() => {
  getList();
});
</script>

<style scoped>
.table-scroll-wrapper {
  overflow-x: auto;
}
.text-muted {
  color: var(--el-text-color-secondary);
}
</style>
